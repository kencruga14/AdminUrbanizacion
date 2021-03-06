import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";
import _ from "lodash";
import * as moment from "moment";

@Component({
  selector: "app-listabitacora",
  templateUrl: "./listabitacora.component.html",
  styleUrls: ["./listabitacora.component.css"],
})
export class ListabitacoraComponent implements OnInit {
  bitacoras: UsuarioModelo[] = [];
  id_visita: 0;
  filtroTipo: any = "";
  casas: any;
  casasselector: any;
  manzanaselector: any;
  cedula: "";
  imagenPerfil: any;
  buscadorVilla = null;
  buscadorManazana = null;
  id_manzana: 0;
  id_villa: 0;
  visitasFiltradas: any;
  nombres: "";
  buscadorFecha: null;
  buscadorFechaglobal: any;
  edit: false;
  motivo: "";
  placa: "";
  accesos: "";
  guardia: "";
  id: 0;
  fechasfilter: any;
  eta = [];
  fecha: any;
  filterName = "";
  visita = {
    id_visita: 0,
    cedula: "",
    nombres: "",
    edit: false,
    motivo: "",
    placa: "",
    id_casa: 0,
    guardia: "",
    imagen: null,
  };

  menu = [];
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getBitacora();
    this.getCasa();
    this.buscadorVilla = ""
    this.buscadorManazana = ""
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  getBitacora() {
    this.auth.getBitacoraById().subscribe((resp: any) => {
      // console.log(resp);
      this.bitacoras = resp;
    });
  }

  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      // console.log("casas: ", resp);
      this.casas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
      // console.log("Manzana selector: ", this.manzanaselector);
    });
  }

  getVillas(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      this.casasselector = resp;
      this.buscadorManazana = value;
      this.getvivistasfilter(value);
      this.buscadorVilla = "";
      this.buscadorFecha = null;
      this.filtroTipo = ""
    });
  }

  getvivistasfilter(manzana) {
    this.auth.visitasByFilter(manzana).subscribe((resp: any) => {
      this.bitacoras = resp;
      // console.log("visitas por filtro manzana: ", this.bitacoras);
    });
  }

  getvivistasfilterMzVilla(manzana, villa) {
    this.auth.visitasByFilterMzVillas(manzana, villa).subscribe((resp: any) => {
      this.bitacoras = resp;
      this.fechasfilter = _.uniqBy(resp, (obj) => obj.dia_creacion);
      console.log("visitas por filtro villa: ", this.bitacoras);
    });
  }

  openImage(admin) {
    console.log("admin seleccionado: ", admin);
    this.imagenPerfil = admin;
    console.log("imagen perfil: ", this.imagenPerfil);
    // this.modalService.open(content);
  }

  getFecha(value) {
    this.filtroTipo = ""
    this.buscadorVilla = value;
    this.getvivistasfilterMzVilla(this.buscadorManazana, value);
    console.log("casa seleccionada: ", value);
  }

  filterfecha(value) {
    console.log("fecha escogida: ", value);
    this.getvivistasfilterMzVillaDate(
      this.buscadorManazana,
      this.buscadorVilla,
      value
    );
  }

  getvivistasfilterMzVillaEstado(manzana, villa) {
    this.auth
      .visitasByFilterMzVillasDate(this.buscadorManazana, this.buscadorVilla, this.fecha, this.filtroTipo)
      .subscribe((resp: any) => {
        this.bitacoras = resp;
        console.log("visitas por filtro estado ", this.bitacoras);
      });
  }

  getvivistasfilterMzVillaDate(manzana, villa, fecha) {
    fecha = moment(fecha).format();
    console.log("fecha: format ", fecha);
    this.auth
      .visitasByFilterMzVillasDate(manzana, villa, fecha, this.filtroTipo)
      .subscribe((resp: any) => {
        this.bitacoras = resp;
        console.log("visitas por filtro fecha: ", this.bitacoras);
      });
  }




  buscadorfechaGlobal(value) {
    let fecha = moment(value).format();
    console.log("valor fecha: ", fecha);
    this.auth.filterBitacoraFecha(fecha).subscribe((resp: any) => {
      this.bitacoras = resp;
      console.log("visitas por filtro fecha global: ", this.bitacoras);
    });
  }
  restablecerFiltroBusqueda() {
    this.buscadorFecha = null;
    this.buscadorVilla = "";
    this.buscadorManazana = "";
    this.filtroTipo = "";
    this.bitacoras = [];
    this.casasselector = [];
    this.buscadorFechaglobal = null;
    this.getBitacora();
  }
}
