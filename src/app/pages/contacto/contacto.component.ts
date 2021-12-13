import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@Component({
  selector: "app-contacto",
  templateUrl: "./contacto.component.html",
  styleUrls: ["./contacto.component.css"],
})
export class ContactoComponent implements OnInit {
  contactos: UsuarioModelo[] = [];
  id_contacto: 0;
  contacto: "";
  telefono: "";
  edit: false;
  imagen = null;
  id: 0;
  changeFoto = false;
  horario: "";
  horario_apertura: "";
  horario_cierre: "";
  eta = [];
  imagenPerfil: any;
  horas = [
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
  ]
  filterName = "";
  contact = {
    id_contacto: 0,
    contacto: "",
    telefono: "",
    edit: false,
    horario: "",
    horario_apertura: "",
    horario_cierre: "",
    imagen: null,
  };
  acceso = {
    accesos: "",
    id_contacto: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getContacto();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }
  openImage(admin) {
    // console.log("admin seleccionado: ", admin);
    this.imagenPerfil = admin;
    // console.log("imagen perfil: ", this.imagenPerfil);
    // this.modalService.open(content);
  }
  getContacto() {
    this.auth.getContacto().subscribe((resp: any) => {
      console.log(resp);
      this.contactos = resp;
    });
  }

  openAcceso(content, acceso) {
    this.acceso.id_contacto = acceso.id_contacto;
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

  openContacto(content, contact = null) {
    if (contact) {
      this.id_contacto = contact.ID;
      this.id = contact.ID;
      this.contacto = contact.contacto;
      this.telefono = contact.telefono;
      this.horario = contact.horario;
      this.contact.edit = true;
      this.imagen = null;
    } else {
      this.id_contacto = 0;
      this.telefono = "";
      this.horario = "";
      this.contact.edit = false;
      this.imagen = null;
    }
    this.modalService.open(content);
  }

  async gestionContacto() {
    let response: any;
    if (this.contact.edit) {
      const body = {
        contacto: this.contacto,
        telefono: this.telefono,
        horario: this.horario,
        imagen: this.imagen,
      };
      JSON.stringify(body);
      response = await this.auth.editContacto(this.id, body);
    } else {
      const body = {
        contacto: this.contacto,
        telefono: this.telefono,
        horario: this.horario,
        imagen: this.imagen,
      };
      JSON.stringify(body);
      response = await this.auth.createContacto(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getContacto();
    }
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
        this.deleteContacto(id);
      }
    });
  }

  async deleteContacto(id: number) {
    const response = await this.auth.deleteContacto(id);
    if (response) {
      this.getContacto();
    }
  }
}
