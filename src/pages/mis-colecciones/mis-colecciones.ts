import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, ResponseContentType} from '@angular/http';
import { HttpClient} from '@angular/common/http';

//Importamos las clases necesarias
import {Coleccion} from '../../clases/Coleccion';

//Importamos las páginas necesarias
import { MisCromosPage } from '../mis-cromos/mis-cromos';

@IonicPage()
@Component({
  selector: 'page-mis-colecciones',
  templateUrl: 'mis-colecciones.html',
})
export class MisColeccionesPage {


// PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  profesorId:number;

//Parametros de coleccion de cromos
  coleccionesProfesor: Coleccion[];
  imagenColeccion: string;
  imagenesColeccion: any[] = [];

  // URLs que utilizaremos
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, private https: HttpClient) {
    this.profesorId=navParams.get('id');
  }

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la página correspondiente a las colecciones del profesor');
    this.ColeccionesDelProfesor();
  }

  //Función que obtiene las colecciones existentes del profesor desde la API
  ColeccionesDelProfesor() {

    this.https.get<Coleccion[]>(this.APIUrlProfesor + '/' + this.profesorId + '/coleccions')
    .subscribe(coleccion => {
      if (coleccion[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.coleccionesProfesor = coleccion;
        console.log(this.coleccionesProfesor);
        this.CromosEImagenDeLaColeccion(this.coleccionesProfesor);
      } else {
        this.coleccionesProfesor = undefined;
      }

    });
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosEImagenDeLaColeccion(colecciones: any[]) {

    console.log('entro a buscar cromos y foto');
    console.log(colecciones);

    for (let i = 0; i < colecciones.length; i ++) {

    console.log(colecciones[i].ImagenColeccion);
    // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
    if (colecciones[i].ImagenColeccion !== undefined) {

    // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
    this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + colecciones[i].ImagenColeccion,
    { responseType: ResponseContentType.Blob })
    .subscribe(response => {
      const blob = new Blob([response.blob()], { type: 'image/jpg'});

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenColeccion = reader.result.toString();
        this.imagenesColeccion[i]=this.imagenColeccion ;
      }, false);

      if (blob) {
        reader.readAsDataURL(blob);
      }
    });

    // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenColeccion = undefined;
    this.imagenesColeccion[i]=this.imagenColeccion ;
  }

  }
  }

  //Función que te redirije a la página de los cromos que contiene la colección seleccionada
  irCromos(i) {
  console.log ('Accediendo a pagina Juegos');
  this.navCtrl.push (MisCromosPage,{coleccion:i});
  }

}
