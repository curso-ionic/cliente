import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File }  from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';

enum estadoGrabacion {
    inactivo,
    grabando,
    grabando_pausado,
    reproduciendo,
    reproduciendo_pausado
}

@Component({
    selector: 'app-principal',
    templateUrl: './principal.page.html',
    styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

    grabacionActiva: MediaObject;

    estado: estadoGrabacion = estadoGrabacion.inactivo;

    pausaGrabacionVisible = false;

    constructor(private media: Media, private file: File, private platform: Platform) { }

    ngOnInit() {
        if (this.platform.is('ios')) {
            this.pausaGrabacionVisible = true;
        }
    }

    grabar() {
        if (this.grabacionActiva) {
            this.grabacionActiva.release();
            this.grabacionActiva = null;
        }
        const directorioDestino = '';
        const nombreArchivo = 'grabacion-' + new Date().getDate() + new Date().getMonth() + 
                            new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds()
                            + '.3gp';
        this.grabacionActiva = this.media.create(directorioDestino + nombreArchivo);
        this.grabacionActiva.startRecord();
        this.estado = estadoGrabacion.grabando;
    }

    pararGrabacion() {
        this.grabacionActiva.stopRecord();
        this.estado = estadoGrabacion.inactivo;
    }

    reproducir() {
        this.grabacionActiva.play();
        this.estado = estadoGrabacion.reproduciendo;
    }

    pausarGrabacion() {
        this.grabacionActiva.pauseRecord();
        this.estado = estadoGrabacion.grabando_pausado;
    }

    resumirGrabacion() {
        this.grabacionActiva.resumeRecord();
        this.estado = estadoGrabacion.grabando;
    }

    pausarReproduccion() {
        this.grabacionActiva.pause();
        this.estado = estadoGrabacion.reproduciendo_pausado;
    }

    pararReproduccion() {
        this.grabacionActiva.stop();
        this.estado = estadoGrabacion.inactivo;
    }

}
