import { Component } from '@angular/core';
import { NavController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

//Importamos las páginas necesarias
import { InicioPage } from '../inicio/inicio';

//Importamos un proveedor para registrar el Id del profesor que ha iniciado sesion
import { IdProfesorProvider } from '../../providers/id-profesor/id-profesor';
import { PeticionesApiProvider } from '../../providers/peticiones-api/peticiones-api'
import { SesionProvider } from '../../providers/sesion/sesion';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  //Parametros de un Usuario
  nombre: string;
  apellido: string;
  public loading: Loading;
  coords: any = { lat: 0, lng: 0 };
  latitud;
  longitud;

  // URLs que utilizaremos
  private APIUrl = 'http://localhost:3000/api/Profesores';

  constructor(private http: HttpClient , public navCtrl: NavController,
              public proveedor : IdProfesorProvider, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public sesion: SesionProvider,
              public peticionesAPI : PeticionesApiProvider) {
  }

  //Función que activará el componente Loading y mostrará el mensaje que se haya introducido
  //como input.
  async showLoading(message: string) {

    this.loading = await this.loadingCtrl.create({
      content: message,
    });
    await this.loading.present();
  }


  //Alerta que se generará al haber encontrado un error en la autentificación del usuario
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Credenciales incorrectos',
      subTitle: 'Vaya...Ha habido un error al verificar las credenciales. Vuelva a intentarlo',
      buttons: ['OK']
    });
    alert.present();
  }



  obtenerPosicion() {

      navigator.geolocation.getCurrentPosition((position) => {
        this.latitud = position.coords.latitude;
        this.longitud = position.coords.longitude;
      });

  }

  //Función que busca en la base de datos el nombre y apellido y en caso afirmativo,
  //te permite acceder a tu sesión de Classpip
  Autentificar() {
    console.log('Entro a mostrar a ' + this.nombre + ' ' + this.apellido);
    this.showLoading('Espere mientras verificamos sus claves de acceso');
    //Se realiza una consulta a la API mediante filtros de nombre y apellido
    this.peticionesAPI.DameProfesor(this.nombre, this.apellido).subscribe(
    //this.http.get<any>(this.APIUrl + '?filter[where][Nombre]=' + this.nombre + '&filter[where][Apellido]=' + this.apellido).subscribe(
      (res) => {
        if (res[0] !== undefined) { // Utilizamos res porque la operacion es sincrona. Me suscribo y veo si tiene algo.
          console.log('profe existe');
          setTimeout(() => {
            this.loading.dismiss();
            this.sesion.TomaProfesor(res[0]);
            this.navCtrl.setRoot (InicioPage,{id:res[0].id}); //Conviertes Inicio en tu página principal
          },1500);

          } else {

            setTimeout(() => {
              this.loading.dismiss();
              this.showAlert();
            },1500);

          console.log('profe no existe');
        }
      }
    );
  }

}
