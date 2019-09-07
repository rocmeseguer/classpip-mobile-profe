import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoJuegoPuntosPage } from './info-juego-puntos';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    InfoJuegoPuntosPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoJuegoPuntosPage),
    SharedModule
  ],
})
export class InfoJuegoPuntosPageModule {}
