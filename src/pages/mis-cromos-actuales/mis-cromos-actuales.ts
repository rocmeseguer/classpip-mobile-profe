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
import { PeticionesApiProvider } from '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { transition } from '@angular/core/src/animation/dsl';


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
  cromoConNumeroRepetidos: any;
  cromosAlumno: Cromo[];
  cromosEquipo: Cromo[];
  cromosColeccion: Cromo[];
  imagenCromoArray: string[] = [];

  listaCromosSinRepetidos: any[];
  repeticiones: number[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, public https: Http, private peticionesApi: PeticionesApiProvider,
              private calculos: CalculosProvider) {
    this.alumno=navParams.get('alumno');
    this.equipo=navParams.get('equipo');
    this.coleccion=navParams.get('coleccion');
    this.juego=navParams.get('juego');

    console.log ('alumno ' + this.alumno);
  }

  //Se realizarán las siguiente tareas dependiendo del modo de Juego Seleccionado.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de los cromos actuales');
    if (this.juego.Modo === 'Individual') {
      this.CromosDelAlumno(this.alumno);
    //this.RecuperarInscripcionesAlumnoJuego();}
    }
    else{
      this.CromosDelEquipo(this.equipo);
   // this.RecuperarInscripcionesEquiposJuego();
    }
  }


  //Función que permite obtener desde la API los cromos disponibles del alumno seleccionado
  CromosDelAlumno(alumno:any) {

    console.log ('vamos a por los cromos del alumno ' + alumno.id);
    this.peticionesApi.DameCromosAlumno (alumno.id)
    //this.http.get<Cromo[]>(this.APIURLAlumnoJuegoDeColeccion + '/' + alumno + '/cromos')
    .subscribe(cromos => {
      console.log ('Ya tengo los cromos del alumno ');
      this.cromosAlumno = cromos;
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosAlumno);
      this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      console.log(this.cromosAlumno);
      this.OrdenarCromos(this.cromosAlumno);
      this.GET_ImagenCromo(this.cromosAlumno);
      this.CromosDeLaColeccion(this.coleccion);

    });
  }

  //Función que permite obtener desde la API los cromos disponibles del equipo seleccionado
  CromosDelEquipo(equipo:any) {

    this.peticionesApi.DameCromosEquipo (equipo.id)
   // this.http.get<Cromo[]>(this.APIURLEquipoJuegoDeColeccion + '/' + equipo + '/cromos')
    .subscribe(cromos => {
      this.cromosEquipo = cromos;
      this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosEquipo);
      this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      console.log(this.cromosEquipo);
      this.OrdenarCromos(this.cromosEquipo);
      this.GET_ImagenCromo(this.cromosEquipo);
      this.CromosDeLaColeccion(this.coleccion);

    });
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosDeLaColeccion(coleccion: Coleccion) {

      // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
      console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

      // Busca los cromos dela coleccion en la base de datos
      this.peticionesApi.DameCromosColeccion (coleccion.id)
      //this.http.get<Cromo[]>(this.APIUrl + '/' + coleccion.id + '/cromos')
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
          this.peticionesApi.DameImagenCromo (cromo.Imagen)
          // this.https.get('http://localhost:3000/api/imagenes/ImagenCromo/download/' + cromo.Imagen,
          //{ responseType: ResponseContentType.Blob })
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

 //     if (this.juego.Modo === 'Individual') {
        this.cromoConNumeroRepetidos = this.listaCromosSinRepetidos.filter(res => res.cromo.id === this.cromosColeccion[i].id)[0];
        // }
        // else{
        // this.cromoConNumeroRepetidos = this.cromosEquipo.filter(res => res.id === this.cromosColeccion[i].id)[0];
        // }

        if (this.cromoConNumeroRepetidos !== undefined) {
          this.AlbumDelAlumno[i] = new AlbumDelAlumno(this.cromosColeccion[i].Nombre, this.cromosColeccion[i].Imagen,
            this.cromosColeccion[i].Probabilidad, this.cromosColeccion[i].Nivel, true);
          this.repeticiones[i] = this.cromoConNumeroRepetidos.rep;

        } else {
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
