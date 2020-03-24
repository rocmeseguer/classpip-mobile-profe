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
  selector: 'page-info-juego-liga',
  templateUrl: 'info-juego-liga.html',
})

export class InfoJuegoLigaPage {

  // PARAMETROS DEL JUEGO
  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadas: Jornada[];
  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[];

  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

  juegosActivosPuntos: Juego[] = [];

  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

  dataSourceEnfrentamientoIndividual;
  dataSourceEnfrentamientoEquipo;

  participanteDescansa;
  botonResultadosDesactivado: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: HttpClient,
    private calculos: CalculosProvider,
    private sesion: SesionProvider,
    private peticionesAPI: PeticionesApiProvider) { }



  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de información del Juego de Liga');
    console.log ('Voy a por la información del juego de liga');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadas = datos.Jornadas;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    this.listaAlumnosOrdenadaPorPuntos = this.sesion.DameInscripcionAlumno();
    this.listaEquiposOrdenadaPorPuntos = this.sesion.DameInscripcionEquipo();
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaSeleccionada.id)
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
      // this.dataSourceEnfrentamientoIndividual = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos individual queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    } else {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientos(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnosClasificacion,
                                                                                            this.listaEquiposClasificacion,
                                                                                            this.juegoSeleccionado);
      // this.dataSourceEnfrentamientoEquipo = new MatTableDataSource(this.EnfrentamientosJornadaSeleccionada);
      console.log('La tabla de enfrentamientos por equipos queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    }
  }

  ParticipanteDescansa(jornadaSeleccionada: TablaJornadas) {
    this.participanteDescansa = null;
    if (this.juegoSeleccionado.Modo === 'Individual' && this.listaAlumnosClasificacion.length % 2 !== 0) {
      // Comparar lista alumnos del juego con los alumnos de los enfrentamientos, si alguno de los alumnos
      // no está en ningún enfrentamiento es por que este descansa
      this.ComprobarQuienDescansa(this.listaAlumnosClasificacion, this.EnfrentamientosJornadaSeleccionada);
      return true;
    } else if (this.juegoSeleccionado.Modo === 'Equipos' && this.listaEquiposClasificacion.length % 2 !== 0) {
      this.ComprobarQuienDescansa(this.listaEquiposClasificacion, this.EnfrentamientosJornadaSeleccionada);
      return true;
    } else {
      return false;
    }
  }

  ComprobarQuienDescansa(participantes: any[], enfrentamientosJornadaSeleccionada: EnfrentamientoLiga[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < participantes.length; i++) {
      let encontrado = false;
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < enfrentamientosJornadaSeleccionada.length; k++) {
        if (enfrentamientosJornadaSeleccionada[k].JugadorUno === participantes[i].id ||
            enfrentamientosJornadaSeleccionada[k].JugadorDos === participantes[i].id) {
              encontrado = true;
        }
      }
      if (encontrado === false) {
        if (this.juegoSeleccionado.Modo === 'Individual') {
          this.participanteDescansa = ' descansa ' + participantes[i].nombre + ' ' + participantes[i].primerApellido
                                      + ' ' + participantes[i].segundoApellido;
        } else {
          this.participanteDescansa = ' descansan ' + participantes[i].nombre;
        }
      }
    }
  }

  JornadaFinalizada(jornadaSeleccionada: TablaJornadas) {
    const jornadaFinalizada = this.calculos.JornadaFinalizada(this.juegoSeleccionado, jornadaSeleccionada);
    if (jornadaFinalizada === true) {
      this.botonResultadosDesactivado = true;
    } else {
      this.botonResultadosDesactivado = false;
    }
    return jornadaFinalizada;
  }

  resultadosJornada(jornada: TablaJornadas) {
    console.log('Estoy en resultadosJornada');
    console.log(jornada);
    this.ObtenerEnfrentamientosDeCadaJornada(jornada);
    console.log('this.EnfrentamientosJornadaSeleccionada');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    // this.navCtrl.push (JornadaJuegoLigaPage,{resultadosJornadaSeleccionada: this.EnfrentamientosJornadaSeleccionada,
    //                                                jornadaSeleccionada: jornada,
    //                                                juegoSeleccionado: this.juegoSeleccionado});
  }

}
