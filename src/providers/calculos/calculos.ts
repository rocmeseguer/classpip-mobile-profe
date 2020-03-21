import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {PeticionesApiProvider} from '../peticiones-api/peticiones-api';

import { Juego, Nivel, Alumno, Equipo, TablaAlumnoJuegoDePuntos, Cromo,
  TablaEquipoJuegoDePuntos, AlumnoJuegoDePuntos, HistorialPuntosAlumno, EquipoJuegoDePuntos,
  HistorialPuntosEquipo, AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Album, AlbumEquipo,
  AlumnoJuegoDeCompeticionFormulaUno, EquipoJuegoDeCompeticionFormulaUno, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion} from '../../clases/index';
import {Observable } from 'rxjs';
/*
  Generated class for the CalculosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalculosProvider {

  constructor(public http: HttpClient,
              private peticionesAPI: PeticionesApiProvider) {
    console.log('Hello CalculosProvider Provider');
  }



  // Trae de la base de datos todos los juegos del grupo y los organiza en dos
  // listas, una de activos y otra de inactivos. Retorna estas listas como observable

  public DameListaJuegos(grupoID: number): any {
    const listasObservables = new Observable ( obs => {

      const juegosActivos: Juego[] = [];
      const juegosInactivos: Juego[] = [];

      console.log ('vamos a por los juegos de puntos: ' + grupoID);
      this.peticionesAPI.DameJuegoDePuntosGrupo(grupoID)
      .subscribe(juegosPuntos => {
        console.log('He recibido los juegos de puntos');
        console.log(juegosPuntos);
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < juegosPuntos.length; i++) {
          if (juegosPuntos[i].JuegoActivo === true) {
            juegosActivos.push(juegosPuntos[i]);
          } else {
            console.log('Juego inactivo');
            console.log(juegosPuntos[i]);
            juegosInactivos.push(juegosPuntos[i]);
          }
        }
        // Ahora vamos apor por los juegos de colección
        this.peticionesAPI.DameJuegoDeColeccionGrupo(grupoID)
        .subscribe(juegosColeccion => {
          console.log('He recibido los juegos de coleccion');

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < juegosColeccion.length; i++) {
            if (juegosColeccion[i].JuegoActivo === true) {
              juegosActivos.push(juegosColeccion[i]);
            } else {
              juegosInactivos.push(juegosColeccion[i]);
            }
          }
          // Ahora vamos a por los juegos de competición
          console.log ('vamos a por los juegos de competicion liga del grupo: ' + grupoID);
          this.peticionesAPI.DameJuegoDeCompeticionLigaGrupo(grupoID)
          .subscribe(juegosCompeticion => {
            console.log('He recibido los juegos de competición');
            console.log(juegosCompeticion);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < juegosCompeticion.length; i++) {
              if (juegosCompeticion[i].JuegoActivo === true) {
                juegosActivos.push(juegosCompeticion[i]);
              } else {
                juegosInactivos.push(juegosCompeticion[i]);
              }
            }
            console.log ('vamos a por los juegos de competicion formula uno del grupo: ' + grupoID);
            this.peticionesAPI.DameJuegoDeCompeticionFormulaUnoGrupo(grupoID)
            .subscribe(juegosCompeticionFormulaUno => {
            console.log('He recibido los juegos de competición formula uno');
            console.log(juegosCompeticionFormulaUno);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < juegosCompeticionFormulaUno.length; i++) {
              if (juegosCompeticionFormulaUno[i].JuegoActivo === true) {
                juegosActivos.push(juegosCompeticionFormulaUno[i]);
              } else {
                juegosInactivos.push(juegosCompeticionFormulaUno[i]);
              }
            }
            const resultado = { activos: juegosActivos, inactivos: juegosInactivos};
            obs.next (resultado);
            // this.PreparaListas ();
            });
          });
        });
      });
    });

    return listasObservables;
  }

  public PrepararTablaRankingIndividual(  listaAlumnosOrdenadaPorPuntos,
    alumnosDelJuego,
    nivelesDelJuego): any {

    const rankingJuegoDePuntos: any [] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
    let alumno: Alumno;
    let nivel: Nivel;
    const alumnoId = listaAlumnosOrdenadaPorPuntos[i].alumnoId;
    const nivelId = listaAlumnosOrdenadaPorPuntos[i].nivelId;
    alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];

    if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
    nivel = nivelesDelJuego.filter(res => res.id === nivelId)[0];
    }

    if (nivel !== undefined) {
    rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
    listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, nivel.Nombre);

    } else {
    rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
    listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno);
    }
    }

    return (rankingJuegoDePuntos);

  }


  // ESTA FUNCION DEVUELVE DOS LISTAS
  // NO ME GUSTA PORQUE LA DE RANKING INDIVIDUAL DEVUELVE SOLO UNA
  // HAY QUE PENSAR COMO SIMPLIFICAR ESTO DE LAS LISTAS Y LOS RANKINGS
  public PrepararTablaRankingEquipos(
    listaEquiposOrdenadaPorPuntos: any,
    equiposDelJuego: any,
    nivelesDelJuego: any,

    ): any {

      console.log ('DENTRO ');
      console.log (listaEquiposOrdenadaPorPuntos);
      console.log (equiposDelJuego);
      console.log (nivelesDelJuego);
    const rankingEquiposJuegoDePuntos: any[] = [];
    // const rankingEquiposJuegoDePuntosTotal: any [] = [];
    for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
      console.log ('Bucle principal');
      let equipo: Equipo;
      let nivel: Nivel;
      equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

      if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
        console.log(listaEquiposOrdenadaPorPuntos[i].equipoId);
        nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
        console.log(listaEquiposOrdenadaPorPuntos[i].nivelId);
      }

      if (nivel !== undefined) {
          rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
            listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);

          // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
          //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, nivel.Nombre);
      } else {
          rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);

          // rankingEquiposJuegoDePuntosTotal[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
          //     listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo);
      }
    }
    return rankingEquiposJuegoDePuntos;
  }


  private DameNivelId( nivelesDelJuego: Nivel[], puntos: number): number {
    let i = 0;
    let encontrado = false;
    while ((i < nivelesDelJuego.length) && !encontrado) {
      if (nivelesDelJuego[i].PuntosAlcanzar > puntos) {
            encontrado = true;
            console.log ('encontrado');
      } else {
            i = i + 1;
      }
    }
    if (!encontrado) {
      console.log ('no encontrado');
      // Tiene el nivel máximo
      return nivelesDelJuego[nivelesDelJuego.length - 1].id;
    } else if (i > 0) {
      return nivelesDelJuego[i - 1].id;
    } else {
      return undefined;
    }
  }


  // public AsignarPuntosAlumno(
  //   alumno: AlumnoJuegoDePuntos,
  //   nivelesDelJuego: Nivel[],
  //   puntosNuevos: any,
  //   puntoSeleccionadoId: any,
  // ) {

  //       alumno.PuntosTotalesAlumno = alumno.PuntosTotalesAlumno + puntosNuevos;
  //       if (nivelesDelJuego !== undefined) {
  //         const nivelId = this.DameNivelId (nivelesDelJuego, alumno.PuntosTotalesAlumno );
  //         alumno.nivelId = nivelId;
  //       }
  //       this.peticionesAPI.PonPuntosJuegoDePuntos(alumno, alumno.id).
  //       subscribe ();
  //       const fechaAsignacionPunto = new Date();
  //       const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
  //       // tslint:disable-next-line:max-line-length
  //       this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno (puntosNuevos, puntoSeleccionadoId, alumno.id, fechaString))
  //           // tslint:disable-next-line:no-shadowed-variable
  //       .subscribe(res => console.log(res));
  // }


  // public AsignarPuntosEquipo(
  //   equipo: EquipoJuegoDePuntos,
  //   nivelesDelJuego: Nivel[],
  //   puntosNuevos: any,
  //   puntoSeleccionadoId: any,
  // ) {

  //       equipo.PuntosTotalesEquipo = equipo.PuntosTotalesEquipo + puntosNuevos;
  //       if (nivelesDelJuego !== undefined) {
  //         const nivelId = this.DameNivelId (nivelesDelJuego, equipo.PuntosTotalesEquipo );
  //         equipo.nivelId = nivelId;
  //       }
  //       this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipo, equipo.id).
  //       subscribe ();
  //       const fechaAsignacionPunto = new Date();
  //       const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
  //       // tslint:disable-next-line:max-line-length
  //       this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo (puntosNuevos, puntoSeleccionadoId, equipo.id, fechaString))
  //           // tslint:disable-next-line:no-shadowed-variable
  //       .subscribe(res => console.log(res));
  // }

  public AsignarPuntosAlumno(
    alumno: AlumnoJuegoDePuntos,
    nivelesDelJuego: Nivel[],
    puntosNuevos: any,
    puntoSeleccionadoId: any,
  ) {

        alumno.PuntosTotalesAlumno = alumno.PuntosTotalesAlumno + puntosNuevos;
        if (nivelesDelJuego.length > 0 ) {
          const nivelId = this.DameNivelId (nivelesDelJuego, alumno.PuntosTotalesAlumno );
          alumno.nivelId = nivelId;
        }
        this.peticionesAPI.PonPuntosJuegoDePuntos(alumno, alumno.id).
        subscribe ();
        const fechaAsignacionPunto = new Date();
        const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.PonHistorialPuntosAlumno(new HistorialPuntosAlumno (puntosNuevos, puntoSeleccionadoId, alumno.id, fechaString))
            // tslint:disable-next-line:no-shadowed-variable
        .subscribe(res => console.log(res));
  }



  public AsignarPuntosEquipo(
    equipo: EquipoJuegoDePuntos,
    nivelesDelJuego: Nivel[],
    puntosNuevos: any,
    puntoSeleccionadoId: any,
  ) {

        equipo.PuntosTotalesEquipo = equipo.PuntosTotalesEquipo + puntosNuevos;
        if (nivelesDelJuego.length > 0 ) {
          const nivelId = this.DameNivelId (nivelesDelJuego, equipo.PuntosTotalesEquipo );
          equipo.nivelId = nivelId;
        }
        this.peticionesAPI.PonPuntosEquiposJuegoDePuntos(equipo, equipo.id).
        subscribe ();
        const fechaAsignacionPunto = new Date();
        const fechaString = fechaAsignacionPunto.toLocaleDateString() + '  ' + fechaAsignacionPunto.toLocaleTimeString();
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.PonHistorialPuntosEquipo(new HistorialPuntosEquipo (puntosNuevos, puntoSeleccionadoId, equipo.id, fechaString))
            // tslint:disable-next-line:no-shadowed-variable
        .subscribe(res => console.log(res));
  }



  public DameRankingPuntoSeleccionadoEquipos(
    listaEquiposOrdenadaPorPuntos: any,
    equiposDelJuego: any,
    nivelesDelJuego: any,
    puntoSeleccionadoId: any
  ): any {

    const rankingObservable = new Observable ( obs => {

      let rankingEquiposJuegoDePuntos: any[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i ++) {

        let equipo: Equipo;
        let nivel: Nivel;
        // Busca equipo
        equipo = equiposDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].equipoId)[0];

        if (listaEquiposOrdenadaPorPuntos[i].nivelId !== undefined) {
          nivel = nivelesDelJuego.filter(res => res.id === listaEquiposOrdenadaPorPuntos[i].nivelId)[0];
        }

        this.peticionesAPI.DameHistorialDeUnPuntoEquipo(listaEquiposOrdenadaPorPuntos[i].id, puntoSeleccionadoId)
        .subscribe(historial => {

          let puntos = 0;
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }


          if (nivel !== undefined) {
            rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos, nivel.Nombre);
          } else {
            rankingEquiposJuegoDePuntos[i] = new TablaEquipoJuegoDePuntos (i + 1, equipo.Nombre, equipo.id,
              puntos);
          }

          if (i === listaEquiposOrdenadaPorPuntos.length - 1 ) {
            // tslint:disable-next-line:only-arrow-functions
            rankingEquiposJuegoDePuntos = rankingEquiposJuegoDePuntos.sort(function(obj1, obj2) {
              return obj2.puntos - obj1.puntos;
            });
            obs.next (rankingEquiposJuegoDePuntos);
          }
        });
      }
    });
    return rankingObservable;
  }

  public DameRankingPuntoSeleccionadoAlumnos(
                            listaAlumnosOrdenadaPorPuntos: any,
                            alumnosDelJuego: any,
                            nivelesDelJuego: any,
                            puntoSeleccionadoId: any): any {
    const rankingObservable = new Observable ( obs => {

      let rankingJuegoDePuntos: any[] = [];

      console.log ('Dentro ranking2 ');
      console.log ('Recorremos los ' + listaAlumnosOrdenadaPorPuntos.length)
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i ++) {
        console.log ('alumno ' + i);

        let alumno: Alumno;
        let nivel: Nivel;

        // Busco al alumno
        alumno = alumnosDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].alumnoId)[0];
        console.log ('nombre ' + alumno.Nombre);

        if (listaAlumnosOrdenadaPorPuntos[i].nivelId !== undefined) {
          console.log(listaAlumnosOrdenadaPorPuntos[i].alumnoId);
          // Busco el nivel
          nivel = nivelesDelJuego.filter(res => res.id === listaAlumnosOrdenadaPorPuntos[i].nivelId)[0];
        }

        this.peticionesAPI.DameHistorialDeUnPunto(listaAlumnosOrdenadaPorPuntos[i].id, puntoSeleccionadoId)
        .subscribe(historial => {
          let puntos = 0;
          console.log (alumno.Nombre + ' tieme ' + historial.length + 'asignaciones');
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < historial.length; j ++) {
            puntos = puntos + historial[j].ValorPunto;
          }
          console.log ('Puntos ' + puntos);

          if (nivel !== undefined) {
            // tslint:disable-next-line:max-line-length
            rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos, nivel.Nombre);
          } else {
            // tslint:disable-next-line:max-line-length
            rankingJuegoDePuntos[i] = new TablaAlumnoJuegoDePuntos (i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
              puntos);
          }

          if (i === listaAlumnosOrdenadaPorPuntos.length - 1 ) {
            console.log ('vamos a acabar');
            // tslint:disable-next-line:only-arrow-functions
            rankingJuegoDePuntos = rankingJuegoDePuntos.sort(function(obj1, obj2) {
              return obj2.puntos - obj1.puntos;
            });
            obs.next (rankingJuegoDePuntos);
        }

        });
      }
    });
    return rankingObservable;
  }



  private randomIndex(
    probabilities: number[],
    randomGenerator: () => number = Math.random): number {

      // get the cumulative distribution function
      let acc = 0;
      const cdf = probabilities
          .map(v => acc += v) // running total [4,7,9,10]
          .map(v => v / acc); // normalize to max 1 [0.4,0.7,0.9,1]

      // pick a random number between 0 and 1
      const randomNumber = randomGenerator();

      // find the first index of cdf where it exceeds randomNumber
      // (findIndex() is in ES2015+)
      return cdf.findIndex(p => randomNumber < p);
  }

  public AsignarCromosAleatoriosAlumno(
    alumno: Alumno,
    inscripcionesAlumnos: any,
    numeroCromosRandom: number,
    probabilidadCromos: any,
    cromosColeccion: any,

  ) {
    console.log ('Vamos a asignar ' + alumno.Nombre);
    console.log ('Vamos a asignar ' + inscripcionesAlumnos);

    let alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion;
    alumnoJuegoDeColeccion = inscripcionesAlumnos.filter(res => res.alumnoId === alumno.id)[0];
    console.log(alumnoJuegoDeColeccion);

    // tslint:disable-next-line:prefer-const
    //let hits = this.probabilidadCromos.map(x => 0);


    for (let k = 0; k < numeroCromosRandom; k++) {

      console.log('Voy a hacer el post del cromo ' + k);

      const indexCromo = this.randomIndex(probabilidadCromos);
      //hits[this.indexCromo]++;


      this.peticionesAPI.AsignarCromoAlumno(new Album (alumnoJuegoDeColeccion.id,
        cromosColeccion[indexCromo].id)).subscribe(res => {

        // this.selection.clear();
        // this.selectionEquipos.clear();
        // this.isDisabled = true;
        // this.seleccionados = Array(this.alumnosDelJuego.length).fill(false);
      });
    }

  }

  public AsignarCromosAleatoriosEquipo(
      equipo: Equipo,
      inscripcionesEquipos: any,
      numeroCromosRandom: number,
      probabilidadCromos: any,
      cromosColeccion: any
  ) {
    let equipoJuegoDeColeccion: EquipoJuegoDeColeccion;
    equipoJuegoDeColeccion = inscripcionesEquipos.filter(res => res.equipoId === equipo.id)[0];
    console.log(equipoJuegoDeColeccion);

    for (let k = 0; k < numeroCromosRandom; k++) {

      console.log('Voy a hacer el post del cromo ' + k);

      const indexCromo = this.randomIndex(probabilidadCromos);

      this.peticionesAPI.AsignarCromoEquipo(new AlbumEquipo (equipoJuegoDeColeccion.id,
        cromosColeccion[indexCromo].id)).subscribe(res => {

        console.log(res);

      });
    }

  }


  // Esta función recibe una lista de cromos en la que puede haber repetidos
    // y geneera otra en la que cada cromo aparece una sola vez y se le asocia el número
    // de veces que aparece reperido en la lista de entrada
  GeneraListaSinRepetidos(listaCromos: Cromo []): any [] {
    const listaCromosSinRepetidos: any [] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaCromos.length; i++) {
      const n = listaCromos.filter (cromo => cromo.Nombre === listaCromos[i].Nombre).length;
      if (listaCromosSinRepetidos.filter (res => res.cromo.Nombre === listaCromos[i].Nombre).length === 0) {
        listaCromosSinRepetidos.push ({rep: n, cromo: listaCromos[i]});
      }
    }
    return listaCromosSinRepetidos;
  }

  ///////////////////////////////////////////////////////////// COMPETICIÓN FÓRMULA UNO ///////////////////////////////////////////////////////////////

  public PrepararTablaRankingIndividualFormulaUno(listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[],
                                                    alumnosDelJuego: Alumno[]): TablaAlumnoJuegoDeCompeticion[] {
      const rankingJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion [] = [];
      console.log (' Vamos a preparar la tabla del ranking individual de Competición Fórmula Uno');
      console.log ('la lista de alumnos ordenada es: ');
      console.log (listaAlumnosOrdenadaPorPuntos);
      // tslint:disable-next-line:prefer-for-oF
      for (let i = 0; i < listaAlumnosOrdenadaPorPuntos.length; i++) {
      let alumno: Alumno;
      const alumnoId = listaAlumnosOrdenadaPorPuntos[i].AlumnoId;
      alumno = alumnosDelJuego.filter(res => res.id === alumnoId)[0];
      rankingJuegoDeCompeticion[i] = new TablaAlumnoJuegoDeCompeticion(i + 1, alumno.Nombre, alumno.PrimerApellido, alumno.SegundoApellido,
                              listaAlumnosOrdenadaPorPuntos[i].PuntosTotalesAlumno, alumnoId);
      }
      return rankingJuegoDeCompeticion;
  }

  public PrepararTablaRankingEquipoFormulaUno(listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[],
                                              equiposDelJuego: Equipo[]) {
    const rankingJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion [] = [];
    console.log (' Vamos a preparar la tabla del ranking por equipos de Competición Fórmula Uno');
    console.log ('la lista de equipos ordenada es: ');
    console.log (listaEquiposOrdenadaPorPuntos);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < listaEquiposOrdenadaPorPuntos.length; i++) {
    let equipo: Equipo;
    const EquipoId = listaEquiposOrdenadaPorPuntos[i].EquipoId;
    equipo = equiposDelJuego.filter(res => res.id === EquipoId)[0];
    rankingJuegoDeCompeticion[i] = new TablaEquipoJuegoDeCompeticion(i + 1, equipo.Nombre,
                            listaEquiposOrdenadaPorPuntos[i].PuntosTotalesEquipo, EquipoId);
    }
    return rankingJuegoDeCompeticion;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}
