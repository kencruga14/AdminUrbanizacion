import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UsuarioModelo } from "src/app/models/usuario.model";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { Console } from "console";
import { id } from "@swimlane/ngx-charts";
@Component({
  selector: "app-areasocial",
  templateUrl: "./areasocial.component.html",
  styleUrls: ["./areasocial.component.css"],
})
export class AreasocialComponent implements OnInit {
  separatedArray = ['a','b'];
  areas: any;
  aforo: any = 0;
  tipoAforo:any;
  imagenAlt:any;
  tipoArea: any;
  banderaAforo: boolean = false;
  banderaReserva: boolean = false;
  normas: any;
  fechaRecaudacionInicio : any;
  fechaRecaudacionFin : any;
  reservasRecaudaciones: any = [];
  valorTotal: any = 0;
  idA:any;
  idTemporal:any;
  item : any = {}
  reservas : any;
  is_publica: any;
  estado:any;
  horarios: any;
  informacionArea: any;
  id_area: 0;
  nombre: "";
  edit: false;
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
  horas = [
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
  ];
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
  };
  acceso = {
    accesos: "",
    id_area: "",
  };

  constructor(
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

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

  //anadirOpcion(){
  // if(this.area.opciones.length < 4){
  // let opciones= [...this.area.opciones]
  //opciones.push({opcion: ''})
  //this.area.opciones = opciones

  // }

  //}

  preview(event: any) {
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    console.log("entrando1")
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagen = reader.result;
      this.imagenPerfil=reader.result;
     
    };
    
    this.changeFoto = true;
  }

  editImagen(event: any) {
    console.log("entrando2")
    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagenEdit = reader.result;
    
      // this.imagenAlt = reader.result;
    };
    this.changeFoto = true;
  }

  openImage(admin, area = null) {
    console.log("admin seleccionado: ", admin);
    this.imagenPerfil = admin;
    this.nombre = area.nombre;
    this.hora_apertura = area.hora_apertura;
    this.hora_cierre = area.hora_cierre;
    this.precio = area.precio;
    console.log("imagen perfil: ", this.imagenPerfil);
    // this.modalService.open(content);
  }

  openArea(content, area ) {
 
    if (area) {
      // this.id_area = area.ID;
      this.id = area.ID;
      this.imagenEdit=area.imagen;
      this.imagen = area.imagen;
      this.nombre = area.nombre;
      this.tipoAforo= area.tipoAforo;
      this.aforo = area.aforo;
      this.normas = area.normas;
      this.tipoArea = area.tipoArea;
      this.tiempo_reservacion_minutos= area.tiempo_reservacion_minutos;
      if(this.tiempo_reservacion_minutos == 0){
        this.tiempo_reservacion_minutos=""
      }
      this.seleccionCosto=area.seleccionCosto
      this.precio = area.precio;
      this.estado=area.estado
      // if(area.precio>0){
      //   this.seleccionCosto="PAGADO"
      // }else{
      //   this.seleccionCosto="GRATIS"
      // }
      this.area = area;
      this.area.edit = true;
    } else {
      this.imagen="";
      this.imagenEdit="";
      this.imagenPerfil=""
      this.nombre = "";
      this.tipoAforo ="";
      this.aforo ="";
      this.normas="";
      this.tipoArea ="";
      this.tiempo_reservacion_minutos ="";
      this.seleccionCosto="";
      this.precio = "";
      this.estado ="";
      this.area.edit=false
    }
    this.modalService.open(content);
  }

  getAreaSocial() {
    this.auth.getAreaSocial().subscribe((resp: any) => {
      this.areas = resp;
    });
  
  }


  getReservasAreaSocial(id:string) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.reservas = resp.reservaciones;
    });
  }

  getInfoAreaSocial(id:string , content: any) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.informacionArea = resp;
      this.separatedArray =[]
      this.separatedArray = this.informacionArea.normas.split(',')
      if(resp){
        this.modalService.open(content, { size: "xl" });
      }
    });
  
    
  
  }




  getRecaudacionesAreaSocial(id:string , fecha1:string , fecha2: string) {
    this.auth.getRecaudacionesAreaSocialxId(id,fecha1,fecha2).subscribe((resp: any) => {
      this.reservasRecaudaciones = resp.reservaciones;
      if(resp){
        this.calcularRecaudaciiones();
      }
    });
   

  }

  getHorarios(id:string) {
    this.auth.getReservasAreaSocialxId(id).subscribe((resp: any) => {
      this.horarios = resp.horarios;
      console.log(this.horarios)
    });
  }



  async gestionArea() {
    let response: any;
    console.log(this.area)
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
        aforo:parseInt(this.aforo),
        normas: this.normas,
        tipoArea: this.tipoArea,
        tiempo_reservacion_minutos: parseInt(this.tiempo_reservacion_minutos),
        seleccionCosto: this.seleccionCosto,
        precio: parseInt(this.precio),
      };
      response = await this.auth.createAreaSocial(body);
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


  openReservas(content, item ) {
    this.getReservasAreaSocial(item.ID)
    this.modalService.open(content, { size: "lg" });
  }


  openInfo(content, item ) {
    this.getInfoAreaSocial(item.ID, content)
    
  }


  openRecaudaciones(content, item ) {
    console.log(item)
    if(item.precio==0){
      Swal.fire({
        title: "<h2>Esta area fue creada para que su ingreso sea gratuito. No genera recaudaciones</h2>",
        confirmButtonColor: "#343A40",
        confirmButtonText: "OK",
      })
    }else{
      this.idTemporal= item.ID;
      this.fechaRecaudacionInicio=""
      this.fechaRecaudacionFin=""
      this.reservasRecaudaciones=[]
      this.valorTotal=0
      this.modalService.open(content, { size: "lg" });
    }
   
  }

  calcularRecaudaciiones(){
    this.valorTotal = 0;
    this.reservasRecaudaciones.forEach((item) => {
      this.valorTotal = this.valorTotal + parseFloat(item.valor_cancelado);
    });
  }

  openHorarios(content, item ) {
    this.getHorarios(item.ID)
    this.idTemporal=item.ID
    this.modalService.open(content, { size: "lg" });
  }

 
  

  
  gestionRecaudaciones(fecha2: string ){
   this.getRecaudacionesAreaSocial(this.idTemporal,this.fechaRecaudacionInicio,this.fechaRecaudacionFin)
  }



  async gestionHorarios() {
    let response: any;
    if (this.item.edit) {
      response = await this.auth.editHorario(
        this.item.ID,
        this.item
      );
      if (response[0]) {
        this.auth.showAlert(" Actualizado exitosamente ", "success");
      }
    } else {
      response = await this.auth.createHorario(this.item
      );
      if (response[0]) {
        this.auth.showAlert("Creado exitosamente", "success");
      }
    }
    if (response) {
      //this.modalService.dismissAll();
      this.getHorarios(this.idTemporal);
    }
  }

  open(content, item ) {
    if (item) {
      this.item=item;
      this.item={...this.item,edit:true}
    }else{
      this.item={};
      this.item={...this.item,id_area:this.idTemporal}
      this.item={...this.item,edit:false}
    
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



}
