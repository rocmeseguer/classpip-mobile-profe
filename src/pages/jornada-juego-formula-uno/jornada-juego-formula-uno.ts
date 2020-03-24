import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';

// Importamos las clases necesarias
import { Juego, Jornada, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, TablaJornadas, TablaClasificacionJornada } from '../../clases/index';


@IonicPage()
@Component({
  selector: 'page-jornada-juego-formula-uno',
  templateUrl: 'jornada-juego-formula-uno.html',
})

export class JornadaJuegoFormulaUnoPage {

  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  datosClasificacionJornada: {participante: string[];
                              puntos: number[];
                              posicion: number[];
                              participanteId: number[];
                             };

  clasificacionJornadaSeleccionada: TablaClasificacionJornada[];

  jornadaSeleccionada: TablaJornadas;

  // Columnas Tabla
  displayedColumns: string[] = ['posicion', 'participante', 'puntos'];

  dataSourceClasificacionJornada;
  botonResultadosDesactivado: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private calculos: CalculosProvider,
              private sesion: SesionProvider,
              private peticionesApi: PeticionesApiProvider) {
    this.clasificacionJornadaSeleccionada = navParams.get('clasificacionJornadaSeleccionada');
    this.jornadaSeleccionada = navParams.get('jornadaSeleccionada');
    this.juegoSeleccionado = navParams.get('juegoSeleccionado');
    console.log('Estoy en jornada juego formula uno');
    console.log('Tabla clasificación jornada');
    console.log(this.clasificacionJornadaSeleccionada);
    console.log('jornada seleccionada');
    console.log(this.jornadaSeleccionada);
  }



  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la página jornada juego fórmula uno ');
  }

}

