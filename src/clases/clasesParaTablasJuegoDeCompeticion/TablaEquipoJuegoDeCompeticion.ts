export class TablaEquipoJuegoDeCompeticion {

  Posicion: number;
  Nombre: string;
  Puntos: number;
  id: number;
  partidosTotales: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;


  constructor(posicion?: number, nombre?: string, puntos?: number, id?: number, partidosTotales?: number,
              partidosJugados?: number, partidosGanador?: number, partidosEmpatados?: number, partidosPerdidos?: number) {

    this.Posicion = posicion;
    this.Nombre = nombre;
    this.Puntos = puntos;
    this.id = id;
    this.partidosTotales = partidosTotales;
    this.partidosJugados = partidosJugados;
    this.partidosGanados = partidosGanador;
    this.partidosEmpatados = partidosEmpatados;
    this.partidosPerdidos = partidosPerdidos;
  }
}
