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
  import {SesionProvider} from '../providers/sesion/sesion'
import { Profesor } from '../clases';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

//Se define la variable grupo vacía para rellenarla con el provider del Profesor
  grupo: any[] = [];
 // prof: any = {Nombre: 'Juan', Apellido: 'Lopez'};

  profesor: Profesor;



//Definimos la página que queremos que aparezca al iniciar la aplicación
  rootPage:any = SlidePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public proveedor : IdProfesorProvider,
    private sesion: SesionProvider ) {
      console.log ('Empezamos');
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

    });

    // Me subscribo para que me envien el profesor cuando esté listo.
    this.sesion.DameProfesor().subscribe ((profesor) => this.profesor = profesor);
  }



  irHome() {

//Como estamos haciendo click a cerrar sesión, debemos borrar el Id del profesor del proveedor
//para ello utilizamos un subscribe para entrar al proveedor y con el pop borramos el Id.
    //this.proveedor.idProfesor.subscribe (this.grupo.pop());

//Una vez borrado el Id, accedemos a la página de Login (HomePage)

    this.nav.setRoot(HomePage);
  }

  irMisPuntos() {

//Accedemos a la página de mis Puntos mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(MispuntosPage,{id:this.profesor.id});
  }

  irMisGrupos() {

//Accedemos a la página de mis Alumnos (InicioPage) mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(InicioPage,{id:this.profesor.id});
  }

  irMisColecciones(){

//Accedemos a la página de mis Alumnos (InicioPage) mediante un id que será el del profesor, obtenido
//del proveedor.
    this.nav.setRoot(MisColeccionesPage,{id:this.profesor.id});
  }
}

