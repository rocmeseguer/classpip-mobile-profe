export class TablaAlumnoJuegoDeCompeticion {

  Posicion: number;
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Puntos: number;
  id: number;
  partidosTotales: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;

  constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string,
              puntos?: number, id?: number, partidosTotales?: number, partidosJugados?: number,
              partidosGanador?: number, partidosEmpatados?: number, partidosPerdidos?: number) {

    this.Posicion = posicion;
    this.Nombre = nombre;
    this.PrimerApellido = primerApellido;
    this.SegundoApellido = segundoApellido;
    this.Puntos = puntos;
    this.id = id;
    this.partidosTotales = partidosTotales;
    this.partidosJugados = partidosJugados;
    this.partidosGanados = partidosGanador;
    this.partidosEmpatados = partidosEmpatados;
    this.partidosPerdidos = partidosPerdidos;
  }
}
