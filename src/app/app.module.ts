import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';


//**************** IMPORTAR PÁGINAS CREADAS ********************/
//Importamos todas las páginas creadas al módulo de la aplicación para que se puedan
//acceder a ellas

import { HomePage } from '../pages/home/home';
import { InicioPageModule } from '../pages/inicio/inicio.module';
import { AlumnosGrupoPageModule } from '../pages/alumnos-grupo/alumnos-grupo.module';
import { EquiposGrupoPageModule } from '../pages/equipos-grupo/equipos-grupo.module';
import { AlumnosEquipoPageModule } from '../pages/alumnos-equipo/alumnos-equipo.module';
import { JuegoPuntosPageModule } from '../pages/juego-puntos/juego-puntos.module';
import { MispuntosPageModule } from '../pages/mispuntos/mispuntos.module';
import { SlidePageModule } from '../pages/slide/slide.module';
import { JuegoSeleccionadoPageModule} from '../pages/juego-seleccionado/juego-seleccionado.module';
import { IdProfesorProvider } from '../providers/id-profesor/id-profesor';
import { InfoJuegoPuntosPageModule } from '../pages/info-juego-puntos/info-juego-puntos.module';
import { AsignarPuntosPageModule } from '../pages/asignar-puntos/asignar-puntos.module';
import { AsignarCromosPageModule } from '../pages/asignar-cromos/asignar-cromos.module';
import { MisColeccionesPageModule } from '../pages/mis-colecciones/mis-colecciones.module';
import { MisCromosPageModule } from '../pages/mis-cromos/mis-cromos.module';
import { MisCromosActualesPageModule } from '../pages/mis-cromos-actuales/mis-cromos-actuales.module';
import { PeticionesApiProvider } from '../providers/peticiones-api/peticiones-api';
import { SesionProvider } from '../providers/sesion/sesion';
import { CalculosProvider } from '../providers/calculos/calculos';
import { InfoJuegoLigaPageModule } from '../pages/info-juego-liga/info-juego-liga.module';
import { SeleccionarGanadorLigaPageModule } from '../pages/Seleccionar-ganador-liga/Seleccionar-ganador-liga.module';
import { SeleccionarGanadorFormulaUnoPageModule } from '../pages/Seleccionar-ganador-formula-uno/Seleccionar-ganador-formula-uno.module';
import { InfoJuegoFormulaUnoPageModule } from '../pages/info-juego-formula-uno/info-juego-formula-uno.module';
import { JornadaJuegoFormulaUnoPageModule } from '../pages/jornada-juego-formula-uno/jornada-juego-formula-uno.module';
import { JornadaJuegoLigaPageModule } from '../pages/jornada-juego-liga/jornada-juego-liga.module'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    InicioPageModule,
    AlumnosGrupoPageModule,
    EquiposGrupoPageModule,
    AlumnosEquipoPageModule,
    JuegoPuntosPageModule,
    MispuntosPageModule,
    SlidePageModule,
    JuegoSeleccionadoPageModule,
    InfoJuegoPuntosPageModule,
    AsignarPuntosPageModule,
    MisColeccionesPageModule,
    MisCromosPageModule,
    MisCromosActualesPageModule,
    AsignarCromosPageModule,
    InfoJuegoLigaPageModule,
    SeleccionarGanadorLigaPageModule,
    InfoJuegoFormulaUnoPageModule,
    SeleccionarGanadorFormulaUnoPageModule,
    JornadaJuegoFormulaUnoPageModule,
    JornadaJuegoLigaPageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IdProfesorProvider,
    PeticionesApiProvider,
    SesionProvider,
    CalculosProvider
  ]
})
export class AppModule {

}

