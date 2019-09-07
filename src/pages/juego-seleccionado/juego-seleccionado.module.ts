import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JuegoSeleccionadoPage } from './juego-seleccionado';

@NgModule({
  declarations: [
    JuegoSeleccionadoPage,
  ],
  imports: [
    IonicPageModule.forChild(JuegoSeleccionadoPage),
  ],
})
export class JuegoSeleccionadoPageModule {}
