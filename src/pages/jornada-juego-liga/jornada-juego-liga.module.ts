import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JornadaJuegoLigaPage } from './jornada-juego-liga';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    JornadaJuegoLigaPage,
  ],
  imports: [
    IonicPageModule.forChild(JornadaJuegoLigaPage),
    SharedModule
  ],
})
export class JornadaJuegoLigaPageModule {}
