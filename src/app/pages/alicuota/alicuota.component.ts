import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import _ from "lodash";
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
import { Console } from "console";
import { ThrowStmt } from "@angular/compiler";

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
  pipe: any;
  filtroEstado: string;
  alicuotaM: alicuota[] = [];
  id_casa: number;
  id_manzana: number;
  submitted = false;
  manzanas: any;
  fechaArray: [];
  id_villa: number;
  casasselector: any;
  manzanaselector: any;
  valor: any;
  nregistros: number;
  seleccionRegistro: any;
  fecha_pago: "";
  id_estado: string;
  edit: false;
  filtro: any;
  id: 0;
  year: number;
  id_alicuota: number;
  ID: Number;
  changeFoto = false;
  casasFiltro: any;
  saldo: number;
  eta = [];
  extraordinariaAnterior: any;
  tipoalicuota: string;
  tipoAlicuotaExtraordinaria: string;
  tipoAlicuotaComun: string;
  valorfirts: number;
  year_seleccionado: any;
  mes_seleccionado: any;
  estado: string;
  existente: any;
  titulomes: string;
  valores: any;
  mes: any;
  estadoalicuota: string;
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
    this.getAlicuota();
  }

  ngOnInit() {
    this.getCasa();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
    this.alicuotaForm = this.fb.group({
      times: this.fb.array([]),
    });
  }

  clasificarAlicuotas(alicuotas) {
    const comunes = _.filter(alicuotas, { tipo: "COMUN" });
    const saldo = _.orderBy(
      _.filter(alicuotas, { tipo: "SALDO" }),
      // ["CreatedAt", "casa.manzana", "casa,villa"],
      // ["desc", "asc", "asc"]
      ["casa.manzana", "casa,villa"],
      ["asc", "asc"]
    );
    const extraordinaria = _.orderBy(
      _.filter(alicuotas, { tipo: "EXTRAORDINARIA" }),
      // ["CreatedAt", "casa.manzana", "casa,villa"],
      // ["desc", "asc", "asc"]
      ["casa.manzana", "casa,villa"],
      ["asc", "asc"]
    );

    const porFecha = _.chain(
      _.groupBy(comunes, (ali) => moment(ali.fecha_pago).format("MMMM YYYY"))
    )
      .toPairs()
      .forEach((ali) => {
        ali[1] = _.orderBy(
          ali[1],
          ["casa.manzana", "casa,villa"],
          ["asc", "asc"]
          // ["CreatedAt", "casa.manzana", "casa,villa"],
          // ["desc", "asc", "asc"]
        );
      })
      .fromPairs()
      .value();

    this.fechaArray = _.assignIn(porFecha, {
      SALDO: saldo,
      EXTRAORDINARIA: extraordinaria,
    });
    let as = _.groupBy(extraordinaria, (ali) =>
      moment(ali.fecha_pago).format("MMMM YYYY")
    );
    this.extraordinariaAnterior = Object.entries(as).sort();
    this.fechaArray = porFecha;
    this.existente = Object.entries(this.fechaArray).sort(); // console: ['0', '1', '2']  }
    this.existente.shift();
    this.existente.shift();
    console.log("fechaArray: ", this.fechaArray);
  }

  addGroup() {
    const val = this.fb.group({
      valor: ["", Validators.required],
      fecha_pago: ["", Validators.required],
    });
    const alicuotaForm = this.alicuotaForm.get("times") as FormArray;
    alicuotaForm.push(val);
    this.nregistros = alicuotaForm.length;
  }

  removeGroup(index) {
    // console.log("ubicacion index borrar: ", index);
    const alicuotaForm = this.alicuotaForm.get("times") as FormArray;
    alicuotaForm.removeAt(index);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  getVillas(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      console.log("manzana seleccionada: ", value);
      console.log("getCasasByManzana: ", resp);
      this.casasselector = resp;
    });
  }
  getEstado(value) {
    console.log("estado: ", value);
  }

  getFiltros(valor: any) {
    console.log("alicuotas form: ", valor);
    const comunes = _.filter(this.alicuotas, { tipo: "COMUN" });
    const saldo = _.filter(this.alicuotas, { tipo: "SALDO" });
    const extraordinaria = _.filter(this.alicuotas, { tipo: "EXTRAORDINARIA" });
    const porFecha = _.groupBy(comunes, (ali) =>
      moment(ali.fecha_pago).format("MMMM YYYY")
    );
    _.assignIn(porFecha, { SALDO: saldo, EXTRAORDINARIAs: extraordinaria });
    _.orderBy(
      this.alicuotas,
      ["Created_at", "casa.Manzana", "casa.Villa"],
      ["desc", "asc", "asc"]
    );

    // console.log("final extra anterior: ", this.extraordinariaAnterior);
    // console.log(
    //   "extraodrinario anterior: ",
    //   Object.entries(this.extraordinariaAnterior).sort()
    // );

    console.log("existente: ", this.existente);
  }

  filtrarVilla(value) {
    // console.log("valor filtrar manzana: ", value);
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      this.casas = resp;
      // console.log("Casas filtradas: ", this.casas);
    });
  }
  // NUEVA
  async Nueva() {
    let response: any;
    let fechavalidacion = this.year_seleccionado
      .concat("/")
      .concat(this.mes_seleccionado)
      .concat("/")
      .concat("1");
      console.log("fechavalidacion: ", fechavalidacion )

      console.log("alicuotas: ", this.alicuotas )
    for (let i = 0; i < this.alicuotas.length; i++) {
      // console.log("areglo validacion: ", this.alicuotas[i].[fecha_pago]);
      if (this.alicuotas[this.fecha_pago].includes(fechavalidacion)){
        alert("mes ya se encuentra regisrasdo")
      }
    }
    for (let i = 0; i < this.casas.length; i++) {
      this.alicuotaM.push({
        valor: this.valor,
        id_casa: this.casas[i].ID,
        tipo: "COMUN",
        fecha_pago: this.year_seleccionado
          .concat("/")
          .concat(this.mes_seleccionado)
          .concat("/")
          .concat("1"),
      });
      this.alicuotaM[i].fecha_pago = moment(
        this.alicuotaM[i].fecha_pago
      ).format();
    }
    // console.log("array comun nueva: ", this.alicuotaM);
    // response = await this.auth.createAlicuota(this.alicuotaM);
    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      this.getAlicuota();
    }
  }

  // ANTERIOR
  async anterior(value) {
    let response: any;
    // console.log("mes seleccionado: ", this.pipe);
    // console.log("id_casa: ", this.id_casa);
    if (value === "EXISTENTE") {
      this.alicuotaM.push({
        valor: this.valor,
        id_casa: Number(this.id_casa),
        tipo: "COMUN",
        fecha_pago: this.pipe,
      });
      console.log("Arreglo sado: ", this.alicuotaM);
      response = await this.auth.createAlicuota(this.alicuotaM);
    } else if (value === "NUEVA") {
      for (let i = 0; i < this.casas.length; i++) {
        this.alicuotaM.push({
          valor: this.valor,
          id_casa: this.casas[i].ID,
          tipo: "COMUN",
          fecha_pago: this.year_seleccionado
            .concat("/")
            .concat(this.mes_seleccionado)
            .concat("/")
            .concat("1"),
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
      this.getCasa();
      this.getAlicuota();
    }
  }

  async crearExtraordinaria(value) {
    let response: any;
    // console.log('value: ', this.form.value);
    // console.log("valor formulario: ", this.alicuotaForm.value);
    if (value === "NUEVA") {
      console.log("entro Extraordinaria NUEVA");
      for (let i = 0; i < this.casas.length; i++) {
        this.alicuotaM.push({
          valor: this.valor,
          id_casa: this.casas[i].ID,
          tipo: "EXTRAORDINARIA",
          fecha_pago: this.year_seleccionado
            .concat("/")
            .concat(this.mes_seleccionado)
            .concat("/")
            .concat("1"),
        });
        this.alicuotaM[i].fecha_pago = moment(
          this.alicuotaM[i].fecha_pago
        ).format();
      }
      console.log("arreglo alicuota extraordinaria Nueva: ", this.alicuotaM);
      response = await this.auth.createAlicuota(this.alicuotaM);
    } else if (value === "ANTERIOR") {
      this.alicuotaM.push({
        valor: this.valor,
        id_casa: Number(this.id_casa),
        tipo: "EXTRAORDINARIA",
        fecha_pago: this.pipe,
      });
      console.log("objeto crear Extraordinaria: ", this.alicuotaM);
      response = await this.auth.createAlicuota(this.alicuotaM);
    }
    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      this.getCasa();
      this.getAlicuota();
    }
  }

  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      this.casas = resp;
      this.manzanas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
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
      this.tipoalicuota = alicuota.estado;
    } else {
      this.id_casa = 0;
      this.valor = "";
      this.fecha_pago = "";
      this.alicuota.edit = false;
      this.id_alicuota = null;
      this.tipoalicuota = "";
    }
    this.modalService.open(content);
  }

  openModalAlicuota(content, alicuota = null) {
    console.log("alicuota seleccionada :", alicuota);
    if (alicuota) {
      this.id_alicuota = alicuota.ID;
      this.id = alicuota.ID;
      this.valor = alicuota.valor;
      this.fecha_pago = alicuota.fecha_pago;
      this.alicuota.edit = true;
      this.id_casa = alicuota.id_casa;
      this.tipoalicuota = alicuota.estado;
    }
    this.modalService.open(content);
  }

  getAlicuota() {
    console.log("get alicuota");
    this.auth.getAlicuota().subscribe((resp: any) => {
      this.alicuotas = resp;
      this.clasificarAlicuotas(resp);
      // this.valores = clasificarAlicuotas;
      // console.log("valores: ", this.valores);
    });
  }

  getManzanas() {}
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
  getIdcasa(value) {
    console.log("value: ", value);
    this.id_casa = value;
    console.log("id capturado: ", this.id_casa);
  }
  resetsForm() {
    this.submitted = false;
    this.alicuotaForm.reset();
    this.id_manzana = null;
    this.valor = null;
    this.id_villa = null;
    this.manzanaselector = [];
    this.modalService.dismissAll();
    this.year_seleccionado = null;
    this.mes_seleccionado = null;
    this.seleccionRegistro = null;
    this.alicuotaM = [];
    this.tipoalicuota = null;
    this.id_casa = null;
    this.id_manzana = null;
    this.filtromanzana = null;
    this.tipoAlicuotaComun = null;
    this.tipoAlicuotaExtraordinaria = null;
    this.tipoalicuota = null;
    this.pipe = null;
    this.casasselector = [];
  }

  restablecerFiltroBusqueda() {
    this.filtromanzana = null;
    this.filtroEstado = null;
    this.filtrovilla = null;
  }

  async UpdatePago() {
    let id = this.id_alicuota;
    let response: any;
    const body = {
      estado: this.estadoalicuota,
    };
    console.log("update body: ", body);
    response = await this.auth.editAlicuota(id, body);
    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      // this.gestionAlicuota();
      this.getCasa();
      this.getAlicuota();
      this.filtromanzana = null;
      this.filtrovilla = null;
      this.filtroEstado = null;
    }
  }
}
