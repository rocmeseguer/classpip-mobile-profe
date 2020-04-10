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

//Importamos las clases necesarias
import { AlumnoJuegoDeCompeticionFormulaUno, EquipoJuegoDeCompeticionFormulaUno, TablaClasificacionJornada} from '../../clases/index';

@IonicPage()
@Component({
  selector: 'page-Seleccionar-ganador-formula-uno',
  templateUrl: 'Seleccionar-ganador-formula-uno.html',
})

export class SeleccionarGanadorFormulaUnoPage {

 // Juego De CompeticionLiga seleccionado
 juegoSeleccionado: Juego;
 numeroTotalJornadas: number;
 jornadasDelJuego: Jornada[];
 JornadasCompeticion: TablaJornadas[] = [];
 tablaJornadaSelccionada: TablaJornadas;
 jornadaId: number;

 jornadaTieneGanadores: boolean;
 textoParticipantesPuntuan: string;
 isDisabledAnadirGanadores = true; // Activa/Desactiva botón añadir masivamente ganadores

 modoAsignacionId: number;
 botonAsignarAleatorioDesactivado = true;
 botonAsignarJuegoDesactivado = true;

 manualmente = false;
 aleatoriamente = true;

 listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
 listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

 participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[] = [];
 participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[] = [];
 ganadoresFormulaUnoId: number[] = [];

 juegosActivosPuntos: Juego[];
 juegosActivosPuntosModo: Juego[];
 NumeroDeJuegoDePuntos: number;
 juegodePuntosSeleccionadoID: number;
 listaAlumnosOrdenadaPorPuntosJuegoDePuntos: AlumnoJuegoDePuntos[];
 listaEquiposOrdenadaPorPuntosJuegoDePuntos: EquipoJuegoDePuntos[];
 jornadaSeleccionada: number;

 listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
 listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
 datosClasificacionJornada: {participante: string[];
                             puntos: number[];
                             posicion: number[];
                             participanteId: number[];
                            };

