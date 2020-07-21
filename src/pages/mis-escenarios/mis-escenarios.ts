import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, ResponseContentType} from '@angular/http';
import { HttpClient} from '@angular/common/http';

import {PeticionesApiProvider } from '../../providers/peticiones-api/peticiones-api';

import { Escenario } from '../../clases/Escenario';
import { MisPuntosGeolocalizablesPage } from '../mis-puntosgeolocalizables/mis-puntosgeolocalizables';


@IonicPage()
@Component({
  selector: 'page-mis-escenarios',
  templateUrl: 'mis-escenarios.html',
})
export class MisEscenariosPage {


// PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  profesorId:number;

//Parametros de coleccion de cromos
  escenariosProfesor: Escenario[];
 
  // URLs que utilizaremos
  private APIUrlProfesor = 'http://localhost:3000/api/Profesores';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, private https: HttpClient, private peticionesApi: PeticionesApiProvider) {
    this.profesorId=navParams.get('id');
  }

  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log('Bienvenido a la página correspondiente a las colecciones del profesor');
    this.EscenariosDelProfesor();
  }

  //Función que obtiene las colecciones existentes del profesor desde la API
  EscenariosDelProfesor() {

    this.peticionesApi.DameEscenariosDelProfesor (this.profesorId)
    //this.https.get<Coleccion[]>(this.APIUrlProfesor + '/' + this.profesorId + '/coleccions')
    .subscribe(escenario => {
      if (escenario[0] !== undefined) {
        console.log('Voy a dar la lista');
        this.escenariosProfesor = escenario;
        console.log(this.escenariosProfesor);
      } else {
        this.escenariosProfesor = undefined;
      }

    });
  }

  irPuntosGeolocalizables(i) {
    console.log('funciona click escenarios para ir a PG');
  console.log ('Accediendo a pagina Juegos');
  this.navCtrl.push (MisPuntosGeolocalizablesPage,{escenario:i});
  }

}
