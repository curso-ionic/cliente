import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  public tags: any[] = [];

  constructor(private authService: AuthService, private http: HttpClient) { }

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
}
