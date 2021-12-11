import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
@Component({
  selector: "app-emprendimiento",
  templateUrl: "./emprendimiento.component.html",
  styleUrls: ["./emprendimiento.component.css"],
})
export class EmprendimientoComponent implements OnInit {
  emprendimientos: any;
  tipoEmprendimientos: string;
  emprendimientoss: any;
  emprendimiento: any;
  categorias: any;
  categoria: any;
  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // this.ObtenerEmprendimientos();
    this.ObtenerCategorias();
  }

  ObtenerEmprendimientos(categoria) {
    this.auth.getEmprendimientos(categoria).subscribe((resp: any) => {
      this.emprendimientos = resp;
      console.log("emprendimientos: ", this.emprendimientos.cercas);
    });
  }

  ObtenerCategorias() {
    this.auth.getCategorias().subscribe((resp: any) => {
      this.categorias = resp;
      console.log("categorias: ", this.categorias);
    });
  }

  // getTipoEmprendimientos(value) {
  //   this.emprendimientoss = this.emprendimientos[value];
  // }

  openEmprendimiento(content, emprendimiento) {
    this.emprendimiento = emprendimiento;
    console.log("emprendimiento: ", this.emprendimiento);
    console.log("content: ", content);
    this.modalService.open(content);
  }

  async deleteEmprendimiento(value) {
    console.log("id emprendimiento: ", value);
    const response = await this.auth.deleteEmprendimiento(value);
    if (response) {
      this.modalService.dismissAll();
      this.ObtenerEmprendimientos(this.categoria);
    }
  }
}
