import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Http} from '@angular/http';
//import { IonContent, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonPage, IonItemDivider } from '@ionic/react';
import {TablaAlumnoJuegoDeCompeticion} from '../../clases/TablaAlumnoJuegoDeCompeticion';
import {TablaEquipoJuegoDeCompeticion} from '../../clases/TablaEquipoJuegoDeCompeticion';

import {TablaJornadas} from '../../clases/TablaJornadas';
import {Jornada} from '../../clases/Jornada';
import {Juego} from '../../clases/Juego';

import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';


//Importamos las clases necesarias
import {TablaClasificacionJornada} from '../../clases/index';

@IonicPage()
@Component({
  selector: 'page-jornada-juego-formula-uno',
  templateUrl: 'jornada-juego-formula-uno.html',
})

export class JornadaJuegoFormulaUnoPage {

 // Juego De CompeticionLiga seleccionado
 juegoSeleccionado: Juego;
 numeroTotalJornadas: number;
 jornadasDelJuego: Jornada[];
 JornadasCompeticion: TablaJornadas[] = [];
 tablaJornadaSelccionada: TablaJornadas;
 jornadaId: number;
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
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);
  }

  ActualizarBoton() {
    console.log('Estoy en actualizar botón');
    this.jornadaId = this.jornadaSeleccionada;
    this.ObtenerClasificaciónDeCadaJornada();
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
}
