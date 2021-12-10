import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import _ from "lodash";

@Component({
  selector: "app-residente",
  templateUrl: "./residente.component.html",
  styleUrls: ["./residente.component.css"],
})
export class ResidenteComponent implements OnInit {
  residentes: UsuarioModelo[] = [];
  casas: UsuarioModelo[] = [];
  id_residente: 0;
  id_casa: 0;
  nombres: "";
  manzanaselector: [];
  casasselector: [];
  edit: false;
  telefono: "";
  pdf: any;
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
  changeFoto = false;
  is_principal: boolean;
  eta = [];
  autorizacion: boolean;
  manzana: any;
  id_villa: any;
  votacion: boolean;
  autorizacionTemp: boolean;
  autorizacionFija: boolean;
  id_urbanizacion: any;
  filterName = "";
  residente = {
    id_casa: 0,
    celular: "",
    id_residente: 0,
    nombres: "",
    edit: false,
    imagen: null,
    correo: "",
    telefono: "",
    usuario: "",
    cedula: "",
    contrasena: "",
    apellido: "",
    is_principal: false,
    autorizacion: false,
  };
  acceso = {
    accesos: "",
    id_residente: "",
  };

  menu = ["Residentes"];
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.id_urbanizacion = Number(localStorage.getItem("id_urbanizacion"));
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

  openAcceso(content, acceso) {
    this.acceso.id_residente = acceso.id_etapa;
    this.modalService.open(content);
  }
  preview(event: any) {
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagen = reader.result;
    };
    this.changeFoto = true;
  }

  // getManzana(value) {
  //   console.log("valor filtrar manzana principal: ", value);
  //   this.auth.getCasasByManzana(value).subscribe((resp: any) => {
  //     this.casasFiltro = resp;
  //     console.log("Casas filtradas: ", this.casas);
  //   });
  // }

  saveEditPicture(event: any) {
    // console.log("entró preview:");
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagenEdit = reader.result;
    };
    this.changeFoto = true;
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
      this.imagen = null;
      this.id_casa = residente.id_casa;
      this.manzana = residente.casa.manzana;
      this.is_principal = residente.is_principal;
      // this.id_casa = residente.id_casa;
      this.id_villa = residente.casa.villa;
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
      this.imagen = null;
      this.usuario = "";
      this.id_casa = 0;
      // this.is_principal = false;
      this.apellido = "";
      this.imagen = this.imagen;
    }
    this.modalService.open(content);
  }

  async gestionResidente() {
    let response: any;
    if (this.residente.edit) {
      const body = {
        is_principal: this.is_principal,
        autorizacion: this.autorizacion,
        cedula: this.cedula,
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          // imagen: this.imagenEdit,
          nombres: this.nombres,
          telefono: this.telefono,
          usuario: this.usuario,
        },
      };
      console.log("body editar residente: ", body);
      response = await this.auth.editResidente(this.id, body);
    } else {
      const body = {
        id_casa: this.id_casa,
        is_principal: this.is_principal,
        autorizacion: this.autorizacion,
        cedula: this.cedula,
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          nombres: this.nombres,
          telefono: this.telefono,
          usuario: this.usuario,
        },
      };
      console.log("body crear residente: ", body);

      response = await this.auth.createResidente(body);
    }
    if (response) {
      this.modalService.dismissAll();
      // this.getResidente();
      this.imagen = null;
      this.imagenPerfila = null;
      this.imagenEdit = null;
      // this.manzanaselector = [];
      // this.casasselector = [];
      this.id_casa = null;
      // this.getAdmin();
    }
    this.imagen = null;
    this.imagenPerfila = null;
    this.imagenEdit = null;
    // this.manzanaselector = [];
    // this.casasselector = [];
    this.id_casa = null;
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
}
