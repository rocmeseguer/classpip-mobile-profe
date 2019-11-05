import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Loading, LoadingController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';

//Importamos las CLASES necesarias
import {TablaAlumnoJuegoDePuntos} from '../../clases/TablaAlumnoJuegoDePuntos';
import {TablaEquipoJuegoDePuntos} from '../../clases/TablaEquipoJuegoDePuntos';
import {AlumnoJuegoDePuntos} from '../../clases/AlumnoJuegoDePuntos';
import {HistorialPuntosAlumno} from '../../clases/HistorialPuntosAlumno';
import {EquipoJuegoDePuntos} from '../../clases/EquipoJuegoDePuntos';
import {HistorialPuntosEquipo} from '../../clases/HistorialPuntosEquipo';
import { SesionProvider } from '../../providers/sesion/sesion';
import { CalculosProvider } from '../../providers/calculos/calculos';


@IonicPage()
@Component({
  selector: 'page-asignar-puntos',
  templateUrl: 'asignar-puntos.html',
})
export class AsignarPuntosPage {

  // Juego De Puntos seleccionado
  juegoSeleccionado: any;

  // Recupera la informacion del juego seleccionado además de los alumnos o los equipos, los puntos y los niveles del juego
  alumnosDelJuego: any[];
  equiposDelJuego: any[];
  nivelesDelJuego: any[];
  tiposPuntosDelJuego: any[];
  alumno : AlumnoJuegoDePuntos;
  alumnosEquipo: any[];
  studentsSelectedArray: Array<any> = new Array<any>();
  vectorCorrectos: any[]=[];

  //PARAMETROS REFERENTES A LOS PUNTOS
  valorPunto: number = 1;
  fechaAsignacionPunto: Date;
  fechaString: string;
  puntoSeleccionadoId: number;


  //Booleano que indicará si se ha seleccionado algun checkbox o no
  haySeleccionado : boolean = false;

  // Recoge la inscripción de un alumno/equipo en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: any[];
  listaEquiposOrdenadaPorPuntos: any[];

  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: any[] = [];
  rankingJuegoDePuntosTotal: any[] = [];
  rankingEquiposJuegoDePuntos: any[] = [];
  rankingEquiposJuegoDePuntosTotal: any[] = [];

  // Se genera el parámetro Loading
  public loading: Loading;

