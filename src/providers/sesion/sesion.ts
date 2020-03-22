import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Alumno, Profesor, Juego, Punto, AlumnoJuegoDePuntos,
  Equipo, EquipoJuegoDePuntos, Coleccion,
  AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
  Album, AlbumEquipo, Jornada, TablaJornadas, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion} from '../../clases/index';

  import { ReplaySubject } from 'rxjs';
/*
  Generated class for the SesionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SesionProvider {

  profesor= new ReplaySubject (1);

  //grupo: Grupo;
  juego: Juego;
  equipo: Equipo;
  alumnosEquipo: Alumno[];
  alumnosGrupo: Alumno[];
  coleccion: Coleccion;
  cromos: Cromo[];
  cromo: Cromo;
  posicion: any;
  tiposPuntosDelJuego: any;
  nivelesDelJuego: any;
  alumnoSeleccionado: any;
  inscripcionAlumnoJuego: any;
  equipoSeleccionado: any;
  inscripcionEquipoJuego: any;

  alumnosDelJuego: any;
  listaAlumnosOrdenadaPorPuntos: any;
  rankingJuegoDePuntos: any;
  equiposDelJuego: any;
  listaEquiposOrdenadaPorPuntos: any;
  rankingEquiposJuegoDePuntos: any;

  alumno: any;
  inscripcionAlumno: any;
  inscripcionEquipo: any;
  listaGrupos: any;
  imagenLogoEquipo: any;

  punto: Punto;
  //insignia: Insignia;

  // listaEquiposGrupo: any;

  // Variable Juego Competición Fórmula Uno
  JornadasCompeticion: TablaJornadas[];
  jornadas: Jornada[];
  TablaAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[];
  TablaEquipoJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[]

  constructor() { }

  // La gestión del profesor tiene una problemática especial.
  // Resulta que el profesor lo pide el componente app.component
  // incluso antes de que el usuario se haya autentificado. Lo necesita
  // para el menú. Por tanto, cuando lo pide el profesor aun no está.
  // Y como app.component ya no va a pedir nunca más el profesor, pues eso genera un error.
  // Lo ideal es que cada vez que se mostrase el menu, se pidiese a la sesión el profesor
  // pero no he sabido encontrar la manera de ejecutar una función cada vez que se muestra el menu
  // La estragegia que se usa es la de guardar el profesor en un observable, al cual se subscribe
  // cualquier componente que necesite al profesor. El componente aap.component se subscribe antes
  // de que profesor exista. No hay problema. En cuanto el profesor se envie a la sesión, se transmite
  // a los subscriptores.
  // Se usa la clase ReplaySubject(1) para guardar el profesor, de manera que siempre que se subscribe
  // un componente se le envía solo el ultimo objeto que se almacenó, que es justo lo que necesitamos




  ///////////////////////////////////////////  JUEGO DE COMPETICIÓN FÓRMULA UNO  //////////////////////////////////////////
  public TomaDatosJornadas(
    jornadas: Jornada[],
    JornadasCompeticion: TablaJornadas[]
  ) {
  this.JornadasCompeticion = JornadasCompeticion;
  this.jornadas = jornadas;
  console.log ('jornadas:');
  console.log ( this.JornadasCompeticion);
  console.log ('TablaJornadas:');
  console.log ( this.jornadas);
}

public DameDatosJornadas(): any {
  const datos = {
  jornadas: this.jornadas,
  JornadasCompeticion: this.JornadasCompeticion
  };
  console.log ('Aqui estan las jornadas guardadas y la tabla de jornadas: ');
  console.log(this.jornadas);
  console.log(this.JornadasCompeticion);

  return datos;
}

public TomaJuego(juego: Juego) {
  this.juego = juego;
}

public  DameJuego(): Juego {
  return this.juego;
}

public TomaTablaAlumnoJuegoDeCompeticion(Tabla: TablaAlumnoJuegoDeCompeticion[]) {
  this.TablaAlumnoJuegoDeCompeticion = Tabla;
}

public DameTablaAlumnoJuegoDeCompeticion(): TablaAlumnoJuegoDeCompeticion[] {
  const Tabla = this.TablaAlumnoJuegoDeCompeticion;
  return Tabla;
}

public TomaTablaEquipoJuegoDeCompeticion(Tabla: TablaEquipoJuegoDeCompeticion[]) {
  this.TablaEquipoJuegoDeCompeticion = Tabla;
}

public DameTablaEquipoJuegoDeCompeticion(): TablaEquipoJuegoDeCompeticion[] {
  const Tabla = this.TablaEquipoJuegoDeCompeticion;
  return Tabla;
}
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




  public TomaProfesor(profesor: Profesor) {
      this.profesor.next(profesor);
  }


  public  DameProfesor(): any {
    return this.profesor;
  }
  // public TomaGrupo(grupo: Grupo) {
  //   this.grupo = grupo;
  // }

  // public TomaListaGrupos(listaGrupos: any) {
  //   this.listaGrupos = listaGrupos;
  // }

  // public DameListaGrupos(): any {
  //   return this.listaGrupos;
  // }

  // public  DameGrupo(): Grupo {
  //   return this.grupo;
  // }

  // // public TomaEquiposGrupo(listaEquipos: any) {
  // //   this.listaEquiposGrupo = listaEquipos;
  // // }

  // // public DameEquiposGrupo(): any {
  // //   return this.listaEquiposGrupo;
  // // }

  // public TomaJuego(juego: Juego) {
  //   this.juego = juego;
  // }
  // public  DameJuego(): Juego {
  //   return this.juego;
  // }
  // public TomaEquipo(equipo: Equipo) {
  //   this.equipo = equipo;
  // }
  // public TomaAlumnosEquipo(alumnos: Alumno[]) {
  //   this.alumnosEquipo = alumnos;
  // }
  // public  DameEquipo(): Equipo {
  //   return this.equipo;
  // }
  // public DameAlumnosEquipo(): Alumno[] {
  //   return this.alumnosEquipo;
  // }

  // public TomaAlumnosGrupo(alumnos: Alumno[]) {
  //   this.alumnosGrupo = alumnos;
  // }
  // public DameAlumnosGrupo(): Alumno[] {
  //   return this.alumnosGrupo;
  // }

  // public TomaColeccion(coleccion: Coleccion) {
  //   this.coleccion = coleccion;
  // }
  // public DameColeccion(): Coleccion {
  //   return this.coleccion ;
  // }

  // public TomaCromos(cromosColeccion: Cromo[]) {
  //   this.cromos = cromosColeccion;
  // }

  // public DameCromos(): Cromo[] {
  //   return this.cromos;
  // }

  // public TomaCromo( cromo: Cromo) {
  //   this.cromo = cromo;
  // }

  // public DameCromo(): Cromo {
  //   return this.cromo;
  // }

  // public TomaDatosEvolucionAlumnoJuegoPuntos( posicion: any,
  //                                             tiposPuntosDelJuego: any,
  //                                             nivelesDelJuego: any,
  //                                             alumnoSeleccionado: any,
  //                                             inscripcionAlumnoJuego: any) {
  //     this.posicion = posicion;
  //     this.tiposPuntosDelJuego = tiposPuntosDelJuego;
  //     this.nivelesDelJuego = nivelesDelJuego;
  //     this.alumnoSeleccionado = alumnoSeleccionado;
  //     this.inscripcionAlumnoJuego = inscripcionAlumnoJuego;
  // }

  // public DameDatosEvolucionAlumnoJuegoPuntos(): any {
  //   const datos = {
  //                     posicion: this.posicion,
  //                     tiposPuntosDelJuego: this.tiposPuntosDelJuego,
  //                     nivelesDelJuego: this.nivelesDelJuego,
  //                     alumnoSeleccionado: this.alumnoSeleccionado,
  //                     inscripcionAlumnoJuego: this.inscripcionAlumnoJuego
  //   };
  //   return datos;
  // }

  // public TomaDatosEvolucionEquipoJuegoPuntos(
  //                     posicion: any,
  //                     equipoSeleccionado: any,
  //                     inscripcionEquipoJuego: any,
  //                     nivelesDelJuego: any,
  //                     tiposPuntosDelJuego) {
  //     this.posicion = posicion;
  //     this.equipoSeleccionado = equipoSeleccionado;
  //     this.inscripcionEquipoJuego = inscripcionEquipoJuego;
  //     this.nivelesDelJuego = nivelesDelJuego;
  //     this.tiposPuntosDelJuego = tiposPuntosDelJuego;

  // }

  // public DameDatosEvolucionEquipoJuegoPuntos(): any {
  //   const datos = {
  //                     posicion: this.posicion,
  //                     equipoSeleccionado: this.equipoSeleccionado,
  //                     inscripcionEquipoJuego: this.inscripcionEquipoJuego,
  //                     nivelesDelJuego: this.nivelesDelJuego,
  //                     tiposPuntosDelJuego: this.tiposPuntosDelJuego
  //   };
  //   return datos;
  // }

  // public TomaInformacionJuego(  nivelesDelJuego: any,
  //                               tiposPuntosDelJuego: any) {
  //     this.nivelesDelJuego = nivelesDelJuego;
  //     this.tiposPuntosDelJuego = tiposPuntosDelJuego;
  // }
  // public DameInformacionJuego(): any {
  //   const datos = {
  //                     nivelesDelJuego: this.nivelesDelJuego,
  //                     tiposPuntosDelJuego: this.tiposPuntosDelJuego
  //   };
  //   return datos;
  // }


  public TomaDatosParaAsignarPuntos(
          tiposPuntosDelJuego: any,
          nivelesDelJuego: any,
          alumnosDelJuego: any,
          listaAlumnosOrdenadaPorPuntos: any,
          rankingJuegoDePuntos: any,
          equiposDelJuego: any,
          listaEquiposOrdenadaPorPuntos: any,
          rankingEquiposJuegoDePuntos: any
        ) {

        this.tiposPuntosDelJuego = tiposPuntosDelJuego;
        this.nivelesDelJuego = nivelesDelJuego;
        this.alumnosDelJuego = alumnosDelJuego;
        this.listaAlumnosOrdenadaPorPuntos = listaAlumnosOrdenadaPorPuntos;
        this.rankingJuegoDePuntos = rankingJuegoDePuntos;
        this.equiposDelJuego = equiposDelJuego;
        this.listaEquiposOrdenadaPorPuntos = listaEquiposOrdenadaPorPuntos;
        this.rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos;
        console.log ('Sesion ' + this.rankingEquiposJuegoDePuntos );
        console.log ('Sesion ' + this.equiposDelJuego );
        console.log ('Sesion ' + this.listaEquiposOrdenadaPorPuntos );

  }

  public DameDatosParaAsignarPuntos(): any {
    const datos = {
    tiposPuntosDelJuego: this.tiposPuntosDelJuego,
    nivelesDelJuego: this.nivelesDelJuego,
    alumnosDelJuego: this.alumnosDelJuego,
    listaAlumnosOrdenadaPorPuntos: this.listaAlumnosOrdenadaPorPuntos,
    rankingJuegoDePuntos: this.rankingJuegoDePuntos,
    equiposDelJuego: this.equiposDelJuego,
    listaEquiposOrdenadaPorPuntos: this.listaEquiposOrdenadaPorPuntos,
    rankingEquiposJuegoDePuntos: this.rankingEquiposJuegoDePuntos
    };
    console.log ('Sesion regreso ' + datos.rankingEquiposJuegoDePuntos );

    return datos;
  }
  public DameRankingEquipos(): any {
    return this.rankingEquiposJuegoDePuntos;
  }

  // public TomaAlumnosDelJuego( alumnos: any) {
  //   this.alumnosDelJuego = alumnos;
  // }

  // public DameAlumnosDelJuego(): any {
  //   return this.alumnosDelJuego;
  // }

  // public DameEquiposDelJuego(): any {
  //   return this.equiposDelJuego;
  // }

  // public TomaEquiposDelJuego( equipos: any) {
  //   this.equiposDelJuego = equipos;
  // }

  // public TomaAlumno(alumno: any) {
  //   this.alumno = alumno;
  // }
  // public DameAlumno(): any {
  //   return this.alumno;
  // }

  // public TomaInscripcionAlumno(inscripcionAlumno: any) {
  //   this.inscripcionAlumno = inscripcionAlumno;
  // }

  // public DameInscripcionAlumno(): any {
  //   return this.inscripcionAlumno;
  // }

  // public TomaInscripcionEquipo(inscripcionEquipo: any) {
  //   this.inscripcionEquipo = inscripcionEquipo;
  // }

  // public DameInscripcionEquipo(): any {
  //   return this.inscripcionEquipo;
  // }

  // public TomaImagenLogoEquipo(imagenLogoEquipo: any) {
  //   this.imagenLogoEquipo = imagenLogoEquipo;
  // }

  // public DameImagenLogoEquipo(): any {
  //   return this.imagenLogoEquipo;
  // }

  // public TomaTipoPunto(punto: any) {
  //   this.punto = punto;
  // }

  // public DameTipoPunto(): any {
  //   return this.punto;
  // }

  // public TomaInsignia(insignia: any) {
  //   this.insignia = insignia;
  // }

  // public DameInsignia(): any {
  //   return this.insignia;
  // }

}
