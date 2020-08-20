export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;
  NumeroTotalJornadas: number;
  coleccionId: number;
  TipoJuegoCompeticion: string;
  NumeroParticipantesPuntuan: number;
  Puntos: number[];
  NombreJuego: string;
  PuntuacionCorrecta: number;
  PuntuacionIncorrecta: number;
  PuntuacionCorrectaBonus: number;
  PuntuacionIncorrectaBonus: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  idescenario: number;
  profesorId: number;
  JuegoTerminado: boolean;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean,
              NumeroTotalJornadas?: number, TipoJuegoCompeticion?: string, NumeroParticipantesPuntuan?: number,
              Puntos?: number[], NombreJuego?: string, PuntuacionCorrecta?: number, PuntuacionIncorrecta?: number, PuntuacionCorrectaBonus?: number, PuntuacionIncorrectaBonus?: number,
              PreguntasBasicas?: number[], PreguntasBonus?: number[], idescenario?: number, profesorId?: number, JuegoTerminado?: boolean) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.NumeroTotalJornadas = NumeroTotalJornadas;
    this.TipoJuegoCompeticion = TipoJuegoCompeticion;
    this.NumeroParticipantesPuntuan = NumeroParticipantesPuntuan;
    this.Puntos = Puntos;
    this.NombreJuego = NombreJuego;
    this.PuntuacionCorrecta = PuntuacionCorrecta;
    this.PuntuacionIncorrecta = PuntuacionIncorrecta;
    this.PuntuacionCorrectaBonus = PuntuacionCorrectaBonus;
    this.PuntuacionIncorrectaBonus = PuntuacionIncorrectaBonus;
    this.PreguntasBasicas = PreguntasBasicas;
    this.PreguntasBonus = PreguntasBonus;
    this.idescenario = idescenario;
    this.profesorId = profesorId;
    this.JuegoTerminado = JuegoTerminado;
  }
}

