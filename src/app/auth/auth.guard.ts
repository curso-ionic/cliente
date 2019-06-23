import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private router: Router, private service: AuthService){}

    canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
        const noEstaLogeado = !this.service.estaLogeado();
        if (noEstaLogeado) {
            this.router.navigateByUrl('/login');
        } else {
            return true;
        }
    }
  
}
