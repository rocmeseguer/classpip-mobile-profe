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
import {AlumnoJuegoDePuntos} from '../../clases/AlumnoJuegoDePuntos';
import {EquipoJuegoDePuntos} from '../../clases/EquipoJuegoDePuntos';

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
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  alumnosJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga[] = [];
  equiposJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga[] = [];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];

  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];

  juegosActivosPuntos: Juego[] = [];
  juegodePuntosSeleccionadoID: number;
  botonAsignarAleatorioDesactivado = true;
  botonAsignarJuegoDesactivado = true;
  juegosActivosPuntosModo: Juego[];
  NumeroDeJuegoDePuntos: number;
  AlumnoJuegoDeCompeticionLigaId: number;
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
    this.juegosActivosPuntos = this.sesion.DameJuegosDePuntosActivos();
    let z = 0;
    this.juegosActivosPuntosModo = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.juegosActivosPuntos.length; i++) {
        if (this.juegosActivosPuntos[i].Modo === this.juegoSeleccionado.Modo) {
          this.juegosActivosPuntosModo[z] = this.juegosActivosPuntos[i];
          z++;
        }
    }
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
    if (this.jornadaSeleccionada !== undefined && this.juegodePuntosSeleccionadoID !== undefined ) {
      for (let i = 0; i < this.juegosActivosPuntosModo.length; i++) {
        this.botonAsignarAleatorioDesactivado = false;
        this.botonAsignarJuegoDesactivado = false;
        console.log('Entro en el for');
        console.log(this.juegosActivosPuntosModo[i].id);
        console.log(this.juegodePuntosSeleccionadoID);
        console.log(this.juegosActivosPuntosModo[i].id === Number(this.juegodePuntosSeleccionadoID));
        if (this.juegosActivosPuntosModo[i].id === Number(this.juegodePuntosSeleccionadoID)) {
        console.log('Entro en el if');
        console.log(this.juegosActivosPuntosModo[i].Modo);
          // Vamos a buscar a los alumnos o equipos con sus repectivos puntos
        if (this.juegosActivosPuntosModo[i].Modo === 'Individual') {
            this.NumeroDeJuegoDePuntos = i;
            this.RecuperarInscripcionesAlumnoJuego();
            console.log(this.listaAlumnosOrdenadaPorPuntos);
          } else {
            this.NumeroDeJuegoDePuntos = i;
            this.RecuperarInscripcionesEquiposJuego();
            console.log(this.listaEquiposOrdenadaPorPuntos);
          }
        console.log('Alumnos');
        console.log(this.listaAlumnosOrdenadaPorPuntos);
        console.log('Equipo');
        console.log(this.listaEquiposOrdenadaPorPuntos);
        }
      }
      this.ObtenerEnfrentamientosDeCadaJornada();

    } else if (this.jornadaSeleccionada !== undefined) {
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarJuegoDesactivado = true;
      this.ObtenerEnfrentamientosDeCadaJornada();
    }
  }

  AsignarGanadorJuegoPuntos() {
    console.log('Entramos en Asignar ganador puntos');
    console.log(this.juegosActivosPuntosModo);
    console.log(this.juegodePuntosSeleccionadoID);
    const listaEnfrentamientosActualizados: EnfrentamientoLiga[] = [];
    let JugadorUno: AlumnoJuegoDePuntos;
    let JugadorDos: AlumnoJuegoDePuntos;
    let JugadorUnoEq: EquipoJuegoDePuntos;
    let JugadorDosEq: EquipoJuegoDePuntos;
    let Resultados = '';
    let Asignados = 'os enfrentamientos: ';
    console.log('Ya he salido del primer if y del primer FOR');
    console.log(this.NumeroDeJuegoDePuntos);
    console.log(this.juegosActivosPuntosModo);
    console.log(this.juegosActivosPuntosModo[this.NumeroDeJuegoDePuntos].Modo);
    if (this.juegosActivosPuntosModo[this.NumeroDeJuegoDePuntos].Modo === 'Individual') {
      console.log('Estoy en AsignarGanadorJuegoPuntos()');
      console.log('La lista de enfrentamientos de esta Jornada es: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
          // Para cada enfrentamiento
          // tslint:disable-next-line:prefer-for-of
          for (let y = 0; y < this.listaAlumnosOrdenadaPorPuntos.length; y++) {
            // Busco a los jugadores del enfrentamiento en la lista de participantes del juego de puntos
            if (this.listaAlumnosOrdenadaPorPuntos[y].alumnoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
              // Saco al jugador uno de la lista de participantes del juego de puntos
              JugadorUno = this.listaAlumnosOrdenadaPorPuntos[y];
              console.log('Jugador uno ' + JugadorUno);

              if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
                JugadorDos = this.listaAlumnosOrdenadaPorPuntos[y];
                console.log('Jugador dos ' + JugadorDos);
              }
            } else if (this.listaAlumnosOrdenadaPorPuntos[y].alumnoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
              // Saco al jugador dos de la lista de participantes del juego de puntos
              JugadorDos = this.listaAlumnosOrdenadaPorPuntos[y];
              console.log('Jugador dos ' + JugadorDos);
            }
          }
          console.log(JugadorUno);
          console.log(JugadorDos);
          if (JugadorUno.PuntosTotalesAlumno > JugadorDos.PuntosTotalesAlumno) {
              console.log('Ha ganado el Jugador uno');

              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else if (JugadorUno.PuntosTotalesAlumno < JugadorDos.PuntosTotalesAlumno) {
              console.log('Ha ganado el Jugador dos');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else {
              console.log('Empate');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
              Resultados = Resultados + '\n' + 'Empate';
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
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

      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Este Juego es Individual');
      this.AsignarPuntosAlumnosGanadorAleatoriamente(listaEnfrentamientosActualizados, this.alumnosJuegoDeCompeticionLiga);

    } else {
      console.log('Estoy en AsignarGanadorJuegoPuntos() por equipos');
      console.log('La lista de enfrentamientos de esta Jornada es: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.EnfrentamientosJornadaSeleccionada.length; i++) {
        if (this.EnfrentamientosJornadaSeleccionada[i].Ganador === undefined) {
          // Para cada enfrentamiento
          // tslint:disable-next-line:prefer-for-of
          for (let y = 0; y < this.listaEquiposOrdenadaPorPuntos.length; y++) {
            // Busco a los jugadores del enfrentamiento en la lista de participantes del juego de puntos
            if (this.listaEquiposOrdenadaPorPuntos[y].equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorUno) {
              // Saco al jugador uno de la lista de participantes del juego de puntos
              JugadorUnoEq = this.listaEquiposOrdenadaPorPuntos[y];
              console.log('Jugador uno ' + JugadorUnoEq);
              if (this.EnfrentamientosJornadaSeleccionada[i].JugadorUno === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
                JugadorDosEq = this.listaEquiposOrdenadaPorPuntos[y];
                console.log('Jugador dos IFF ' + JugadorDosEq);
              }
            } else if (this.listaEquiposOrdenadaPorPuntos[y].equipoId === this.EnfrentamientosJornadaSeleccionada[i].JugadorDos) {
              // Saco al jugador dos de la lista de participantes del juego de puntos
              JugadorDosEq = this.listaEquiposOrdenadaPorPuntos[y];
              console.log('Jugador dos ' + JugadorDosEq);
            }
          }
          if (JugadorUnoEq.PuntosTotalesEquipo > JugadorDosEq.PuntosTotalesEquipo) {
              console.log('Ha ganado el Jugador uno');

              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorUno;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorUno);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else if (JugadorUnoEq.PuntosTotalesEquipo < JugadorDosEq.PuntosTotalesEquipo) {
              console.log('Ha ganado el Jugador dos');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = this.EnfrentamientosJornadaSeleccionada[i].JugadorDos;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              Resultados = Resultados + '\n' + 'Ganador: ' + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos;
              console.log('El ganador del enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' es: '
              + this.EnfrentamientosJornadaSeleccionada[i].nombreJugadorDos);
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
              listaEnfrentamientosActualizados.push(this.EnfrentamientosJornadaSeleccionada[i]);
          } else {
              console.log('Empate');
              this.EnfrentamientosJornadaSeleccionada[i].Ganador = 0;
              this.EnfrentamientosJornadaSeleccionada[i].nombreGanador = 'Empate';
              console.log('El enfrentamiento ' + this.EnfrentamientosJornadaSeleccionada[i].id + ' ha quedado en empate: ');
              Resultados = Resultados + '\n' + 'Empate';
              console.log(this.EnfrentamientosJornadaSeleccionada[i]);
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

      console.log('La lista de enfrentamientos actualizados queda: ');
      console.log(listaEnfrentamientosActualizados);
      console.log('Este Juego es por Equipos');
      this.AsignarPuntosEquiposGanadorAleatoriamente(listaEnfrentamientosActualizados, this.equiposJuegoDeCompeticionLiga);
    }

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