 TablaClasificacionJornadaSeleccionada: TablaClasificacionJornada[];


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
    console.log('Estoy en ionViewDidLoad de ganadores formula uno');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.jornadasDelJuego = datos.jornadas;
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
    this.listaAlumnosOrdenadaPorPuntos = this.sesion.DameInscripcionAlumno();
    console.log(this.listaAlumnosOrdenadaPorPuntos);
    this.listaEquiposOrdenadaPorPuntos = this.sesion.DameInscripcionEquipo();
    console.log(this.listaEquiposOrdenadaPorPuntos);
    this.jornadaTieneGanadores = true;
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
    console.log('juegosActivosPuntosModo:');
    console.log(this.juegosActivosPuntosModo);
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    console.log(this.jornadaSeleccionada);
    console.log(this.juegodePuntosSeleccionadoID);
    console.log(this.botonAsignarAleatorioDesactivado);
    console.log(this.botonAsignarJuegoDesactivado);
    if (this.jornadaSeleccionada !== undefined && this.juegodePuntosSeleccionadoID !== undefined) {
      console.log('Estoy en actualizar botón modo juego');
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarJuegoDesactivado = false;
       // tslint:disable-next-line:prefer-for-of
       for (let i = 0; i < this.juegosActivosPuntosModo.length; i++) {
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
            console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
          } else {
            this.NumeroDeJuegoDePuntos = i;
            this.RecuperarInscripcionesEquiposJuego();
            console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
          }
        console.log('Alumnos');
        console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
        console.log('Equipo');
        console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
        }
      }
      this.TieneGanadores(this.jornadaId);
      this.ObtenerClasificaciónDeCadaJornada();

    } else if (this.jornadaSeleccionada !== undefined) {
      console.log('Estoy en actualizar botón modo alea');
      this.botonAsignarAleatorioDesactivado = false;
      this.botonAsignarJuegoDesactivado = true;
      this.jornadaId = this.jornadaSeleccionada;
      this.TieneGanadores(this.jornadaId);
      this.ObtenerClasificaciónDeCadaJornada();
      console.log(this.juegosActivosPuntosModo);
      console.log(this.juegodePuntosSeleccionadoID);

    }
  }

  AsignarAleatoriamente() {
    console.log('Estoy en AsignarAleatoriamente');
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      this.GanadoresAleatoriamente(this.juegoSeleccionado, this.listaAlumnosOrdenadaPorPuntos, this.listaEquiposOrdenadaPorPuntos);
      // Actualizamos TablaClasificacionJornadaSeleccionada
      this.ActualizarTablaClasificacion(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      swal('Resultados asignados', ' Enhorabuena', 'success');
      this.ActualizarGanadoresJornada();
    } else {
      console.log('Este juego ya tiene ganadores asignados');
      swal('Este juego ya tiene ganadores asignados', ' No se ha podido realizar esta acción', 'error');
    }
  }

  // Funciones para AsignarAleatoriamente
  GanadoresAleatoriamente(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                          listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[]) {
    if (juegoSeleccionado.Modo === 'Individual') {
      console.log('Estoy en asignar aleatoriamente individual');
      this.ganadoresFormulaUnoId = [];
      this.participantesIndividualPuntuan = [];
      const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = [];
      listaAlumnosOrdenadaPorPuntos.forEach(alumno => participantes.push(alumno));
      console.log('participantes');
      console.log(participantes);

      let i = 0;
      let posicion = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        const AlumnoId = participantes[elegido].AlumnoId;
        const puntosTotales = participantes[elegido].PuntosTotalesAlumno + juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, juegoSeleccionado.id, puntosTotales, id);
        this.participantesIndividualPuntuan.push(ganador);
        participantes.splice(elegido, 1);
        console.log('participantes');
        console.log(participantes);
        console.log('listaAlumnosOrdenadaPorPuntos');
        console.log(listaAlumnosOrdenadaPorPuntos);
        this.ganadoresFormulaUnoId.push(AlumnoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesIndividualPuntuan);
    } else {

      this.ganadoresFormulaUnoId = [];
      this.participantesEquipoPuntuan = [];
      const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: EquipoJuegoDeCompeticionFormulaUno[] = listaEquiposOrdenadaPorPuntos;
      console.log(participantes);
      let i = 0;
      let posicion = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesEquipoPuntuan y
      // los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
        const numeroParticipantes = participantes.length;
        const elegido = Math.floor(Math.random() * numeroParticipantes);
        const EquipoId = participantes[elegido].EquipoId;
        const puntosTotales = participantes[elegido].PuntosTotalesEquipo + juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new EquipoJuegoDeCompeticionFormulaUno(EquipoId, juegoSeleccionado.id, puntosTotales, id);
        this.participantesEquipoPuntuan.push(ganador);
        participantes.splice(elegido, 1);
        this.ganadoresFormulaUnoId.push(EquipoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesEquipoPuntuan);
    }
    console.log('Los id de los ganadores de la jornada son:');
    console.log(this.ganadoresFormulaUnoId);
  }

  ActualizarTablaClasificacion(juegoSeleccionado: Juego, participantesIndividualPuntuan: AlumnoJuegoDeCompeticionFormulaUno[],
                               participantesEquipoPuntuan: EquipoJuegoDeCompeticionFormulaUno[]) {
    console.log('Hay ' + this.TablaClasificacionJornadaSeleccionada.length +
                ' participantes en la TablaClasificacionJornadaSeleccionada');
    if (juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < participantesIndividualPuntuan.length; x++) {
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.TablaClasificacionJornadaSeleccionada.length; y++) {
          if (this.TablaClasificacionJornadaSeleccionada[y].id === participantesIndividualPuntuan[x].AlumnoId) {
            this.TablaClasificacionJornadaSeleccionada[y].puntos = this.juegoSeleccionado.Puntos[x];
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let x = 0; x < participantesEquipoPuntuan.length; x++) {
        // tslint:disable-next-line:prefer-for-of
        for (let y = 0; y < this.TablaClasificacionJornadaSeleccionada.length; y++) {
          if (this.TablaClasificacionJornadaSeleccionada[y].id === participantesEquipoPuntuan[x].EquipoId) {
            this.TablaClasificacionJornadaSeleccionada[y].puntos = this.juegoSeleccionado.Puntos[x];
          }
        }
      }
      // tslint:disable-next-line:only-arrow-functions
      this.TablaClasificacionJornadaSeleccionada = this.TablaClasificacionJornadaSeleccionada.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
    }
    // tslint:disable-next-line:prefer-for-of
    for (let z = 0; z < this.TablaClasificacionJornadaSeleccionada.length; z++) {
       this.TablaClasificacionJornadaSeleccionada[z].posicion = z + 1;
    }
    // this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    console.log('La TablaClasificacionJornadaSeleccionada actualizada queda: ');
    console.log(this.TablaClasificacionJornadaSeleccionada);
  }

  // Consultas a la API
  ActualizarGanadoresJornada() {
    // Hacemos el put para editar el juego con los GanadoresFormulaUno
      // tslint:disable-next-line:prefer-for-of
      for (let m = 0; m < this.jornadasDelJuego.length; m++) {
        if (this.jornadasDelJuego[m].id === Number(this.jornadaId)) {
          const jornadaActualizada: Jornada = this.jornadasDelJuego[m];
          jornadaActualizada.GanadoresFormulaUno = this.ganadoresFormulaUnoId;
          this.peticionesApi.PonGanadoresJornadasDeCompeticionFormulaUno(jornadaActualizada)
          .subscribe(jornada => {
            console.log('La jornada actualizada queda: ');
            console.log(jornada);
            this.ActualizarPuntosGanadoresJornada();
          });
        }
      }
  }

  ActualizarPuntosGanadoresJornada() {
    console.log('Estoy en ActualizarPuntosGanadoresJornada()');
    // Hacemos el put de los ganadores para actualizar los puntos en la base de datos
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participantesIndividualPuntuan.length; i++) {
      this.peticionesApi.PonPuntosAlumnosGanadoresJornadasDeCompeticionFormulaUno(this.participantesIndividualPuntuan[i])
      .subscribe(participante => {
        console.log('Se ha actualizado en la base de datos el alumno: ');
        console.log(participante);
      });
      }
    } else {
      console.log('Estoy en ActualizarPuntosGanadoresJornada() equipos');
      console.log('participantesEquipoPuntuan: ');
      console.log(this.participantesEquipoPuntuan);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.participantesEquipoPuntuan.length; i++) {
        this.peticionesApi.PonPuntoEquiposGanadoresJornadasDeCompeticionFormulaUno(this.participantesEquipoPuntuan[i])
        .subscribe(participante => {
          console.log('Se ha actualizado en la base de datos el equipo: ');
          console.log(participante);
        });
        }
    }
  }

  TieneGanadores(jornadaId: number) {
    console.log('Estoy en TieneGanadores');
    console.log(this.jornadasDelJuego);
    this.jornadaTieneGanadores = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadasDelJuego.length; i++) {
      if (this.jornadasDelJuego[i].id === Number(jornadaId)) {
        if (this.jornadasDelJuego[i].GanadoresFormulaUno !== undefined) {
          this.jornadaTieneGanadores = true;
        }
      }
    }
    return this.jornadaTieneGanadores;
  }

  ObtenerClasificaciónDeCadaJornada() {
    console.log('Estoy en ObtenerClasificaciónDeCadaJornada');
    console.log(this.JornadasCompeticion);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.JornadasCompeticion.length; i++) {
      const JornadasCompeticionId = this.JornadasCompeticion[i].id;
      if (JornadasCompeticionId === Number(this.jornadaId)) {
        this.tablaJornadaSelccionada = this.JornadasCompeticion[i];
      }
    }
    console.log(this.tablaJornadaSelccionada);
    console.log('El id de la jornada seleccionada es: ' + this.tablaJornadaSelccionada.id);
    if (this.tablaJornadaSelccionada.GanadoresFormulaUno === undefined) {
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                                          this.listaEquiposClasificacion,
                                                                          undefined,
                                                                          undefined);
    } else {
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                                          this.listaEquiposClasificacion,
                                                                          this.tablaJornadaSelccionada.GanadoresFormulaUno.nombre,
                                                                          this.tablaJornadaSelccionada.GanadoresFormulaUno.id);
    }
    this.ConstruirTablaClasificaciónJornada();
  }

  ConstruirTablaClasificaciónJornada() {
    console.log ('Aquí tendré la tabla de clasificación, los participantes ordenados son:');
    console.log(this.datosClasificacionJornada.participante);
    console.log(this.datosClasificacionJornada.puntos);
    console.log(this.datosClasificacionJornada.posicion);
    console.log('ParticipanteId:');
    console.log(this.datosClasificacionJornada.participanteId);
    this.TablaClasificacionJornadaSeleccionada = this.calculos.PrepararTablaRankingJornadaFormulaUno(this.datosClasificacionJornada);
    // this.dataSourceClasificacionJornada = new MatTableDataSource(this.TablaClasificacionJornadaSeleccionada);
    // console.log(this.dataSourceClasificacionJornada.data);
  }

  AsignarGanadorJuegoPuntos() {
    console.log('Estoy en AsignarJuegoPuntos');
    console.log(this.jornadaId);
    const jornadaTieneGanadores = this.TieneGanadores(Number(this.jornadaId));
    console.log('Tiene Ganadores = ' + jornadaTieneGanadores);
    console.log('Puntos del juego');
    console.log(this.juegoSeleccionado.Puntos);
    if (jornadaTieneGanadores === false) {
      // Elegimos los ganadores y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
      this.GanadoresJuegoDePuntos(this.juegoSeleccionado, this.listaAlumnosOrdenadaPorPuntos, this.listaEquiposOrdenadaPorPuntos);
      // Actualizamos TablaClasificacionJornadaSeleccionada
      this.ActualizarTablaClasificacion(this.juegoSeleccionado, this.participantesIndividualPuntuan, this.participantesEquipoPuntuan);
      swal('Resultados asignados', ' Enhorabuena', 'success');
      // Rellenamos lista participantesIndividualPuntuan/participantesEquipoPuntuan con los Alumno/Equipo actualizados
      this.ListaParticipantesPuntuanActualizados();
      // Actualizamos ganadores en la jornada
      this.ActualizarGanadoresJornada();
    } else {
      console.log('Este juego ya tiene ganadores asignados');
      swal('Este juego ya tiene ganadores asignados', ' No se ha podido realizar esta acción', 'error');
    }
  }

  GanadoresJuegoDePuntos(juegoSeleccionado: Juego, listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                         listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[]) {
    if (juegoSeleccionado.Modo === 'Individual') {
    console.log('Estoy en asignar Puntos individual');
    console.log(juegoSeleccionado);
    console.log(listaAlumnosOrdenadaPorPuntos);
    console.log(listaEquiposOrdenadaPorPuntos);
    this.ganadoresFormulaUnoId = [];
    this.participantesIndividualPuntuan = [];
    const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
    const participantes: AlumnoJuegoDeCompeticionFormulaUno[] = listaAlumnosOrdenadaPorPuntos;
    let i = 0;
    let elegido = 0;
    let posicion = 0;
    // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesPuntuan y los id en la lista ganadoresFormulaUnoId
    while (i < numeroParticipantesPuntuan) {
      console.log(numeroParticipantesPuntuan);
    // tslint:disable-next-line:prefer-for-of
    for (let w = 0; w < participantes.length; w++) {
      console.log(participantes[w].AlumnoId);
      console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
      console.log(this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos[i].alumnoId);
      if (participantes[w].AlumnoId === this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos[i].alumnoId) {
        elegido = w;
      }
    }
    console.log(participantes);
    const AlumnoId = participantes[elegido].AlumnoId;
    console.log('A ver que pasa');
    console.log(participantes[elegido]);
    console.log(juegoSeleccionado.Puntos);
    console.log(participantes[elegido].PuntosTotalesAlumno);
    console.log(juegoSeleccionado.Puntos[posicion]);
    const puntosTotales = participantes[elegido].PuntosTotalesAlumno + juegoSeleccionado.Puntos[posicion];
    posicion = posicion + 1;
    const id = participantes[elegido].id;
    const ganador = new AlumnoJuegoDeCompeticionFormulaUno(AlumnoId, juegoSeleccionado.id, puntosTotales, id);
    this.participantesIndividualPuntuan.push(ganador);
    this.ganadoresFormulaUnoId.push(AlumnoId);
    i++;
    }
    console.log('Los participantes que puntúan son: ');
    console.log(this.participantesIndividualPuntuan);
    } else {
      console.log('Estoy en asignar aleatoriamente equipo');
      console.log(listaEquiposOrdenadaPorPuntos);
      this.ganadoresFormulaUnoId = [];
      this.participantesEquipoPuntuan = [];
      const numeroParticipantesPuntuan = juegoSeleccionado.NumeroParticipantesPuntuan;
      const participantes: EquipoJuegoDeCompeticionFormulaUno[] = listaEquiposOrdenadaPorPuntos;
      let i = 0;
      let posicion = 0;
      let elegido = 0;
      // Elegimos los ganadores aleatoriamente y los ponemos en una lista: participantesEquipoPuntuan y
      // los id en la lista ganadoresFormulaUnoId
      while (i < numeroParticipantesPuntuan) {
      // tslint:disable-next-line:prefer-for-of
        for (let w = 0; w < participantes.length; w++) {
          if (participantes[w].EquipoId === this.listaEquiposOrdenadaPorPuntosJuegoDePuntos[i].equipoId) {
            elegido = w;
          }
        }
        const EquipoId = participantes[elegido].EquipoId;
        const puntosTotales = participantes[elegido].PuntosTotalesEquipo + juegoSeleccionado.Puntos[posicion];
        posicion = posicion + 1;
        const id = participantes[elegido].id;
        const ganador = new EquipoJuegoDeCompeticionFormulaUno(EquipoId, juegoSeleccionado.id, puntosTotales, id);
        this.participantesEquipoPuntuan.push(ganador);
        this.ganadoresFormulaUnoId.push(EquipoId);
        i++;
      }
      console.log('Los participantes que puntúan son: ');
      console.log(this.participantesEquipoPuntuan);
    }
    console.log('Los id de los ganadores de la jornada son:');
    console.log(this.ganadoresFormulaUnoId);
    }

    ListaParticipantesPuntuanActualizados() {
      if (this.juegoSeleccionado.Modo === 'Individual') {
        console.log('Estoy en ListaParticipantesPuntuanActualizados() Individual');
        this.participantesIndividualPuntuan = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.ganadoresFormulaUnoId.length; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.listaAlumnosOrdenadaPorPuntos.length; j++) {
            if (this.ganadoresFormulaUnoId[i] === this.listaAlumnosOrdenadaPorPuntos[j].AlumnoId) {
              this.listaAlumnosOrdenadaPorPuntos[j].PuntosTotalesAlumno = this.listaAlumnosOrdenadaPorPuntos[j].PuntosTotalesAlumno
                                                                          + this.juegoSeleccionado.Puntos[i];
              this.participantesIndividualPuntuan.push(this.listaAlumnosOrdenadaPorPuntos[j]);
            }
          }
        }
        console.log('participantesIndividualPuntuan');
        console.log(this.participantesIndividualPuntuan);
      } else {
        this.participantesEquipoPuntuan = [];
        console.log('Estoy en ListaParticipantesPuntuanActualizados() Equipo');
        console.log('ganadoresFormulaUnoId');
        console.log(this.ganadoresFormulaUnoId);
        this.participantesEquipoPuntuan = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.ganadoresFormulaUnoId.length; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.listaEquiposOrdenadaPorPuntos.length; j++) {
            if (this.ganadoresFormulaUnoId[i] === this.listaEquiposOrdenadaPorPuntos[j].EquipoId) {
              this.listaEquiposOrdenadaPorPuntos[j].PuntosTotalesEquipo = this.listaEquiposOrdenadaPorPuntos[j].PuntosTotalesEquipo
                                                                          + this.juegoSeleccionado.Puntos[i];
              this.participantesEquipoPuntuan.push(this.listaEquiposOrdenadaPorPuntos[j]);
            }
          }
        }
      }
      console.log('participantesEquipoPuntuan');
      console.log(this.participantesEquipoPuntuan);
    }

    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesAlumnoJuego() {
    console.log ('voy a por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesApi.DameInscripcionesAlumnoJuegoDePuntos(this.juegodePuntosSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos = this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log ('ya tengo las inscripciones');
      console.log (this.listaAlumnosOrdenadaPorPuntosJuegoDePuntos);
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen
  RecuperarInscripcionesEquiposJuego() {

    console.log ('vamos por las inscripciones ' + Number(this.juegodePuntosSeleccionadoID));
    this.peticionesApi.DameInscripcionesEquipoJuegoDePuntos(this.juegodePuntosSeleccionadoID)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);

      // ordenamos por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntosJuegoDePuntos = this.listaEquiposOrdenadaPorPuntosJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      console.log ('ya tengo las inscripciones');
      console.log (this.listaEquiposOrdenadaPorPuntosJuegoDePuntos);
    });
  }
}
