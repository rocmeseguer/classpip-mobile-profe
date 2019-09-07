//Se define la clase TablaAlumnoJuegoDeColeccion junto a los atributos que le corresponden

export class TablaAlumnoJuegoDeColeccion {

  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  count: number;
  id: number;

  constructor(nombre?: string, primerApellido?: string, segundoApellido?: string, count?: number, id?: number) {

    this.nombre = nombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.count = count;
    this.id = id;
  }
}
