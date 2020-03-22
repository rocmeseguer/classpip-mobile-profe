import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoJuegoFormulaUnoPage as InfoJuegoFormulaUnoPage } from './info-juego-formula-uno';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    InfoJuegoFormulaUnoPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoJuegoFormulaUnoPage),
    SharedModule
  ],
})
export class InfoJuegoFormulaUnoPageModule {}
