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
import swal from 'sweetalert';

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
  selectedArray: Array<any> = new Array<any>();
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

  public todos: boolean = false;
  alumnoElegido: any;
  equipoElegido: any;
  puntoAleatorioId: any;


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
    this.puntoAleatorioId = datos.tiposPuntosDelJuego.filter (p => p.Nombre === 'Aleatorio')[0].id;

    this.tiposPuntosDelJuego = datos.tiposPuntosDelJuego.filter (p => p.Nombre !== 'Aleatorio');
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

  //Función que permitirá Asignar puntos Manualmente
  AsignacionSeleccionados() {

    this.alumnoElegido = undefined;
    this.equipoElegido = undefined;
    //Se discrimina entre modo de Juego y se utiliza la función AsignarPuntosAlumno para Individual
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('El juego seleccionado es individual');
      this.AsignarAlumnosSeleccionados();
      console.log("Revisa los puntos para verificar");

    }
    //Se discrimina entre modo de Juego y se utiliza la función AsignarPuntosEquipo para Colectivo
    else {
      console.log('El juego seleccionado es colectivo');
      this.AsignarEquiposSeleccionados();
    }

    //Se resetea el vectorCorrectos para que así en la próxima asignación de puntos,
    //no aparezcan los alumnos asignados anteriormente.
    this.LimpiarSeleccion();

  }
  //Función que añade los puntos seleccionados en el alumno seleccionado
  AsignarAlumnosSeleccionados() {

    for (let i = 0; i < this.selectedArray.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.selectedArray [i].selected) {
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
  AsignarEquiposSeleccionados() {

    for (let i = 0; i < this.selectedArray.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.selectedArray[i].selected) {
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

  AsignacionAleatoria() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log ('Entramos');
      const numeroAlumnos = this.alumnosDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroAlumnos);
      this.alumnoElegido = this.rankingJuegoDePuntos[elegido];

      this.calculos.AsignarPuntosAlumno ( this.listaAlumnosOrdenadaPorPuntos[elegido],
                                            this.nivelesDelJuego, this.valorPunto,
                                            this.puntoAleatorioId);
      this.rankingJuegoDePuntos[elegido].puntos = this.rankingJuegoDePuntos[elegido].puntos + this.valorPunto;
      if (this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaAlumnosOrdenadaPorPuntos[elegido].nivelId)[0];
          this.rankingJuegoDePuntos[elegido].nivel = nivel.Nombre;
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
      // this.dataSource = new MatTableDataSource (this.rankingJuegoDePuntos);
      // this.selection.clear();
      swal(this.alumnoElegido.nombre + ' ' + this.alumnoElegido.primerApellido, 'Enhorabuena', 'success');
    } else {
      const numeroEquipos = this.equiposDelJuego.length;
      const elegido = Math.floor(Math.random() * numeroEquipos);
      this.equipoElegido = this.rankingEquiposJuegoDePuntos[elegido];

      this.calculos.AsignarPuntosEquipo ( this.listaEquiposOrdenadaPorPuntos[elegido],
                                            this.nivelesDelJuego, this.valorPunto,
                                            this.puntoAleatorioId);
      this.rankingEquiposJuegoDePuntos[elegido].puntos = this.rankingEquiposJuegoDePuntos[elegido].puntos + this.valorPunto;
      if (this.listaEquiposOrdenadaPorPuntos[elegido].nivelId !== undefined) {
          const nivel = this.nivelesDelJuego.filter (n => n.id === this.listaEquiposOrdenadaPorPuntos[elegido].nivelId)[0];
          this.rankingEquiposJuegoDePuntos[elegido].nivel = nivel.Nombre;
      }

      // tslint:disable-next-line:only-arrow-functions
      this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
      });
      // tslint:disable-next-line:only-arrow-functions
      this.rankingEquiposJuegoDePuntos = this.rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
        return obj2.puntos - obj1.puntos;
      });
      for (let i = 0; i < this.rankingEquiposJuegoDePuntos.length; i++) {
        this.rankingEquiposJuegoDePuntos[i].posicion = i + 1;
      }
      // this.dataSource = new MatTableDataSource (this.rankingEquiposJuegoDePunto);
      // this.selection.clear();
      swal(this.equipoElegido.nombre + ' Enhorabuena', 'success');

    }
  }
  TomaElegibles(elegibles: Array<any>){
    this.selectedArray = elegibles;
  }

  CambarSeleccion(elegibles: Array<any>) {
    console.log ('Los paso a todos a ' + this.todos);
    console.log ('Numero elegibles ' + elegibles.length);
    for (let i = 0; i < elegibles.length; i++) {
      elegibles[i].selected = this.todos;
    }
    this.TomaElegibles (elegibles);
    console.log ('A ver: ' + this.NumeroSeleccionados());
  }

  LimpiarSeleccion() {
    for (let i = 0; i < this.selectedArray.length; i++) {
      this.selectedArray[i].selected = false;
    }
  }

  PedirConfirmacionAsignacionAlumnosSeleccionados () {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Manual',
      message: 'Confirma que quieres asignar los puntos a los alumnos seleccionados',
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
            this.AsignacionSeleccionados();
          }
        }
      ]
    });
    confirm.present();
  }


  PedirConfirmacionAsignacionAlumnoAleatorio() {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Aleatoria',
      message: 'Confirma que quieres asignar los puntos a un alumno elegido aleatoriamente',
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
            this.AsignacionAleatoria();
          }
        }
      ]
    });
    confirm.present();
  }


  PedirConfirmacionAsignacionEquiposSeleccionados () {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Manual',
      message: 'Confirma que quieres asignar los puntos a los equipos seleccionados',
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
            this.AsignacionSeleccionados();
          }
        }
      ]
    });
    confirm.present();
  }


  PedirConfirmacionAsignacionEquipoAleatorio() {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Aleatoria',
      message: 'Confirma que quieres asignar los puntos a un equipo elegido aleatoriamente',
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
            this.AsignacionAleatoria();
          }
        }
      ]
    });
    confirm.present();
  }



  NumeroSeleccionados () {
    let cont = 0;
    for (let i = 0; i < this.selectedArray.length; i++) {
      if (this.selectedArray[i].selected) {
        cont = cont+1;
      }
    }
    return cont;

  }

  // Retorna FALSO si todo está preparado para asignar puntos al alumno seleccionado
  // (se ha seleccionado el tipo de punto, el número de puntos y hay alumnos marcados)
  PreparadaAsignacionSeleccionados(){
    console.log ('Vamos a comprobar punto: ' + this.puntoSeleccionadoId);
    console.log ('Vamos a comprobar valor: ' + this.valorPunto);
    console.log ('Vamos a comprobar seleccionados: ' + this.NumeroSeleccionados());
    if ((this.puntoSeleccionadoId !== undefined ) && (this.valorPunto !== undefined) && (this.NumeroSeleccionados () >0)) {
      return false;
    } else {
      return true;
    }
  }

    // Retorna FALSO si todo está preparado para asignar puntos a un alumno
    // elegido aleatoriamente (se ha seleccionado el número de puntos)

  PreparadaAsignacionAleatoria() {
    if (this.valorPunto !== undefined) {
      return false;
    } else {
      return true;
    }

  }
}
