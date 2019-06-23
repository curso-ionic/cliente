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

  username = '';
  password = '';

  constructor(private service: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
      this.service.login(this.username, this.password).then( () => {
        this.router.navigateByUrl('/principal');
      }).catch( () => {

      })
  }

}
