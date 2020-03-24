import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';

// Importamos las clases necesarias
import { Juego, Jornada, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, TablaJornadas, TablaClasificacionJornada,
  EnfrentamientoLiga, AlumnoJuegoDeCompeticionLiga, EquipoJuegoDeCompeticionLiga} from '../../clases/index';

@IonicPage()
@Component({
  selector: 'page-jornada-juego-liga',
  templateUrl: 'jornada-juego-liga.html',
})

export class JornadaJuegoLigaPage {

  // PARAMETROS DEL JUEGO
  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  jornadaSeleccionada: TablaJornadas;
  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  juegosActivosPuntos: Juego[] = [];



  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private calculos: CalculosProvider,
              private sesion: SesionProvider,
              private peticionesApi: PeticionesApiProvider) {

    this.EnfrentamientosJornadaSeleccionada = navParams.get('enfrentamientosJornadaSeleccionada');
    this.jornadaSeleccionada = navParams.get('jornadaSeleccionada');
    this.juegoSeleccionado = navParams.get('juegoSeleccionado');
  }



  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la página jornada juego fórmula uno ');
  }

}

