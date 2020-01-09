import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Http, ResponseContentType} from '@angular/http';

//Importamos las CLASES necesarias
import {Juego} from '../../clases/Juego';
import {Alumno} from '../../clases/Alumno';
import {Equipo} from '../../clases/Equipo';
import {Coleccion} from '../../clases/Coleccion';
import {Cromo} from '../../clases/Cromo';
import {AlumnoJuegoDeColeccion} from '../../clases/AlumnoJuegoDeColeccion';
import {EquipoJuegoDeColeccion} from '../../clases/EquipoJuegoDeColeccion';
import {Album} from '../../clases/Album';
import {AlbumEquipo} from '../../clases/AlbumEquipo';

import {PeticionesApiProvider} from  '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider} from '../../providers/calculos/calculos';
import swal from 'sweetalert';

@IonicPage()
@Component({
  selector: 'page-asignar-cromos',
  templateUrl: 'asignar-cromos.html',
})

export class AsignarCromosPage {


  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  juegoSeleccionado: Juego;
  Tipo: string;

  // PARAMETROS REFERENTES A LOS CROMOS
  imagenCromo: string;
  public cromo:any;
  coleccion: Coleccion;
  cromosColeccion: Cromo[];
  cromoSeleccionado: any;
  cromoSeleccionadoId: number;
  // Para asignar cromos random
  probabilidadCromos: number[] = [];
  indexCromo: number;
  numeroCromosRandom: number = 1;

  inscripciones: any[]; // inscripciones de los participantes
  participantes: any[]; // Los participantes pueden ser alumnos o equipos


  // PARAMETROS REFERENTES A LOS ALUMNOS Y EQUIPOS
  // inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  // inscripcionesEquipos: EquipoJuegoDeColeccion[];
  // studentsSelectedArray: Array<any> = new Array<any>();
  // items: any[];
  // itemsAPI: any[];
  // vectorCorrectos: any[]=[];

  //Booleano que indicará si se ha seleccionado algun checkbox o no
  haySeleccionado : boolean = false;


  // Se genera el parámetro Loading
  public loading: Loading;

  todos: boolean = false;
 // selectedArray: Array<any>= new Array<any>();
  alumnoElegido: any;
  equipoElegido: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, private https: Http, private peticionesApi: PeticionesApiProvider,
              private calculos: CalculosProvider,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    this.juegoSeleccionado=navParams.get('juego');
    this.Tipo = "Manual";

  }

  //Función que activará el componente Loading y mostrará el mensaje que se haya introducido
  //como input.
  async showLoading(message: string) {

    this.loading = await this.loadingCtrl.create({
      content: message,
    });
    await this.loading.present();
  }


  ionViewDidLoad() {
    console.log('Bienvenido a la página de Asignación de Cromos');
    // Obtiene los participantes (alumnos o equipos), sus inscripciones y los cromos
    // de la colección
    this.RecuperaInformacionJuego ();
  }


  // Recupera las inscripciones de los alumnos en el juego de colección seleccionado
  RecuperaInformacionJuego() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      // recupero las inscripciones de alumnos
      this.peticionesApi.DameInscripcionesAlumnoJuegoDeColeccion (this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.inscripciones = inscripciones;
      });
      // Recupero los alumnos
      this.peticionesApi.DameAlumnosJuegoDeColeccion (this.juegoSeleccionado.id)
      .subscribe(alumnos => {
        this.participantes = alumnos;
        //this.items = alumnosJuego;
      });
    } else {
      // Recupero inscripciones de equipos
      this.peticionesApi.DameInscripcionesEquipoJuegoDeColeccion (this.juegoSeleccionado.id)
        .subscribe(inscripciones => {
          this.inscripciones = inscripciones;
        });
      // recupero los equipos
      this.peticionesApi.DameEquiposJuegoDeColeccion (this.juegoSeleccionado.id)
      //this.http.get<any[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/equipos')
      .subscribe(equipos => {
        this.participantes = equipos;
        //this.items= equiposJuego;
      });
    }
    //Recupero los cromos
    this.CromosColeccion();

  }



  CromosColeccion() {
    console.log ('Voy a por los cromos');
    // Busca los cromos de la coleccion en la base de datos
    this.peticionesApi.DameCromosColeccion (this.juegoSeleccionado.coleccionId)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        // Preparo el primer cromo para la lista de seleccion de cromo
        this.cromoSeleccionadoId=this.cromosColeccion[0].id;
        this.cromoSeleccionado=this.cromosColeccion[0];
        this.GET_ImagenCromo();
        // Preparo las probabilidades
        for (let i = 0; i < this.cromosColeccion.length; i ++) {
          if (this.cromosColeccion[i].Probabilidad === 'Muy Baja') {
            this.probabilidadCromos[i] = 3;

          } else if (this.cromosColeccion[i].Probabilidad === 'Baja') {

            this.probabilidadCromos[i] = 7;

          } else if (this.cromosColeccion[i].Probabilidad === 'Media') {

            this.probabilidadCromos[i] = 20;

          } else if (this.cromosColeccion[i].Probabilidad === 'Alta') {

            this.probabilidadCromos[i] = 30;
          } else {
            this.probabilidadCromos[i] = 40;
          }
        }
        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.cromosColeccion = undefined;
      }
    });
  }


    // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  GET_ImagenCromo() {
      if (this.cromoSeleccionado.Imagen !== undefined ) {
        console.log ('Voy a por la imagen');
        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.peticionesApi.DameImagenCromo (this.cromoSeleccionado.Imagen)
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            console.log ('Ya la tengo');
            this.imagenCromo = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
      });
      }
  }



  //Cada vez que se seleccione otro como el seleccionador de cromos, la función se ejecutará
  //y mostrará el cromo al lado del nombre del cromo seleccionado.
  ionChange(){
    this.cromoSeleccionado = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];
    this.GET_ImagenCromo();
  }


  PedirConfirmacionAsignacionAlumnosSeleccionados() {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Manual',
      message: 'Confirma que quieres asignar el cromo a los alumnos seleccionados ',
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
            console.log('Agree clickeeee');
            this.AsignarCromos();
          }
        }
      ]
    });
    confirm.present();
}

