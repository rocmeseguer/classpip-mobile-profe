//Se define la clase AlbumDelAlumno junto a los atributos que le corresponden

export class AlbumDelAlumno {
  Nombre: string;
  Imagen: string;
  Probabilidad: string;
  Nivel: string;
  id: number;
  coleccionId: number;
  Tengi: boolean

  constructor(nombre?: string, imagen?: string, probabilidad?: string, nivel?: string, tengi?: boolean) {

    this.Nombre = nombre;
    this.Imagen = imagen;
    this.Probabilidad = probabilidad;
    this.Nivel = nivel;
    this.Tengi = tengi;
  }
}
