import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Importamos las páginas necesarias
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html',
})
export class SlidePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la introducción de Classpip Mobile');
  }

  //Se definen las páginas deslizables
  slides = [
    {
      title: "Descubre Classpip Mobile!",
      description: "Consigue con la gamificación un entorno educativo interactivo e integrador.",
      image: "assets/imgs/Imagen2.png"
    },
    {
      title: "¿Hasta donde podemos llegar?",
      description: "Mediante <b>Classpip</b> conseguiremos motivar a nuestro alumnado y incrementaremos el rendimiento académico.",
      image: "assets/imgs/Imagen1.png"
    },
    {
      title: "¿Cómo lo haremos?",
      description: "Haciendo uso de dinámicas de juegos como las competiciones, los niveles o los cromos.",
      image: "assets/imgs/Imagen3.png"
    }
  ];

  //Función que te redirije a la página de registro para inicializar Classpip
  irRegistro() {
    console.log ('Accediendo a pagina Registro');
    this.navCtrl.setRoot (HomePage);
}

}
