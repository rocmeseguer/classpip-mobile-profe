import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-info-juego-puntos',
  templateUrl: 'info-juego-puntos.html',
})

export class InfoJuegoPuntosPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  juegoSeleccionado: any;
  Tipo: string;

  // PARAMETROS DEL JUEGO
  nivelesDelJuego: any[];
  puntosDelJuego: any[];

  //PARAMETROS DEL NIVEL
  imagenNivel: string;
  imagenesNivel: any[] = [];

  // URLs que utilizaremos
  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private http2: Http ) {
    this.juegoSeleccionado=navParams.get('juego');
    this.Tipo = "Puntos";
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de información del Juego de puntos');
    this.RecibirNivelesDelServicio();
    this.RecibirPuntosDelServicio();

  }

  //Función que obtiene los niveles del juego de puntos seleccionado desde la API
  RecibirNivelesDelServicio(){
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/nivels').subscribe(
      lista => {
        this.nivelesDelJuego = lista;
        console.log ('Ya está la lista');
        console.log(this.nivelesDelJuego)
        this.LogoDeNivel();
        ;})
  }

  //Función que obtiene los puntos del juego de puntos seleccionado desde la API
  RecibirPuntosDelServicio(){
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/puntos').subscribe(
      lista => {
        this.puntosDelJuego = lista;
        console.log ('Ya está la lista');
        console.log(this.puntosDelJuego);})
  }

  // Le pasamos el id de la insignia y buscamos el logo que tiene
  LogoDeNivel() {

    for (let i = 0; i < this.nivelesDelJuego.length; i ++) {
    if (this.nivelesDelJuego[i].Imagen!== undefined) {

      // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
      this.http2.get('http://localhost:3000/api/imagenes/imagenNivel/download/' + this.nivelesDelJuego[i].Imagen,
      { responseType: ResponseContentType.Blob })
      .subscribe(response => {
        const blob = new Blob([response.blob()], { type: 'image/jpg'});

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.imagenNivel = reader.result.toString();
          this.imagenesNivel[i] = this.imagenNivel;
        }, false);

        if (blob) {
          reader.readAsDataURL(blob);
        }
      });

      // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
    } else {
      this.imagenNivel = undefined;
      this.imagenesNivel[i] = this.imagenNivel;
    }
  }
}
}
