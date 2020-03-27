import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JornadaJuegoFormulaUnoPage } from './jornada-juego-formula-uno';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    JornadaJuegoFormulaUnoPage,
  ],
  imports: [
    IonicPageModule.forChild(JornadaJuegoFormulaUnoPage),
    SharedModule
  ],
})
export class JornadaJuegoFormulaUnoPageModule {}
