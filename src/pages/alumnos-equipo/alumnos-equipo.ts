import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType, Http } from '@angular/http';



@IonicPage()
@Component({
  selector: 'page-alumnos-equipo',
  templateUrl: 'alumnos-equipo.html',
})
export class AlumnosEquipoPage {

  // URLs que utilizaremos
  private APIUrlEquipos = 'http://localhost:3000/api/Equipos';


  //Parametros de un equipo
  alumnosEquipo : any[];
  imagenLogo: string;
  items : any[];
  itemsGrupo: any[];

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  id: number;
  equipo:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient, private http2: Http) {

  //Recogemos los valores de la pagina anterior y los añadimos en el parametro id y equipo
    this.id=navParams.get('id');
    this.equipo=navParams.get('equipo');
  }

  //Al iniciar la pantalla, estas serán las acciones que se realizaran
  ionViewDidLoad() {
    console.log('Bienvenido a la página de los Alumnos del Equipo');
    console.log('El id del equipo mostrado es: '+ this.id);

    //Buscamos en la API los alumnos del equipo
    this.http.get<any[]>(this.APIUrlEquipos + '/' + this.id + '/alumnos').subscribe(
      alumnosEquipo => {

      //Copiamos los alumnosEquipo en itemsGrupo y en items para definir una lista
      //inicial de alumnos (fija) y una lista de alumnos que desaparecerá segun el
      //filtro de ion-searchbar
      this.itemsGrupo = alumnosEquipo;
      this.items = alumnosEquipo;
      console.log ('Ya está la lista');
      console.log(this.itemsGrupo);
  })
    this.LogoDelEquipo();
  }

  // Le pasamos el equipo y buscamos el logo que tiene y sus alumnos
  LogoDelEquipo() {

      console.log('entro a buscar alumnos y foto');
      console.log(this.equipo.FotoEquipo);
      // Si el equipo tiene una foto (recordemos que la foto no es obligatoria)
      if (this.equipo.FotoEquipo !== undefined) {

        // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
        this.http2.get('http://localhost:3000/api/imagenes/LogosEquipos/download/' + this.equipo.FotoEquipo,
        { responseType: ResponseContentType.Blob })
        .subscribe(response => {
          const blob = new Blob([response.blob()], { type: 'image/jpg'});

          const reader = new FileReader();
          reader.addEventListener('load', () => {
            this.imagenLogo = reader.result.toString();
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }
        });

        // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
      } else {
        this.imagenLogo = undefined;
      }
  }

  //Nos permitirá fijar la lista de alumnos (filtrados)
  fijarAlumnos(alumnos :any[]){
      this.items = alumnos;
  }

  //Función correspondiente al ion-searchbar que nos permitirá visualizar los alumnos que
  //tengas las caracteristicas definidas en el filtro
  getItems(ev: any) {
      // Reset items back to all of the items
      this.fijarAlumnos(this.itemsGrupo);
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

}
