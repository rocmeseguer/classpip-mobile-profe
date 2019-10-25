import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

//Importamos las páginas necesarias
import { AlumnosGrupoPage } from '../alumnos-grupo/alumnos-grupo';
import { EquiposGrupoPage } from '../equipos-grupo/equipos-grupo';
import { JuegoPuntosPage } from '../juego-puntos/juego-puntos';
import { SesionProvider} from '../../providers/sesion/sesion'
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api'
import { Profesor } from '../../clases';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

// URLs que utilizaremos
private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

// PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
id:number;

//Parametros de un Usuario
lista : any[];
data: any;
nombre: string;
profesor: Profesor;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private peticionesApi: PeticionesApiProvider,
              private sesion: SesionProvider) {
  //this.id=navParams.get('id');
  //this.profesor = this.sesion.DameProfesor();
  // Pido el profesor (por subscripción). Seguro que ya está en la sesión.
  this.sesion.DameProfesor().subscribe ((profesor) => this.profesor = profesor);

  }

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('El identificador del profesor es ' + this.id);
    //Se accede a la API y se obtiene la lista de grupos del profesor
    this.peticionesApi.DameGruposProfesor (this.profesor.id).subscribe (
    //this.http.get<any[]>(this.APIUrlProfesor + '/' + this.id + '/grupos').subscribe(
      lista => {
        this.lista = lista;
        console.log ('Ya está la lista');
        console.log(this.lista);
      }
    )
  }


  //Función que te redirije a la página de los alumnos del grupo seleccionado del profesor
  irAlumnos(i) {
      console.log ('El id del grupo es ' + i);
      console.log ('Accediendo a pagina Alumnos');
      this.navCtrl.push (AlumnosGrupoPage,{id:i});
  }

  //Función que te redirije a la página de los equipos del grupo seleccionado del profesor
  irEquipos(i,j) {
      console.log ('El id del grupo es ' + i);
      console.log ('El nombre del grupo es ' + j);
      console.log ('Accediendo a pagina Equipos');
      this.navCtrl.push (EquiposGrupoPage,{id:i,nombre:j});
    }

  //Función que te redirije a la página de los equipos del grupo seleccionado del profesor
  irJuego(i) {
      console.log ('Accediendo a pagina Juegos');
      this.navCtrl.push (JuegoPuntosPage,{id:i});
  }

}
