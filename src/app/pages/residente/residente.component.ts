import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
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
  edit: false;
  telefono: "";
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
      console.log(resp);
      this.casas = resp;
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
      this.manzana = residente.casa.villa;
      this.is_principal = residente.is_principal;
      // this.id_casa = residente.id_casa;
      this.id_villa = residente.casa.villa;
      this.apellido = residente.usuario.apellido;
      this.imagenEdit = residente.usuario.imagen;
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
      this.is_principal = false;
      this.apellido = "";
      this.imagen = this.imagen;
    }
    this.modalService.open(content);
  }

  async gestionResidente() {
    let response: any;
    if (this.residente.edit) {
      const body = {
        // id_casa: this.id_casa,
        is_principal: this.is_principal,
        cedula: this.cedula,
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          // imagen: this.imagenEdit,
          nombres: this.nombres,
          telefono: this.telefono,
          usuario: this.usuario,
          // contrasena : this.contrasena,
        },
      };
      console.log("body editar residente: ", body);
      response = await this.auth.editResidente(this.id, body);
    } else {
      const body = {
        id_casa: this.id_casa,
        is_principal: this.is_principal,
        cedula: this.cedula,
        usuario: {
          apellido: this.apellido,
          celular: this.celular,
          correo: this.correo,
          // imagen: this.imagen,
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
      // this.getAdmin();
    }
    this.imagen = null;
    this.imagenPerfila = null;
    this.imagenEdit = null;
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
