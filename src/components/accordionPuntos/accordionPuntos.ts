import { Component, ViewChild, OnInit, Renderer, Input } from '@angular/core';

@Component({
  selector: 'accordionPuntos',
  templateUrl: 'accordionPuntos.html'
})

/* Se definen las funciones y variables necesarias para
conseguir plegar y desplegar el contenido de la carta */

export class AccordionPuntosComponent implements OnInit {

  accordionExapanded = false;
  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;

  //Se define que tipo de icono queremos de manera predefinida
  icon: string = "arrow-forward";

  constructor(public renderer: Renderer) {

  }

  /*Acciones que queremso que sucedan al iniciar el acordeon.
  En este caso queremos que el contenido aparezca oculto*/

  ngOnInit() {
    console.log(this.cardContent.nativeElement);
    this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms");
  }

  /*Función que permite pasar de contenido oculto a contenido visible.
  Esto sucede cambiando el tamaño del card-content. Además cuando se
  expanda o se contraiga, los iconos deberán cambiar.*/

  toggleAccordion() {
    if (this.accordionExapanded) {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "10px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "0px 16px");

    } else {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "400px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "13px 16px");

    }

    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward";

  }

}