  // URLs que utilizaremos
  private APIRURLJuegoDePuntos = 'http://localhost:3000/api/JuegosDePuntos';
  private APIURLAlumnoJuegoDePuntos = 'http://localhost:3000/api/AlumnoJuegosDePuntos';
  private APIURLEquiposJuegoDePuntos = 'http://localhost:3000/api/EquiposJuegosDePuntos';
  private APIURLHistorialPuntosAlumno = 'http://localhost:3000/api/HistorialesPuntosAlumno';
  private APIURLHistorialPuntosEquipo = 'http://localhost:3000/api/HistorialesPuntosEquipo';


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, public alertCtrl: AlertController,
              private sesion: SesionProvider,
              private calculos: CalculosProvider,
              public loadingCtrl: LoadingController) {
    this.juegoSeleccionado=navParams.get('juego');
  }

  //Función que activará el componente Loading y mostrará el mensaje que se haya introducido
  //como input.
  async showLoading(message: string) {

    this.loading = await this.loadingCtrl.create({
      content: message,
    });
    await this.loading.present();
  }

  //Se realizarán las siguiente tareas dependiendo del modo de Juego Seleccionado.
  ionViewDidLoad() {
    console.log('ionViewDidLoad AsignarPuntosPage');

    const datos = this.sesion.DameDatosParaAsignarPuntos();
    console.log ('Datos ' + datos);
    this.tiposPuntosDelJuego = datos.tiposPuntosDelJuego;
    this.nivelesDelJuego = datos.nivelesDelJuego;
    this.alumnosDelJuego = datos.alumnosDelJuego;
    this.listaAlumnosOrdenadaPorPuntos = datos.listaAlumnosOrdenadaPorPuntos;
    this.rankingJuegoDePuntos = datos.rankingJuegoDePuntos;
    this.equiposDelJuego = datos.equiposDelJuego;

    this.listaEquiposOrdenadaPorPuntos = datos.listaEquiposOrdenadaPorPuntos;
    console.log ('lista ' + this.listaEquiposOrdenadaPorPuntos);

    // Por alguna razon tengo que recoger esto aparte, porque no lo devuelve
    // bien cuando le pido todos los datos.
    this.rankingEquiposJuegoDePuntos = this.sesion.DameRankingEquipos();


    // Ordena la lista de niveles por si el profesor no los creó de forma ascendente
     // tslint:disable-next-line:only-arrow-functions
    this.nivelesDelJuego = this.nivelesDelJuego.sort(function(obj1, obj2) {
      return obj1.PuntosAlcanzar - obj2.PuntosAlcanzar;
    });
  }

  //Se ejecutará cuando se haga click a validar asignación de puntos
  validar(){

  //Inicialmente indicamos que no hay ningún alumno/equipo seleccionado
  this.haySeleccionado = false;

    if (this.studentsSelectedArray.length >= 1) {
      for (let i = 0; i < this.studentsSelectedArray.length; i++) {
        if (this.studentsSelectedArray[i].selected) {
            //En el caso de que el vector de estudiantes seleccionados sea mayor que 0,
            //entonces el booleano haySeleccionado será true e indicará que almenos se ha
            //seleccionado un checkbox de un alumno.
            this.haySeleccionado = true;
            this.vectorCorrectos[i]=this.studentsSelectedArray[i];
        }
      }
    }
    this.AsignarPuntos();

      // //En el caso de que no se haya seleccionado un alumno/equipo (haySeleccionado!==true)
      // if (this.haySeleccionado!==true)
      // {
      //   //Mostrará el mensaje de loading hasta que se generá la alerta showAlert1,
      //   //que indica que no se ha seleccionado ningún alumno/equipo.
      //   this.showLoading('Espere mientras se asignan los puntos.');
      //   setTimeout(() => {
      //     this.loading.dismiss();
      //     this.showAlert1();
      //   },1500);

      // }
      // //En el caso de que se haya seleccionado un alumno/equipo (haySeleccionado===true)
      // else{
      //   //Mostrará el mensaje de loading y se asignará el correspondiente punto al
      //   //correspondiente alumno.
      //   this.showLoading('Espere mientras se asignan los puntos.');
      //   this.AsignarPuntos();
      // }
  }

  //Función que permitirá Asignar puntos Manualmente
  AsignarPuntos() {

    //Se discrimina entre modo de Juego y se utiliza la función AsignarPuntosAlumno para Individual
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('El juego seleccionado es individual');
      this.AsignarPuntosAlumnos();
      console.log("Revisa los puntos para verificar");

    }
    //Se discrimina entre modo de Juego y se utiliza la función AsignarPuntosEquipo para Colectivo
    else {
      console.log('El juego seleccionado es colectivo');
      this.AsignarPuntosEquipos();
    }

    //Se resetea el vectorCorrectos para que así en la próxima asignación de puntos,
    //no aparezcan los alumnos asignados anteriormente.
    this.vectorCorrectos = [];

  }
  //Función que añade los puntos seleccionados en el alumno seleccionado
  AsignarPuntosAlumnos() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos [i]) {
        this.calculos.AsignarPuntosAlumno ( this.listaAlumnosOrdenadaPorPuntos[i],
          this.nivelesDelJuego, this.valorPunto,
          this.puntoSeleccionadoId);

        this.rankingJuegoDePuntos[i].puntos = this.rankingJuegoDePuntos[i].puntos + this.valorPunto;
        if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
          this.rankingJuegoDePuntos[i].nivel = nivel.Nombre;
        }

      }
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for (let i = 0; i < this.rankingJuegoDePuntos.length; i++) {
      this.rankingJuegoDePuntos[i].posicion = i + 1;
    }

  }

  //Función que añade los puntos seleccionados en el equipo seleccionado
  AsignarPuntosEquipos() {

    for (let i = 0; i < this.vectorCorrectos.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.vectorCorrectos[i]) {
        this.calculos.AsignarPuntosEquipo (
          this.listaEquiposOrdenadaPorPuntos[i],
          this.nivelesDelJuego,
          this.valorPunto,
          this.puntoSeleccionadoId);

        this.rankingEquiposJuegoDePuntos[i].puntos = this.rankingEquiposJuegoDePuntos[i].puntos + this.valorPunto;
        if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
          this.rankingEquiposJuegoDePuntos[i].nivel = nivel.Nombre;
        }
      }
    }
    // tslint:disable-next-line:only-arrow-functions
    this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
    });
    // tslint:disable-next-line:only-arrow-functions
    this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
      return obj2.puntos - obj1.puntos;
    });
    for ( let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i++) {
      this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
    }

  }

  // // Recoge la lista de Alumnos y la ordena por puntos de mayor a menor
  // OrdenarListaPorPuntos() {
  //   console.log('Entro a ordenar lista de Alumnos');
  //   this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
  //   return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;});
  //   return this.listaAlumnosOrdenadaPorPuntos;
  // }

  // // Recoge la lista de Equipos y la ordena por puntos de mayor a menor
  // OrdenarListaEquiposPorPuntos() {
  //   console.log('Entro a ordenar lista de Equipos');
  //   this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
  //   return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;});
  //   return this.listaEquiposOrdenadaPorPuntos;
  // }

  // // Ordena la clasificación de alumnos por puntos de mayor a menor
  // OrdenarRankingPorPuntos() {

  // console.log('Entro a ordenar la clasificación de Alumnos');

  // this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.sort(function(obj1, obj2)
  // {return obj2.puntos - obj1.puntos;});

  // for (let i = 0; i < this.rankingJuegoDePuntos.length; i ++)
  // {this.rankingJuegoDePuntos[i].posicion = i + 1;}

  // this.rankingJuegoDePuntos = this.rankingJuegoDePuntos.filter(res => res.nombre !== '');
  // return this.rankingJuegoDePuntos;
  // }

  // // Ordena la clasificación de equipos por puntos de mayor a menor
  // OrdenarRankingEquiposPorPuntos() {
  //   console.log('Entro a ordenar la clasificación de Equipos');

  //   this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2)
  //   {return obj2.puntos - obj1.puntos;});

  //   for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i ++)
  //   {this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;}

  //   this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.filter(res => res.nombre !== '');
  //   return this.rankingEquiposJuegoDePuntos;
  // }

  // //Funcione que sube el Historial de puntos de un Alumno a la API
  // POST_HistorialAlumno(valorPunto: number, puntoId: number, alumnoJuegoDePuntos: number, fechaAsignacionPunto: string ) {
  //   console.log(fechaAsignacionPunto);
  //   this.http.post<HistorialPuntosAlumno>(this. APIURLHistorialPuntosAlumno, new HistorialPuntosAlumno (valorPunto, puntoId, alumnoJuegoDePuntos, fechaAsignacionPunto))
  //   .subscribe(res => console.log(res));
  // }

  // //Funcione que sube el Historial de puntos de un Equipo a la API
  // POST_HistorialEquipo(valorPunto: number, puntoId: number, equipoJuegoDePuntos: number, fechaAsignacionPunto: string) {
  //   this.http.post<HistorialPuntosEquipo>(this. APIURLHistorialPuntosEquipo, new HistorialPuntosEquipo (valorPunto, puntoId, equipoJuegoDePuntos, fechaAsignacionPunto))
  //   .subscribe(res => console.log(res));
  // }

  //Función que asigna el array de alumnos/equipos seleccionados (stuArray) en la
  //variable studentsSelectedArray utilizada para asignar puntos
  getSelectedStudents(stuArray: Array<any>){
    this.studentsSelectedArray = stuArray;
  }

  // // // Recupera los puntos que se pueden asignar en el juego
  // // PuntosDelJuego() {
  // //   this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/puntos')
  // //   .subscribe(puntos => {
  // //     this.tiposPuntosDelJuego = puntos;
  // //   });
  // // }

  // // // Recupera los alumnos que pertenecen al juego
  // // AlumnosDelJuego() {
  // //   this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/alumnos')
  // //   .subscribe(alumnosJuego => {
  // //     console.log(alumnosJuego);
  // //     this.alumnosDelJuego = alumnosJuego;
  // //     this.RecuperarInscripcionesAlumnoJuego();
  // //   });
  // // }

  // // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  // RecuperarInscripcionesAlumnoJuego() {
  //     this.http.get<any[]>(this.APIURLAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
  //     .subscribe(inscripciones => {
  //       this.listaAlumnosOrdenadaPorPuntos = inscripciones;
  //       this.OrdenarPorPuntos();
  //       this.TablaClasificacionTotal();
  //     });
  // }

  // // Recoge la lista y la ordena por puntos de mayor a menor
  // OrdenarPorPuntos() {

  //   this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2)
  //   {return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;});

  //   return this.listaAlumnosOrdenadaPorPuntos;
  // }

  // // En función del modo, recorremos la lista de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
  // TablaClasificacionTotal() {

  //   if (this.juegoSeleccionado.Modo === 'Individual') {

  //     for (let i = 0; i < this.listaAlumnosOrdenadaPorPuntos.length; i++) {
  //       let alumno: any;
  //       let nivel: any;

  //       alumno = this.BuscarAlumno(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);

  //       if (this.listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
  //         console.log(this.listaAlumnosOrdenadaPorPuntos[i].alumnoId);
  //       }

  //       if (nivel !== undefined) {
  //         this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
  //           this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

  //         this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
  //           alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);
  //       } else {
  //         this.rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
  //           this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);

  //         this.rankingJuegoDePuntosTotal[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido,
  //           alumno.SegundoApellido, this.listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
  //       }
  //     }


  //   } else {
  //     for (let i = 0; i < this.listaEquiposOrdenadaPorPuntos.length; i++) {
  //       let equipo: any;
  //       let nivel: any;

  //       equipo = this.BuscarEquipo(this.listaEquiposOrdenadaPorPuntos[i].equipoId);

  //       if (this.listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
  //         console.log(this.listaEquiposOrdenadaPorPuntos[i].equipoId);
  //       }

  //       if (nivel !== undefined) {
  //         this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
  //           this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

  //         this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
  //           this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
  //       } else {
  //         this.rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
  //           this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

  //         this.rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
  //           this.listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
  //       }
  //     }

  //   }
  // }

  // //Función que permite buscar el alumno y su información a partir de el id que tiene asignado
  // //ese alumno en el juego.
  // //***(NO TIENE PORQUE COINCIDIR EL ID DEL ALUMNO CON EL ID DEL ALUMNO EN EL JUEGO)***
  // BuscarAlumno(alumnoId: number): any {

  //   let alumno: any;
  //   alumno = this.alumnosDelJuego.filter(res => res.id === alumnoId)[0];
  //   return alumno;
  // }

  // //Función que permite buscar el equipo y su información a partir de el id que tiene asignado
  // //ese equipo en el juego.
  // //***(NO TIENE PORQUE COINCIDIR EL ID DEL EQUIPO CON EL ID DEL EQUIPO EN EL JUEGO)***
  // BuscarEquipo(equipoId: number): any {

  //   let equipo: any;
  //   equipo = this.equiposDelJuego.filter(res => res.id === equipoId)[0];
  //   return equipo;
  // }

  // // Recupera los equipos que pertenecen al juego
  // EquiposDelJuego() {
  //   this.http.get<any[]>(this.APIRURLJuegoDePuntos + '/' + this.juegoSeleccionado.id + '/equipos')
  //   .subscribe(equiposJuego => {
  //     this.equiposDelJuego = equiposJuego;
  //     this.RecuperarInscripcionesEquiposJuego();
  //   });
  // }

  //  // Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
  // RecuperarInscripcionesEquiposJuego() {

  //   this.http.get<any[]>(this.APIURLEquiposJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + this.juegoSeleccionado.id)
  //   .subscribe(inscripciones => {
  //     this.listaEquiposOrdenadaPorPuntos = inscripciones;
  //     console.log(this.listaEquiposOrdenadaPorPuntos);
  //     this.OrdenarPorPuntosEquipos();
  //     this.TablaClasificacionTotal();
  //   });
  // }

  // //Se ordena la lista de Equipos por puntos de mayor a menor
  // OrdenarPorPuntosEquipos() {

  //   this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2)
  //   {return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;});
  //   return this.listaEquiposOrdenadaPorPuntos;
  // }

  //Dialogo de confirmación que se generará al hacer click en Validar (Asignación Manual)
  //y que dará la opción de cancelar la asignación en caso de haberse equivocado o no
  //estar seguros
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Manual',
      message: '¿Ha asignado correctamente ? En caso afirmativo, haga click en ACEPTAR de lo contrario, haga click en CANCELAR ',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');
            this.validar();
          }
        }
      ]
    });
    confirm.present();
  }

  // //Alerta que se generará al haber finalizado la asignación de los puntos correspondientes
  // showAlert() {
  //   const alert = this.alertCtrl.create({
  //     title: 'Asignación efectuada',
  //     subTitle: 'Para comprobar la asignación, retroceda a la página anterior.',
  //     buttons: ['Cerrar']
  //   });
  //   alert.present();
  // }

  // //Alerta que se generará al detectar un error en la asignación de los puntos
  // showAlert1() {
  //   const alert = this.alertCtrl.create({
  //     title: 'Asignación Abortada',
  //     subTitle: 'Compruebe que ha seleccionado el alumno/equipo deseado.',
  //     buttons: ['Cerrar']
  //   });
  //   alert.present();
  // }
}
