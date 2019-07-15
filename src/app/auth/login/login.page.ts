import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mensajeError = '';
  username = '';
  password = '';

  constructor(private service: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
      this.mensajeError = '';
      this.service.login(this.username, this.password).then( () => {
        this.router.navigateByUrl('/principal/reproduccion');
      }).catch( (error) => {
          if (error.status == 400) {
              this.mensajeError = 'Usuario/Password incorrectos';
              return;
          }
          this.mensajeError = 'No me puedo comunicar con el servidor';
          console.log(error);
      });
  }

}
