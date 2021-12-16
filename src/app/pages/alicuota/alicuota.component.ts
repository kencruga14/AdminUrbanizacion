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
  totalPE =0 ;
  totalVE= 0 ;
  saldototal: any;
  saldoTotalVencido : any;
  saldototalExtraordinario: any;
  saldoTotalVencidoExtraordinario : any;
  body2 :any;
  valorVencidas = 0;
  valorPagadas = 0 ;
  valorTotal = 0;
  bandera = false;
  listaVencidas=[]
  filtromanzana: number;
  years = [];
  pipe: any;
  paramMz: number;
  paramVilla: number;
  paramEstado: string;
  filtroEstado: string;
  alicuotaM: alicuota[] = [];
  id_casa: number;
  id_manzana: number;
  submitted = false;
  manzanas: any;
  fechaArray: any = [];
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
  tipoReporte: string;
  year_seleccionado: any;
  mes_seleccionado: any;
  estado: string;
  existente: any;
  titulomes: string;
  valores: any;
  mes: any;
  totalDia: any;
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
    // console.log("otal dia: ", this.totalDia);
  }

  ngOnInit() {
    this.bandera=false;
    this.valorTotal = 0;
    this.getCasa();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
    this.alicuotaForm = this.fb.group({
      times: this.fb.array([]),
    });
    this.totalDia = moment(new Date()).format("DD-MM-YYYY");
  }

  sortByMzVilla = (ali) => {
    let ints = [];
    let strs = [];
    _.forEach(ali, (r) => {
      if (_.isNaN(parseInt(r.casa.manzana))) strs.push(r);
      else ints.push(_.assign(r, { "casa.manzana": parseInt(r.casa.manzana) }));
    });
    ints.sort(
      (a, b) => a.casa.manzana - b.casa.manzana || a.casa.villa - b.casa.villa
    );
    strs.sort(
      (a, b) =>
        a.casa.manzana.localeCompare(b.casa.manzana, "en", {
          numeric: true,
        }) || a.casa.villa.localeCompare(b.casa.villa, "en", { numeric: true })
    );
    return ints.concat(strs);
  };

  chainGroup = (arr, fn1, fn2, fn3) =>
    _.chain(_.groupBy(arr, fn1))
      .toPairs()
      .sortBy(fn2)
      .forEach(fn3)
      .fromPairs()
      .value();



  clasificarAlicuotas(alicuotas) {
    const comunes = _.filter(alicuotas, { tipo: "COMUN" });
    const saldo = this.sortByMzVilla(_.filter(alicuotas, { tipo: "SALDO" }));
    const extraordinaria = this.sortByMzVilla(
      _.filter(alicuotas, { tipo: "EXTRAORDINARIA" })
    );

    console.log("extraoridinarias:",extraordinaria)

      this.totalPE=0;
      this.totalVE=0;
        extraordinaria.forEach((item) => {
        if(item.estado=== 'PAGADO') this.totalPE = this.totalPE + parseFloat(item.valor);
        if(item.estado=== 'VENCIDO') this.totalVE = this.totalVE + parseFloat(item.valor);
      });
      console.log(this.totalPE)
      console.log(this.totalVE)

    const saldosPagado = this.chainGroup(
      comunes,
      (ali) => moment(ali.fecha_pago).format("MMMM YYYY"),
      (ali) => _.maxBy(ali[1], "CreatedAt").CreatedAt,
      (ali) => {
        ali[1] = _.sumBy(ali[1], (r) => (r.estado === "PAGADO" ? r.valor : 0));
      }
    );
    const saldosVencido = this.chainGroup(
      comunes,
      (ali) => moment(ali.fecha_pago).format("MMMM YYYY"),
      (ali) => _.maxBy(ali[1], "CreatedAt").CreatedAt,
      (ali) => {
        ali[1] = _.sumBy(ali[1], (r) => (r.estado === "VENCIDO" ? r.valor : 0));
      }
    );

    // extraordinario
    const saldosPagadoExtraordinario =_.sumBy(extraordinaria, (r) => (r.estado === "PAGADO" ? r.valor : 0));
   


    
    const saldosVencidoExtraordinario = this.chainGroup(
      extraordinaria,
      (ali) => moment(ali.fecha_pago).format("MMMM YYYY"),
      (ali) => _.maxBy(ali[1], "CreatedAt").CreatedAt,
      (ali) => {
        ali[1] = _.sumBy(ali[1], (r) => (r.estado === "VENCIDO" ? r.valor : 0));
      }
    );


    const porFecha = this.chainGroup(
      comunes,
      (ali) => moment(ali.fecha_pago).format("MMMM YYYY"),
      (ali) => _.maxBy(ali[1], "ID").ID,
      (ali) => {
        ali[1] = this.sortByMzVilla(ali[1]);
      }
    );

    // let asd= saldos;
    (this.fechaArray = _.assignIn(porFecha, {
      SALDO: saldo,
      EXTRAORDINARIA: extraordinaria,
    })),
      saldosPagado,
      saldosVencido,
      saldosPagadoExtraordinario,
      saldosVencidoExtraordinario
    let as = _.groupBy(extraordinaria, (ali) =>
      moment(ali.fecha_pago).format("MMMM YYYY")
    );
    console.log(this.fechaArray)
    this.extraordinariaAnterior = Object.entries(as).sort();
    this.existente = Object.entries(this.fechaArray).sort(); // console: ['0', '1', '2']  }
    this.existente.shift();
    this.existente.shift();
    this.saldototal = saldosPagado;
    this.saldoTotalVencido = saldosVencido;
    this.saldototalExtraordinario = saldosPagadoExtraordinario;
    this.saldoTotalVencidoExtraordinario = saldosVencidoExtraordinario;
    console.log("saldo total vencido",this.saldoTotalVencido )
    console.log("saldo total vencido ex",this.saldoTotalVencidoExtraordinario )
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
    this.paramMz = value;
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      console.log("manzana seleccionada: ", value);
      console.log("getCasasByManzana: ", resp);
      this.auth.getAlicuotasByMz(value).subscribe((resp: any) => {
        this.alicuotas = resp;
        console.log("alicuotas x manzana: ", this.alicuotas);
      });

      // alicuotas
      this.casasselector = resp;
    });
  }

  getEstado(value) {
    this.paramVilla = value;
    console.log("casa: ", value);
    this.auth
      .getAlicuotasByMzVil(this.paramMz, value)
      .subscribe((resp: any) => {
        this.alicuotas = resp;
        console.log("alicuotas x villa: ", this.alicuotas);
      });
  }

  getAlicuotaEstado(value) {
    console.log("estado: ", value);
    this.paramEstado = value;
    this.auth
      .getAlicuotasByMzVilEstado(this.paramMz, this.paramVilla, value)
      .subscribe((resp: any) => {
        this.alicuotas = resp;
        this.listaVencidas =resp;
        this.bandera=false
        if(this.listaVencidas[0].estado === 'VENCIDO') this.bandera=true
        this.calcularVencidos();  
        console.log("alicuotas x estado: ", this.alicuotas);
        console.log("alicuotas x estado: ", resp.length);
      });
    


  }


  calcularVencidos(){
    this.valorTotal = 0;
    console.log("a recorrer: ", this.listaVencidas);
    this.listaVencidas.forEach((item) => {
      this.valorTotal = this.valorTotal + parseFloat(item.valor);
    });

  }

  // calcularExtraordinaria(){
  //   this.totalPE=0;
  //   this.totalVE=0;
  //   this.listaVencidas.forEach((item) => {
  //     if(item.estado=== 'PAGADO') this.totalPE = this.totalPE + parseFloat(item.valor);
  //     if(item.estado=== 'VENCIDO') this.totalVE = this.totalVE + parseFloat(item.valor);
  //   });

  // }



  filtrarVilla(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      this.casas = resp;
    });
  }
  // NUEVA
  async Nueva() {
    let response: any;
    let validacion: any;
    let d = new Date();
    d.getDate();

    let as = this.year_seleccionado
      .concat("/")
      .concat(this.mes_seleccionado)
      .concat("/")
      .concat(d.getDate());
    let fechavalidacion = moment(as).format();
    validacion = this.alicuotas.filter(
      (ali) => ali.fecha_pago === fechavalidacion
    );
    if (validacion.length === 0) {
      for (let i = 0; i < this.casas.length; i++) {
        this.alicuotaM.push({
          valor: this.valor,
          id_casa: this.casas[i].ID,
          tipo: "COMUN",
          fecha_pago: as,
        });
        this.alicuotaM[i].fecha_pago = moment(
          this.alicuotaM[i].fecha_pago
        ).format();
      }
      console.log("array comun nueva: ", this.alicuotaM);
      response = await this.auth.createAlicuota(this.alicuotaM);
    } else {
      Swal.fire("Error!", "El mes ya se encuentra registrado", "error");
      this.resetsForm();
      this.removeGroup(this.nregistros);
      this.getAlicuota();
    }
    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      this.getAlicuota();
    }
  }

  // ANTERIOR
  async anterior(value) {
    let response: any;
    let d = new Date();
    d.getDate();
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
            .concat(d.getDate()),
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
    let d = new Date();
    d.getDate();
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
            .concat(d.getDate()),
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
      console.log("manzanas selecor: ", this.manzanaselector);
    });
  }

  openAcceso(content, acceso) {
    this.acceso.id_alicuota = acceso.id_alicuota;
    this.modalService.open(content);
  }

  openReporte(content) {
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
    this.resetCampos();
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

    this.auth.getAlicuota().subscribe((resp: any) => {
      this.alicuotas = resp;
      this.clasificarAlicuotas(resp);
    });
  }

  getManzanas() {}
  async gestionAlicuota() {
    let response: any;
    if (this.alicuota.edit) {

    } else {

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

  resetCampos(){
    this.submitted = false;
    this.alicuotaForm.reset();
    this.id_manzana = null;
    this.valor = null;
    this.id_villa = null;
    // this.manzanaselector = [];
    this.modalService.dismissAll();
    this.year_seleccionado = null;
    this.mes_seleccionado = null;
    this.seleccionRegistro = null;
    // this.alicuotaM = [];
    this.tipoalicuota = null;
    this.id_casa = null;
    this.id_manzana = null;
    this.filtromanzana = null;
    this.tipoAlicuotaComun = null;
    this.tipoAlicuotaExtraordinaria = null;
    this.tipoalicuota = null;
    this.pipe = null;
    // this.casasselector = [];
  }



  restablecerFiltroBusqueda() {
    this.filtromanzana = null;
    this.filtroEstado = null;
    this.filtrovilla = null;
    this.paramEstado = null;
    this.paramMz = null;
    this.paramVilla = null;
  }

  UpdatePago() {
    Swal.fire({
      title: "¿Está seguro de realizar esta acción?",
      // text: "Esta acción no se puede reversar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.pagar();
        this.bandera=false;
      } else {
      }
    });
  }

  UpdatePagoTodo() {
    Swal.fire({
      title: "¿Está seguro de realizar esta acción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.pagarTodo();
      } else {
      }
    });
  }


  async pagar() {
    let id = this.id_alicuota;
    let response: any;
    const body = {
      estado: "PAGADO",
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

  async pagarTodo() {
    let response: any;
    const body = this.listaVencidas
    let arregloAlicuotas = []
    body.forEach((item) => {
      console.log(item)
      this.body2={...this.body2,id:item.ID,estado:"PAGADO"}
      arregloAlicuotas.push(this.body2)
    });
    response = await this.auth.editTodasAlicuota(arregloAlicuotas);
    if (response) {
      this.resetsForm();
      this.removeGroup(this.nregistros);
      // this.gestionAlicuota();
      this.getCasa();
      this.getAlicuota();
      this.filtromanzana = null;
      this.filtrovilla = null;
      this.filtroEstado = null;
      this.bandera=false;
    }
  }

  
  resetReportes() {
    this.tipoReporte = null;
    this.modalService.dismissAll();
  }
}
