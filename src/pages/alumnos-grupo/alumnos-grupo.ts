import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api'
import swal from 'sweetalert';


@IonicPage()
@Component({
  selector: 'page-alumnos-grupo',
  templateUrl: 'alumnos-grupo.html',
})
export class AlumnosGrupoPage {

// URLs que utilizaremos
private APIUrlGrupos = 'http://localhost:3000/api/Grupos';

//Parametros de un grupo
items : any[];
itemsAPI: any[];

// PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
id:number;

seleccionados: boolean[];


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private peticionesAPI: PeticionesApiProvider) {
    //Recogemos los valores de la pagina anterior y los añadimos en el parametro id
    this.id=navParams.get('id');
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la pagina de los alumnos de un grupo');
    console.log('El id del grupo seleccionado es:' + this.id);
    this.cargarAlumnos();

}

  //Buscamos en la API los alumnos del grupo
  cargarAlumnos(){
    this.peticionesAPI.DameAlumnosGrupo (this.id).subscribe (
    //this.http.get<any[]>(this.APIUrlGrupos + '/' + this.id + '/alumnos').subscribe(
      grupo => {

        //Copiamos el grupo en itemsAPI y en items para definir una lista
        //inicial de alumnos (fija) y una lista de alumnos que desaparecerá segun el
        //filtro de ion-searchbar
        this.itemsAPI = grupo;
        console.log ('Ya está la lista');
        console.log(this.itemsAPI);
        this.items = grupo;
        this.seleccionados = new Array (this.items.length).fill (false);
    })
  }

  //Nos permitirá fijar la lista de alumnos (filtrados)
  fijarAlumnos(alumnos :any[]){
    this.items = alumnos;
  }

  //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengan las caracteristicas definidas en el filtro
  getItems(ev: any) {
  // Reset items back to all of the items
  this.fijarAlumnos(this.itemsAPI);
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

  ProcesarSeleccionados () {
    console.log ('Seleccionados ' + this.seleccionados);
    this.seleccionados.fill (false);
    swal('Aún no está decidido lo que hacer con los seleccionados', 'success');

  }


  ElegirAleatoriamente() {


    console.log ('Entramos');
    const numeroAlumnos = this.items.length;
    const elegido = Math.floor(Math.random() * numeroAlumnos);
    const alumnoElegido = this.items[elegido];
    console.log ('Hemos elegido a ' + elegido);
    swal(alumnoElegido.Nombre + ' ' + alumnoElegido.PrimerApellido, 'Enhorabuena', 'success');
  }


}
