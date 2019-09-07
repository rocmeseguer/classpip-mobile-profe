//Se define la clase PUNTO junto a los atributos que le corresponden

export class Punto {
  Nombre: string;
  Descripcion: string;
  id: number;
  profesorId: number;

  constructor(nombre?: string, descripcion?: string) {

    this.Nombre = nombre;
    this.Descripcion = descripcion;
  }

}
