import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Console } from "console";
import { id } from "@swimlane/ngx-charts";
import * as moment from "moment";

@Component({
  selector: "app-areasocial",
  templateUrl: "./areasocial.component.html",
  styleUrls: ["./areasocial.component.css"],
})
export class AreasocialComponent implements OnInit {
  separatedArray = ["a", "b"];
  fechaHorario : any = "";
  areas: any;
  aforo: any = 0;
  tipoAforo: any;
  imagenAlt: any;
  tipoArea: any;
  banderaAforo: boolean = false;
  banderaReserva: boolean = false;
  normas: any;
  fechaRecaudacionInicio: any;
  fechaRecaudacionFin: any;
  reservasRecaudaciones: any = [];
  valorTotal: any = 0;
  idA: any;
  datesExclude: any;
  es: any;
  excluirdias: string = "";
  idTemporal: any;
  item: any = {};
  reservas: any = [];
  is_publica: any;
  estado: any;
  invalidDates: Date[] = [];
  // const result : string[] = [];
  // dates: Date[];
  horarios: any;
  diasDesabilitados: any;
  informacionArea: any;
  id_area: 0;
  nombre: "";
  edit: false;
  // dates: Date[];
  fechaA: Date;
  fechaB: Date;
  imagen = null;
  id: 0;
  tiempo_reservacion_minutos: any;
  seleccionCosto: string;
  changeFoto = false;
  hora_apertura: "";
  hora_cierre: "";
  precio: "";
  valor: number;
  imagenEdit = null;
  imagenPerfil = null;
  eta = [];
  // horas = [
  //   "05:00",
  //   "05:30",
  //   "06:00",
  //   "06:30",
  //   "07:00",
  //   "07:30",
  //   "08:00",
  //   "08:30",
  //   "09:00",
  //   "09:30",
  //   "10:00",
  //   "10:30",
  //   "11:00",
  //   "11:30",
  //   "12:00",
  //   "12:30",
  //   "13:00",
  //   "13:30",
  //   "14:00",
  //   "14:30",
  //   "15:00",
  //   "15:30",
  //   "16:00",
  //   "16:30",
  //   "17:00",
  //   "17:30",
  //   "18:00",
  //   "18:30",
  //   "19:00",
  //   "19:30",
  //   "20:00",
  //   "20:30",
  //   "21:00",
  //   "21:30",
  //   "22:00",
  //   "22:30",
  //   "23:00",
  //   "23:30",
  //   "00:00",
  //   "00:30",
  //   "01:00",
  //   "01:30",
  //   "02:00",
  //   "02:30",
  //   "03:00",
  //   "03:30",
  //   "04:00",
  // ];
  filterName = "";
  area = {
    id_area: 0,
    nombre: "",
    hora_apertura: "",
    hora_cierre: "",
    precio: "",
    tiempo_reservacion_minutos: "",
    edit: false,
    imagen: null,
    opciones: [{ opcion: "" }],
    disponibilidad: "",
  };
  acceso = {
    accesos: "",
    id_area: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ],
      monthNamesShort: [
        "ene",
        "feb",
        "mar",
        "abr",
        "may",
        "jun",
        "jul",
        "ago",
        "sep",
        "oct",
        "nov",
        "dic",
      ],
      today: "Hoy",
      clear: "Borrar",
    };
  }

  ngOnInit() {
    this.getAreaSocial();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }

  openAcceso(content, acceso) {
    this.acceso.id_area = acceso.id_area;
    this.modalService.open(content);
  }

  desahibilitardia(value) {
    // console.log("valor seleccionado: ", value);
    let a =
      value === "Sunday"
        ? 0
        : value === "Monday"
        ? 1
        : value === "Tuesday"
        ? 2
        : value === "Wednesday"
        ? 3
        : value === "Thursday"
        ? 4
        : value === "Friday"
        ? 5
        : 6;
    // console.log("value: ", a);
    let f = [0, 1, 2, 3, 4, 5, 6, 7];
    this.diasDesabilitados = f.filter((d) => d !== a);
    // console.log("result: ", this.diasDesabilitados);
  }
  // var newFoo = removeItemFromArr( foo, 'thumb-2' );
  preview(event: any) {
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    // console.log("entrando1");
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

  editImagen(event: any) {
    // console.log("entrando2");
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

  openImage(admin, area = null) {
    // console.log("admin seleccionado: ", admin);
    this.imagenPerfil = admin;
    this.nombre = area.nombre;
    this.hora_apertura = area.hora_apertura;
    this.hora_cierre = area.hora_cierre;
    this.precio = area.precio;
    // console.log("imagen perfil: ", this.imagenPerfil);
    // this.modalService.open(content);
  }

  openArea(content, area = null) {
    if (area) {
      this.id = area.ID;
      this.imagenEdit = area.imagen;
      this.imagen = area.imagen;
      this.nombre = area.nombre;
      this.tipoAforo = area.tipoAforo;
      this.aforo = area.aforo;
      this.normas = area.normas;
      this.tipoArea = area.tipoArea;
      this.tiempo_reservacion_minutos = area.tiempo_reservacion_minutos;
      if (this.tiempo_reservacion_minutos == 0) {
        this.tiempo_reservacion_minutos = "";
      }
      this.seleccionCosto = area.seleccionCosto;
      this.precio = area.precio;
      this.estado = area.estado;
      this.area = area;
      this.area.edit = true;
    } else {
      this.imagen = "";
      this.imagenEdit = "";
      this.imagenPerfil = "";
      this.nombre = "";
      this.tipoAforo = "";
      this.aforo = "";
      this.normas = "";
      this.tipoArea = "";
      this.tiempo_reservacion_minutos = "";
      this.seleccionCosto = "";
      this.precio = "";
      this.estado = "";
      this.area.edit = false;
      this.excluirdias = "";
      this.diasDesabilitados = [];
      this.fechaA = null;
      this.fechaB = null;
    }
    this.modalService.open(content);
  }

  getAreaSocial() {
    this.auth.getAreaSocial().subscribe((resp: any) => {
      this.areas = resp;
    });
  }

  getReservasAreaSocial(id: string) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.reservas = resp.reservaciones;
    });
  }

  getInfoAreaSocial(id: string, content: any) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.informacionArea = resp;
      this.separatedArray = [];
      this.separatedArray = this.informacionArea.normas.split(",");
      if (resp) {
        this.modalService.open(content, { size: "xl" });
      }
    });
  }

  getRecaudacionesAreaSocial(id: string, fecha1: string, fecha2: string) {
    this.auth
      .getRecaudacionesAreaSocialxId(id, fecha1, fecha2)
      .subscribe((resp: any) => {
        this.reservasRecaudaciones = resp.reservaciones;
        if (resp) {
          this.calcularRecaudaciiones();
        }
      });
  }


  getReservacionesHorarios(id: string, fecha1: string) {
    this.auth
      .getReservacionesAreaSocialxId(id, fecha1)
      .subscribe((resp: any) => {
        if (resp) {
          this.reservas = resp.horarios_disponibles;
          console.log("hor", this.reservas)
        }
      });
  }


  getHorarios(id: string) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.horarios = resp.horarios;
      console.log("modal horario: ", this.horarios);
    });
  }

  async gestionArea() {
    let response: any;

    if (this.area.edit) {
      const body = {
        imagen: this.imagenAlt,
        nombre: this.nombre,
        tipoAforo: this.tipoAforo,
        aforo: parseInt(this.aforo),
        normas: this.normas,
        tipoArea: this.tipoArea,
        tiempo_reservacion_minutos: parseInt(this.tiempo_reservacion_minutos),
        seleccionCosto: this.seleccionCosto,
        precio: parseInt(this.precio),
      };
      response = await this.auth.editAreaSocial(this.id, body);
    } else {
      const body = {
        imagen: this.imagen,
        nombre: this.nombre,
        tipoAforo: this.tipoAforo,
        aforo: parseInt(this.aforo),
        normas: this.normas,
        tipoArea: this.tipoArea,
        tiempo_reservacion_minutos: parseInt(this.tiempo_reservacion_minutos),
        seleccionCosto: this.seleccionCosto,
        precio: parseInt(this.precio),
      };
      if (!body.imagen) {
        Swal.fire({
          title: "Por favor ingrese una imagen",
          confirmButtonColor: "#343A40",
          confirmButtonText: "OK",
        });
      } else {
        response = await this.auth.createAreaSocial(body);
      }
    }
    if (response) {
      this.modalService.dismissAll();
      this.getAreaSocial();
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
        this.deleteAreaSocial(id);
      }
    });
  }

  async deleteAreaSocial(id: number) {
    const response = await this.auth.deleteAreaSocial(id);
    if (response) {
      this.getAreaSocial();
    }
  }

  saveEditPicture(event: any) {
    console.log("entró preview:");
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagenEdit = reader.result;
      this.imagenAlt = reader.result;
    };
    this.changeFoto = true;
  }

  openReservas(content, item) {
    // this.getReservasAreaSocial(item.ID);
    this.reservas=[]
    this.fechaHorario = "";
    this.idTemporal = item.ID;
    this.modalService.open(content, { size: "lg" });
  }

  openInfo(content, item) {
    this.getInfoAreaSocial(item.ID, content);
  }

  openDiasInahibilatos(content, div) {
    this.modalService.open(content, { size: "lg" });
    this.datesExclude = div;
    console.log("modal dias inahibilitados: ", div);
  }

  openRecaudaciones(content, item) {
    console.log(item);
    if (item.precio == 0) {
      Swal.fire({
        title:
          "<h2>Esta área fue creada para que su ingreso sea gratuito. No genera recaudaciones</h2>",
        confirmButtonColor: "#343A40",
        confirmButtonText: "OK",
      });
    } else {
      this.idTemporal = item.ID;
      this.fechaRecaudacionInicio = "";
      this.fechaRecaudacionFin = "";
      this.reservasRecaudaciones = [];
      this.valorTotal = 0;
      this.modalService.open(content, { size: "lg" });
    }
  }

  calcularRecaudaciiones() {
    this.valorTotal = 0;
    this.reservasRecaudaciones.forEach((item) => {
      this.valorTotal = this.valorTotal + parseFloat(item.valor_cancelado);
    });
  }

  openHorarios(content, item) {
    this.getHorarios(item.ID);
    this.idTemporal = item.ID;
   
    this.modalService.open(content, { size: "lg" });
  }

  gestionRecaudaciones(fecha2: string) {
    this.getRecaudacionesAreaSocial(
      this.idTemporal,
      this.fechaRecaudacionInicio,
      this.fechaRecaudacionFin
    );
  }


  gestionReservaHorarios(fecha2: string) {
    this.getReservacionesHorarios(this.idTemporal,this.fechaHorario)
  }

  async gestionHorarios() {
    let response: any;
    let diasExcluidos = [];
    if(this.item.dias_exclude){
      if (this.item.dias_exclude.length > 0)
      for (let i = 0; i < this.item.dias_exclude.length; i++) {
        diasExcluidos.push(moment(this.item.dias_exclude[i]).format());
      }
    }
    console.log("llegue abajo")
    if (this.item.edit) {
      const body = {
        dias_exclude: diasExcluidos,
      };
      // console.log("body editar: ", body);
      response = await this.auth.editHorario(this.item.ID, this.item);
      if (response[0]) {
        this.auth.showAlert(" Actualizado exitosamente ", "success");
      }
    } else {
      const body = {
        dia: this.item.dia,
        edit: false,
        fecha_fin: moment(this.item.fecha_fin).format(),
        fecha_inicio: moment(this.item.fecha_inicio).format(),
        hora_fin: this.item.hora_fin,
        dias_exclude: diasExcluidos,
        hora_inicio: this.item.hora_inicio,
        id_area: this.item.id_area,
      };
      // console.log("body crear: ", body);
      response = await this.auth.createHorario(this.item);
      if (response[0]) {
        this.auth.showAlert("Creado exitosamente", "success");
      }
    }
    if (response) {
     
    
      this.getHorarios(this.idTemporal);
    }
  }

  open(content, item) {
    console.log("modal editar: ", item);
    if (item != null) {
      this.desahibilitardia(item.dia);
      this.fechaA = new Date(item.fecha_inicio);
      this.fechaB = new Date(item.fecha_fin);
      for (let i = 0; i < item.fechas_exclude.length; i++) {
        let as = new Date(item.fechas_exclude[i].fecha);
        this.invalidDates.push(as);
      }
      // console.log("invalidDates: ", this.invalidDates);
    }
    if (item) {
      this.item = item;
      this.item = { ...this.item, edit: true };
    } else {
      this.item = {};
      this.excluirdias =""
      this.item = { ...this.item, id_area: this.idTemporal };
      this.item = { ...this.item, edit: false };
    }
    this.modalService.open(content, { size: "xl" });
  }

  async eliminarHorario(id: any) {
    Swal.fire({
      title: "¿Seguro que desea eliminar este item ?",
      text: "Esta acción no se puede revertir ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#343a40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        const response = await this.auth.deleteHorario(id);
        if (response) {
          this.getHorarios(this.idTemporal);
        }
      }
    });
  }

  async eliminarDiaExcluido(id: number) {
    Swal.fire({
      title: "¿Seguro que desea habilitar este día?",
      text: "Esta acción no se puede revertir ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#343a40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        const response = await this.auth.deleteDiaExcluido(id);
        if (response) {
          this.modalService.dismissAll();
          this.getHorarios(this.idTemporal);
          this.fechaB = null;
          this.fechaA = null;
          this.invalidDates = [];

          // this.fehc
        }
      }
    });
  }
}
