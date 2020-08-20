import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { ResponseContentType, Http} from '@angular/http';

import {  Alumno, Grupo,Profesor, Juego, Punto, Insignia, AlumnoJuegoDePuntos,
  Equipo, EquipoJuegoDePuntos, Coleccion, Matricula, Nivel,
  AlumnoJuegoDeColeccion, EquipoJuegoDeColeccion, Cromo, HistorialPuntosAlumno, HistorialPuntosEquipo,
  Album, AlbumEquipo, AsignacionEquipo, AsignacionPuntosJuego, Jornada, AlumnoJuegoDeCompeticionLiga,
  EquipoJuegoDeCompeticionLiga, EnfrentamientoLiga, AlumnoJuegoDeCompeticionFormulaUno,
  EquipoJuegoDeCompeticionFormulaUno, Escenario, PuntoGeolocalizable, AlumnoJuegoDeGeocaching, JuegoDeGeocaching } from '../../clases/index';
  





/*
  Generated class for the PeticionesApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PeticionesApiProvider {


  //private URLBase = 'http://localhost:3000/api/';

  private URLBase = 'http://147.83.118.92:3000/api/';


  private APIUrlProfesores = this.URLBase + 'Profesores';

  private APIUrlGrupos = this.URLBase + 'Grupos';

  private APIUrlMatriculas = this.URLBase + 'Matriculas';

  private APIUrlEquipos = this.URLBase + 'Equipos';

  private APIUrlColecciones =this.URLBase + 'Colecciones';

  private APIRUrlJuegoDePuntos = this.URLBase + 'JuegosDePuntos';
  private APIUrlAlumnoJuegoDePuntos = this.URLBase + 'AlumnoJuegosDePuntos';
  private APIUrlEquipoJuegoDePuntos = this.URLBase + 'EquiposJuegosDePuntos';
  private APIUrlPuntosJuego = this.URLBase + 'AsignacionPuntosJuego';
  private APIUrlHistorialPuntosAlumno = this.URLBase + 'HistorialesPuntosAlumno';
  private APIUrlHistorialPuntosEquipo = this.URLBase + 'HistorialesPuntosEquipo';

  private APIRUrlJuegoDeColeccion = this.URLBase + 'JuegosDeColeccion';
  private APIUrlAlumnoJuegoDeColeccion = this.URLBase + 'AlumnosJuegoDeColeccion';
  private APIUrlEquipoJuegoDeColeccion = this.URLBase + 'EquiposJuegoDeColeccion';
  private APIRUrlAlbum = this.URLBase + 'Albumes';
  private APIRUrlAlbumEquipo = this.URLBase + 'albumsEquipo';


  // Para cargar y descargar imagenes
  private APIUrlImagenAlumno = this.URLBase + 'imagenes/imagenAlumno';
  private APIUrlImagenColeccion = this.URLBase + 'imagenes/ImagenColeccion';
  private APIUrlImagenCromo = this.URLBase + 'imagenes/ImagenCromo';
  private APIUrlImagenNivel = this.URLBase + 'imagenes/imagenNivel';
  private APIURLImagenInsignia = this.URLBase + 'imagenes/ImagenInsignia';
  private APIUrlLogosEquipos = this.URLBase + 'imagenes/LogosEquipos';

  // Juego de Competición Fórmula Uno
  private APIUrlJuegoDeCompeticionFormulaUno = 'http://localhost:3000/api/JuegosDecompeticionFormulaUno';
  private APIUrlAlumnoJuegoDeCompeticionFormulaUno = 'http://localhost:3000/api/AlumnosJuegoDeCompeticionFormulaUno';
  private APIUrlEquipoJuegoDeCompeticionFormulaUno = 'http://localhost:3000/api/EquiposJuegoDeCompeticionFormulaUno';

  //Juego competicion Liga
  private APIUrlJornadasJuegoDeCompeticionLiga = 'http://localhost:3000/api/JornadasDeCompeticionLiga';
  private APIUrlJuegoDeCompeticionLiga = 'http://localhost:3000/api/JuegosDeCompeticionLiga';
  private APIUrlAlumnoJuegoDeCompeticionLiga = 'http://localhost:3000/api/AlumnosJuegoDeCompeticionLiga';
  private APIUrlEquipoJuegoDeCompeticionLiga = 'http://localhost:3000/api/EquiposJuegoDeCompeticionLiga';


  private APIUrlEscenarios = this.URLBase + 'Escenarios';
  private APIUrlJuegoDeGeocaching = this.URLBase + 'JuegosDeGeocaching';
  private APIUrlAlumnoJuegoDeGeocaching = this.URLBase + 'AlumnosJuegoDeGeocaching';

  constructor(
    private http: HttpClient,
    private httpImagenes: Http
  ) { }


  public DameProfesor(nombre: string, apellido: string): Observable<Profesor> {
    console.log('Entro a mostrar a ' + nombre + ' ' + apellido);
    return this.http.get<Profesor>(this.APIUrlProfesores + '?filter[where][Nombre]=' + nombre + '&filter[where][Apellido]=' + apellido);
  }

  public DameAlumnoConcreto(alumno: Alumno, ProfesorId: number): Observable<Alumno> {
    console.log('Entro a buscar a ' + alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido );
    return this.http.get<Alumno>(this.APIUrlProfesores + '/' + ProfesorId + '/alumnos?filter[where][Nombre]=' + alumno.Nombre +
    '&filter[where][PrimerApellido]=' + alumno.PrimerApellido + '&filter[where][SegundoApellido]=' + alumno.SegundoApellido);
  }
  public DameImagenAlumno(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenAlumno + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }

  public AsignaAlumnoAlProfesor(alumno: Alumno, profesorId: number): Observable<Alumno> {
    return this.http.post<Alumno>(this.APIUrlProfesores + '/' + profesorId + '/alumnos', alumno);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Grupos
  public DameGruposProfesor(profesorId: number): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.APIUrlProfesores + '/' + profesorId + '/grupos');
  }
  public CreaGrupo(grupo: Grupo, profesorId: number): Observable<Grupo> {
    return this.http.post<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos', grupo);
  }
  public ModificaGrupo(grupo: Grupo, profesorId: number, grupoId: number): Observable<Grupo> {
    return this.http.put<Grupo>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId, grupo);
  }
  public BorraGrupo(profesorId: number, grupoId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/grupos/' + grupoId);
  }
  public DameAlumnosGrupo(grupoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlGrupos + '/' + grupoId + '/alumnos');
  }
  public DameMatriculasGrupo(grupoId: number): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId);
  }
  public BorraMatricula(matriculaId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlMatriculas + '/' + matriculaId);
  }
  public MatriculaAlumnoEnGrupo(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.APIUrlMatriculas, matricula);
  }
  public DameMatriculaAlumno(alumnoId: number, grupoId: number): Observable<Matricula> {
    return this.http.get<Matricula>(this.APIUrlMatriculas + '?filter[where][grupoId]=' + grupoId + '&filter[where][alumnoId]=' + alumnoId);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Equipos
  public DameEquiposDelGrupo(grupoId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlGrupos + '/' + grupoId + '/equipos');
  }
  public BorraEquipoDelGrupo(equipo: Equipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + equipo.grupoId + '/equipos/' + equipo.id);
  }
  public CreaEquipo(equipo: Equipo, grupoId: number): Observable<Equipo> {
    return this.http.post<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos', equipo);
  }
  public PonLogoEquipo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlLogosEquipos + '/upload', formData);
  }
  public DameLogoEquipo(logo: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlLogosEquipos + '/download/' + logo,
    { responseType: ResponseContentType.Blob });
  }
  public ModificaEquipo(equipo: Equipo, grupoId: number, equipoId: number): Observable<Equipo> {
    return this.http.put<Equipo>(this.APIUrlGrupos + '/' + grupoId + '/equipos/' + equipoId, equipo);
  }
  public DameAlumnosEquipo(equipoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlEquipos + '/' + equipoId + '/alumnos');
  }
  public DameAsignacionesDelEquipo(equipo: Equipo): Observable<AsignacionEquipo[]> {
    // Da las asignaciones de los alumnos del equipo
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + equipo.grupoId + '/asignacionEquipos?filter[where][equipoId]='
     + equipo.id);
  }
  public DameAsignacionesEquipoDelGrupo(grupoId: number): Observable<AsignacionEquipo[]> {
    // Da las asignaciones a equipos de todos los alumnos del grupo (sean del equipo que sean)
    return this.http.get<AsignacionEquipo[]>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos');
  }
  public DameAsignacionEquipoAlumno(alumnoId: number, equipoId: number, grupoId: number): Observable<AsignacionEquipo> {
    // Da la asignación a un equipo de un alumno concreto
    return this.http.get<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos?filter[where][equipoId]=' + equipoId +
    '&filter[where][alumnoId]=' + alumnoId);
  }
  public ModificaAsignacionEquipoAlumno(asignacionEquipo: AsignacionEquipo, grupoId: number, asignacionEquipoId: number):
  Observable<AsignacionEquipo> {
    return this.http.put<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos/' +
    asignacionEquipoId, asignacionEquipo);
  }
  public BorraAlumnoEquipo(asignacionEquipo: AsignacionEquipo): Observable<any> {
    return this.http.delete<any>(this.APIUrlGrupos + '/' + asignacionEquipo.grupoId + '/asignacionEquipos/'
    + asignacionEquipo.id);
  }
  public PonAlumnoEquipo(asignacionEquipos: AsignacionEquipo, grupoId: number): Observable<AsignacionEquipo> {
    return this.http.post<AsignacionEquipo>(this.APIUrlGrupos + '/' + grupoId + '/asignacionEquipos', asignacionEquipos);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Puntos e insignias
  public CreaTipoDePunto(punto: Punto, profesorId: number): Observable<Punto> {
    return this.http.post<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos', punto);
  }
  public ModificaTipoDePunto(punto: Punto, profesorId: number, puntoId: number): Observable<Punto> {
    return this.http.put<Punto>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId, punto);
  }
  public BorraTipoDePunto(puntoId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/puntos/' + puntoId);
  }
  public CreaInsignia(insignia: Insignia, profesorId: number): Observable<Insignia> {
    return this.http.post<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia', insignia);
  }
  public DameInsignias(profesorId: number): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(this.APIUrlProfesores + '/' + profesorId + '/insignia');
  }
  public ModificaInsignia(insignia: Insignia, profesorId: number, insigniaId: number): Observable<Insignia> {
    return this.http.put<Insignia>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId, insignia);
  }
  public BorraInsignia(insigniaId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/insignia/' + insigniaId);
  }
  public PonImagenInsignia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIURLImagenInsignia + '/upload', formData);
  }
  public DameImagenInsignia(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIURLImagenInsignia + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Colecciones
  public CreaColeccion(coleccion: Coleccion, profesorId: number): Observable<Coleccion> {
    return this.http.post<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions', coleccion);
  }
  public DameColeccion(coleccionId: number): Observable<Coleccion> {
    return this.http.get<Coleccion>(this.APIUrlColecciones + '/' + coleccionId);
  }
  public PonImagenColeccion(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenColeccion + '/upload', formData);
  }
  public DameImagenColeccion(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenColeccion + '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }
  public ModificaColeccion(coleccion: Coleccion, profesorId: number, coleccionId: number): Observable<Coleccion> {
    return this.http.put<Coleccion>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId, coleccion);
  }
  public BorraColeccion(coleccionId: number, profesorId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlProfesores + '/' + profesorId + '/coleccions/' + coleccionId);
  }
  public PonCromoColeccion(cromo: Cromo, coleccionId: number): Observable<Cromo> {
    return this.http.post<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos', cromo);
  }
  public PonImagenCromo(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenCromo + '/upload', formData);
  }
  public DameImagenCromo(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenCromo +  '/download/' + imagen,
      { responseType: ResponseContentType.Blob });
  }
  public ModificaCromoColeccion(cromo: Cromo, coleccionId: number, cromoId: number): Observable<Cromo> {
    return this.http.put<Cromo>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId, cromo);
  }
  public BorrarCromo(cromoId: number, coleccionId: number): Observable<any> {
    return this.http.delete<any>(this.APIUrlColecciones + '/' + coleccionId + '/cromos/' + cromoId);
  }
  public DameCromosColeccion(coleccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlColecciones + '/' + coleccionId + '/cromos');
  }


///////////////////////////////////////////////////////////////////////////////////////////
  // Juego de puntos
  // Creacion del juego
  public CreaJuegoDePuntos(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos', juego);
  }
  public DameTiposDePuntos(profesorId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIUrlProfesores + '/' + profesorId + '/puntos');
  }
  public AsignaPuntoJuego(asignacionPuntoJuego: AsignacionPuntosJuego) {
    return this.http.post<AsignacionPuntosJuego>(this.APIUrlPuntosJuego, asignacionPuntoJuego);
  }
  public CreaNivel(nivel: Nivel, juegoDePuntosId: number) {
    return this.http.post<Nivel>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels', nivel);
  }
  public PonImagenNivel(formData: FormData): Observable<any> {
    return this.http.post<any>(this.APIUrlImagenNivel + '/upload', formData);
  }
  public DameImagenNivel(imagen: string): Observable<any> {
    return this.httpImagenes.get(this.APIUrlImagenNivel + '/download/' + imagen,
        { responseType: ResponseContentType.Blob });
  }
  public CambiaEstadoJuegoDePuntos(juegoDePuntos: Juego, juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId, juegoDePuntos);
  }
  public BorraJuegoDePuntos(juegoDePuntosId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos/' + juegoDePuntosId);
  }

///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion de puntos en juego individual

  public DameJuegoDePuntosGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDePuntos');
  }
  public DameAlumnosJuegoDePuntos(juegoDePuntosId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/alumnos');
  }
  public DamePuntosJuegoDePuntos(juegoDePuntosId: number): Observable<Punto[]> {
    return this.http.get<Punto[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/puntos');
  }
  public DameNivelesJuegoDePuntos(juegoDePuntosId: number): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/nivels');
  }
  public DameInscripcionAlumnoJuegoDePuntos(alumnoId: number, juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    return this.http.get<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][alumnoId]=' + alumnoId
    + '&filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public DameInscripcionesAlumnoJuegoDePuntos(juegoDePuntosId: number): Observable<AlumnoJuegoDePuntos[]> {
    return this.http.get<AlumnoJuegoDePuntos[]>(this.APIUrlAlumnoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public InscribeAlumnoJuegoDePuntos(alumnoJuegoDePuntos: AlumnoJuegoDePuntos) {
    return this.http.post<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos, alumnoJuegoDePuntos);
  }
  public BorrarPuntosAlumno(historialPuntosAlumnoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.delete<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '/' + historialPuntosAlumnoId);
  }
  public PonPuntosJuegoDePuntos( alumnoJuegoDePuntos: AlumnoJuegoDePuntos, alumnoJuegoDePuntosId: number): Observable<AlumnoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDePuntos>(this.APIUrlAlumnoJuegoDePuntos + '/' + alumnoJuegoDePuntosId, alumnoJuegoDePuntos);
  }
  public DameHistorialPuntosAlumno(alumnoJuegoDePuntosId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId);
  }
  public PonHistorialPuntosAlumno(historial: HistorialPuntosAlumno): Observable<HistorialPuntosAlumno> {
    return this.http.post<HistorialPuntosAlumno>(this. APIUrlHistorialPuntosAlumno, historial);
  }
  public DameHistorialDeUnPunto(alumnoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosAlumno[]> {
    return this.http.get<HistorialPuntosAlumno[]>(this.APIUrlHistorialPuntosAlumno + '?filter[where][alumnoJuegoDePuntosId]='
     + alumnoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }


///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion de puntos en juego por equipos
  public DameEquiposJuegoDePuntos(juegoDePuntosId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRUrlJuegoDePuntos + '/' + juegoDePuntosId + '/equipos');
  }
  public InscribeEquipoJuegoDePuntos(equipoJuegoDePuntos: EquipoJuegoDePuntos) {
    return this.http.post<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos, equipoJuegoDePuntos);
  }
  public DameInscripcionesEquipoJuegoDePuntos(juegoDePuntosId: number): Observable<EquipoJuegoDePuntos[]> {
    return this.http.get<EquipoJuegoDePuntos[]>(this.APIUrlEquipoJuegoDePuntos + '?filter[where][juegoDePuntosId]=' + juegoDePuntosId);
  }
  public DameHistorialDeUnPuntoEquipo(equipoJuegoDePuntosId: number, puntoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId + '&filter[where][puntoId]=' + puntoId);
  }
  public DameHistorialPuntosEquipo(equipoJuegoDePuntosId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.get<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '?filter[where][equipoJuegoDePuntosId]='
     + equipoJuegoDePuntosId);
  }
  // tslint:disable-next-line:max-line-length
  public PonPuntosEquiposJuegoDePuntos( equipoJuegoDePuntos: EquipoJuegoDePuntos, equipoJuegoDePuntosId: number): Observable<EquipoJuegoDePuntos> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDePuntos>(this.APIUrlEquipoJuegoDePuntos + '/' + equipoJuegoDePuntosId, equipoJuegoDePuntos);
  }
  public PonHistorialPuntosEquipo(historial: HistorialPuntosEquipo): Observable<HistorialPuntosEquipo> {
    return this.http.post<HistorialPuntosEquipo>(this. APIUrlHistorialPuntosEquipo, historial);
  }
   public BorraPuntosEquipo(historialPuntosEquipoId: number): Observable<HistorialPuntosEquipo[]> {
    return this.http.delete<HistorialPuntosEquipo[]>(this.APIUrlHistorialPuntosEquipo + '/' + historialPuntosEquipoId);
  }



///////////////////////////////////////////////////////////////////////////////////////////
  // Juego de colección
  public DameColeccionesDelProfesor(profesorId: number): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(this.APIUrlProfesores + '/' + profesorId + '/coleccions');
  }
  public CreaJuegoDeColeccion(juego: Juego, grupoId: number): Observable<Juego> {
    return this.http.post<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions', juego);
  }
  public CambiaEstadoJuegoDeColeccion(juegoDeColeccion: Juego, juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId, juegoDeColeccion);
  }
  public BorraJuegoDeColeccion(juegoDeColeccionId: number, grupoId: number): Observable<Juego> {
    return this.http.delete<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoDeColeccionId);
  }
  public DameJuegoDeColeccionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions');
  }
  public CompletaJuegoDeColeccion(juego: Juego, grupoId: number, juegoId: number): Observable<Juego> {
    return this.http.put<Juego>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeColeccions/' + juegoId, juego);
  }
  public InscribeAlumnoJuegoDeColeccion(alumnoJuegoDeColeccion: AlumnoJuegoDeColeccion) {
    return this.http.post<AlumnoJuegoDeColeccion>(this.APIUrlAlumnoJuegoDeColeccion, alumnoJuegoDeColeccion);
  }
  public InscribeEquipoJuegoDeColeccion(equipoJuegoDeColeccion: EquipoJuegoDeColeccion) {
    return this.http.post<EquipoJuegoDeColeccion>(this.APIUrlEquipoJuegoDeColeccion, equipoJuegoDeColeccion);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de colecciones, individual
  public DameAlumnosJuegoDeColeccion(juegoDeColeccionId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIRUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/alumnos');
  }
  public DameInscripcionesAlumnoJuegoDeColeccion(juegoDeColeccionId: number): Observable<AlumnoJuegoDeColeccion[]> {
    return this.http.get<AlumnoJuegoDeColeccion[]>(this.APIUrlAlumnoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }
  public AsignarCromoAlumno(album: Album) {
    return this.http.post<Album>(this.APIRUrlAlbum, album);
  }

  public DameCromosAlumno(alumnoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlAlumnoJuegoDeColeccion + '/' + alumnoJuegoDeColeccionId + '/cromos');
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de colecciones, en equipo
  public DameEquiposJuegoDeColeccion(juegoDeColeccionId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIRUrlJuegoDeColeccion + '/' + juegoDeColeccionId + '/equipos');
  }
  public DameCromosEquipo(equipoJuegoDeColeccionId: number): Observable<Cromo[]> {
    return this.http.get<Cromo[]>(this.APIUrlEquipoJuegoDeColeccion + '/' + equipoJuegoDeColeccionId + '/cromos');
  }
  public DameInscripcionesEquipoJuegoDeColeccion(juegoDeColeccionId: number): Observable<EquipoJuegoDeColeccion[]> {
    return this.http.get<EquipoJuegoDeColeccion[]>(this.APIUrlEquipoJuegoDeColeccion + '?filter[where][juegoDeColeccionId]='
    + juegoDeColeccionId);
  }
  public AsignarCromoEquipo(album: AlbumEquipo) {
    return this.http.post<AlbumEquipo>(this.APIRUrlAlbumEquipo, album);
  }



  // Juego de competición
  public DameJuegoDeCompeticionGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegoDeCompeticions');
  }
  public DameJuegoDeCompeticionLigaGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionLiga');
  }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Juego de competición fórmula uno
  public DameJuegoDeCompeticionFormulaUnoGrupo(grupoId: number): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/JuegosDeCompeticionFormulaUno');
  }
  public DameJornadasDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJornadasJuegoDeCompeticionLiga + '?filter[where][JuegoDeCompeticionLigaId]='
    + juegoDeCompeticionLigaId);

    // return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionID + '/JornadasDeCompeticionLiga');
  }
  public DameEnfrentamientosDeCadaJornadaLiga(jornadasDeCompeticionLigaId: number): Observable<Array<EnfrentamientoLiga>> {
    return this.http.get<Array<EnfrentamientoLiga>>('http://localhost:3000/api/JornadasDeCompeticionLiga/' + jornadasDeCompeticionLigaId +
    '/enfrentamientosLiga');
  }
  public DameAlumnosJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Alumno[]> {
    console.log('Voy a por los alumnos');
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/alumnos');
  }
  public DameEquiposJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionLiga + '/' + juegoDeCompeticionLigaId + '/equipos');
  }
  public DameInscripcionesAlumnoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<AlumnoJuegoDeCompeticionLiga[]> {
    return this.http.get<AlumnoJuegoDeCompeticionLiga[]>(this.APIUrlAlumnoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }
  public DameInscripcionesEquipoJuegoDeCompeticionLiga(juegoDeCompeticionLigaId: number): Observable<EquipoJuegoDeCompeticionLiga[]> {
    return this.http.get<EquipoJuegoDeCompeticionLiga[]>(this.APIUrlEquipoJuegoDeCompeticionLiga
                                                          + '?filter[where][JuegoDeCompeticionLigaId]=' + juegoDeCompeticionLigaId);
  }
  public PonGanadorDelEnfrentamiento(enfrentamiento: EnfrentamientoLiga): Observable<EnfrentamientoLiga> {
    return this.http.put<EnfrentamientoLiga>('http://localhost:3000/api/EnfrentamientosLiga/' + enfrentamiento.id, enfrentamiento);
  }
  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnoGanadorJuegoDeCompeticionLiga(alumnoGanadorJuegoDeCompeticionLiga: AlumnoJuegoDeCompeticionLiga): Observable<AlumnoJuegoDeCompeticionLiga> {
    return this.http.put<AlumnoJuegoDeCompeticionLiga>(this.APIUrlAlumnoJuegoDeCompeticionLiga + '/'
                                                       + alumnoGanadorJuegoDeCompeticionLiga.id, alumnoGanadorJuegoDeCompeticionLiga);
  }
  // tslint:disable-next-line:max-line-length
  public PonPuntosEquipoGanadorJuegoDeCompeticionLiga(ganadorJuegoDeCompeticionLiga: EquipoJuegoDeCompeticionLiga): Observable<EquipoJuegoDeCompeticionLiga> {
    return this.http.put<EquipoJuegoDeCompeticionLiga>('http://localhost:3000/api/EquiposJuegoDeCompeticionLiga/'
                                                       + ganadorJuegoDeCompeticionLiga.id, ganadorJuegoDeCompeticionLiga);
  }

  public DameJornadasDeCompeticionFormulaUno(juegoDeCompeticionId: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionId
                                     + '/jornadasDeCompeticionFormulaUno');
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de competición fórmula uno, individual
  public DameAlumnosJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionFormulaUnoId + '/alumnos');
  }

  public DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<AlumnoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<AlumnoJuegoDeCompeticionFormulaUno[]>(this.APIUrlAlumnoJuegoDeCompeticionFormulaUno
                                                      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Gestion del juego de competición fórmula uno, equipos
  public DameEquiposJuegoDeCompeticionFormulaUno(juegoDeCompeticionLigaId: number): Observable<Equipo[]> {
    console.log('Voy a por los equipos');
    return this.http.get<Equipo[]>(this.APIUrlJuegoDeCompeticionFormulaUno + '/' + juegoDeCompeticionLigaId + '/equipos');
  }

  public DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(juegoDeCompeticionFormulaUnoId: number): Observable<EquipoJuegoDeCompeticionFormulaUno[]> {
    return this.http.get<EquipoJuegoDeCompeticionFormulaUno[]>(this.APIUrlEquipoJuegoDeCompeticionFormulaUno
                                                      + '?filter[where][JuegoDeCompeticionFormulaUnoId]=' + juegoDeCompeticionFormulaUnoId);
  }

  public PonGanadoresJornadasDeCompeticionFormulaUno(jornada: Jornada): Observable<Jornada> {
    return this.http.put<Jornada>('http://localhost:3000/api/JornadasDeCompeticionFormulaUno/' + jornada.id, jornada);
  }

  // tslint:disable-next-line:max-line-length
  public PonPuntosAlumnosGanadoresJornadasDeCompeticionFormulaUno(alumno: AlumnoJuegoDeCompeticionFormulaUno): Observable<AlumnoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<AlumnoJuegoDeCompeticionFormulaUno>('http://localhost:3000/api/AlumnosJuegoDeCompeticionFormulaUno/' + alumno.id, alumno);
  }

   // tslint:disable-next-line:max-line-length
   public PonPuntoEquiposGanadoresJornadasDeCompeticionFormulaUno(equipo: EquipoJuegoDeCompeticionFormulaUno): Observable<EquipoJuegoDeCompeticionFormulaUno> {
    // tslint:disable-next-line:max-line-length
    return this.http.put<EquipoJuegoDeCompeticionFormulaUno>('http://localhost:3000/api/EquiposJuegoDeCompeticionFormulaUno/' + equipo.id, equipo);
  }



//escenarios
public DameEscenariosDelProfesor(profesorId: number): Observable<Escenario[]> {
  return this.http.get<Escenario[]>(this.APIUrlProfesores + '/' + profesorId + '/escenarios');
}
public DamePuntosGeolocalizablesEscenario(idescenario: number): Observable<PuntoGeolocalizable[]> {
  return this.http.get<PuntoGeolocalizable[]>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables');
}
public ModificaPuntoGeolocalizableEscenario(puntogeolocalizable: PuntoGeolocalizable, idescenario: number, idpuntogeolocalizable: number): Observable<PuntoGeolocalizable> {
  return this.http.put<PuntoGeolocalizable>(this.APIUrlEscenarios + '/' + idescenario + '/puntosgeolocalizables/' + idpuntogeolocalizable, puntogeolocalizable);
}

public DameJuegoDeGeocaching(grupoId: number): Observable<Juego[]> {
  return this.http.get<Juego[]>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching');
}


public DameAlumnosJuegoDeGeocaching(juegoDeGeocaching: number): Observable<Alumno[]> {
  return this.http.get<Alumno[]>(this.APIUrlJuegoDeGeocaching + '/' + juegoDeGeocaching + '/alumnos');
}

public DameInscripcionesAlumnoJuegoDeGeocaching(juegoDeGeocachingId: number): Observable<AlumnoJuegoDeGeocaching[]> {
  return this.http.get<AlumnoJuegoDeGeocaching[]>(this.APIUrlAlumnoJuegoDeGeocaching
                                                    + '?filter[where][juegoDeGeocachingId]=' + juegoDeGeocachingId);
}
public ModificaJuegoDeGeocaching(JuegosDeGeocaching: JuegoDeGeocaching,
  juegoDeGeocachingId: number, grupoId: number): Observable<JuegoDeGeocaching> {
return this.http.put<JuegoDeGeocaching>(this.APIUrlGrupos + '/' + grupoId + '/juegosDeGeocaching/' + juegoDeGeocachingId,
JuegosDeGeocaching);
}
}
