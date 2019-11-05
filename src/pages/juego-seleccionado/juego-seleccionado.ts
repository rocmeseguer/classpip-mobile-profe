import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';

//Importamos las páginas necesarias
import { InfoJuegoPuntosPage } from '../info-juego-puntos/info-juego-puntos';
import { AsignarPuntosPage } from '../asignar-puntos/asignar-puntos';
import { AsignarCromosPage } from '../asignar-cromos/asignar-cromos';
import { MisCromosPage } from '../mis-cromos/mis-cromos';
import { MisCromosActualesPage } from '../mis-cromos-actuales/mis-cromos-actuales';

//Importamos las clases necesarias
import {TablaAlumnoJuegoDePuntos} from '../../clases/TablaAlumnoJuegoDePuntos';
import {TablaEquipoJuegoDePuntos} from '../../clases/TablaEquipoJuegoDePuntos';
import {Punto} from '../../clases/Punto';
import { Alumno } from '../../clases/Alumno';
import {Equipo} from '../../clases/Equipo';
import {Coleccion} from '../../clases/Coleccion';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';


@IonicPage()
@Component({
  selector: 'page-juego-seleccionado',
  templateUrl: 'juego-seleccionado.html',
})
export class JuegoSeleccionadoPage  {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  juegoSeleccionado: any;

  // Recupera la informacion del juego seleccionado además de los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: any[];
  equiposDelJuego: any[];
  tiposPuntosDelJuego: any[];
  nivelesDelJuego: any[];
  alumnosEquipo: any[];
  puntoSeleccionadoId: number;
  items: any[];
  items1: any[];
  itemsAPI: any[];
  coleccion: any;
  listaSeleccionable: any[] = [];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: any[];
  listaEquiposOrdenadaPorPuntos: any[];

  inscripcionesAlumnosJuegoColeccion: any[];
  inscripcionesEquiposJuegoColeccion: any[];

   // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
   rankingJuegoDePuntos: any[] = [];
   rankingJuegoDePuntosTotal: any[] = [];
   rankingEquiposJuegoDePuntos: any[] = [];
   rankingEquiposJuegoDePuntosTotal: any[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private calculos: CalculosProvider,
              private sesion: SesionProvider,
              private peticionesApi: PeticionesApiProvider) {
    this.juegoSeleccionado=navParams.get('juego');

  }

  // URLs que utilizaremos
  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIURLAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIURLEquiposJuegoDePuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIURLHistorialPuntosAlumno = 'http://localhost:3000/api/HistorialesPuntosAlumno';
  private APIURLHistorialPuntosEquipo = 'http://localhost:3000/api/HistorialesPuntosEquipo';
  private APIRURLJuegoDeColeccion = 'http://localhost:3000/api/JuegosDeColeccion';
  private APIRURLColecciones = 'http://localhost:3000/api/Colecciones';

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log(this.juegoSeleccionado);


    //Se discrimina por tipo de Juego: Puntos o Coleccion

    if (this.juegoSeleccionado.Tipo === 'Juego De Puntos') {
      this.listaSeleccionable[0] =  new Punto('Totales');

      this.TraeTiposPuntosDelJuego();
      this.NivelesDelJuego();

      //Se discrimina por modo de Juego: Individual o Colectivo
      if (this.juegoSeleccionado.Modo === 'Individual') {
        this.AlumnosDelJuego();
      } else {
        this.EquiposDelJuego();
      }
    }

