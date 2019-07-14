import { Component, OnInit } from '@angular/core';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';
const { Storage } = Plugins;


@Component({
  selector: 'app-grabacion',
  templateUrl: './grabacion.page.html',
  styleUrls: ['./grabacion.page.scss'],
})
export class GrabacionPage implements OnInit {

    grabacionActiva: MediaObject;

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
        if (this.platform.is('ios')) {
            this.pausaGrabacionVisible = true;
        }
        this.obtenerGrabaciones().then((obj) => {
            if (obj.value) {
                this.grabaciones = JSON.parse(obj.value);
            }
        });
        this.cargarTags();
    }

    /**
     * Retorna el siguiente nombre de la grabacion
     */
    siguienteNombre() {
        return 'rec_' + (this.grabaciones.length + 1);
    }

    agregarGrabacionActual() {
        const objGrabacion = { nombre: this.nombreArchivo }
        this.grabaciones.push(objGrabacion);
        Storage.set({
            key: 'grabaciones',
            value: JSON.stringify(this.grabaciones)
        });
    }

    async obtenerGrabaciones() {
        return await Storage.get({ key: 'grabaciones' });
    }

    grabar() {
        if (this.grabacionActiva) {
            this.grabacionActiva.release();
            this.grabacionActiva = null;
        }
        const directorioDestino = '';
        this.nombreArchivo = this.siguienteNombre() + '.3gp';
        this.grabacionActiva = this.media.create(directorioDestino + this.nombreArchivo);

        //this.estado = estadoGrabacion.corriendo;

        this.grabacionActiva.onStatusUpdate.subscribe((newStatus) => {
            this.estado = newStatus;
            console.log(this.estado);
        });

        this.grabacionActiva.startRecord();
        this.timer = 0;
        this.timerEncendido = true;

        setInterval(() => {
            if (this.timerEncendido) {
                this.timer++;
            }
        }, 1000);
    }

    pararGrabacion() {
        this.timerEncendido = false;
        this.timer = 0;
        this.grabacionActiva.stopRecord();
        this.agregarGrabacionActual();
    }



    pausarGrabacion() {
        this.grabacionActiva.pauseRecord();
    }

    resumirGrabacion() {
        this.grabacionActiva.resumeRecord();
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

    seleccionoTag(idx) {
        this.tags[idx].cantidad++;
        this.tags[idx].positions.push({ posicion: this.timer });
        console.log(this.tags);
    }

}
