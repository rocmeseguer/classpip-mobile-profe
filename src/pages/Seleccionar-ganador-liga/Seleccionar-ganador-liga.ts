import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';
//import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';
import {TablaAlumnoJuegoDeCompeticion} from '../../clases/TablaAlumnoJuegoDeCompeticion';
import {TablaEquipoJuegoDeCompeticion} from '../../clases/TablaEquipoJuegoDeCompeticion';
import {AlumnoJuegoDeCompeticionLiga} from '../../clases/AlumnoJuegoDeCompeticionLiga';
import {EquipoJuegoDeCompeticionLiga} from '../../clases/EquipoJuegoDeCompeticionLiga';
import {InformacionPartidosLiga} from '../../clases/InformacionPartidosLiga';
import {TablaJornadas} from '../../clases/TablaJornadas';
import {Jornada} from '../../clases/Jornada';
import {Juego} from '../../clases/Juego';
import {EnfrentamientoLiga} from '../../clases/EnfrentamientoLiga';
import swal from 'sweetalert';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';

@IonicPage()
@Component({
  selector: 'page-Seleccionar-ganador-liga',
  templateUrl: 'Seleccionar-ganador-liga.html',
})

export class SeleccionarGanadorLigaPage {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasDelJuego: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  jornadas: Jornada[];
  // Información de la tabla: Muestra el JugadorUno, JugadorDos, Ganador, JornadaDeCompeticionLigaId y id
  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];
  jornadaSeleccionada: number;
  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[];
  alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[] = [];
  equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[] = [];
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

  juegosActivosPuntos: Juego[] = [];
  botonAsignarAleatorioDesactivado = true;
  botonAsignarManualDesactivado = true;
  // Columnas Tabla
  displayedColumnsEnfrentamientos: string[] = ['nombreJugadorUno', 'nombreJugadorDos', 'nombreGanador'];

  dataSourceEnfrentamientoIndividual;
  dataSourceEnfrentamientoEquipo;

  participanteDescansa;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private http2: Http,
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
    this.alumnosJuegoDeCompeticionLiga = this.sesion.DameInscripcionAlumno();
    this.equiposJuegoDeCompeticionLiga = this.sesion.DameInscripcionEquipo();
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

  AsignarGanadorAleatoriamente() {
    console.log('Estoy en AsignarGanadorAleatoriamente()');
    console.log('La lista de enfrentamientos de esta Jornada es: ');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    let Resultados = '';
    let Asignados = 'os enfrentamientos: ';
    const listaEnfrentamientosActualizados: EnfrentamientoLiga[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
      if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
        const Random = Math.random();
        console.log('Random ' + i + ' = ' + Random);
        if (Random < 0.33) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
          console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                      + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        } else if (Random > 0.33 && Random < 0.66) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
          console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
                      + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        } else if (Random > 0.66) {
          this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
          this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
          console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
          console.log(this.EnfrentamientosJornadaSeleccionada[i]);
          Resultados = Resultados + '\n' + 'Empate';
          listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
        }
        const enfrentamiento = new EnfrentamientoLiga(this.EnfrentamientosJornadaSeleccionada[i].JugadorUno,
                                                      this.EnfrentamientosJornadaSeleccionada[i].JugadorDos,
                                                      this.EnfrentamientosJornadaSeleccionada[i].Ganador,
                                                      this.EnfrentamientosJornadaSeleccionada[i].JornadaDeCompeticionLigaId,
                                                      undefined, undefined,
                                                      this.EnfrentamientosJornadaSeleccionada[i].id);
        this.peticionesApi.PonGanadorDelEnfrentamiento(enfrentamiento).subscribe();
      } else {
        console.log('Este enfrentamiento ya tiene asignado un ganador: ');
        console.log(this.EnfrentamientosJornadaSeleccionada[i].nombreGanador);
        Asignados = Asignados + (i + 1) + 'º ' ;
      }

    }
    if (Resultados !== '' && Asignados === 'os enfrentamientos: ') {
      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Los Resultados son: ' + Resultados);
      swal(Resultados, 'Estos son los resultados', 'success');
    } else if (Resultados === '' && Asignados !== '') {
      swal('L' + Asignados + ' ya tienen asignado un gandaor',
      'No se ha podido asignar ganador a estos enfrentamientos', 'error');
    } else if (Resultados !== '' && Asignados !== '') {
      swal(Resultados, 'No se ha podido asignar ganador a l' + Asignados + 'porque ya tienen asignado un gandaor. ',
                'success');
    }

    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Este Juego es Individual');
      this.AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados, this.alumnosJuegoDeCompeticionLiga);
    } else {
      console.log('Este Juego es por Equipos');
      this.AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados, this.equiposJuegoDeCompeticionLiga);
    }
  }

  AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < alumnosJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
          alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(alumnosJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === alumnosJuegoDeCompeticionLiga[j].AlumnoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno = alumnosJuegoDeCompeticionLiga[j].PuntosTotalesAlumno + 1;
          }
        }
        this.peticionesApi.PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnosJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados: EnfrentamientoLiga[],
                                            equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[]) {
    console.log('Estoy en AsignarGanadorAlumnosAleatoriamente()');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEnfrentamientosActualizados.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < equiposJuegoDeCompeticionLiga.length; j++) {
        if (listaEnfrentamientosActualizados[i].Ganador === equiposJuegoDeCompeticionLiga[j].EquipoId) {
          equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 3;
          console.log('El alumno ganador actualizado queda: ');
          console.log(equiposJuegoDeCompeticionLiga[j]);
        } else if (listaEnfrentamientosActualizados[i].Ganador === 0) {
          if (listaEnfrentamientosActualizados[i].JugadorUno === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorUno del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                         + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          } else if (listaEnfrentamientosActualizados[i].JugadorDos === equiposJuegoDeCompeticionLiga[j].EquipoId) {
            console.log('Ya tengo el JugadorDos del enfrentamiento ' + listaEnfrentamientosActualizados[i].id
                          + ', voy a sumarle un punto y actualizar la BD');
            equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo = equiposJuegoDeCompeticionLiga[j].PuntosTotalesEquipo + 1;
          }
        }
        this.peticionesApi.PonPuntosEquipoGanadorJuegoDeCompeticionLiga(equiposJuegoDeCompeticionLiga[j])
        .subscribe();
      }
    }
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    if (this.jornadaSeleccionada !== undefined) {
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarManualDesactivado = false;
      this.ObtenerEnfrentamientosDeCadaJornada();
    }
  }

}
