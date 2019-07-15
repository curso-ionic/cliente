import { Component, OnInit } from '@angular/core';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { File } from '@ionic-native/file/ngx';
import { Plugins, Capacitor, FileReadResult } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ArchivoAudio } from '../archivo-audio';
import { Base64 } from '@ionic-native/base64/ngx';
const { Storage } = Plugins;


@Component({
    selector: 'app-reproduccion',
    templateUrl: './reproduccion.page.html',
    styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {

    reproduccionActiva: MediaObject;

    grabaciones: any[] = [];

    estado: MEDIA_STATUS = MEDIA_STATUS.NONE;

    archivoReproduccionActual: ArchivoAudio;

    timer = 0;
    timerEncendido = false;

    tags: string[] = [];


    constructor(private media: Media,
        private file: File,
        private platform: Platform,
        private authService: AuthService,
        private http: HttpClient,
        private base64: Base64) { }

    ngOnInit() {

    }

    ionViewDidEnter() {
        this.obtenerGrabaciones().then((obj) => {
            if (obj.value) {
                this.grabaciones = JSON.parse(obj.value);
            }
        });
    }

    async obtenerGrabaciones() {
        return await Storage.get({ key: 'grabaciones' });
    }

    async cargarTags() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authService.getToken()
            })
        };
        this.tags = await this.http.get(environment.serverUrl + 'tags', httpOptions).toPromise() as string[];

    }

    reproducir() {
        this.reproduccionActiva.play();
        this.estado = 2;
    }

    pausar() {
        this.reproduccionActiva.pause();
        this.estado = 1;
    }

    parar() {
        this.reproduccionActiva.stop();
        this.estado = 0;
    }

    irAPosicion(pos) {
        this.reproduccionActiva.seekTo(pos * 1000);
    }

    seleccionarGrabacion(idx) {
        const nombreArchivo = this.grabaciones[idx].nombre;
        this.reproduccionActiva = this.media.create(nombreArchivo);
        this.archivoReproduccionActual = this.grabaciones[idx];
    }

    async upload(archivo) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authService.getToken()
            })
        };
        try {
            const entry = await this.file.resolveLocalFilesystemUrl(this.file.externalRootDirectory + archivo);
            const fullPath = entry.nativeURL;
            const contenidoArchivo: FileReadResult = await Capacitor.Plugins.Filesystem.readFile({ path: fullPath });
            const contenidoB64 = contenidoArchivo.data;
            const body: any = {...this.archivoReproduccionActual};
            body.contenido = contenidoB64;
            const rta = this.http.post(environment.serverUrl + 'grabaciones', body, httpOptions).toPromise();
            console.log(rta);

        } catch (e) {
            console.log('------ERROR---------');
            console.log(e);
        }
    }
}
