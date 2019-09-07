//Se define la clase TablaHistorialPuntosEquipo junto a los atributos que le corresponden

export class TablaHistorialPuntosEquipo {


  nombre: string;
  descripcion: string;
  valorPunto: number;
  equipoJuegoDePuntosId: number;
  historialId: number;
  puntoId: number;

  constructor(nombre?: string, descripcion?: string, valorPunto?: number, equipoJuegoDePuntosId?: number, historialId?: number, puntoId?: number) {

    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valorPunto = valorPunto;
    this.equipoJuegoDePuntosId = equipoJuegoDePuntosId;
    this.historialId = historialId;
    this.puntoId = puntoId;
  }
}