    if (this.juegoSeleccionado.Tipo === 'Juego De Colección') {

        //Se discrimina por modo de Juego: Individual o Colectivo
        if (this.juegoSeleccionado.Modo === 'Individual') {
          this.AlumnosDelJuegoColeccion();
        } else {
          this.EquiposDelJuegoColeccion();
        }
    }
  }


  // Recupera los alumnos que pertenecen al juego de Puntos
  AlumnosDelJuego() {
    this.peticionesApi.DameAlumnosJuegoDePuntos (this.juegoSeleccionado.id)
    // this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.items = alumnosJuego;
      this.itemsAPI=alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

    // Recupera los equipos que pertenecen al juego de Puntos
  EquiposDelJuego() {
      this.peticionesApi.DameEquiposJuegoDePuntos (this.juegoSeleccionado.id)
      // this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/equipos')
      .subscribe(equiposJuego => {
        this.equiposDelJuego= equiposJuego;
        console.log ('Equipos ' + this.equiposDelJuego);
        this.items = equiposJuego;
        this.itemsAPI=equiposJuego;
        this.RecuperarInscripcionesEquiposJuego();
      });
    }



    // Recupera los puntos que se pueden asignar en el juego
  TraeTiposPuntosDelJuego() {
      this.peticionesApi.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(puntos => {
        this.tiposPuntosDelJuego = puntos;
        this.listaSeleccionable = [];
        this.listaSeleccionable[0] =  new Punto('Totales');
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.tiposPuntosDelJuego.length; i ++) {
          this.listaSeleccionable.push(this.tiposPuntosDelJuego[i]);
        }
      });
  }


    // Recupera los niveles de los que dispone el juego
  NivelesDelJuego() {
      this.peticionesApi.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(niveles => {
        this.nivelesDelJuego = niveles;
      });
  }



  // Recupera los alumnos que pertenecen al juego de Colecciones desde la API
  AlumnosDelJuegoColeccion() {
    this.peticionesApi.DameAlumnosJuegoDeColeccion (this.juegoSeleccionado.id)
    // this.http.get<Alumno[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.items = alumnosJuego;
      this.itemsAPI=alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuegoColeccion();
      this.ColeccionDelJuego();
    });
  }

  // Recupera los equipos que pertenecen al juego de Colecciones desde la API
  EquiposDelJuegoColeccion() {
    this.peticionesApi.DameEquiposJuegoDeColeccion (this.juegoSeleccionado.id)
    // this.http.get<Equipo[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {
      this.equiposDelJuego= equiposJuego;
      this.items = equiposJuego;
      this.itemsAPI= equiposJuego;
      console.log(equiposJuego);
      this.RecuperarInscripcionesEquiposJuegoColeccion();
      this.ColeccionDelJuego();
    });
  }

  // Recupera la colección de cromos que pertenece al juego de Colecciones desde la API
  ColeccionDelJuego() {
    console.log('voy por la colección ' + this.juegoSeleccionado.coleccionId );
    this.peticionesApi.DameColeccion (this.juegoSeleccionado.coleccionId)
    //this.peticionesApi.DameColeccionesDelProfesor (this.juegoSeleccionado.coleccionId)
    // this.http.get<Coleccion>(this.APIRURLColecciones + '/' + this.juegoSeleccionado.coleccionId)
    .subscribe(coleccion => {
      this.coleccion = coleccion;
      console.log('ya tengo la colección ' + this.coleccion );
    });
  }


  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesApi.DameInscripcionesAlumnoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log ('ya tengo las inscripciones');
      // this.OrdenarPorPuntos();
      this.TablaClasificacionTotal();
    });
  }


    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
    RecuperarInscripcionesEquiposJuego() {

      this.peticionesApi.DameInscripcionesEquipoJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.listaEquiposOrdenadaPorPuntos = inscripciones;
        console.log(this.listaEquiposOrdenadaPorPuntos);

        // ordenamos por puntos
        // tslint:disable-next-line:only-arrow-functions
        this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
          return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
        });
        console.log ('ya tengo las inscripciones');
        this.TablaClasificacionTotal();
      });
    }



  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuegoColeccion() {
    this.peticionesApi.DameInscripcionesAlumnoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnosJuegoColeccion = inscripciones;

    });
  }



    // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuegoColeccion() {

    this.peticionesApi.DameInscripcionesEquipoJuegoDeColeccion(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquiposJuegoColeccion = inscripciones;
    });
  }

  // En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
  // Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS
  TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividual (
        this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego,
        this.nivelesDelJuego
      );
      console.log ('Ya tengo la tabla');
      // tslint:disable-next-line:max-line-length
     // this.rankingJuegoDePuntosTotal = this.calculos.DameRanking (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego);
     // this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);

    } else {

      this.rankingEquiposJuegoDePuntos = this.calculos.PrepararTablaRankingEquipos (
        this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego
      );
      console.log ('ranking ' + this.rankingEquiposJuegoDePuntos);
      //this.datasourceEquipo = new MatTableDataSource(this.rankingEquiposJuegoDePuntos);

    }
  }



  ClasificacionPorTipoDePunto() {

    if (this.juegoSeleccionado.Modo === 'Individual') {
      // tslint:disable-next-line:max-line-length
      console.log('Voy a por la clasficiacion del punto de tipo ' + this.puntoSeleccionadoId);
      // tslint:disable-next-line:max-line-length
      this.calculos.DameRankingPuntoSeleccionadoAlumnos (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego, this.puntoSeleccionadoId).
      subscribe ( res => this.rankingJuegoDePuntos = res);
    } else {
      // tslint:disable-next-line:max-line-length
      this.calculos.DameRankingPuntoSeleccionadoEquipos (this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego, this.puntoSeleccionadoId).
      subscribe ( res => this. rankingEquiposJuegoDePuntos = res);
    }

  }

  //Función que permite mostrar los puntos totales o en caso de seleccionar un punto, te muestra
  //la tabla segun el tipo de punto seleccionado
  MostrarRankingSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.tiposPuntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

      console.log('Tabla del principio');
      this.TablaClasificacionTotal();

    } else {
      console.log('Voy a por la clasficiacion del punto');
      this.ClasificacionPorTipoDePunto();

    }
  }

  //Función que permite redirigirte a la página de información de juego de puntos o juego de coleccion
  irInformacion(juego: any) {
    if (this.juegoSeleccionado.Tipo === 'Juego De Puntos') {
    console.log ('Accediendo a Información de Juego de Puntos');
    this.navCtrl.push (InfoJuegoPuntosPage,{juego:juego});
    }
    else{
    console.log ('Accediendo a Información de Juego de Colecciones ' + this.coleccion);
    this.navCtrl.push (MisCromosPage,{coleccion:this.coleccion});
    }
}

