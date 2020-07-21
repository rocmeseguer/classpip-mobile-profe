import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, ResponseContentType} from '@angular/http';
import { HttpClient} from '@angular/common/http';

//Importamos las CLASES necesarias

import { PeticionesApiProvider } from '../../providers/peticiones-api/peticiones-api';
import { Escenario, PuntoGeolocalizable } from '../../clases';
import { EditarMisPuntosGeolocalizablesPage } from '../editar-mis-puntosgeolocalizables/editar-mis-puntosgeolocalizables';


@IonicPage()
@Component({
  selector: 'page-mis-puntosgeolocalizables',
  templateUrl: 'mis-puntosgeolocalizables.html',
})
export class MisPuntosGeolocalizablesPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  escenario:Escenario;

  //PARAMETROS DE UNA COLECCION DE CROMOS
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];

  //PARAMETROS DE UN CROMO
  puntogeolocalizable: PuntoGeolocalizable;

  // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Escenarios';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, private https: HttpClient,
              private peticionesApi: PeticionesApiProvider) {
    this.escenario=navParams.get('escenario');
  }

  //Se realizarán las siguiente tareas al inicializar la pantalla.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de puntosgeolocalizables del escenario ' + this.escenario);
    this.DamePuntosGeolocalizablesDelEscenario(this.escenario);
  }

  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  DamePuntosGeolocalizablesDelEscenario(escenario: Escenario) {
 
    console.log('voy a mostrar los cromos de la coleccion ' + escenario.id);

    // Busca los cromos dela coleccion en la base de datos
    this.peticionesApi.DamePuntosGeolocalizablesEscenario(escenario.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.puntosgeolocalizablesEscenario = res;
        this.OrdenarPuntosGeolocalizables();
        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        this.puntosgeolocalizablesEscenario = undefined;
      }
    });
  }


// Ordena los cromos por nombre. Asi si tengo algun cromo repetido, salen juntos
  OrdenarPuntosGeolocalizables() {
  this.puntosgeolocalizablesEscenario.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
  }


  irEditarPuntosGeolocalizables(i) {
  console.log('funciona click escenarios para ir a editar los PG');
  console.log ('Accediendo a pagina Juegos');
  this.navCtrl.push (EditarMisPuntosGeolocalizablesPage,{puntogeolocalizable:i});
  }


}
