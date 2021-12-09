import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
@Component({
  selector: "app-areasocial",
  templateUrl: "./areasocial.component.html",
  styleUrls: ["./areasocial.component.css"],
})
export class AreasocialComponent implements OnInit {
  areas: any;

  id_area: 0;
  nombre: "";
  edit: false;
  imagen = null;
  id: 0;
  tiempo_reservacion_minutos: string;
  seleccionCosto: string;
  changeFoto = false;
  hora_apertura: "";
  hora_cierre: "";
  precio: "";
  valor: number;
  imagenEdit = null;
  imagenPerfil = null;
  eta = [];
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
  ];
  filterName = "";
  area = {
    id_area: 0,
    nombre: "",
    hora_apertura: "",
    hora_cierre: "",
    precio: "",
    tiempo_reservacion_minutos: "",
    edit: false,
    imagen: null,
    opciones: [{ opcion: "" }],
  };
  acceso = {
    accesos: "",
    id_area: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAreaSocial();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  openAcceso(content, acceso) {
    this.acceso.id_area = acceso.id_area;
    this.modalService.open(content);
  }

  //anadirOpcion(){
  // if(this.area.opciones.length < 4){
  // let opciones= [...this.area.opciones]
  //opciones.push({opcion: ''})
  //this.area.opciones = opciones

  // }

  //}

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

  openArea(content, area = null) {
    console.log("content: ", content);
    console.log("area: ", area);
    if (area) {
      this.id_area = area.ID;
      this.id = area.ID;
      this.nombre = area.nombre;
      this.hora_apertura = area.hora_apertura;
      this.hora_cierre = area.hora_cierre;
      this.precio = area.precio;
      this.imagenEdit = area.imagen;
      this.area = area;
      this.area.edit = true;
      // this.tiempo_reservacion_minutos =
    } else {
      this.id_area = 0;
      this.nombre = "";
      this.hora_apertura = "";
      this.hora_cierre = "";
      this.precio = "";
      this.tiempo_reservacion_minutos = "";
    }
    this.modalService.open(content);
  }
  getAreaSocial() {
    this.auth.getAreaSocial().subscribe((resp: any) => {
      console.log(resp);
      this.areas = resp;
    });
  }

  async gestionArea() {
    let response: any;
    if (this.area.edit) {
      const body = {
        nombre: this.area.nombre,
        hora_apertura: this.area.hora_apertura,
        hora_cierre: this.area.hora_cierre,
        precio: parseInt(this.area.precio),
        imagen: this.imagenEdit,
      };

      response = await this.auth.editAreaSocial(this.id, body);
    } else {
      const body = {
        nombre: this.nombre,
        hora_apertura: this.hora_apertura,
        hora_cierre: this.hora_cierre,
        precio: parseInt(this.precio),
        imagen: this.imagen,
        tiempo_reservacion_minutos: this.tiempo_reservacion_minutos
      };
      console.log("body crear: ", body);
      response = await this.auth.createAreaSocial(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getAreaSocial();
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
        this.deleteAreaSocial(id);
      }
    });
  }

  async deleteAreaSocial(id: number) {
    const response = await this.auth.deleteAreaSocial(id);
    if (response) {
      this.getAreaSocial();
    }
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
}
