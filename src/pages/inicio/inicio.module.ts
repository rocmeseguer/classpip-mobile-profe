import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioPage } from './inicio';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    InicioPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioPage),
    SharedModule
  ],
})
export class InicioPageModule {}
