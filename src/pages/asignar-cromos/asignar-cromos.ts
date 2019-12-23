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

@IonicPage()
@Component({
  selector: 'page-asignar-cromos',
  templateUrl: 'asignar-cromos.html',
})

export class AsignarCromosPage {

   // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Colecciones';
  private APIUrlCromos = 'http://localhost:3000/api/cromos';
  private APIRURLJuegoDeColeccion = 'http://localhost:3000/api/JuegosDeColeccion';
  private APIRURLAlbum = 'http://localhost:3000/api/Albumes';
  private APIURLAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';
  private APIURLEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';
  private APIRURLAlbumEquipo = 'http://localhost:3000/api/albumsEquipo';


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


  // PARAMETROS REFERENTES A LOS ALUMNOS Y EQUIPOS
  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];
  studentsSelectedArray: Array<any> = new Array<any>();
  items: any[];
  itemsAPI: any[];
  vectorCorrectos: any[]=[];

  //Booleano que indicará si se ha seleccionado algun checkbox o no
  haySeleccionado : boolean = false;


  // Se genera el parámetro Loading
  public loading: Loading;



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

  //Se realizarán las siguiente tareas dependiendo del modo de Juego Seleccionado.
  ionViewDidLoad() {

    console.log('Bienvenido a la página de Asignación de Cromos');

    //Si es el caso de un juego individual, se cargarán los alumnos inscritos en dicho Juego
    //de Colección.
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.RecuperarInscripcionesAlumnoJuego();
      this.Get_AlumnosColeccion();
    }
    //Lo mismo sucede para el caso de juego Colectivo , donde se cargarán los equipos
    //inscritos en dicho Juego de Colección.
    else {
      this.RecuperarInscripcionesEquiposJuego();
      this.Get_EquiposColeccion();
    }

    //Se cargan los cromos de la colección asignada a ese tipo de Juego de Colección
    this.CromosColeccion();

  }

  //Cada vez que se seleccione otro como el seleccionador de cromos, la función se ejecutará
  //y mostrará la estética del cromo al lado del nombre del cromo seleccionado.
  ionChange(){

    this.cromoSeleccionado = this.cromosColeccion.filter(res => res.id === Number(this.cromoSeleccionadoId))[0];

    this.GET_ImagenCromo();
  }

  //Función que permitirá Asignar cromos Manualmente pasandole el identificador del cromo como parámetro
  //de entrada
  AsignarCromos() {

    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromoAlumno para Individual
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log('El juego seleccionado es individual');
      this.AsignarCromoAlumnos(this.cromo[0].id);
      console.log("Revisa los cromos para verificar");

    }
    //Se discrimina entre modo de Juego y se utiliza la función AsignarCromoEquipo para Colectivo
    else {
      console.log('El juego selecionado es por equipo');
      this.AsignarCromoEquipos(this.cromo[0].id);
      console.log("Revisa los cromos para verificar");
    }

    //Se resetea el vectorCorrectos para que así en la próxima asignación de cromos,
    //no aparezcan los alumnos asignados anteriormente.
    this.studentsSelectedArray = [];

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
  }

  AsignarCromosAleatoriosAlumno() {
    for (let i = 0; i < this.studentsSelectedArray.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.studentsSelectedArray [i]) {
                this.calculos.AsignarCromosAleatoriosAlumno  (
                  this.items[i], this.inscripcionesAlumnos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion
                  );
      }
    };
  }

  AsignarCromosAleatoriosEquipo() {

    for (let i = 0; i < this.studentsSelectedArray.length; i++) {

      // Buscamos los alumnos que hemos seleccionado
      if (this.studentsSelectedArray [i]) {
                // tslint:disable-next-line:max-line-length
                this.calculos.AsignarCromosAleatoriosEquipo (this.items[i], this.inscripcionesEquipos, this.numeroCromosRandom, this.probabilidadCromos, this.cromosColeccion);
      }
    };
}



  //Función que añade los cromos seleccionados en el alumno seleccionado
  AsignarCromoAlumnos(cromoSeleccionado) {

    //Muestra en consola el cromoSeleccionado desde el seleccionador
    console.log('cromo' + cromoSeleccionado);

    for (let i = 0; i < this.studentsSelectedArray.length; i++) {

       // Buscamos los alumnos que hemos seleccionado
       if (this.studentsSelectedArray [i]) {

        let alumno: Alumno;
        alumno = this.items[i];
        console.log(alumno.Nombre + ' seleccionado');

        let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;

        alumnoJuegoDeColeccion = this.inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
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
    for (let i = 0; i < this.studentsSelectedArray.length; i++) {

       // Buscamos los equipos que hemos seleccionado
       if (this.studentsSelectedArray [i]) {

        let equipo: Equipo;
        equipo = this.items[i];
        console.log(equipo.Nombre + ' seleccionado');

        let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;

        equipoJuegoDeColeccion = this.inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
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

  // Recupera las inscripciones de los alumnos en el juego de colección seleccionado
  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesApi.DameInscripcionesAlumnoJuegoDeColeccion (this.juegoSeleccionado.id)
    // this.http.get<AlumnoJuegoDeColeccion[]>(this.APIURLAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    // + this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);
    });
  }

  // Recupera las inscripciones de los equipos en el juego de colección seleccionado
  RecuperarInscripcionesEquiposJuego() {
    this.peticionesApi.DameInscripcionesEquipoJuegoDeColeccion (this.juegoSeleccionado.id)
    //   this.http.get<EquipoJuegoDeColeccion[]>(this.APIURLEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    // + this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.inscripcionesEquipos = inscripciones;
        console.log(this.inscripcionesEquipos);
      });
  }

  //Función que asigna el array de alumnos/equipos seleccionados (stuArray) en la
  //variable studentsSelectedArray utilizada para asignar cromos
  getSelectedStudents(stuArray: Array<any>){
    this.studentsSelectedArray = stuArray;
  }

  //Función que permite obtener los cromos de la colección del juego seleccionado y
  //la correspondiente imagen del cromo
  CromosColeccion() {
    console.log ('Voy a por los cromos');
    // Busca los cromos de la coleccion en la base de datos
    this.peticionesApi.DameCromosColeccion (this.juegoSeleccionado.coleccionId)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromoSeleccionadoId=this.cromosColeccion[0].id;
        this.cromoSeleccionado=this.cromosColeccion[0];
        console.log ('muestro el cromo ' + this.cromoSeleccionado.Nombre);
        this.GET_ImagenCromo();




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

  //Función que obtiene los Alumnos registrado en Juego de Colección
  Get_AlumnosColeccion(){
    this.peticionesApi.DameAlumnosJuegoDeColeccion (this.juegoSeleccionado.id)
    //this.http.get<any[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/alumnos')
    .subscribe(alumnosJuego => {

      //Se define itemsAPI y items para mantener uno fijo y otro que se pueda modificar al
      //utilizar el filtro por Nombre/Apellido en la aplicación
      this.itemsAPI = alumnosJuego;
      this.items = alumnosJuego;
    });
  }

  //Función que obtiene los Alumnos registrado en Juego de Colección
  Get_EquiposColeccion(){
    this.peticionesApi.DameEquiposJuegoDeColeccion (this.juegoSeleccionado.id)
    //this.http.get<any[]>(this.APIRURLJuegoDeColeccion + '/' + this.juegoSeleccionado.id + '/equipos')
    .subscribe(equiposJuego => {

      //Se define itemsAPI y items para mantener uno fijo y otro que se pueda modificar al
      //utilizar el filtro por Nombre/Apellido en la aplicación
      this.itemsAPI = equiposJuego;
      this.items= equiposJuego;
    });
  }


  //Nos permitirá fijar la lista de alumnos (filtrados)
  fijarItems(items :any[]){
  this.items = items;
  }

  //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengan las caracteristicas definidas en el filtro
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

  //Función correspondiente al ion-searchbar que nos permitirá visualizar los equipos que
  //tengan las caracteristicas definidas en el filtro
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
              console.log('Agree clickeeee');
              this.AsignarCromos();
            }
          }
        ]
      });
      confirm.present();
  }

  //Dialogo de confirmación que se generará al hacer click en Validar (Asignación Aleatoria) y
  //que dará la opción de cancelar la asignación en caso de haberse equivocado o no
  //estar seguros
  showConfirm1() {
      const confirm = this.alertCtrl.create({
        title: 'Asignación Aleatoria',
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
              console.log('Agree clickedddd');
              this.AsignarCromosAleatorios();
            }
          }
        ]
      });
      confirm.present();
  }


}
