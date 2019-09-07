import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AccordionComponent} from '../components/accordion/accordion';
import {AccordionPuntosComponent} from '../components/accordionPuntos/accordionPuntos';

//Se crea este Modulo compartido para poder hacer uso de los acordeones en diferentes páginas
//sin que sale ningún tipo de error.

//Se importa tanto el acordeon para desplegar los grupos, como el acordeon correspondiente a los
//puntos.

@NgModule({
    imports: [IonicPageModule.forChild(AccordionComponent)],
    declarations: [AccordionComponent,AccordionPuntosComponent],
    exports: [AccordionComponent,AccordionPuntosComponent]
}) export class SharedModule {}


