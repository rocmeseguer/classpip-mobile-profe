//Se define la clase Coleccion junto a los atributos que le corresponden

export class Escenario {
  Mapa: string;
  Descripcion: string;
  id: number;
  profesorId: number;

  constructor(mapa?: string, descripcion?: string) {

    this.Mapa = mapa;
    this.Descripcion = descripcion;
  }
}
