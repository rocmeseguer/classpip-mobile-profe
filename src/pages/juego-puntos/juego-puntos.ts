import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

//Importamos las páginas necesarias
import { JuegoSeleccionadoPage } from '../juego-seleccionado/juego-seleccionado';
import { JuegoSeleccionadoInactivoPage } from '../juego-seleccionado-inactivo/juego-seleccionado-inactivo';
import { JuegoSeleccionadoPreparadoPage } from '../juego-seleccionado-preparado/juego-seleccionado-preparado';
import {CalculosProvider} from '../../providers/calculos/calculos';

// Importamos las clases necesarias
import { Juego } from '../../clases/index';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}


@IonicPage()
@Component({
  selector: 'page-juego-puntos',
  templateUrl: 'juego-puntos.html',
})
export class JuegoPuntosPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  grupoId: number;

// Opciones para mostrar en la lista desplegable para seleccionar el tipo de juego que listar
opcionesMostrar: OpcionSeleccionada[] = [
  {nombre: 'Todos los juegos', id: 'todosLosJuegos'},
  {nombre: 'Juegos de puntos', id: 'juegosDePuntos'},
  {nombre: 'Juegos de colección', id: 'juegosDeColeccion'},
  {nombre: 'Juegos de competición Liga', id: 'juegosDeCompeticionLiga'},
  {nombre: 'Juegos de competición Fórmula Uno', id: 'juegosDeCompeticionFormulaUno'},
  {nombre: 'Juegos de Geocaching', id: 'juegosDeGeocaching'},
];

  // Recogemos los tres tipos de juegos que tenemos y las metemos en una lista, tanto activos como inactivos
  juegosDePuntos:any[];
  juegosDeColeccion:any[];
  juegosDeCompeticion:any[];

  // AHORA SEPARAMOS ENTRE LOS JUEGOS ACTIVOS E INACTIVOS DE CADA TIPO DE JUEGO

  // Separamos entre juegos de puntos activos e inactivos
  juegosDePuntosActivos: any[] = [];
  juegosDePuntosInactivos: any[] = [];

  // Separamos entre juegos de coleccion activos e inactivos
  juegosDeColeccionActivos: any[] = [];
  juegosDeColeccionInactivos: any[] = [];

  // Separamos entre juegos de competición activos e inactivos
  juegosDeCompeticionActivos: any[] = [];
  juegosDeCompeticionInactivos: any[] = [];


  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS E INACTIVOS DE LOS TRES TIPOS DE JUEGOS
  juegosActivos: any[] = [];
  juegosInactivos: any[] = [];
  juegosPreparados: any[] = [];

  // Al seleccionar el tipo de juego que deseo mostrar de la lista desplegable (OpcionSeleccionada), copiaremos esa lista
  // en este vector, ya que será de donde se sacará la información que se mostrará
  ListaJuegosSeleccionadoActivo: any[];
  ListaJuegosSeleccionadoInactivo: any[];

  opcionSeleccionada: string = 'todosLosJuegos';
  juegoSeleccionado: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private calculos: CalculosProvider) {
    this.grupoId=navParams.get('id');
  }

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de Juegos');

    // Recupera la lista de juegos que tiene el grupo (primero el de puntos, después de colección,después los totales)
    // y los va clasificando en activo e inactivo

    this.calculos.DameListaJuegos(this.grupoId)
    .subscribe ( listas => {
            console.log ('He recibido los juegos');
            this.juegosActivos = listas.activos;
            this.juegosPreparados = listas.preparados;
            // Si la lista aun esta vacia la dejo como indefinida para que me
            // salga el mensaje de que aun no hay juegos
            if (listas.activos[0] === undefined) {
              this.juegosActivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosActivos = listas.activos;
              console.log ('hay activos');
            }
            if (listas.inactivos[0] === undefined) {
              this.juegosInactivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosInactivos = listas.inactivos;
              console.log ('hay inactivos');
            }
            if (listas.preparados[0] === undefined) {
              this.juegosPreparados = undefined;
              console.log ('No hay preparados');
            } else {
              this.juegosPreparados = listas.preparados;
              console.log ('hay preparados');
            }

    });
    //this.ListaJuegosDePuntos();
  }

  // //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion
  // ListaJuegosDePuntos() {
  //   this.http.get<any[]>(this.APIUrlGrupos + '/' + this.grupoId + '/juegoDePuntos')
  //   .subscribe(juegos => {
  //     console.log('He recibido los juegos de puntos');

  //     for (let i = 0; i < juegos.length; i++) {
  //       if (juegos[i].JuegoActivo === true) {
  //         this.juegosDePuntosActivos.push(juegos[i]);
  //       } else {
  //         this.juegosDePuntosInactivos.push(juegos[i]);
  //       }
  //     }
  //     this.ListaJuegosDeColeccion();
  //   });
  // }


  // // Busca la lista de juego de coleccion y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeCompeticion
  // ListaJuegosDeColeccion() {
  //   this.http.get<any[]>(this.APIUrlGrupos + '/' + this.grupoId + '/juegoDeColeccions')
  //   .subscribe(juegos => {
  //     console.log('He recibido los juegos de coleccion');

  //     for (let i = 0; i < juegos.length; i++) {
  //       if (juegos[i].JuegoActivo === true) {
  //         this.juegosDeColeccionActivos.push(juegos[i]);
  //       } else {
  //         this.juegosDeColeccionInactivos.push(juegos[i]);
  //       }
  //     }
  //     this.ListaJuegosDeCompeticion();
  //   });
  // }


  // // Busca la lista de juego de competicion y la clasifica entre activo e inactivo, y activa la función ListaJuegosTotales
  // ListaJuegosDeCompeticion() {
  //   this.http.get<any[]>(this.APIUrlGrupos + '/' + this.grupoId + '/juegoDeCompeticions')
  //   .subscribe(juegos => {
  //     console.log('He recibido los juegos de competición');

  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < juegos.length; i++) {
  //       if (juegos[i].JuegoActivo === true) {
  //         this.juegosDeCompeticionActivos.push(juegos[i]);
  //       } else {
  //         this.juegosDeCompeticionInactivos.push(juegos[i]);
  //       }
  //     }
  //     this.ListaJuegosTotales();
  //   });
  // }


  // // Una vez recibidos los juegos de puntos y colección y clasificados en activos e inactivos, los metemos dentro de la
  // // lista total de juegos activos e inactivos
  // ListaJuegosTotales() {

  //   for (let i = 0; i < (this.juegosDePuntosActivos.length); i++ ) {
  //     this.todosLosJuegosActivos.push(this.juegosDePuntosActivos[i]);
  //   }

  //   for (let i = 0; i < (this.juegosDePuntosInactivos.length); i++ ) {
  //     this.todosLosJuegosInactivos.push(this.juegosDePuntosInactivos[i]);
  //   }

  //   for (let i = 0; i < (this.juegosDeColeccionActivos.length); i++ ) {
  //     this.todosLosJuegosActivos.push(this.juegosDeColeccionActivos[i]);
  //   }

  //   for (let i = 0; i < (this.juegosDeColeccionInactivos.length); i++ ) {
  //     this.todosLosJuegosInactivos.push(this.juegosDeColeccionInactivos[i]);
  //   }

  //   for (let i = 0; i < (this.juegosDeCompeticionActivos.length); i++ ) {
  //     this.todosLosJuegosActivos.push(this.juegosDeCompeticionActivos[i]);
  //   }

  //   for (let i = 0; i < (this.juegosDeCompeticionInactivos.length); i++ ) {
  //     this.todosLosJuegosInactivos.push(this.juegosDeCompeticionInactivos[i]);
  //   }

  //   // Por defecto al principio mostraremos la lista de todos los juegos, con lo que la lista seleccionada para mostrar
  //   // será la de todos los juegos
  //   this.ListaJuegosSeleccionadoActivo = this.todosLosJuegosActivos;
  //   this.ListaJuegosSeleccionadoInactivo = this.todosLosJuegosInactivos;
  // }


  // // En función de la opción que deseemos muestrear (opcionSeleccionada) en la lista de juegos, el vector
  // // ListaJuegosSeleccionadoActivo y ListaJuegosSeleccionadoInactivo tomará un valor u otro
  // ListaJuegoSeleccionado() {

  //   console.log('Busquemos la lista correspondiente');
  //   console.log(this.opcionSeleccionada);

  //   if (this.opcionSeleccionada === 'todosLosJuegos') {
  //     this.ListaJuegosSeleccionadoActivo = this.todosLosJuegosActivos;
  //     this.ListaJuegosSeleccionadoInactivo = this.todosLosJuegosInactivos;
  //   }
  //   if (this.opcionSeleccionada === 'juegosDePuntos') {
  //     this.ListaJuegosSeleccionadoActivo = this.juegosDePuntosActivos;
  //     this.ListaJuegosSeleccionadoInactivo = this.juegosDePuntosInactivos;
  //   }

  //   if (this.opcionSeleccionada === 'juegosDeColeccion') {
  //     this.ListaJuegosSeleccionadoActivo = this.juegosDeColeccionActivos;
  //     this.ListaJuegosSeleccionadoInactivo = this.juegosDeColeccionInactivos;
  //   }

  //   if (this.opcionSeleccionada === 'juegosDeCompeticion') {

  //     this.ListaJuegosSeleccionadoActivo = this.juegosDeCompeticionActivos;
  //     this.ListaJuegosSeleccionadoInactivo = this.juegosDeCompeticionInactivos;
  //   }
  // }

  // Función que usaremos para clicar en un juego y entrar en él, enviándolo al servicio

  JuegoSeleccionado(juego: Juego) {
    console.log ('Has seleccionado este juego ');
    console.log(juego);
    this.navCtrl.push (JuegoSeleccionadoPage, {juego: juego});
  }

  JuegoSeleccionadoInactivo(juego: Juego) {
    console.log ('Has seleccionado este juego ');
    console.log(juego);
    this.navCtrl.push (JuegoSeleccionadoInactivoPage, {juego: juego});
  }
  JuegoSeleccionadoPreparado(juego: Juego) {
    console.log ('Has seleccionado este juego ');
    console.log(juego);
    this.navCtrl.push (JuegoSeleccionadoPreparadoPage, {juego: juego});
  }



}
