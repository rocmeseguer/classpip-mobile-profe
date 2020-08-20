import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, ResponseContentType} from '@angular/http';
import { HttpClient} from '@angular/common/http';

//Importamos las CLASES necesarias

import { PeticionesApiProvider } from '../../providers/peticiones-api/peticiones-api';
import { Escenario, PuntoGeolocalizable } from '../../clases';
import { Nav,Platform} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-editar-mis-puntosgeolocalizables',
  templateUrl: 'editar-mis-puntosgeolocalizables.html',
})
export class EditarMisPuntosGeolocalizablesPage {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  escenario:Escenario;

  //PARAMETROS DE UNA COLECCION DE CROMOS
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];

  //PARAMETROS DE UN CROMO
  puntogeolocalizable: PuntoGeolocalizable;

  nombre: string;
  latitud: string;
  longitud: string;
  coords: any = { lat:0, lng: 0 }

 
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: Http, private https: HttpClient,
              private peticionesApi: PeticionesApiProvider,public platform: Platform) {
    this.puntogeolocalizable=navParams.get('puntogeolocalizable');
  }

  //Se realizarán las siguiente tareas al inicializar la pantalla.
  ionViewDidLoad() {
    console.log('Bienvenido a la página de editar el puntosgeolocalizable ');
    console.log(this.puntogeolocalizable);

  }

  obtenerPosicion():any{
    console.log("entro en la funcion de obtener coordenadas");
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitud = position.coords.latitude.toString();
      this.longitud = position.coords.longitude.toString();
      console.log(this.latitud);
      console.log(this.longitud);

      this.EditarPuntoGeolocalizable();
      console.log(this.puntogeolocalizable);
      console.log('las coordenadas del PG han cambiado');
    
  }); 
  
}

  EditarPuntoGeolocalizable() {
    this.peticionesApi.ModificaPuntoGeolocalizableEscenario(new PuntoGeolocalizable(this.puntogeolocalizable.Nombre,this.latitud,this.longitud,this.puntogeolocalizable.PistaFacil,this.puntogeolocalizable.PistaDificil),this.puntogeolocalizable.idescenario,this.puntogeolocalizable.id)
    .subscribe((res) => {
      if (res != null) {
        this.puntogeolocalizable = res;
      }
    });
  }




}
