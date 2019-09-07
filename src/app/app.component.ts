import { Component, ViewChild} from '@angular/core';
import { Nav,Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


//Importamos las páginas que aparecen en los deslizables que introducen la aplicación
//y el LOGIN (HomePage)
  import { HomePage } from '../pages/home/home';
  import { SlidePage } from '../pages/slide/slide';


//Importamos las páginas que aparecerán en el menu lateral una vez se haya iniciado sesión
  import { MispuntosPage } from '../pages/mispuntos/mispuntos';
  //La página de Inicio será la que recoge los grupos disponibles del profesor
  import { InicioPage } from '../pages/inicio/inicio';
  import { MisColeccionesPage } from '../pages/mis-colecciones/mis-colecciones';


//Importamos un provider para poder enviar el Id del Profesor y tenerlo guardado durante
//toda la aplicación ya que será necesario para acceder a las páginas disponibles del
//menu lateral.
  import { IdProfesorProvider } from '../providers/id-profesor/id-profesor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

//Se define la variable grupo vacía para rellenarla con el provider del Profesor
  grupo: any[] = [];

//Definimos la página que queremos que aparezca al iniciar la aplicación
  rootPage:any = SlidePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public proveedor : IdProfesorProvider ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

//Le pasamos al proveedor el Id del profesor y así guardarlo (subscribirlo al proveedor).
    this.proveedor.idProfesor
    .subscribe ((idProfe) =>this.grupo.push(idProfe));
  }


  irHome() {

//Como estamos haciendo click a cerrar sesión, debemos borrar el Id del profesor del proveedor
//para ello utilizamos un subscribe para entrar al proveedor y con el pop borramos el Id.
    this.proveedor.idProfesor.subscribe (this.grupo.pop());

//Una vez borrado el Id, accedemos a la página de Login (HomePage)
    this.nav.setRoot(HomePage);
  }

  irMisPuntos(i:number) {

//Accedemos a la página de mis Puntos mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(MispuntosPage,{id:i});
  }

  irMisGrupos(i:number) {

//Accedemos a la página de mis Alumnos (InicioPage) mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(InicioPage,{id:i});
  }

  irMisColecciones(i:number){

//Accedemos a la página de mis Alumnos (InicioPage) mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(MisColeccionesPage,{id:i});
  }
}

