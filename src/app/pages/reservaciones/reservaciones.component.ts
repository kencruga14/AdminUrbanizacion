import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import _ from "lodash";
@Component({
  selector: "app-reservaciones",
  templateUrl: "./reservaciones.component.html",
  styleUrls: ["./reservaciones.component.css"],
})
export class ReservacionesComponent implements OnInit {
  casas: UsuarioModelo[] = [];
  estados: any = {}
  filtroManzana: number = 0;
  filtroAutorizacion: string = "";
  paramMz: number;
  paramVilla: number;
  filtrovilla: number = 0;
  filtroEstado: string = "";
  manzanas: any;
  casasselector: any;
  manzanaselector: any;
  id: 0;
  eta = [];
  tipoAutorizacionFija: string = "";
  filterName = "";
  acceso = {
    accesos: "",
    id_alicuota: "",
  };
  // años = [];
  autorizaciones = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getAutorizaciones();
    this.getCasa();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  getVillas(value) {
    this.filtroAutorizacion = ""
    this.filtroEstado = ""
    this.tipoAutorizacionFija = ""
    this.filtrovilla = 0;
    this.paramMz = value;
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      this.casasselector = resp;
      console.log("casas x manzana: ", this.casasselector);
    });
    this.filtrovilla = 0;
  }

  filtrarVilla(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      this.casas = resp;
    });
  }

  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      this.casas = resp;
      this.manzanas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
      console.log("numeros de casas: ", this.casas.length);
    });
  }

  getAutorizacions() {
    this.auth.getAutorizacion().subscribe((resp: any) => {
      this.autorizaciones = resp;
    });
  }

  getEstado(value) {
    // this.filtroAutorizacion=""
    // this.filtroEstado=""
    // this.tipoAutorizacionFija=""
    if (this.filtroAutorizacion == "TEMPORAL") {
      this.estados = [
        {
          texto: "Anulada",
          value: "ANULADA"
        },
        {
          texto: "Validada",
          value: "VALIDADA"
        },
        {
          texto: "Pendiente",
          value: "PENDIENTE"
        }
      ]
    } else {
      this.estados = [
        {
          texto: "Activa",
          value: "ACTIVA"
        },
        {
          texto: "Anulada",
          value: "ANULADA"
        }
      ]
    }
    this.paramVilla = value;
    console.log("casa: ", value);
    this.getAutorizaciones(
      this.tipoAutorizacionFija,
      this.filtroAutorizacion,
      this.filtroEstado,
      this.filtrovilla
    );
  }





  async getAutorizaciones(
    tipoFija = null,
    tipo = null,
    estado = null,
    id_casa = null
  ) {
    if (id_casa == 0) id_casa = null;
    const response = await this.auth.getAutorizaciones(
      tipoFija,
      tipo,
      estado,
      id_casa
    );
    if (response[1]) {
      this.autorizaciones = response[1];
    }
  }

  restablecerFiltroBusqueda() {
    this.filtroAutorizacion = "";
    this.filtroEstado = "";
    this.filtrovilla = 0;
    this.filtroManzana = 0;
    this.paramMz = null;
    this.paramVilla = null;
    this.tipoAutorizacionFija = null;
    this.getAutorizacions();
  }
}
