import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {IvyCarouselModule} from 'angular-responsive-carousel';

@Component({
  selector: "app-emprendimiento",
  templateUrl: "./emprendimiento.component.html",
  styleUrls: ["./emprendimiento.component.css"],
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
})
export class EmprendimientoComponent implements OnInit {
  emprendimientos: any;
  tipoEmprendimientos: string;
  emprendimientoss: any;
  carrusels: any;
  responsiveOptions;
  emprendimiento: any;
  categorias: any;
  idCategoria = "todas";
  eggSize = "size";
  categoria: any;
  arregloDescripcion = [];
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {  this.responsiveOptions = [
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
  ];}

  ngOnInit() {
    this.getEmprendimientos();
    this.ObtenerCategorias();
  }

  ObtenerEmprendimientos(categoria) {
    if (categoria === "todas") {
      this.getEmprendimientos();
    } else {
      this.auth.getEmprendimientos(categoria).subscribe((resp: any) => {
        this.emprendimientos = resp["cercas"];
        console.log("emprendimientos filtrados: ", this.emprendimientos);
      });
    }
  }

  getEmprendimientos() {
    this.auth.obtenerEmprendimeintos().subscribe((resp: any) => {
      this.emprendimientos = resp["cercas"];
      console.log("emprendimientos: ", this.emprendimientos);
    });
  }

  ObtenerCategorias() {
    this.auth.getCategorias().subscribe((resp: any) => {
      this.categorias = resp;
      console.log("categorias: ", this.categorias);
    });
  }

  openEmprendimiento(content, emprendimiento) {
    this.emprendimiento = emprendimiento;
    this.carrusels= emprendimiento.imagenes;
    this.arregloDescripcion =[]
    this.arregloDescripcion = this.emprendimiento.descripcion.split('\n')
    this.modalService.open(content);
  }

 
  deleteE(id: number) {
    Swal.fire({
      title: "¿Esta seguro de eliminarlo?",
      text: "Esta acción no se puede revertir",
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.deleteEmprendimiento(id);
      }
    });
  }

  async deleteEmprendimiento(value) {
    const response = await this.auth.deleteEmprendimiento(value);
    if (response) {
      this.getEmprendimientos();
      this.modalService.dismissAll();
    }
  }

  openCarrusel(content, emprendimiento) {
    // let Id_Encuesta = encuesta.ID;
    // // console.log("encuesta seleccionada: ", encuesta.ID);
    // this.auth.getEncuestaById(Id_Encuesta).subscribe((resp: any) => {
    //   this.carrusels = resp["imagenes"];
    //   console.log("  this.carrusel: ", this.carrusels);
    // });
    
    console.log("  this.carrusel: ", this.carrusels);
    this.modalService.open(content, { size: "lg" });
      
  }
  
}
