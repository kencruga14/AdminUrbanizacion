import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@Component({
  selector: "app-admingarita",
  templateUrl: "./admingarita.component.html",
  styleUrls: ["./admingarita.component.css"],
})
export class AdmingaritaComponent implements OnInit {
  admins: UsuarioModelo[] = [];
  id_admin: 0;
  nombres: "";
  telefono: "";
  usuario: "";
  celular: "";
  contrasena: "";
  imagen = null;
  imagenEdit = null;
  imagenPerfil = null;
  ss;
  correo: "";
  edit: false;
  id: 0;
  eta = [];
  changeFoto = false;

  filterName = "";
  adming = {
    id_admin: 0,
    nombres: "",
    imagen: null,
    telefono: "",
    usuario: "",
    celular: "",
    contrasena: "",
    correo: "",
    edit: false,
  };
  acceso = {
    accesos: "",
    id_admin: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAdmin();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  getAdmin() {
    this.auth.getAdmin().subscribe((resp: any) => {
      this.admins = resp;
      console.log("admins: ", resp);
    });
  }

  openAcceso(content, acceso) {
    this.acceso.id_admin = acceso.id_admin;
    this.modalService.open(content);
  }

  openAdmin(content, adming = null) {
    console.log("user selccionado: ", adming);
    if (adming) {
      this.id_admin = adming.ID;
      this.id = adming.ID;
      this.contrasena = adming.usuario.contrasena;
      this.nombres = adming.usuario.nombres;
      this.usuario = adming.usuario.usuario;
      this.correo = adming.usuario.correo;
      this.telefono = adming.usuario.telefono;
      this.celular = adming.usuario.celular;
      this.imagenEdit = adming.usuario.imagen;
      this.adming.edit = true;
    } else {
      this.id_admin = 0;
      this.telefono = "";
      this.celular = "";
      this.imagen = null;
      this.usuario = "";
      this.nombres = "";
      this.correo = "";
      this.contrasena = "";
      this.adming.edit = false;
      this.imagen = this.imagen;
    }
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

  openImage(content, admin) {
    this.imagenPerfil = admin;
    this.modalService.open(content);
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

  async gestionAdmin() {
    let response: any;
    if (this.adming.edit) {
      const body = {
        usuario: {
          nombres: this.nombres,
          telefono: this.telefono,
          celular: this.celular,
          usuario: this.usuario,
          correo: this.correo,
          imagen: this.imagenEdit,
          contrasena: this.contrasena,
        },
      };
      JSON.stringify(body);
      response = await this.auth.editAdminGarita(this.id, body);
    } else {
      const body = {
        usuario: {
          nombres: this.nombres,
          telefono: this.telefono,
          celular: this.celular,
          usuario: this.usuario,
          correo: this.correo,
          imagen: this.imagen,
          contrasena: this.contrasena,
        },
      };
      JSON.stringify(body);
      response = await this.auth.createAdminGarita(body);
    }
    if (response) {
      this.modalService.dismissAll();
      // this.getAdmin();
      this.imagen = null;
      this.imagenPerfil = null;
      this.imagenEdit = null;
      // this.getAdmin();
    }
    this.imagen = null;
    this.imagenPerfil = null;
    this.imagenEdit = null;
    this.getAdmin();
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
        this.deleteAdmin(id);
      }
    });
  }

  async deleteAdmin(id: number) {
    const response = await this.auth.deleteAdminGarita(id);
    if (response) {
      this.getAdmin();
    }
  }
}
