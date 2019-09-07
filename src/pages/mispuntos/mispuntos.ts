import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-mispuntos',
  templateUrl: 'mispuntos.html',
})
export class MispuntosPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  id:number;
  Tipo: string;

  //VARIABLES DE LA PÁGINA (PUNTOS o INSIGNIAS)
  puntosProfesor: any[];
  insigniasProfesor: any[];

  //PARAMETROS DE LAS INSIGNIAS
  imagenLogo: string;
  imagenesLogo: any[] = [];

  // URLs que utilizaremos
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpClient, private http2: Http ) {
    this.id=navParams.get('id');
    this.Tipo = "Puntos";
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de Puntos e Insignias Existentes');
    console.log('El id del profesor es ' + this.id);

    this.PuntosDelProfesor();
    this.InsigniasDelProfesor();
  }


  //Función que obtiene los puntos creados por el profesor desde la API
  PuntosDelProfesor() {

    this.http.get<any[]>(this.APIUrlProfesor + '/' + this.id + '/puntos')
    .subscribe(puntos => {
      if (puntos[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.puntosProfesor = puntos;
        console.log(this.puntosProfesor);
      } else {
        this.puntosProfesor = undefined;
      }

    });
  }

  //Función que obtiene las insignias creadas por el profesor desde la API
  InsigniasDelProfesor() {

      //Se inicializa el vector imagenesLogo a [] para limpiar las imagenes anteriores
      this.imagenesLogo=[];
      this.http.get<any[]>(this.APIUrlProfesor + '/' + this.id + '/insignia')
      .subscribe(insignas => {
        if (insignas[0] !== undefined) {
          console.log('Voy a dar la lista');
          this.insigniasProfesor = insignas;
          console.log(this.insigniasProfesor);
          this.LogoDeInsignias(this.insigniasProfesor);
          console.log(this.imagenesLogo);

        } else {
          this.insigniasProfesor = undefined;
        }

      });
  }

  // Le pasamos el id de la insignia y buscamos el logo que tiene
  LogoDeInsignias(insignias: any[]) {

      for (let i = 0; i < insignias.length; i ++) {
      if (insignias[i].Imagen!== undefined) {

        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http2.get('http://localhost:3000/api/imagenes/ImagenInsignia/download/' + insignias[i].Imagen,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenLogo = reader.result.toString();
            this.imagenesLogo[i] = this.imagenLogo;
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
        });

        // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
      } else {
        this.imagenLogo = undefined;
        this.imagenesLogo[i] = this.imagenLogo;
      }
    }
  }


}
