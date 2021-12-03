import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { format } from "url";
import { alicuota } from "../../models/alicuota";
import * as moment from "moment";

@Component({
  selector: "app-alicuota",
  templateUrl: "./alicuota.component.html",
  styleUrls: ["./alicuota.component.css"],
})
export class AlicuotaComponent implements OnInit {
  // @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  alicuotaForm: FormGroup;
  value = this.fb.group({
    valor: ["", Validators.required],
    fecha_pago: ["", Validators.required],
  });
  casas: UsuarioModelo[] = [];
  alicuotas: UsuarioModelo[] = [];
  filtrovilla: number;
  filtromanzana: number;
  years = [];
  filtroEstado: string;
  alicuotaM: alicuota[] = [];
  id_casa: number;
  id_manzana: number;
  submitted = false;
  id_villa: number;
  valor: any;
  nregistros: number;
  seleccionRegistro: any;
  fecha_pago: "";
  id_estado: string;
  edit: false;
  id: 0;
  year: number;
  id_alicuota: "";
  changeFoto = false;
  saldo: number;
  eta = [];
  valorfirts: number;
  year_seleccionado: any;
  mes_seleccionado: any;
  titulomes: string;
  mes: any;
  filterName = "";
  alicuota = {
    id_casa: 0,
    valor: "",
    fecha_pago: "",
    edit: false,
    id_alicuota: "",
  };
  acceso = {
    accesos: "",
    id_alicuota: "",
  };
  // años = [];

  meses = [
    // { name: "Saldo", id: 1 },
    { name: "Enero", id: 1 },
    { name: "Febrero", id: 2 },
    { name: "Marzo", id: 3 },
    { name: "Abril", id: 4 },
    { name: "Mayo", id: 5 },
    { name: "Junio", id: 6 },
    { name: "Julio", id: 7 },
    { name: "Agosto", id: 8 },
    { name: "Septiembre", id: 9 },
    { name: "Octubre", id: 10 },
    { name: "Noviembre", id: 11 },
    { name: "Diciembre", id: 12 },
    { name: "Extraordinaria", id: 13 },
    // "Saldo",
    // "Enero",
    // "Febrero",
    // "Marzo",
    // "Abril",
    // "Mayo",
    // "Junio",
    // "Julio",
    // "Agosto",
    // "Septiembre",
    // "Octubre",
    // "Noviembre",
    // "Diciembre",
    // "Extraordinaria",
  ];

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    const YEARS = () => {
      const dateStart = moment().subtract(1, "years");
      const dateEnd = moment().add(10, "y");
      while (dateEnd.diff(dateStart, "years") >= 0) {
        this.years.push(dateStart.format("YYYY"));
        dateStart.add(1, "year");
      }
    };
    YEARS();
  }

  ngOnInit() {
    this.getCasa();
    this.getAlicuota();
    this.titulomes = "Seleccione un mes";
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
    this.alicuotaForm = this.fb.group({
      times: this.fb.array([]),
    });
  }

  getManzana(value) {
    console.log("villa: ", value);
  }

  getVilla(value) {
    console.log("villa: ", value);
  }

  getEstado(value) {
    console.log("estado: ", value);
  }

  addGroup() {
    const val = this.fb.group({
      id_casa: [""],
      valor: ["", Validators.required],
      fecha_pago: ["", Validators.required],
    });
    const alicuotaForm = this.alicuotaForm.get("times") as FormArray;
    alicuotaForm.push(val);
    this.nregistros = alicuotaForm.length;
  }

  removeGroup(index) {
    console.log("ubicacion index borrar: ", index);
    const alicuotaForm = this.alicuotaForm.get("times") as FormArray;
    alicuotaForm.removeAt(index);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  async onsubmit(value) {
    let response: any;
    if (value === "nuevo") {
      console.log("nuevo");
      // let fecha = moment
      this.alicuotaM.push({
        valor: this.valor,
        id_casa: this.id_casa,
        tipo: "SALDO",
        fecha_pago: moment().format(),
      });
      response = await this.auth.createAlicuota(this.alicuotaM);
    } else if (value === "varios") {
      console.log("varios");

      for (let i = 0; i < this.casas.length; i++) {
        console.log("id_casa: ", this.meses[i]);
        this.alicuotaM.push({
          valor: this.valor,
          id_casa: this.casas[i].ID,
          tipo: null,
          fecha_pago: "01/"
            .concat(this.mes_seleccionado)
            .concat("/")
            .concat(this.year_seleccionado),
        });
        this.alicuotaM[i].fecha_pago = moment(
          this.alicuotaM[i].fecha_pago
        ).format();
      }
      console.log("arreglo alicuota M: ", this.alicuotaM);
      response = await this.auth.createAlicuota(this.alicuotaM);
    }

    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      this.gestionAlicuota();
    }
  }

  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      this.casas = resp;
      console.log("numeros de casas: ", this.casas.length);
    });
  }

  openAcceso(content, acceso) {
    this.acceso.id_alicuota = acceso.id_alicuota;
    this.modalService.open(content);
  }

  openAlicuota(content, alicuota = null) {
    if (alicuota) {
      this.id_alicuota = alicuota.ID;
      this.id = alicuota.ID;
      this.valor = alicuota.valor;
      this.fecha_pago = alicuota.fecha_pago;
      this.alicuota.edit = true;
      this.id_casa = alicuota.id_casa;
    } else {
      this.id_casa = 0;
      this.valor = "";
      this.fecha_pago = "";
      this.alicuota.edit = false;
      this.id_alicuota = "";
    }
    this.modalService.open(content);
  }
  getAlicuota() {
    this.auth.getAlicuota().subscribe((resp: any) => {
      console.log(resp);
      this.alicuotas = resp;
    });
  }

  async gestionAlicuota() {
    let response: any;
    if (this.alicuota.edit) {
      console.log("entro editar");
    } else {
      console.log("entro crear");
      console.log("body crear alicuota: ", this.alicuotaM);
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
        this.deleteAlicuota(id);
      }
    });
  }

  async deleteAlicuota(id: number) {
    const response = await this.auth.deleteAlicuota(id);
    if (response) {
      this.getAlicuota();
    }
  }

  resetsForm() {
    this.submitted = false;
    this.alicuotaForm.reset();
    this.id_manzana = null;
    this.valor = null;
    this.id_villa = null;
    this.modalService.dismissAll();
    this.year_seleccionado = null;
    this.mes_seleccionado = null;
    this.seleccionRegistro = null;
    this.alicuotaM = [];

    // this.removeGroup();

    // this.formGroupDirective.resetForm();
  }

  restablecerFiltroBusqueda() {
    this.filtromanzana = null;
    this.filtroEstado = null;
    this.filtrovilla = null;
  }
}
