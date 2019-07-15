import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReproduccionPage } from './reproduccion.page';
import { Base64 } from '@ionic-native/base64/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReproduccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReproduccionPage]
})
export class ReproduccionPageModule {}
