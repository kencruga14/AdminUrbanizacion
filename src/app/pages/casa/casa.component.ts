import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
@Component({
  selector: "app-casa",
  templateUrl: "./casa.component.html",
  styleUrls: ["./casa.component.css"],
})
export class CasaComponent implements OnInit {
  casas: UsuarioModelo[] = [];
  etapas: UsuarioModelo[] = [];
  id_casa: 0;
  manzana: "";
  villa: "";
  fijo: "";
  edit: false;
  celular: "";
  piso: "";
  departamento: "";
  familia: "";
  id: 0;
  eta = [];
  valor_alicuota: number;
  id_urbanizacion: any;
  filterName = "";
  casa = {
    id_casa: 0,
    fijo: "",
    manzana: "",
    villa: "",
    edit: false,
    celular: "",
    piso: "",
    departamento: "",
    familia: "",
    valor_alicuota: 0,
  };
  acceso = {
    accesos: "",
    id_casa: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.id_urbanizacion = Number(localStorage.getItem("id_urbanizacion"));
  }

  ngOnInit() {
    this.getCasa();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  openAcceso(content, acceso) {
    this.acceso.id_casa = acceso.id_casa;
    this.modalService.open(content);
  }

  openCasa(content, casa = null) {
    if (casa) {
      this.id_casa = casa.ID;
      this.id = casa.ID;
      this.celular = casa.celular;
      (this.valor_alicuota = casa.valor_alicuotas),
        (this.departamento = casa.departamento);
      this.manzana = casa.manzana;
      this.villa = casa.villa;
      this.familia = casa.familia;
      this.casa.edit = true;
    } else {
      this.id_casa = 0;
      this.manzana = "";
      this.villa = "";
      this.casa.edit = false;
      this.familia = "";
      this.celular = "";
      this.valor_alicuota = 0;
      this.departamento = "";
    }
    this.modalService.open(content);
  }

  // getCasa() {
  //   this.auth.getCasa().subscribe((resp: any) => {
  //     console.log(resp);
  //     this.casas = resp;
  //   });
  // }

  getCasa() {
    this.auth
      .getCasaByUrbanizacion(this.id_urbanizacion)
      .subscribe((resp: any) => {
        console.log(resp);
        this.casas = resp;
      });
  }

  async gestionCasa() {
    let response: any;
    if (this.casa.edit) {
      const body = {
        manzana: this.manzana,
        celular: this.celular,
        // valor_alicuotas: this.valor_alicuota,
        fijo: this.fijo,
        departamento: this.departamento,
        villa: this.villa,
        familia: this.familia,
      };
      JSON.stringify(body);
      console.log("cuerpo editar casa: ", body);
      response = await this.auth.editCasa(this.id, body);
    } else {
      const body = {
        manzana: this.manzana,
        celular: this.celular,
        // valor_alicuotas: this.valor_alicuota,
        fijo: this.fijo,
        departamento: this.departamento,
        villa: this.villa,
        familia: this.familia,
      };
      JSON.stringify(body);
      console.log("cuerpo crear casa: ", body);
      response = await this.auth.createCasa(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getCasa();
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
        this.deleteCasa(id);
      }
    });
  }

  async deleteCasa(id: number) {
    const response = await this.auth.deleteCasa(id);
    if (response) {
      this.getCasa();
    }
  }
}
