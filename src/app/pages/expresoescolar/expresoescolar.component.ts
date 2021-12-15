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
  pdfNombre: string;
  edit: false;
  eta = [];
  expresos: any;
  id_expreso: number;
  imagen = null;
  pdf: any;
  razon_social: string;
  documento: string;
  correo: string;
  imagenPerfil: any;
  changeFoto = false;
  telefono: any;
  vehiculo: string;
  placa: string;
  ano: string;
  conductor: string;
  modelo: string;
  imagenEdit = null;
  imagenPerfila = null;
  cedula: string;
  marca: string;
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
    ano: "",
    conductor: "",
    cedula: "",
    marca: "",
    edit: false,
    pdf: null
  };
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getExpresos();
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

  getExpresos() {
    this.auth.getExpresos().subscribe((resp: any) => {
      console.log(resp);
      this.expresos = resp;
    });
  }
  openImage(content, admin) {
    this.imagenPerfil = admin;
    this.modalService.open(content);
  }
  PDF(event: any) {
    const fileData = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.pdf = reader.result;
    };
    console.log("pdf base: ", this.pdf);
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
    console.log("expreso seleccionado: ", expreso);
    if (expreso) {
      this.id_expreso = expreso.ID;
      // this.id = casa.ID;
      this.imagenEdit = expreso.imagen;
      (this.razon_social = expreso.razon_social),
        (this.documento = expreso.ruc);
      this.correo = expreso.correo;
      this.telefono = expreso.telefono;
      this.vehiculo = expreso.vehiculo;
      this.placa = expreso.placa;
      this.ano = expreso.ano;
      this.conductor = expreso.conductor;
      this.cedula = expreso.cedula;
      this.expreso.edit = true;
      this.marca = expreso.marca;
      this.modelo = expreso.modelo;
      let splitUrl = expreso.pdf.split("/")
      this.pdfNombre = splitUrl[5]

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
      this.ano = "";
      this.conductor = "";
      this.cedula = "";
      this.marca = "";
      this.modelo = "";

    }
    this.modalService.open(content);
  }

  async gestionExpreso() {
    let response: any;
    if (this.expreso.edit) {
      if (this.imagenEdit.includes("https")) {
        // console.log("incluye htpps");
        this.imagenEdit = "";
      }

      const body = {
        conductor: this.conductor,
        razon_social: this.razon_social,
        cedula: this.cedula,
        imagen: this.imagenEdit,
        correo: this.correo,
        telefono: this.telefono,
        ano: this.ano,
        placa: this.placa,
        marca: this.marca,
        modelo: this.modelo,
        ruc: this.documento,
        tipo_usuario: "EXPRESO",
        pdf: this.pdf
      };
      JSON.stringify(body);
      console.log("cuerpo editar expreso: ", body);
      response = await this.auth.editExpreso(this.id_expreso, body);
    } else {
      const body = {
        conductor: this.conductor,
        razon_social: this.razon_social,
        cedula: this.cedula,
        imagen: this.imagen,
        correo: this.correo,
        telefono: this.telefono,
        ano: this.ano,
        placa: this.placa,
        marca: this.marca,
        modelo: this.modelo,
        ruc: this.documento,
        tipo_usuario: "EXPRESO",
        pdf: this.pdf
      };
      JSON.stringify(body);
      console.log("cuerpo crear expreso: ", body);
      response = await this.auth.createExpreso(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getExpresos();
      this.imagenEdit = null;
      this.imagenPerfila = null;
      this.imagen = null;
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
    const response = await this.auth.deleteExpreso(id);
    if (response) {
      this.getExpresos();
    }
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }

  obtenerNombrePdf(url: string) {
    let splitUrl = url.split("/")
    this.pdfNombre = splitUrl[-1]
    return this.pdfNombre
  }

}
