import { Component, OnInit } from '@angular/core';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { File } from '@ionic-native/file/ngx';
import { Plugins } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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

    pausaGrabacionVisible = false;

    nombreArchivo = '';

    timer = 0;
    timerEncendido = false;

    tags: any = [];

    constructor(private media: Media,
        private file: File,
        private platform: Platform,
        private authService: AuthService,
        private http: HttpClient) { }

    ngOnInit() {
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
        const tmpTags = await this.http.get(environment.serverUrl + 'tags', httpOptions).toPromise() as string[];
        this.tags = [];
        tmpTags.forEach((item) => {
            this.tags.push({ nombre: item, cantidad: 0, positions: [] });
        });
    }

    reproducir() {
        this.reproduccionActiva.seekTo(0);
        this.reproduccionActiva.play();
    }

    pausar() {
        this.reproduccionActiva.pause();
    }

    parar() {
        this.reproduccionActiva.stop();
    }

    seleccionarGrabacion(idx) {
        const nombreArchivo = this.grabaciones[idx].nombre;
        this.reproduccionActiva = this.media.create(nombreArchivo);
        this.reproduccionActiva.onStatusUpdate.subscribe((newStatus) => {
            this.estado = newStatus;
        });
        this.nombreArchivo = nombreArchivo;
    }

}
