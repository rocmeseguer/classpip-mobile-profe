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
  puntosDelJuego: any[];
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

   // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
   rankingJuegoDePuntos: any[] = [];
   rankingJuegoDePuntosTotal: any[] = [];
   rankingEquiposJuegoDePuntos: any[] = [];
   rankingEquiposJuegoDePuntosTotal: any[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient) {
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

      this.PuntosDelJuego();
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

  // Recupera los alumnos que pertenecen al juego de Colecciones desde la API
  AlumnosDelJuegoColeccion() {
    this.http.get<Alumno[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.items = alumnosJuego;
      this.itemsAPI=alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
      this.ColeccionDelJuego();
    });
  }

  // Recupera los equipos que pertenecen al juego de Colecciones desde la API
  EquiposDelJuegoColeccion() {
    this.http.get<Equipo[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {
      this.items = equiposJuego;
      this.itemsAPI= equiposJuego;
      console.log(equiposJuego);
      this.RecuperarInscripcionesEquiposJuego();
      this.ColeccionDelJuego();
    });
  }

  // Recupera la colección de cromos que pertenece al juego de Colecciones desde la API
  ColeccionDelJuego() {
    this.http.get<Coleccion>(this.APIRURLColecciones + '/' + this.juegoSeleccionado.coleccionId)
    .subscribe(coleccion => {
      this.coleccion = coleccion;
      console.log('voy a enviar la coleccion');
    });
  }

   // Recupera los puntos que se pueden asignar en el juego de Puntos
   PuntosDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/puntos')
    .subscribe(puntos => {
      this.puntosDelJuego = puntos;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.puntosDelJuego.length; i ++) {
        this.listaSeleccionable.push(this.puntosDelJuego[i]);
      }
    });
  }

  // Recupera los niveles de los que dispone el juego de Puntos
  NivelesDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/nivels')
    .subscribe(niveles => {
      this.nivelesDelJuego = niveles;
      console.log(this.nivelesDelJuego);
    });
  }

  // Recupera los alumnos que pertenecen al juego de Puntos
  AlumnosDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {
      console.log(alumnosJuego);
      this.items = alumnosJuego;
      this.itemsAPI=alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  // Recupera los equipos que pertenecen al juego de Puntos
  EquiposDelJuego() {
    this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {
      this.items = equiposJuego;
      this.itemsAPI=equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesAlumnoJuego() {
    this.http.get<any[]>(this.APIURLAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      this.OrdenarPorPuntos();
      this.TablaClasificacionTotal();
    });
  }

  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  RecuperarInscripcionesEquiposJuego() {

    this.http.get<any[]>(this.APIURLEquiposJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaEquiposOrdenadaPorPuntos = inscripciones;
      console.log(this.listaEquiposOrdenadaPorPuntos);
      this.OrdenarPorPuntosEquipos();
      this.TablaClasificacionTotal();
    });
  }

  // Recoge la lista de alumnos y la ordena por puntos de mayor a menor
  OrdenarPorPuntos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.listaAlumnosOrdenadaPorPuntos;
  }

  // Recoge la lista de equipos y la ordena por puntos de mayor a menor
  OrdenarPorPuntosEquipos() {

    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    return this.listaEquiposOrdenadaPorPuntos;
  }

  //Función que permite buscar el alumno y su información a partir de el id que tiene asignado
  //ese alumno en el juego.
  //***(NO TIENE PORQUE COINCIDIR EL ID DEL ALUMNO CON EL ID DEL ALUMNO EN EL JUEGO)***
  BuscarAlumno(alumnoId: number): any {

    let alumno: any;
    alumno = this.items.filter(res => res.id === alumnoId)[0];
    return alumno;
  }

   //Función que permite buscar el equipo y su información a partir de el id que tiene asignado
  //ese equipo en el juego.
  //***(NO TIENE PORQUE COINCIDIR EL ID DEL EQUIPO CON EL ID DEL EQUIPO EN EL JUEGO)***
  BuscarEquipo(equipoId: number): any {

    let equipo: any;
    // tslint:disable-next-line:no-unused-expression
    equipo = this.items.filter(res => res.id === equipoId)[0];
    return equipo;
  }

  //Mediante el identificador del nivel introducido como parámetro, se obtiene el nivel entero
  BuscarNivel(nivelId: number): any {

    let nivel: any;
    console.log(this.nivelesDelJuego.filter(res => res.id === nivelId)[0]);

    nivel = this.nivelesDelJuego.filter(res => res.id === nivelId)[0];

    return nivel;
  }

   // En función del modo, recorremos la lista de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
   TablaClasificacionTotal() {

    if (this.juegoSeleccionado.Modo === 'Individual') {

      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i++) {
        let alumno: any;
        let nivel: any;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          nivel = this.BuscarNivel(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
        }

        if (nivel !== undefined) {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);
        } else {
          this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
            this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);

          this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
            alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
        }
      }


    } else {
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i++) {
        let equipo: any;
        let nivel: any;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaEquiposOrdenadaPorPuntos[i].equipoId);
          nivel = this.BuscarNivel(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
        }

        if (nivel !== undefined) {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
        } else {
          this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

          this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
        }
      }

    }
  }

  //Ordena la tabla por puntos de mayor a menor. Se realiza distinción entre modo Individual o colectivo
  OrdenarTablaPorPuntos() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('Voy a orddenar la tabla');
      // tslint:disable-next-line:only-arrow-functions
      this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
        this.rankingJuegoDePuntos[i].posicion = i + 1;
      }
    } else {

      console.log('Voy a ordenar la tabla de equipos');

      this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i++) {
        this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
      }
    }

  }

  //Calcula las posiciones de los alumnos segun el tipo de punto seleccionado
  ClasificacionPorTipoDePunto() {
    if (this.juegoSeleccionado.Modo === 'Individual') {

      for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i ++) {

        let alumno: any;
        let nivel: any;

        alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          nivel = this.BuscarNivel(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
          console.log(this.listaAlumnosOrdenadaPorPuntos[i].nivelId);
        }

        this.http.get<any[]>(this.APIURLHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
        + this.listaAlumnosOrdenadaPorPuntos[i].id + '&filter[where][puntoId]=' + this.puntoSeleccionadoId)
        .subscribe(historial => {
          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }

          if (nivel !== undefined) {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos, nivel.Nombre);
          } else {
            // tslint:disable-next-line:max-line-length
            this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos);
          }

          if (i === this.listaAlumnosOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    } else {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i ++) {

        let equipo: any;
        let nivel: any;

        equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {

          nivel = this.BuscarNivel(this.listaEquiposOrdenadaPorPuntos[i].nivelId);
        }

        this.http.get<any[]>(this.APIURLHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
        + this.listaEquiposOrdenadaPorPuntos[i].id + '&filter[where][puntoId]=' + this.puntoSeleccionadoId)
        .subscribe(historial => {

          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }


          if (nivel !== undefined) {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos, nivel.Nombre);
          } else {
            this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos);
          }

          if (i === this.listaEquiposOrdenadaPorPuntos.length - 1 ) {
            this.OrdenarTablaPorPuntos();
          }
        });
      }
    }


  }

  //Función que permite mostrar los puntos totales o en caso de seleccionar un punto, te muestra
  //la tabla segun el tipo de punto seleccionado
  MostrarRankingSeleccionado() {

    // Si es indefinido muestro la tabla del total de puntos
    if (this.puntosDelJuego.filter(res => res.id === Number(this.puntoSeleccionadoId))[0] === undefined) {

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
    console.log ('Accediendo a Información de Juego de Colecciones');
    this.ColeccionDelJuego();
    this.navCtrl.push (MisCromosPage,{coleccion:this.coleccion});
    }
}

//Función que permite redirigirte a la página de asignación de puntos
AsignarPuntos(juego: any) {
  console.log ('Accediendo a Asignación de Puntos');
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
      console.log ('Accediendo a Asignación de Puntos');
      this.navCtrl.push (MisCromosActualesPage,{alumno:alumno,coleccion:this.coleccion,juego:juego });
    }

    //Función que permite redirigirte a la página de cromos disponibles de un equipo
    irCromosActualesEquipo(equipo:any,juego: any){
      console.log ('Accediendo a Asignación de Puntos');
      this.navCtrl.push (MisCromosActualesPage,{equipo:equipo,coleccion:this.coleccion, juego:juego });
    }
}
