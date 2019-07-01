import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
const { Storage } = Plugins;

enum estadoGrabacion {
    inactivo,
    corriendo,
    pausado,
    parado
}

@Component({
    selector: 'app-principal',
    templateUrl: './principal.page.html',
    styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

    grabacionActiva: MediaObject;

    grabaciones: any[] = [];

    estado: estadoGrabacion = estadoGrabacion.inactivo;

    pausaGrabacionVisible = false;

    nombreArchivo = '';

    timer = 0;
    timerEncendido = false;

    tags: any = [];

    constructor(private media: Media, private file: File, private platform: Platform, private authService: AuthService, private http: HttpClient) { }

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
        this.estado = estadoGrabacion.corriendo;
        this.grabacionActiva.onStatusUpdate.subscribe((newStatus) => {
            switch (newStatus) {
                case 0:
                    this.estado = estadoGrabacion.inactivo;
                    break;
                case 2:
                    this.estado = estadoGrabacion.corriendo;
                    break;
                case 3:
                    this.estado = estadoGrabacion.pausado;
                    break;
                case 4:
                    this.estado = estadoGrabacion.parado;
                    break;
                default:
                    break;
            }
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

    reproducir() {
        this.grabacionActiva.seekTo(2000);
        this.grabacionActiva.play();
    }

    pausarGrabacion() {
        this.grabacionActiva.pauseRecord();
    }

    resumirGrabacion() {
        this.grabacionActiva.resumeRecord();
    }

    pausarReproduccion() {
        this.grabacionActiva.pause();
    }

    pararReproduccion() {
        this.grabacionActiva.stop();
    }

    seleccionarGrabacion(idx) {
        const nombreArchivo = this.grabaciones[idx].nombre;
        this.grabacionActiva = this.media.create(nombreArchivo);
    }

    async cargarTags() {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authService.getToken()
            })
        };
        const tmpTags = <string[]> await this.http.get(environment.serverUrl + 'tags', httpOptions).toPromise();
        this.tags = [];
        tmpTags.forEach( (item) => {
            this.tags.push({nombre: item, cantidad: 0, positions: []});
        });
    }

    seleccionoTag(idx) {
        this.tags[idx].cantidad ++;
        this.tags[idx].positions.push({posicion: this.timer});
        console.log(this.tags);
    }

}
