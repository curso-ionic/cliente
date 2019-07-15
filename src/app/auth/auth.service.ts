import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private usuario = null;

    constructor(private http: HttpClient) {
        if (localStorage.getItem('usuario')) {
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
        }
    }

    async login(username, password) {
        try {
            const body = {username, password};
            //console.log(body);
            const respuesta = await this.http.post(environment.serverUrl + 'auth/login', body).toPromise();
            this.usuario = respuesta;
            localStorage.setItem('usuario', JSON.stringify(this.usuario));
            //console.log('ok');
        } catch (e) {
            console.log(e);
            throw e;
        }

    }

    estaLogeado() {
        return this.usuario != null;
    }

    logout() {
        this.usuario = null;
    }

    getToken() {
        if (!this.usuario) {
            return null;
        }
        return this.usuario.token;
    }
}
