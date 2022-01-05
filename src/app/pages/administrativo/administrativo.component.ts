import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
@Component({
  selector: "app-administrativo",
  templateUrl: "./administrativo.component.html",
  styleUrls: ["./administrativo.component.css"],
})
export class AdministrativoComponent implements OnInit {
  admins: UsuarioModelo[] = [];
  id_adminis: 0;
  correo: "";
  nombre: "";
  edit: false;
  cedula: "";
  celular: "";
  telefono: "";
  accesos: "";
  id: 0;
  cargo: "";
  imagenPerfila: any;
  imagenPerfil = null;
  imagenEdit = null;
  imagen = null;
  changeFoto = false;
  imagenChange = null;
  eta = [];

  filterName = "";
  admin = {
    id_adminis: 0,
    cargo: "",
    correo: "",
    nombre: "",
    edit: false,
    cedula: "",
    celular: "",
    telefono: "",
    imagen: null,
  };
  acceso = {
    accesos: "",
    id_adminis: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAdministrativos();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }
  saveEditPicture(event: any) {
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
      this.imagenPerfil = reader.result;
    };
    this.changeFoto = true;
    console.log("imagen de perfil: ", this.imagenPerfil);
    console.log("imagen: ", this.imagen);
  }

  openAcceso(content, acceso) {
    this.acceso.id_adminis = acceso.id_adminis;
    this.modalService.open(content);
  }

  openAdmin(content, admin = null) {
    if (admin) {
      this.id_adminis = admin.id_adminis;
      this.id = admin.ID;
      this.correo = admin.correo;
      this.cedula = admin.cedula;
      this.nombre = admin.nombre;
      this.admin.edit = true;
      this.cargo = admin.cargo;
      this.celular = admin.celular;
      this.telefono = admin.telefono;
      this.imagenEdit = admin.imagen;
      console.log("admin.edit: ", admin.imagen);
    } else {
      this.id_adminis = 0;
      this.correo = "";
      this.nombre = "";
      this.cargo = "";
      this.cedula = "";
      this.admin.edit = false;
      this.telefono = "";
      this.celular = "";
      this.imagen = "";
      this.imagenEdit = "";
      this.imagenPerfil = "";
      this.imagenPerfila = "";
    }
    this.modalService.open(content);
  }
  getAdministrativos() {
    this.auth.getAdministrativos().subscribe((resp: any) => {
      console.log("administrativos: ", resp);
      this.admins = resp;
    });
  }

  openImage(content, admin) {
    this.imagenPerfil = admin;
    this.modalService.open(content);
  }

  async gestionAdmin() {
    let response: any;
    if (this.admin.edit) {
      const body = {
        nombre: this.nombre,
        correo: this.correo,
        telefono: this.telefono,
        cedula: this.cedula,
        cargo: this.cargo,
        celular: this.celular,
        imagen: this.imagenEdit,
      };
      // console.log("body imagen: ", body);
      JSON.stringify(body);
      console.log("body editar administrativo: ", body);
      response = await this.auth.editAdministrativos(this.id, body);
    } else {
      const body = {
        nombre: this.nombre,
        correo: this.correo,
        telefono: this.telefono,
        cedula: this.cedula,
        cargo: this.cargo,
        celular: this.celular,
        imagen: this.imagen,
      };
      JSON.stringify(body);
      // console.log("body crear administrativo: ", body);
      if(!body.imagen){
        Swal.fire({
          title: "Por favor ingrese una imagen",
          confirmButtonColor: "#343A40",
          confirmButtonText: "OK",
        })
      }else{
        response = await this.auth.createAdministrativos(body);
      }
    
    }
    if (response) {
      this.modalService.dismissAll();
      this.getAdministrativos();
      this.imagenPerfil = null;
      this.imagenPerfila = null;
      this.imagenEdit = null;
      this.imagen = null;
    }
    this.imagenPerfil = null;
    this.imagenPerfila = null;
    this.imagenEdit = null;
    this.imagen = null;
  }

  delete(id: number) {
    Swal.fire({
      title: "¿Seguro que desea eliminar este registro?",

      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.deleteAdministrativos(id);
      }
    });
  }

  async deleteAdministrativos(id: number) {
    const response = await this.auth.deleteAdministrativos(id);
    if (response) {
      this.getAdministrativos();
    }
  }
}
