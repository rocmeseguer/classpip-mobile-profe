//Se define la clase EquipoJuedoDeColeccion junto a los atributos que le corresponden

export class EquipoJuegoDeColeccion {

  equipoId: number;
  juegoDeColeccionId: number;
  id: number;

  constructor(equipoId?: number, juegoDeColeccionId?: number) {

    this.equipoId = equipoId;
    this.juegoDeColeccionId = juegoDeColeccionId;

  }
}
