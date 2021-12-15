import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import _ from "lodash";
import * as moment from "moment";

@Component({
  selector: "app-residente",
  templateUrl: "./residente.component.html",
  styleUrls: ["./residente.component.css"],
})
export class ResidenteComponent implements OnInit {
  residentes: any;
  casas: UsuarioModelo[] = [];
  id_residente: 0;
  id_casa: 0;
  nombres: "";
  manzanaselector: [];
  casasselector: any;
  edit: false;
  telefono: "";
  documento: any;
  fechanacimiento: any;
  imagen = null;
  id: 0;
  imagenPerfila: any;
  imagenPerfil: any;
  correo: "";
  celular: "";
  usuario: "";
  cedula: "";
  apellido: "";
  contrasena: "";
  imagenEdit = null;
  es: any;
  changeFoto = false;
  is_principal: Boolean;
  eta = [];
  autorizacion: Boolean;
  manzana: any;
  id_villa: any;
  votacion: boolean;
  fechaMaxima = new Date();
  autorizacionTemp: boolean;
  autorizacionFija: boolean;
  id_urbanizacion: any;
  filterName = "";
  accion: Boolean;
  pdfEdit = null;
  villa: number = 0;
  residente = {
    id_casa: 0,
    celular: "",
    id_residente: 0,
    nombres: "",
    edit: false,
    imagen: null,
    correo: "",
    telefono: "",
    villa: "",
    manzana: "",
    documento: "",
    usuario: "",
    cedula: "",
    fechanacimiento: "",
    contrasena: "",
    apellido: "",
    is_principal: "",
    autorizacion: "",
    accion: "",
  };
  acceso = {
    accesos: "",
    id_residente: "",
  };
  editing = false;

  menu = ["Residentes"];
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.id_urbanizacion = Number(localStorage.getItem("id_urbanizacion"));
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ],
      monthNamesShort: [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ],
      today: "Hoy",
      clear: "Borrar",
    };
  }

  ngOnInit() {
    this.getResidente();
    this.getCasa();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  getResidente() {
    this.auth.getResidente().subscribe((resp: any) => {
      this.residentes = resp;
      console.log("residentes: ", this.residentes);
    });
  }
  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      console.log("casas: ", resp);
      this.casas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
      console.log("Manzana selector: ", this.manzanaselector);
    });
  }

  getVillas(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      console.log("getCasasByManzana: ", resp);
      this.casasselector = resp;
      // this.c = _.uniqBy(resp, (obj) => obj.manzana);
      // console.log("Manzana selector: ", this.casasselector);
    });
  }

  getVillass(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      console.log("getCasasByManzana: ", resp);
      this.casasselector = resp;
      this.accion = true;
      console.log("accion: ", this.accion);
    });
  }

  openAcceso(content, acceso) {
    this.acceso.id_residente = acceso.id_etapa;
    this.modalService.open(content);
  }

  PDF(event: any) {
    const fileData = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.documento = reader.result;
    };
    console.log("pdf base: ", this.documento);
  }

  PDFEDIT(event: any) {
    const fileData = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.pdfEdit = reader.result;
    };
    console.log("pdf base: ", this.documento);
  }

  openImage(content, admin) {
    this.imagenPerfil = admin;
    this.modalService.open(content);
  }

  openResidente(content, residente = null) {
    if (residente) {
      this.id_residente = residente.ID;
      this.id = residente.ID;
      this.celular = residente.usuario.celular;
      this.contrasena = residente.contrasena;
      this.cedula = residente.cedula;
      this.correo = residente.usuario.correo;
      this.nombres = residente.usuario.nombres;
      this.residente.edit = true;
      this.telefono = residente.usuario.telefono;
      this.usuario = residente.usuario.usuario;
      this.fechanacimiento = new Date(residente.fecha_nacimiento);
      this.imagen = null;
      this.id_casa = residente.id_casa;
      this.manzana = residente.casa.manzana;
      this.is_principal = residente.is_principal;
      // this.pdf = residente.usuario.pdf
      // this.id_casa = residente.id_casa;
      this.villa = residente.casa.villa;
      this.apellido = residente.usuario.apellido;
      this.imagenEdit = residente.usuario.imagen;
      this.autorizacion = residente.autorizacion;
    } else {
      this.id_residente = 0;
      this.correo = "";
      this.contrasena = "";
      this.cedula = "";
      this.celular = "";
      this.nombres = "";
      this.residente.edit = false;
      this.telefono = "";
      this.is_principal = new Boolean();
      this.autorizacion = new Boolean();
      this.imagen = null;
      this.fechanacimiento = "";
      this.usuario = "";
      this.manzana = "";
      this.villa = 0;
      this.documento = "";
      this.id_casa = 0;
      this.accion = false;
      // this.is_principal = false;
      this.apellido = "";
      this.imagen = this.imagen;
    }
    this.modalService.open(content);
  }

  async gestionResidente() {
    console.log("objeto villa: ", this.villa);
    let response: any;
    if (this.residente.edit) {
      const body = {
        id_casa: this.id_casa,
        is_principal: this.is_principal,
        autorizacion: this.autorizacion,
        cedula: this.cedula,
        fecha_nacimiento: moment(this.fechanacimiento).format(),
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          nombres: this.nombres,
          telefono: this.telefono,
          usuario: this.usuario,
          // pdf: this.pdf
          // documeto: this.pdfEdit,
        },
        documento: this.documento
      };
      console.log("body editar residente: ", body);
      response = await this.auth.editResidente(this.id, body);
      this.villa = 0
    } else {
      const body = {
        id_casa: this.villa,
        is_principal: this.is_principal,
        autorizacion: this.autorizacion,
        cedula: this.cedula,
        fecha_nacimiento: moment(this.fechanacimiento).format(),
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          nombres: this.nombres,
          telefono: this.telefono,
          usuario: this.usuario,
          // pdf: this.pdf
          // documento: this.pdf,
        },
        documento: this.documento

      };
      console.log("body crear residente: ", body);
      response = await this.auth.createResidente(body);
      this.villa = 0
    }
    if (response) {
      this.modalService.dismissAll();
      this.imagen = null;
      this.imagenPerfila = null;
      this.imagenEdit = null;
      this.id_casa = null;
      this.fechanacimiento = null;
      this.pdfEdit = null;
      this.documento = null;
    }
    this.imagen = null;
    this.imagenPerfila = null;
    this.imagenEdit = null;
    this.id_casa = null;
    this.fechanacimiento = null;
    this.pdfEdit = null;
    this.documento = null;
    this.accion = false;
    this.getResidente();
  }

  delete(id: number) {
    Swal.fire({
      title: "¿Seguro que desea eliminar este registro?",
      text: "Esta acción no se puede reversar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.deleteResidente(id);
      }
    });
  }

  async deleteResidente(id: number) {
    const response = await this.auth.deleteResidente(id);
    if (response) {
      this.getResidente();
    }
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
