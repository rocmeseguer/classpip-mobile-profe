import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MispuntosPage } from './mispuntos';
import {SharedModule} from '../../app/shared.module';

@NgModule({
  declarations: [
    MispuntosPage,
  ],
  imports: [
    IonicPageModule.forChild(MispuntosPage),
    SharedModule,
  ],
})
export class MispuntosPageModule {}
