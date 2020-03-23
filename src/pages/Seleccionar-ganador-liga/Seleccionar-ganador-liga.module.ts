import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeleccionarGanadorLigaPage } from './Seleccionar-ganador-liga';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    SeleccionarGanadorLigaPage,
  ],
  imports: [
    IonicPageModule.forChild(SeleccionarGanadorLigaPage),
    SharedModule
  ],
})
export class SeleccionarGanadorLigaPageModule {}
