import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http} from '@angular/http';

//Importamos las páginas necesarias
import { AlumnosEquipoPage } from '../alumnos-equipo/alumnos-equipo';


@IonicPage()
@Component({
  selector: 'page-equipos-grupo',
  templateUrl: 'equipos-grupo.html',
})

export class EquiposGrupoPage {

  // URLs que utilizaremos
  private APIUrlGrupos = 'http://localhost:3000/api/Grupos';

  //Lista de equipos disponibles
  equipos : any[];

  //Parametros de un equipo
  equipo: string;
  imagenLogo: string;
  imagenes: any[] = [];

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  id:number;
  nombre:string;


  constructor(public navCtrl: NavController,public navParams: NavParams,
              private http: HttpClient,private http2: Http) {
    //Recogemos los valores de la pagina anterior y los añadimos en el parametro id y nombre
    this.id=navParams.get('id');
    this.nombre=navParams.get('nombre');
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de los equipos de tu grupo');
    console.log('El grupo seleccionado tiene el siguiente id:' + this.id);

    //Creo un vector vacío para borrar el histórico de imagenes previo
    this.imagenes=[];

    //Buscamos en la API los equipos del grupo
    this.http.get<any[]>(this.APIUrlGrupos + '/' + this.id + '/equipos').subscribe(
      equipos => {
        this.equipos = equipos;
        console.log ('Ya está la lista');
        console.log(this.equipos);

        this.LogoDeEquipos(this.equipos);
        console.log(this.imagenes);
    })

  }

  //Al hacer click en un grupo, activará la función y abrirá la página AlumnosEquipo y
  //se le pasará la información del equipo seleccionado
  obtenerAlumnos(i,j){
    console.log ('El id del equipo es ' + i);
    console.log ('Accediendo a pagina Alumnos de un Equipo');
    this.navCtrl.push (AlumnosEquipoPage,{id:i,equipo:j});
  }

  // Le pasamos el equipo y buscamos el logo que tiene y sus alumnos
  LogoDeEquipos(equipos:any[]) {

  for (let i = 0; i < equipos.length; i ++) {

  // Si el equipo tiene una foto (recordemos que la foto no es obligatoria)
  if (this.equipos[i].FotoEquipo !== undefined) {

    // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
    this.http2.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + this.equipos[i].FotoEquipo,
    { responseType: ResponseContentType.Blob })
    .subscribe(response => {
      const blob = new Blob([response.blob()], { type: 'image/jpg'});

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenLogo = reader.result.toString();
        this.imagenes[i] = this.imagenLogo;
      }, false);

      if (blob) {
        reader.readAsDataURL(blob);
      }
    });

    // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
  } else {
    this.imagenLogo = undefined;
    this.imagenes[i] = this.imagenLogo;
  }
  }}


}
