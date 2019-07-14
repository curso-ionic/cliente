import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PrincipalPage } from './principal/principal.page';

const routes: Routes = [
    { path: '', redirectTo: 'principal', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
    {
        path: 'principal', component: PrincipalPage,
        children: [
            {
                path: 'grabacion', children: [
                    { path: '', loadChildren: './principal/grabacion/grabacion.module#GrabacionPageModule' }
                ]
            },
            {
                path: 'reproduccion', children: [
                    { path: '', loadChildren: './principal/reproduccion/reproduccion.module#ReproduccionPageModule' }
                ]
            }
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