AsignarPuntos(juego: any) {
  // Para enviar la tabla de los puntos totales
  this.TablaClasificacionTotal();


  // enviamos a la sesión la información que se necesitará para asignar
  // puntos, que es mucha
  // Esto hay que mejorarlo
  this.sesion.TomaDatosParaAsignarPuntos (
        this.tiposPuntosDelJuego,
        this.nivelesDelJuego,
        this.alumnosDelJuego,
        this.listaAlumnosOrdenadaPorPuntos,
        this.rankingJuegoDePuntos,
        this.equiposDelJuego,
        this.listaEquiposOrdenadaPorPuntos,
        this.rankingEquiposJuegoDePuntos);
  this.navCtrl.push (AsignarPuntosPage,{juego:juego});
}



//Función que permite redirigirte a la página de asignación de cromos
AsignarCromos(juego: any) {
  console.log ('Accediendo a Asignación de Puntos');
  this.navCtrl.push (AsignarCromosPage,{juego:juego});
}

//Nos permitirá fijar la lista de alumnos (filtrados)
fijarItems(items :any[]){
  this.items = items;
}

//Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengas las caracteristicas definidas en el filtro
  getItems(ev: any) {
    // Reset items back to all of the items
    this.fijarItems(this.itemsAPI);
    // set val to the value of the searchbar
    let val = ev.target.value;

        if (val && val.trim() !== '') {
        this.items = this.items.filter(function(item) {
          return (item.Nombre.toLowerCase().includes(val.toLowerCase())||
          item.PrimerApellido.toLowerCase().includes(val.toLowerCase())||
          item.SegundoApellido.toLowerCase().includes(val.toLowerCase()));
        });
      }
    }

      //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengas las caracteristicas definidas en el filtro
  getItems1(ev: any) {
    // Reset items back to all of the items
    this.fijarItems(this.itemsAPI);
    // set val to the value of the searchbar
    let val = ev.target.value;

        if (val && val.trim() !== '') {
        this.items = this.items.filter(function(item) {
          return (item.Nombre.toLowerCase().includes(val.toLowerCase()));
        });
      }
    }

    //Función que permite redirigirte a la página de cromos disponibles de un alumno
    irCromosActualesAlumno(alumno:any,juego: any){
      console.log ('FILTER ' + alumno.id);
      console.log ('FILTER ' + this.inscripcionesAlumnosJuegoColeccion);
      let al = this.inscripcionesAlumnosJuegoColeccion.filter(res => res.alumnoId === alumno.id)[0];

      console.log ('Accediendo a ver cromos de ' + al);
      this.navCtrl.push (MisCromosActualesPage,{alumno:al,coleccion:this.coleccion,juego:juego });
    }

    //Función que permite redirigirte a la página de cromos disponibles de un equipo
    irCromosActualesEquipo(equipo:any,juego: any){
      console.log ('Accediendo a Asignación de Puntos');
      let eq = this.inscripcionesEquiposJuegoColeccion.filter(res => res.equipoId === equipo.id)[0];
      this.navCtrl.push (MisCromosActualesPage,{equipo:eq ,coleccion:this.coleccion, juego:juego });
    }
}
