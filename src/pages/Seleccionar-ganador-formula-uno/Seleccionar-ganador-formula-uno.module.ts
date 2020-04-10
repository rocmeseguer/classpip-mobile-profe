import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeleccionarGanadorFormulaUnoPage } from './Seleccionar-ganador-formula-uno';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    SeleccionarGanadorFormulaUnoPage,
  ],
  imports: [
    IonicPageModule.forChild(SeleccionarGanadorFormulaUnoPage),
    SharedModule
  ],
})
export class SeleccionarGanadorFormulaUnoPageModule {}