PedirConfirmacionAsignacionEquiposSeleccionados() {
  const confirm = this.alertCtrl.create({
    title: 'Asignación Manual',
    message: 'Confirma que quieres asignar el cromo a los equipos seleccionados ',
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
          console.log('Agree clickeeee');
          this.AsignarCromos();
        }
      }
    ]
  });
  confirm.present();
}


  //Función que permitirá Asignar cromos Manualmente pasandole el identificador del cromo como parámetro
  //de entrada
  AsignarCromos() {
    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromoAlumno para Individual
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('El juego seleccionado es individual');
      this.AsignarCromoAlumnos(this.cromoSeleccionadoId);
      console.log("Revisa los cromos para verificar");

    }
    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromoEquipo para Colectivo
    else {
      console.log('El juego selecionado es por equipo');
      this.AsignarCromoEquipos(this.cromoSeleccionadoId);
      console.log("Revisa los cromos para verificar");
    }

    this.LimpiarSeleccion();

  }

  //Función que añade los cromos seleccionados en el alumno seleccionado
  AsignarCromoAlumnos(cromoSeleccionado) {

    //Muestra en consola el cromoSeleccionado desde el seleccionador
    console.log('cromo' + cromoSeleccionado);

    for (let i = 0; i < this.participantes.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.participantes [i].selected) {

        let alumno: Alumno;
        alumno = this.participantes[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;

        alumnoJuegoDeColeccion = this.inscripciones.filter(res => res.alumnoId === alumno.id)[0];
        console.log(alumnoJuegoDeColeccion);
        this.peticionesApi.AsignarCromoAlumno (new Album (alumnoJuegoDeColeccion.id, cromoSeleccionado))
        .subscribe(res => {
            console.log(res);
          });
       }
    }
  }

  //Función que añade los cromos seleccionados en el equipo seleccionado
  AsignarCromoEquipos(cromoSeleccionado) {

    console.log(cromoSeleccionado);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.participantes.length; i++) {

       // Buscamos los equipos que hemos seleccionado
       if (this.participantes [i].selected) {

        let equipo: Equipo;
        equipo = this.participantes[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;

        equipoJuegoDeColeccion = this.inscripciones.filter(res => res.equipoId === equipo.id)[0];
        console.log(equipoJuegoDeColeccion);

        //Se realiza un post en la API, para añadir ese cromo en el Album de
        //cromos del Equipo Seleccionado.
        this.peticionesApi.AsignarCromoEquipo (new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
       // this.http.post<Album>(this.APIRURLAlbumEquipo, new AlbumEquipo (equipoJuegoDeColeccion.id, cromoSeleccionado))
       .subscribe(res => {
        console.log(res);
        });
      }
    }
  }

  //Dialogo de confirmación que se generará al hacer click en Validar (Asignación Aleatoria) y
  //que dará la opción de cancelar la asignación en caso de haberse equivocado o no
  //estar seguros
  PedirConfirmacionAsignacionAleatoriaEquiposSeleccionados() {
    const confirm = this.alertCtrl.create({
      title: 'Asignación Aleatoria',
      message: 'Confirma que quieres asignar el paquete de cromos aleatorios a los equipos seleccionados',
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
            console.log('Agree clickedddd');
            this.AsignarCromosAleatorios();
          }
        }
      ]
    });
    confirm.present();
}

