import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { DateButton } from "angular-bootstrap-datetimepicker";
import * as moment from "moment";

import { unitOfTime } from "moment";
@Component({
  selector: "app-votacion",
  templateUrl: "./votacion.component.html",
  styleUrls: ["./votacion.component.css"],
  styles: [
    `
      .carousel-demo
        .ui-carousel
        .ui-carousel-content
        .ui-carousel-item
        .car-details
        > .p-grid {
        border: 1px solid #b3c2ca;
        border-radius: 3px;
        margin: 0.3em;
        text-align: center;
        padding: 2em 0 2.25em 0;
      }
      .carousel-demo
        .ui-carousel
        .ui-carousel-content
        .ui-carousel-item
        .car-data
        .car-title {
        font-weight: 700;
        font-size: 20px;
        margin-top: 24px;
      }
      .carousel-demo
        .ui-carousel
        .ui-carousel-content
        .ui-carousel-item
        .car-data
        .car-subtitle {
        margin: 0.25em 0 2em 0;
      }
      .carousel-demo
        .ui-carousel
        .ui-carousel-content
        .ui-carousel-item
        .car-data
        button {
        margin-left: 0.5em;
      }
      .carousel-demo
        .ui-carousel
        .ui-carousel-content
        .ui-carousel-item
        .car-data
        button:first-child {
        margin-left: 0;
      }
      .carousel-demo .ui-carousel.custom-carousel .ui-carousel-dot-icon {
        width: 16px !important;
        height: 16px !important;
        border-radius: 50%;
      }
      .carousel-demo
        .ui-carousel.ui-carousel-horizontal
        .ui-carousel-content
        .ui-carousel-item.ui-carousel-item-start
        .car-details
        > .p-grid {
        margin-left: 0.6em;
      }
      .carousel-demo
        .ui-carousel.ui-carousel-horizontal
        .ui-carousel-content
        .ui-carousel-item.ui-carousel-item-end
        .car-details
        > .p-grid {
        margin-right: 0.6em;
      }
    `,
  ],
  // encapsulation: ViewEncapsulation.None
})
export class VotacionComponent implements OnInit {
  PreguntaForm;
  submitted = false;
  casas: UsuarioModelo[] = [];
  encuestas: UsuarioModelo[] = [];
  id_encuesta: 0;
  // selectedFiles: FileList;
  pregunta: "";
  fecha_vencimiento: "";
  edit: false;
  id: 0;
  responsiveOptions;
  images = [];
  // opciones: any;
  changeFoto = false;
  previews: string[] = [];
  eta = [];
  imagenPerfila: any;
  imagenEdit = null;
  imagen = null;
  // startView= new Date();
  startView: string = "day";
  enteredDate: Date;
  imagenes: any[] = [];
  selectedFiles?: FileList;
  carrusels: any;
  imagenPerfil = null;
  encuestaSeleccionada: any;
  filterName = "";
  encuesta = {
    id_encuesta: 0,
    pregunta: "",
    fecha_vencimiento: "",
    edit: false,
    // opciones: [{ opcion: "" }],
    imagenes: [],
    images: "",
    imagen: "",
    imagenPerfil: "",
  };
  acceso = {
    accesos: "",
    id_encuesta: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: "768px",
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: "560px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  buildForm() {
    this.PreguntaForm = new FormGroup({
      pregunta: new FormControl("", Validators.required),
      fecha_vencimiento: new FormControl("", Validators.required),
      opciones: new FormArray([]),
    });
  }

  addOpciones() {
    const add = this.PreguntaForm.get("opciones") as FormArray;
    add.push(new FormControl("", Validators.required));
  }

  removeOpciones(i) {
    const remove = this.PreguntaForm.get("opciones") as FormArray;
    remove.removeAt(i);
  }

  ngOnInit() {
    this.getEncuesta();
    this.buildForm();
    this.addOpciones();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  openAcceso(content, acceso) {
    this.acceso.id_encuesta = acceso.id_encuesta;
    this.modalService.open(content);
  }

  openEncuesta(content, encuesta = null) {
    if (!encuesta) {
      this.encuesta.id_encuesta = 0;
      this.encuesta.pregunta = "";
      this.encuesta.fecha_vencimiento = "";
      this.imagen = "";
      this.images = [];
      this.imagenPerfil = "";
      this.encuesta.edit = false;
      this.PreguntaForm.reset();
      // this.PreguntaForm.clear();
      // this.encuesta.opciones = [{ opcion: "" }];
    } else {
      this.encuesta = encuesta;
      this.pregunta = encuesta.pregunta;
      this.encuesta.edit = true;
    }
    this.modalService.open(content);
  }

  openResultado(content, encuesta) {
    let Id_Encuesta = encuesta.ID;
    // console.log("encuesta seleccionada: ", encuesta.ID);
    this.auth.getEncuestaById(Id_Encuesta).subscribe((resp: any) => {
      this.encuestaSeleccionada = resp;
      // console.log("encuesta seleccionada: ", this.encuestaSeleccionada);
    });
    this.modalService.open(content);
  }

  openCarrusel(content, encuesta) {
    let Id_Encuesta = encuesta.ID;
    // console.log("encuesta seleccionada: ", encuesta.ID);
    this.auth.getEncuestaById(Id_Encuesta).subscribe((resp: any) => {
      this.carrusels = resp["imagenes"];
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
    // console.log("entr?? preview:");
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
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // anadirOpcion() {
  //   if (this.encuesta.opciones.length < 4) {
  //     let opciones = [...this.encuesta.opciones];
  //     opciones.push({ opcion: "" });
  //     this.encuesta.opciones = opciones;
  //   }
  // }

  async gestionEncuesta() {
    let response: any;
    this.submitted = true;
    if (this.PreguntaForm.invalid) {
      alert("Error en validacion del formulario");
    }

    console.log("formulario: ", this.PreguntaForm.value);
    if (this.encuesta.edit) {
      const body = {
        // pregunta: this.PreguntaForm.value.pregunta,
        // imagen: this.imagenEdit,
        // fecha_vencimiento: this.encuesta.fecha_vencimiento,
        // opciones: this.encuesta.opciones,
      };
      JSON.stringify(body);
      // response = await this.auth.editEncuesta(this.id, body);
    } else {
      // console.log("formulario: ", this.PreguntaForm.value.opciones[0]);
      let arr = [];
      for (var i = 0; i < this.PreguntaForm.value.opciones.length; i++) {
        arr.push({
          opcion: this.PreguntaForm.value.opciones[i],
        });
      }
      const body = {
        imagenes: this.images,
        pregunta: this.PreguntaForm.value.pregunta,
        fecha_vencimiento: this.PreguntaForm.value.fecha_vencimiento,
        opciones: arr,
      };
      JSON.stringify(body);
      console.log("body crear pregunta: ", body);
      response = await this.auth.createEncuesta(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getEncuesta();
      this.PreguntaForm.reset();
      this.PreguntaForm.clear();
      // this.PreguntaForm.removeAt();
      this.images = [];
    }
  }
  delete(id: number) {
    Swal.fire({
      title: "??Seguro que desea eliminar este registro?",
    
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "S??",
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

  public startDatePickerFilter(
    dateButton: DateButton,
    viewName: string
  ): boolean {
    return (
      dateButton.value >
      moment()
        .startOf(viewName as unitOfTime.StartOf)
        .valueOf()
    );
  }
}
