import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import _ from "lodash";
@Component({
  selector: "app-casa",
  templateUrl: "./casa.component.html",
  styleUrls: ["./casa.component.css"],
})
export class CasaComponent implements OnInit {
  filtroManzana: any;
  filtrovilla: any;
  manzanas: any;
  manzanaselector: any = []
  casasselector: any = []
  casas: UsuarioModelo[] = [];
  etapas: UsuarioModelo[] = [];
  id_casa: 0;
  manzana: "";
  villa: "";
  fijo: "";
  edit: false;
  celular: "";
  propietario = "";
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
    this.filtroManzana = ""
    this.filtrovilla = ""
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
      this.propietario = casa.propietario  
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
      this.propietario= "";
      this.celular = "";
      this.valor_alicuota = 0;
      this.departamento = "";
    }
    this.modalService.open(content);
  }

  sortByMzVilla = (casas) => {
    let ints = [];
    let strs = [];
    _.forEach(casas, (r) => {
      if (_.isNaN(parseInt(r.manzana))) strs.push(r);
      else ints.push(_.assign(r, { "r.manzana": parseInt(r.manzana) }));
    });
    ints.sort((a, b) => a.manzana - b.manzana || a.villa - b.villa);
    strs.sort(
      (a, b) =>
        a.manzana.localeCompare(b.manzana, "en", {
          numeric: true,
        }) || a.villa.localeCompare(b.villa, "en", { numeric: true })
    );
    return ints.concat(strs);
  };

  // getCasa() {
  //   this.auth.getCasa().subscribe((resp: any) => {
  //     console.log(resp);
  //     this.casas = this.sortByMzVilla(resp);
  //   });
  // }

  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      this.casas = resp;
      this.manzanas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
      console.log("numeros de casas: ", this.casas.length);
    });
  }

  // getCasa() {
  //   this.auth
  //     .getCasaByUrbanizacion(this.id_urbanizacion)
  //     .subscribe((resp: any) => {
  //       console.log(resp);
  //       this.casas = resp;
  //     });
  // }

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
        propietario: this.propietario
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
        propietario: this.propietario

      };
      JSON.stringify(body);
      response = await this.auth.createCasa(body);
    }
    if (response) {
      this.modalService.dismissAll();
      this.getCasa();
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

  getFiltroCasa() {
    this.filtrovilla = ""
    this.auth.getCasasByManzana(this.filtroManzana).subscribe((resp: any) => {
      this.casasselector = resp;
      console.log("casas x manzana: ", this.casasselector);
    });
    this.auth.getCasaFiltros(this.filtroManzana, this.filtrovilla).subscribe((resp: any) => {
      this.casas = resp;
      console.log("casas x manzana: ", this.casasselector);
    });
  }


  getFiltroVilla() {
    this.auth.getCasaFiltros(this.filtroManzana, this.filtrovilla).subscribe((resp: any) => {
      this.casas = resp;
    });
  }


}
