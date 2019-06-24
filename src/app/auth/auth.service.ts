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
            this.usuario = localStorage.getItem('usuario');
        }
    }

    login(username, password) {
        return new Promise( (resolve, reject) => {
            this.http.post(environment.serverUrl + 'auth/login', { username: username, password: password }).subscribe(respuesta => {
                this.usuario = respuesta;
                localStorage.setItem('usuario', this.usuario);
                resolve();
            }, (error) => {
                reject(error);
            });
        })

    }

    estaLogeado() {
        return this.usuario != null;
    }

    logout() {
        this.usuario = null;
    }
}
