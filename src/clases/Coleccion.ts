//Se define la clase Coleccion junto a los atributos que le corresponden

export class Coleccion {
  Nombre: string;
  ImagenColeccion: string;
  id: number;
  profesorId: number;

  constructor(nombre?: string, imagenColeccion?: string) {

    this.Nombre = nombre;
    this.ImagenColeccion = imagenColeccion;
  }
}
