import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';

//Importamos las clases necesarias
import {PeticionesApiProvider} from '../../providers/peticiones-api/peticiones-api';
import { CalculosProvider } from '../../providers/calculos/calculos';
import { SesionProvider } from '../../providers/sesion/sesion';


//Importamos las clases necesarias
import { Juego, AlumnoJuegoDeGeocaching, TablaAlumnoJuegoDeGeocaching,  JuegoDeGeocaching} from '../../clases/index';
import swal from 'sweetalert';


@IonicPage()
@Component({
  selector: 'page-juego-seleccionado-preparado',
  templateUrl: 'juego-seleccionado-preparado.html',
})
export class JuegoSeleccionadoPreparadoPage  {

  // PARAMETROS QUE RECOGEMOS DE LA PAGINA PREVIA
  juegoSeleccionado: Juego;
  alumnosDelJuego: any[];


  listaAlumnosOrdenadaPorPuntuacion: AlumnoJuegoDeGeocaching[];
  rankingAlumnosPorPuntuacion: TablaAlumnoJuegoDeGeocaching[];



  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private calculos: CalculosProvider,
              private sesion: SesionProvider,
              private peticionesApi: PeticionesApiProvider) {
    this.juegoSeleccionado = navParams.get('juego');

  }

  ionViewDidEnter () {
    console.log(' Entramos' + this.juegoSeleccionado);
  }
  //Se realizarán las siguiente tareas al inicializar la página.
  ionViewDidLoad() {
    console.log(' Entramos' + this.juegoSeleccionado);

    if (this.juegoSeleccionado.Tipo === 'Juego De Geocaching') {
      console.log('obtenemos info geocaching inactivo');
      this.AlumnosDelJuegoGeocaching();
    }
  }

  AlumnosDelJuegoGeocaching() {
    this.peticionesApi.DameAlumnosJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuegoGeocaching();
    });
  }
  RecuperarInscripcionesAlumnoJuegoGeocaching() {
    this.peticionesApi.DameInscripcionesAlumnoJuegoDeGeocaching(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntuacion = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntuacion = this.listaAlumnosOrdenadaPorPuntuacion.sort(function(a, b) {
        return b.Puntuacion - a.Puntuacion;
      });
      this.TablaClasificacionTotalGeocaching();
    });
  }

  TablaClasificacionTotalGeocaching() {
    this.rankingAlumnosPorPuntuacion = this.calculos.PrepararTablaRankingGeocaching(this.listaAlumnosOrdenadaPorPuntuacion,
      this.alumnosDelJuego);
  }

  ActivarGeocaching(juego: any){
    this.peticionesApi.ModificaJuegoDeGeocaching(new JuegoDeGeocaching(this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.PuntuacionCorrecta,
      this.juegoSeleccionado.PuntuacionIncorrecta, this.juegoSeleccionado.PuntuacionCorrectaBonus, this.juegoSeleccionado.PuntuacionIncorrectaBonus, this.juegoSeleccionado.PreguntasBasicas, this.juegoSeleccionado.PreguntasBonus, true, false,
      // tslint:disable-next-line:max-line-length
      this.juegoSeleccionado.profesorId, this.juegoSeleccionado.grupoId, this.juegoSeleccionado.idescenario), this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId)
      .subscribe(res => {
        swal('¡ Juego activado correctamente !')
      });

  }

}
