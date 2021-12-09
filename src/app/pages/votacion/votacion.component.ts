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
  // selectedFiles: FileList;
  pregunta: "";
  fecha_vencimiento: "";
  edit: false;
  id: 0;
  images = [];
  opciones: any;
  changeFoto = false;
  previews: string[] = [];
  eta = [];
  imagenPerfila: any;
  imagenEdit = null;
  imagen = null;
  imagenes: any[] = [];
  selectedFiles?: FileList;
  carrusels: any;
  encuestaSeleccionada: any;
  filterName = "";
  encuesta = {
    id_encuesta: 0,
    pregunta: "",
    fecha_vencimiento: "",
    edit: false,
    opciones: [{ opcion: "" }],
    imagenes: [],
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

  // anadirOpcion() {
  //   if (this.encuesta.opciones.length < 4) {
  //     let opciones = [...this.encuesta.opciones];
  //     opciones.push({ opcion: "" });
  //     this.encuesta.opciones = opciones;
  //   }
  // }

  openEncuesta(content, encuesta = null) {
    console.log("pregunta: ", encuesta);
    if (!encuesta) {
      this.encuesta.id_encuesta = 0;
      this.encuesta.pregunta = "";
      this.encuesta.fecha_vencimiento = "";
      this.imagen = null;
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
      // this.imagenEdit = encuesta.imagen;
      // this.fecha_vencimiento = encuesta.fecha_vencimiento;
    }
    this.modalService.open(content);
  }

  openResultado(content, encuesta) {
    let Id_Encuesta = encuesta.ID;
    console.log("encuesta seleccionada: ", encuesta.ID);
    this.auth.getEncuestaById(Id_Encuesta).subscribe((resp: any) => {
      this.encuestaSeleccionada = resp;
      console.log("encuesta seleccionada: ", this.encuestaSeleccionada);
    });
    this.modalService.open(content);
  }

  openCarrusel(content, encuesta) {
    let Id_Encuesta = encuesta.ID;
    // console.log("encuesta seleccionada: ", encuesta.ID);
    this.auth.getEncuestaById(Id_Encuesta).subscribe((resp: any) => {
      this.carrusels = resp;
      console.log("  this.carrusel: ", this.carrusels);
    });
    this.modalService.open(content);
  }

  getEncuesta() {
    this.auth.getEncuesta().subscribe((resp: any) => {
      console.log(resp);
      this.encuestas = resp;
    });
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

  preview(event: any) {
    console.log("valor evento: ", event);
    // let array = event.target.files.length;
    for (let i = 0; i < event.target.files.length; i++) {
      const fileData = event.target.files[i];
      const mimeType = fileData[i].type;
      // if (mimeType[i].match(/image\/*/) == null) {
      //   return;
      // }
      const reader = new FileReader();
      reader[i].readAsDataURL(fileData[i]);
      reader.onload = (response) => {
        this.imagenes.push(reader.result);
        // this.imagen = ;
        // this.imagenPerfila = reader.result;
      };
    }
    this.changeFoto = true;
    console.log("Array de iamgenes: ", this.imagenes);
  }

  onFileChange(e) {
    if (e.target.files) {
      var filesAmount = e.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.images.push(events.target.result);
        };
      }
    }
  }

  anadirOpcion() {
    if (this.encuesta.opciones.length < 4) {
      let opciones = [...this.encuesta.opciones];
      opciones.push({ opcion: "" });
      this.encuesta.opciones = opciones;
    }
  }
  async gestionEncuesta() {
    let response: any;
    if (this.encuesta.edit) {
      const body = {
        pregunta: this.encuesta.pregunta,
        imagen: this.imagenEdit,
        fecha_vencimiento: this.encuesta.fecha_vencimiento,
        opciones: this.encuesta.opciones,
      };
      JSON.stringify(body);
      // response = await this.auth.editEncuesta(this.id, body);
    } else {
      const body = {
        imagenes: this.images,
        pregunta: this.encuesta.pregunta,
        fecha_vencimiento: this.encuesta.fecha_vencimiento,
        opciones: this.encuesta.opciones,
      };
      JSON.stringify(body);
      console.log("body crear pregunta: ", body);
      response = await this.auth.createEncuesta(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getEncuesta();
      this.images = [];
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
