import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';
import {TablaAlumnoJuegoDeCompeticion} from '../../clases/TablaAlumnoJuegoDeCompeticion';
import {TablaEquipoJuegoDeCompeticion} from '../../clases/TablaEquipoJuegoDeCompeticion';
import {TablaJornadas} from '../../clases/TablaJornadas';
import {Juego} from '../../clases/Juego';
import {EnfrentamientoLiga} from '../../clases/EnfrentamientoLiga';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';
import {AlumnoJuegoDePuntos} from '../../clases/AlumnoJuegoDePuntos';
import {EquipoJuegoDePuntos} from '../../clases/EquipoJuegoDePuntos';

@IonicPage()
@Component({
  selector: 'page-jornada-juego-liga',
  templateUrl: 'jornada-juego-liga.html',
})

export class JornadaJuegoLigaPage {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  JornadasCompeticion: TablaJornadas[] = [];
  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];
  jornadaSeleccionada: number;
  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];
  juegodePuntosSeleccionadoID: number;

  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

  dataSourceEnfrentamientoIndividual;
  dataSourceEnfrentamientoEquipo;

  participanteDescansa;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private calculos: CalculosProvider,
    private sesion: SesionProvider,
    private peticionesApi: PeticionesApiProvider ) {
      this.juegoSeleccionado=navParams.get('juego');
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de Seleccionar Ganador del Juego de Liga');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log(this.listaAlumnosClasificacion);
    console.log('Bienvenido a la página de Seleccionar Ganador del Juego de Liga');


  }

  ObtenerEnfrentamientosDeCadaJornada() {
    console.log('El id de la jornada seleccionada es: ' + this.jornadaSeleccionada);
    this.peticionesApi.DameEnfrentamientosDeCadaJornadaLiga(this.jornadaSeleccionada)
    .subscribe(enfrentamientos => {
      this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
      console.log('Los enfrentamientos de esta jornada son: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
      this.ConstruirTablaEnfrentamientos();
    });
  }

  ConstruirTablaEnfrentamientos() {
    console.log ('Aquí tendré la tabla de enfrentamientos, los enfrentamientos sonc:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    console.log('Distinción entre Individual y equipos');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientos(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnosClasificacion,
                                                                                            this.listaEquiposClasificacion,
                                                                                            this.juegoSeleccionado);
      //this.dataSourceEnfrentamientoIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos individual queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    } else {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientos(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnosClasificacion,
                                                                                            this.listaEquiposClasificacion,
                                                                                            this.juegoSeleccionado);
      //this.dataSourceEnfrentamientoEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos por equipos queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    }
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    this.ObtenerEnfrentamientosDeCadaJornada();
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnoJuego() {
    console.log ('voy a por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesApi.DameInscripcionesAlumnoJuegoDePuntos(Number(this.juegodePuntosSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log (this.listaAlumnosOrdenadaPorPuntos);
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuego() {

    console.log ('vamos por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesApi.DameInscripcionesEquipoJuegoDePuntos(Number(this.juegodePuntosSeleccionadoID))
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);
      console.log ('ya tengo las inscripciones');

    });
  }

}
