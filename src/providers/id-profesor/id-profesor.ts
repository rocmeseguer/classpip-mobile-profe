import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()

//IdProfesorProvider es una clase que se deberá exportar para así poder introducir y adquirir
//el idProfe

export class IdProfesorProvider {

  idProfesor = new Subject;

  constructor(public http: HttpClient) {
    console.log('Accediendo al proveedor idProfesor');
  }

//Entrará como input un número de identificación del profesor y este será introducido en el
//proveedor para poder utilizarlo en el menu lateral de la aplicación

  idProfesorSeleccionado (idProfe:number){
    this.idProfesor.next(idProfe);
  }


}
