import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@Component({
  selector: "app-votacion",
  templateUrl: "./votacion.component.html",
  styleUrls: ["./votacion.component.css"],
})
export class VotacionComponent implements OnInit {
  casas: UsuarioModelo[] = [];
  encuestas: UsuarioModelo[] = [];
  id_encuesta: 0;
  pregunta: "";
  fecha_vencimiento: "";
  edit: false;
  id: 0;
  opciones: any;
  changeFoto = false;
  eta = [];

  filterName = "";
  encuesta = {
    id_encuesta: 0,
    pregunta: "",
    fecha_vencimiento: "",
    edit: false,
    opciones: [{ opcion: "" }],
  };
  acceso = {
    accesos: "",
    id_encuesta: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getEncuesta();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  openAcceso(content, acceso) {
    this.acceso.id_encuesta = acceso.id_encuesta;
    this.modalService.open(content);
  }

  anadirOpcion() {
    if (this.encuesta.opciones.length < 4) {
      let opciones = [...this.encuesta.opciones];
      opciones.push({ opcion: "" });
      this.encuesta.opciones = opciones;
    }
  }

  openEncuesta(content, encuesta = null) {
    console.log("pregunta: ", encuesta.pregunta)
    if (!encuesta) {
      this.encuesta.id_encuesta = 0;
      this.encuesta.pregunta = "";
      this.encuesta.fecha_vencimiento = "";
      this.encuesta.edit = false;
      this.encuesta.opciones = [{ opcion: "" }];
      //this.id_encuesta = encuesta.ID;
      //this.id = encuesta.ID;
      //this.pregunta = encuesta.pregunta;
      //this.fecha_vencimiento = encuesta.fecha_vencimiento;
      //this.encuesta.edit = true;
      //this.opciones = encuesta.opciones
    } else {
      this.encuesta = encuesta;
      this.pregunta = encuesta.pregunta;
      this.encuesta.edit = true;
      // this.fecha_vencimiento = encuesta.fecha_vencimiento;
    }
    this.modalService.open(content);
  }
  getEncuesta() {
    this.auth.getEncuesta().subscribe((resp: any) => {
      console.log(resp);
      this.encuestas = resp;
    });
  }

  async gestionEncuesta() {
    let response: any;
    if (this.encuesta.edit) {
      const body = {
        pregunta: this.encuesta.pregunta,
        fecha_vencimiento: this.encuesta.fecha_vencimiento,
        opciones: this.encuesta.opciones,
      };
      JSON.stringify(body);
      response = await this.auth.editEncuesta(this.id, body);
    } else {
      const body = {
        pregunta: this.encuesta.pregunta,
        fecha_vencimiento: this.encuesta.fecha_vencimiento,
        opciones: this.encuesta.opciones,
      };
      JSON.stringify(body);
      response = await this.auth.createEncuesta(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getEncuesta();
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
        this.deleteEncuesta(id);
      }
    });
  }

  async deleteEncuesta(id: number) {
    const response = await this.auth.deleteEncuesta(id);
    if (response) {
      this.getEncuesta();
    }
  }
}
