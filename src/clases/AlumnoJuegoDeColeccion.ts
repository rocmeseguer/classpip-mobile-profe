//Se define la clase AlumnoJuegoDeColeccion junto a los atributos que le corresponden

export class AlumnoJuegoDeColeccion {

  alumnoId: number;
  juegoDeColeccionId: number;
  id: number;

  constructor(alumnoId?: number, juegoDePuntosId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeColeccionId = juegoDePuntosId;

  }
}
