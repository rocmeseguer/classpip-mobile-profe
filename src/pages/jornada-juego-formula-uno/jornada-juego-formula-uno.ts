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

  TablaClasificacionJornadaSeleccionada: TablaClasificacionJornada[];

  // Columnas Tabla
  displayedColumns: string[] = ['posicion', 'participante', 'puntos'];

  dataSourceClasificacionJornada;
  botonResultadosDesactivado: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private calculos: CalculosProvider,
              private sesion: SesionProvider,
              private peticionesApi: PeticionesApiProvider) { }



  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Estoy en ngOnInit de información formula uno');
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    console.log('Juego seleccionado: ');
    console.log(this.juegoSeleccionado);
    console.log('Número total de jornadas: ');
    console.log(this.numeroTotalJornadas);
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
  }

  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
    if (jornadaSeleccionada.GanadoresFormulaUno === undefined) {
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                     this.listaEquiposClasificacion, undefined, undefined);
    } else {
      this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
                                                     this.listaEquiposClasificacion, jornadaSeleccionada.GanadoresFormulaUno.nombre,
                                                     jornadaSeleccionada.GanadoresFormulaUno.id);
    }
    // console.log(this.datosClasificaciónJornada.participante);
    // console.log(this.datosClasificaciónJornada.puntos);
    // console.log(this.datosClasificaciónJornada.posicion);
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
    console.log('TablaClasificacionJornadaSeleccionada:');
    console.log(this.TablaClasificacionJornadaSeleccionada);
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
  }

}

