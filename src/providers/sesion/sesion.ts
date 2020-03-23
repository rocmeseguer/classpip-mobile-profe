import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Alumno, Profesor, Juego, Punto, AlumnoJuegoDePuntos,
  Equipo, EquipoJuegoDePuntos, Coleccion,
  AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
  Album, AlbumEquipo, TablaAlumnoJuegoDeCompeticion, Jornada, TablaJornadas, TablaEquipoJuegoDeCompeticion } from '../../clases/index';

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

  jornadas: any;
  JornadasCompeticion: any;
  TablaAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[];
  TablaEquipoJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[];
  JuegosDePuntosActivos: Juego[];

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

  public TomaJuego(juego: Juego) {
    this.juego = juego;
  }
  public  DameJuego(): Juego {
    return this.juego;
  }

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
public TomaTablaAlumnoJuegoDeCompeticion(Tabla: TablaAlumnoJuegoDeCompeticion[]) {
  this.TablaAlumnoJuegoDeCompeticion = Tabla;
}

public DameDatosJornadasJuegoComponent(): any {
const datos = {
jornadas: this.jornadas,
};
console.log ('Aqui estan las jornadas guardadas: ');
console.log(this.jornadas);

return datos;
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

public TomaInscripcionAlumno(inscripcionAlumno: any) {
  this.inscripcionAlumno = inscripcionAlumno;
}

public DameInscripcionAlumno(): any {
  return this.inscripcionAlumno;
}

public TomaInscripcionEquipo(inscripcionEquipo: any) {
  this.inscripcionEquipo = inscripcionEquipo;
}

public DameInscripcionEquipo(): any {
  return this.inscripcionEquipo;
}
}
