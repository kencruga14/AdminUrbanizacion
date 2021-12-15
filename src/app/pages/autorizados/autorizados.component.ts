import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-autorizados',
  templateUrl: './autorizados.component.html',
  styleUrls: ['./autorizados.component.css']
})
export class AutorizadosComponent implements OnInit {

  constructor(private modalService: NgbModal, public auth: AuthService) { }
  autorizados = []
  eta = []
  filterName = ''
  autorizado: any = {}
  permisos: any = {}
  usuario: any = {}
  imagenPerfil: any;
  imagenEdit = null;
  changeFoto = false;
  imagen = null;
  infoPermisos: any = {}

  imagenPerfila: any;


  ngOnInit(): void {
    this.getAutorizados();
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }
  saveEditPicture(event: any) {

    const fileData = event.target.files[0];
    const mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (response) => {
      this.imagenEdit = reader.result;
      this.usuario.imagen = this.imagenEdit
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
    };
    this.changeFoto = true;
  }
  openAutorizado(content, autorizado = null) {
    this.changeFoto = false;

    if (autorizado) {
      this.autorizado = autorizado
      this.usuario = autorizado.usuario
      this.permisos = autorizado.permisos

      console.log(this.usuario.usuario)
      this.autorizado.edit = true

    } else {
      this.autorizado = {}
      this.usuario = {}
      this.permisos = {}
      this.autorizado.edit = false
    }
    this.modalService.open(content);
  }

  getAutorizados() {
    this.auth.getAutorizados().subscribe((resp: any) => {
      console.log(resp);
      this.autorizados = resp;
    });
  }
  openImage(admin) {
    console.log("admin seleccionado: ", admin);
    this.imagenPerfil = admin;
    console.log("imagen perfil: ", this.imagenPerfil);
    // this.modalService.open(content);
  }
  async gestionAutorizado() {
    this.autorizado.usuario = this.usuario
    let response;
    if (this.autorizado.edit) {
      delete this.permisos.id_admin_etapa
      delete this.permisos.admin_etapa
      delete this.permisos.CreatedAt
      delete this.permisos.DeletedAt
      delete this.permisos.ID
      delete this.permisos.UpdatedAt

      if (!this.changeFoto) {
        delete this.autorizado.usuario.imagen
      }
      this.autorizado.permisos = this.permisos

      response = await this.auth.editAutorizado(this.autorizado.ID, this.autorizado)
      if (response) {
        this.getAutorizados();
      }
    } else {
      delete this.permisos.id_admin_etapa
      delete this.permisos.admin_etapa
      this.autorizado.permisos = this.permisos
      
      response = await this.auth.createAutorizado(this.autorizado)
      if (response) {
        this.getAutorizados();
      }
    }
    this.modalService.dismissAll()
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
        this.deleteAutorizado(id);
      }
    });

  }
  async deleteAutorizado(id: number) {
    const response = await this.auth.deleteAutorizado(id);
    if (response) {
      this.getAutorizados();
    }
  }

  mostrarPermisos(content, autorizado) {
    delete autorizado.permisos.admin_etapa
    delete autorizado.permisos.id_admin_etapa
    delete autorizado.permisos.DeletedAt
    delete autorizado.permisos.CreatedAt
    delete autorizado.permisos.UpdatedAt
    delete autorizado.permisos.ID



    this.infoPermisos = autorizado.permisos

    for (const property in this.infoPermisos) {
      console.log(`${property}: ${this.infoPermisos[property]}`);
    }
    this.modalService.open(content);

  }

}
