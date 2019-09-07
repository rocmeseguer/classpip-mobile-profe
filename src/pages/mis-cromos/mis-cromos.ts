import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, ResponseContentType} from '@angular/http';
import { HttpClient} from '@angular/common/http';

//Importamos las CLASES necesarias
import {Cromo} from '../../clases/Cromo';
import {Coleccion} from '../../clases/Coleccion';


@IonicPage()
@Component({
  selector: 'page-mis-cromos',
  templateUrl: 'mis-cromos.html',
})
export class MisCromosPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  coleccion:Coleccion;

  //PARAMETROS DE UNA COLECCION DE CROMOS
  imagenColeccion: string;
  cromosColeccion: Cromo[];

  //PARAMETROS DE UN CROMO
  cromo: Cromo;
  imagenCromoArray: string[] = [];

  // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Colecciones';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, private https: HttpClient) {
    this.coleccion=navParams.get('coleccion');
  }

  //Se realizarán las siguiente tareas al inicializar la pantalla.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de cromos de la coleccion');
    this.CromosEImagenDeLaColeccion(this.coleccion);
    this.GET_Imagen();
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosEImagenDeLaColeccion(coleccion: Coleccion) {

    console.log('entro a buscar cromos y foto');
    console.log(coleccion.ImagenColeccion);
    // Si la coleccion tiene una foto (recordemos que la foto no es obligatoria)
    if (coleccion.ImagenColeccion !== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + coleccion.ImagenColeccion,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenColeccion = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenColeccion será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenColeccion = undefined;
    }


    // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
    console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

    // Busca los cromos dela coleccion en la base de datos
    this.https.get<Cromo[]>(this.APIUrl + '/' + coleccion.id + '/cromos')
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.OrdenarCromos();
        this.GET_ImagenCromo();
        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }

   // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
   GET_ImagenCromo() {

    // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.cromosColeccion.length; i++) {

    this.cromo = this.cromosColeccion[i];

    if (this.cromo.Imagen !== undefined ) {
      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenCromoArray[i] = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
    });
    }
  }
  }

// Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
  OrdenarCromos() {
  this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

  // Busca la imagen que tiene el nombre del coleccion.ImagenColeccion y lo carga en imagenColeccion
  GET_Imagen() {

    if (this.coleccion.ImagenColeccion !== undefined ) {
      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http.get('http://localhost:3000/api/imagenes/ImagenColeccion/download/' + this.coleccion.ImagenColeccion,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenColeccion = reader.result.toString();
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
    });

    }
  }
}
