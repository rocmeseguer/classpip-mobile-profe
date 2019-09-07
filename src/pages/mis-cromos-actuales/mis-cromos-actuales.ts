import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Http, ResponseContentType} from '@angular/http';

//Importamos las CLASES necesarias
import {Coleccion} from '../../clases/Coleccion';
import {Cromo} from '../../clases/Cromo';
import {AlbumDelAlumno} from '../../clases/AlbumDelAlumno';
import {AlumnoJuegoDeColeccion} from '../../clases/AlumnoJuegoDeColeccion';
import {EquipoJuegoDeColeccion} from '../../clases/EquipoJuegoDeColeccion';
import {TablaAlumnoJuegoDeColeccion} from '../../clases/TablaAlumnoJuegoDeColeccion';


@IonicPage()
@Component({
  selector: 'page-mis-cromos-actuales',
  templateUrl: 'mis-cromos-actuales.html',
})
export class MisCromosActualesPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  alumno: any;
  equipo: any;
  juego:any;
  coleccion: Coleccion;

  // PARAMETROS DE UN EQUIPO Y UN ALUMNO
  alumnoSeleccionado:any;
  equipoSeleccionado:any;
  inscripcionesAlumnos: AlumnoJuegoDeColeccion[];
  inscripcionesEquipos: EquipoJuegoDeColeccion[];
  tablaAlumno: TablaAlumnoJuegoDeColeccion[] = [];
  AlbumDelAlumno: AlbumDelAlumno[] = [];

  //PARAMETROS DE UN CROMO
  cromo: Cromo;
  cromosAlumno: Cromo[];
  cromosEquipo: Cromo[];
  cromosColeccion: Cromo[];
  imagenCromoArray: string[] = [];


  // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Colecciones';
  private APIURLEquipoJuegoDeColeccion = 'http://localhost:3000/api/EquiposJuegoDeColeccion';
  private APIURLAlumnoJuegoDeColeccion = 'http://localhost:3000/api/AlumnosJuegoDeColeccion';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, public https: Http) {
    this.alumno=navParams.get('alumno');
    this.equipo=navParams.get('equipo');
    this.coleccion=navParams.get('coleccion');
    this.juego=navParams.get('juego');
  }

  //Se realizarán las siguiente tareas dependiendo del modo de Juego Seleccionado.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de los cromos actuales');
    if (this.juego.Modo === 'Individual') {
    this.RecuperarInscripcionesAlumnoJuego();}
    else{
    this.RecuperarInscripcionesEquiposJuego();
    }
  }


  // Recupera las inscripciones de los alumnos en el juego y los cromos que tienen
  RecuperarInscripcionesAlumnoJuego() {
    this.http.get<AlumnoJuegoDeColeccion[]>(this.APIURLAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + this.juego.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnos = inscripciones;
      console.log(this.inscripcionesAlumnos);

      for (let i = 0; i < this.inscripcionesAlumnos.length ; i++) {
        //alumno.id es el identificador del alumno seleccionado en la pantalla anterior
        if (this.inscripcionesAlumnos[i].alumnoId=== this.alumno.id){
          this.alumnoSeleccionado=this.inscripcionesAlumnos[i].id;
        }
      }
      console.log(this.alumnoSeleccionado);
      this.CromosDelAlumno(this.alumnoSeleccionado);
      this.CromosDeLaColeccion(this.coleccion);

    });
  }

   // Recupera las inscripciones de los equipos en el juego y los cromos que tienen
  RecuperarInscripcionesEquiposJuego() {

    this.http.get<EquipoJuegoDeColeccion[]>(this.APIURLEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + this.juego.id)
    .subscribe(inscripciones => {
      this.inscripcionesEquipos = inscripciones;
      console.log(this.inscripcionesEquipos);

      for (let i = 0; i < this.inscripcionesEquipos.length ; i++) {
        //equipo.id es el identificador del equipo seleccionado en la pantalla anterior
        if (this.inscripcionesEquipos[i].equipoId=== this.equipo.id){
          this.equipoSeleccionado=this.inscripcionesEquipos[i].id;
        }
      }
      console.log(this.equipoSeleccionado);
      this.CromosDelEquipo(this.equipoSeleccionado);
      this.CromosDeLaColeccion(this.coleccion);
    });
  }

  //Función que permite obtener desde la API los cromos disponibles del alumno seleccionado
  CromosDelAlumno(alumno:any) {

    this.http.get<Cromo[]>(this.APIURLAlumnoJuegoDeColeccion + '/' + alumno + '/cromos')
    .subscribe(cromos => {
      this.cromosAlumno = cromos;
      console.log(this.cromosAlumno);
      this.OrdenarCromos(this.cromosAlumno);
      this.GET_ImagenCromo(this.cromosAlumno);

    });
  }

  //Función que permite obtener desde la API los cromos disponibles del equipo seleccionado
  CromosDelEquipo(equipo:any) {

    this.http.get<Cromo[]>(this.APIURLEquipoJuegoDeColeccion + '/' + equipo + '/cromos')
    .subscribe(cromos => {
      this.cromosEquipo = cromos;
      console.log(this.cromosEquipo);
      this.OrdenarCromos(this.cromosEquipo);
      this.GET_ImagenCromo(this.cromosEquipo);

    });
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosDeLaColeccion(coleccion: Coleccion) {

      // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
      console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

      // Busca los cromos dela coleccion en la base de datos
      this.http.get<Cromo[]>(this.APIUrl + '/' + coleccion.id + '/cromos')
      .subscribe(res => {
        if (res[0] !== undefined) {
          this.cromosColeccion = res;
          console.log(this.cromosColeccion);
          this.OrdenarCromos(this.cromosColeccion);
          this.GET_ImagenCromo(this.cromosColeccion);
          this.VerAlbum();
          console.log(res);
        } else {
          console.log('No hay cromos en esta coleccion');
          this.cromosColeccion = undefined;
        }
      });
  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  GET_ImagenCromo(cromos: Cromo[]) {

      for (let i = 0; i < cromos.length ; i++) {

        let cromo: Cromo;
        cromo = cromos[i];

        if (cromo.Imagen !== undefined ) {
          // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
          this.https.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + cromo.Imagen,
          { responseType: ResponseContentType.Blob })
          .subscribe(response => {
            const blob = new Blob([response.blob()], { type: 'image/jpg'});

            const reader = new FileReader();
            reader.addEventListener('load', () => {
              this.imagenCromoArray[i] = reader.result.toString();
            }, false);

            if (blob) {
              reader.readAsDataURL(blob);
            }
          });
        }
      }
  }

  //Función que te filtra por cromos que dispones y cromos que no dispones. Des esta manera
  //se podrá visualizar un cromo mas transparente o sin transparencia.
  VerAlbum() {

      for (let i = 0; i < this.cromosColeccion.length; i++) {

        if (this.juego.Modo === 'Individual') {
        this.cromo = this.cromosAlumno.filter(res => res.id === this.cromosColeccion[i].id)[0];
        }
        else{
        this.cromo = this.cromosEquipo.filter(res => res.id === this.cromosColeccion[i].id)[0];
        }

        if (this.cromo !== undefined) {
          console.log('Tengo ' + this.cromo.Nombre);
          this.AlbumDelAlumno[i] = new AlbumDelAlumno(this.cromosColeccion[i].Nombre, this.cromosColeccion[i].Imagen,
            this.cromosColeccion[i].Probabilidad, this.cromosColeccion[i].Nivel, true);

        } else {
          console.log('No tengo ' + this.cromosColeccion[i].Nombre);
          this.AlbumDelAlumno[i] = new AlbumDelAlumno(this.cromosColeccion[i].Nombre, this.cromosColeccion[i].Imagen,
            this.cromosColeccion[i].Probabilidad, this.cromosColeccion[i].Nivel, false);
        }
      }
  }

  // Ordena los cromos por nombre.
  OrdenarCromos(cromosColeccion: any) {
      cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }

}
