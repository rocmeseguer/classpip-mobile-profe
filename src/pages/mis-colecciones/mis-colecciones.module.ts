import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisColeccionesPage } from './mis-colecciones';

@NgModule({
  declarations: [
    MisColeccionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisColeccionesPage),
  ],
})
export class MisColeccionesPageModule {}
