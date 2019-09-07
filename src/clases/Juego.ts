//Se define la clase Juego junto a los atributos que le corresponden

export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;

  coleccionId: number;

  TipoDeCompeticion: string;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean, TipoDeCompeticion?: string) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.TipoDeCompeticion = TipoDeCompeticion;
  }
}