PedirConfirmacionAsignacionAleatoriaAlumnosSeleccionados() {
  const confirm = this.alertCtrl.create({
    title: 'Asignación Aleatoria',
    message: 'Confirma que quieres asignar el paquete de cromos aleatorios a los alumnos seleccionados',
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
          console.log('Agree clickedddd');
          this.AsignarCromosAleatorios();
        }
      }
    ]
  });
  confirm.present();
}



  //Función que permitirá Asignar cromos Aleatoriamente.
  AsignarCromosAleatorios() {

    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromosAleatoriosAlumno para Individual
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('El juego seleccionado es individual');
      this.AsignarCromosAleatoriosAlumno();
      console.log("Revisa los cromos para verificar");

    }
    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromosAleatoriosEquipo para Colectivo
    else {
      console.log('El juego seleccionado es por equipo');
      this.AsignarCromosAleatoriosEquipo();
      console.log("Revisa los cromos para verificar");
    }
    this.LimpiarSeleccion();
  }

  AsignarCromosAleatoriosAlumno() {
    for (let i = 0; i < this.participantes.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.participantes [i].selected) {
                this.calculos.AsignarCromosAleatoriosAlumno  (
                  this.participantes[i], this.inscripciones, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
              );
      }
    };
  }

  AsignarCromosAleatoriosEquipo() {

    for (let i = 0; i < this.participantes.length; i++) {


      // Buscamos los alumnos que hemos seleccionado
      if (this.participantes [i].selected) {
                // tslint:disable-next-line:max-line-length
                this.calculos.AsignarCromosAleatoriosEquipo (this.participantes[i], this.inscripciones, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
              );
      }
    };
}



PedirConfirmacionAsignacionAleatoriaAlumnoAleatorio() {
  const confirm = this.alertCtrl.create({
    title: 'Asignación Aleatoria',
    message: 'Confirma que quieres asignar el paquete de cromos aleatorios a un alumno elegido aleatoriamente',
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
          console.log('Agree clickedddd');
          this.AsignarAleatoriamenteCromosAleatorios();
        }
      }
    ]
  });
  confirm.present();
}

PedirConfirmacionAsignacionAleatoriaEquipoAleatorio() {
  const confirm = this.alertCtrl.create({
    title: 'Asignación Aleatoria',
    message: 'Confirma que quieres asignar el paquete de cromos aleatorios a un equipo elegido aleatoriamente',
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
          console.log('Agree clickedddd');
          this.AsignarAleatoriamenteCromosAleatorios();
        }
      }
    ]
  });
  confirm.present();
}



AsignarAleatoriamenteCromosAleatorios() {
  if (this.juegoSeleccionado.Modo === 'Individual') {
    console.log('el juego es individual');
    this.AsignarCromosAleatoriosAlumnoAleatorio();

  } else {
    console.log('El juego es en equipo');
    this.AsignarCromosAleatoriosEquipoAleatorio();
  }
}


AsignarCromosAleatoriosAlumnoAleatorio() {
  const numeroAlumnos = this.inscripciones.length;
  const elegido = Math.floor(Math.random() * numeroAlumnos);
  this.alumnoElegido = this.participantes[elegido];
  this.calculos.AsignarCromosAleatoriosAlumno (
          this.alumnoElegido, this.inscripciones, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
  );
  swal (this.alumnoElegido.Nombre + ' Enhorabuena', 'success');
}

AsignarCromosAleatoriosEquipoAleatorio() {
  const numeroEquipos = this.inscripciones.length;
  const elegido = Math.floor(Math.random() * numeroEquipos);
  this.equipoElegido = this.participantes[elegido];
  this.calculos.AsignarCromosAleatoriosEquipo (
          this.equipoElegido, this.inscripciones, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
  );
  swal (this.equipoElegido.Nombre + ' Enhorabuena', 'success');
}




  //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengan las caracteristicas definidas en el filtro
  Filtrar(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() !== '') {
        this.participantes = this.participantes.filter(function(participante) {
          return (participante.Nombre.toLowerCase().includes(val.toLowerCase())||
          participante.PrimerApellido.toLowerCase().includes(val.toLowerCase())||
          participante.SegundoApellido.toLowerCase().includes(val.toLowerCase()));
        });
    }
  }

  CambarSeleccion() {
    for (let i = 0; i < this.participantes.length; i++) {
      this.participantes[i].selected = this.todos;
    }

  }

  LimpiarSeleccion() {
    for (let i = 0; i < this.participantes.length; i++) {
      this.participantes[i].selected = false;
    }
  }

  NumeroSeleccionados () {
    let cont = 0;
    for (let i = 0; i < this.participantes.length; i++) {
      if (this.participantes[i].selected) {
        cont = cont+1;
      }
    }
    return cont;

  }

  PreparadaAsignacionSeleccionados () {
      if ((this.cromoSeleccionado !== undefined ) && (this.NumeroSeleccionados () >0)) {
        return false;
      } else {
        return true;
      }
  }

}
