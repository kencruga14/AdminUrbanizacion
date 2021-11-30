import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: "app-expresoescolar",
  templateUrl: "./expresoescolar.component.html",
  styleUrls: ["./expresoescolar.component.css"],
})
export class ExpresoescolarComponent implements OnInit {
  edit: false;
  eta = [];
  expresos: any;
  id_expreso: number;
  imagen = null;
  razon_social: string;
  documento: string;
  correo: string;
  changeFoto = false;
  telefono: any;
  vehiculo: string;
  placa: string;
  year: string;
  conductor: string;
  imagenEdit = null;
  imagenPerfila = null;
  cedula: string;
  filterName = "";
  acceso = {
    accesos: "",
    id_casa: "",
  };
  expreso = {
    ID: 0,
    imagen: null,
    razon_social: "",
    documento: "",
    correo: "",
    telefono: "",
    vehiculo: "",
    placa: "",
    year: "",
    conductor: "",
    cedula: "",
    edit: false,
  };
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

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

  openAcceso(content, acceso) {
    this.acceso.id_casa = acceso.id_casa;
    this.modalService.open(content);
  }

  openExpreso(content, expreso = null) {
    if (expreso) {
      this.id_expreso = expreso.ID;
      // this.id = casa.ID;
      this.imagenEdit = expreso.imagen;
      (this.razon_social = expreso.razon_social),
        (this.documento = expreso.documento);
      this.correo = expreso.correo;
      this.telefono = expreso.telefono;
      this.vehiculo = expreso.vehiculo;
      this.placa = expreso.placa;
      this.year = expreso.year;
      this.conductor = expreso.conductor;
      this.cedula = expreso.cedula;
      this.expreso.edit = true;
    } else {
      this.id_expreso = 0;
      this.imagen = null;
      this.razon_social = "";
      this.expreso.edit = false;
      this.documento = "";
      this.correo = "";
      this.telefono = "";
      this.vehiculo = "";
      this.placa = "";
      this.year = "";
      this.conductor = "";
      this.cedula = "";
    }
    this.modalService.open(content);
  }

  async gestionExpreso() {
    let response: any;
    if (this.expreso.edit) {
      const body = {
        imagen: this.imagenEdit,
        razon_social: this.razon_social,
        documento: this.documento,
        correo: this.correo,
        telefono: this.telefono,
        vehiculo: this.vehiculo,
        placa: this.placa,
        year: this.year,
        conductor: this.conductor,
        cedula: this.cedula,
      };
      JSON.stringify(body);
      console.log("cuerpo editar expreso: ", body);
      // response = await this.auth.editCasa(this.id, body);
    } else {
      const body = {
        imagen: this.imagen,
        razon_social: this.razon_social,
        documento: this.documento,
        correo: this.correo,
        telefono: this.telefono,
        vehiculo: this.vehiculo,
        placa: this.placa,
        year: this.year,
        conductor: this.conductor,
        cedula: this.cedula,
      };
      JSON.stringify(body);
      console.log("cuerpo crear expreso: ", body);
      // response = await this.auth.createCasa(body);
    }
    if (response) {
      this.modalService.dismissAll();
      // this.getCasa();
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
        this.deleteExpreso(id);
      }
    });
  }

  async deleteExpreso(id: number) {
    const response = await this.auth.deleteCasa(id);
    if (response) {
      // this.getCasa();
    }
  }
}
