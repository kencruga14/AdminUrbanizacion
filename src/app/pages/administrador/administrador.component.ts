import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  admins: UsuarioModelo[] = [];
  id_usuario: 0;
    correo: '';
    nombres: '';
    edit: false;
    contrasena: '';
    usuario: '';
    telefono: '';
    accesos: '';
    id: 0;
    imagen=null;
    changeFoto = false;
    eta= [];


  filterName = '';
  admin = {
    id_usuario: 0,
    correo: '',
    nombres: '',
    edit: false,
    contrasena: '',
    usuario: '',
    telefono: '',
    imagen: null,
  };
  acceso = {
    accesos: '',
    id_usuario: '',
  };

  menu = ['Administradores de Etapa'];
  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getAdmin();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [,JSON.parse(info_urb),JSON.parse(info_eta)];

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
    openAcceso(content, acceso) {
      this.acceso.id_usuario = acceso.id_usuario;
      this.modalService.open(content);
    }

    openAdmin(content, admin = null) {
      if (admin) {
        this.id_usuario = admin.usuario.id_usuario;
        this.id = admin.ID;
        this.correo = admin.correo;
        this.contrasena = admin.clave;
        this.nombres = admin.usuario.nombres;
        this.admin.edit = true;
        this.usuario = admin.usuario.usuario;
        this.telefono = admin.usuario.telefono;
        this.contrasena = admin.usuario.contrasena;
        this.imagen = null;
      } else {
        this.id_usuario = 0;
        this.correo = '';
        this.nombres = '';
        this.contrasena = '';
        this.admin.edit = false;
        this.telefono = '';
        this.usuario = '';
        this.imagen = null;
      }
      this.modalService.open(content);
    }
    getAdmin() {
      this.auth.getAdmin()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.admins = resp;
      });
    }


    async gestionAdmin() {
      let response: any;
      if (this.admin.edit) {
        const body = {
          usuario:{
          nombres: this.nombres,
          correo: this.correo,
          telefono: this.telefono,
          usuario: this.usuario,
          contrasena: this.contrasena,
          imagen: this.imagen
        }};
        JSON.stringify(body);
        response = await this.auth.editAdmin(this.id, body);
      } else {
        const body =  {
          usuario:{
          nombres: this.nombres,
          correo: this.correo,
          telefono: this.telefono,
          usuario: this.usuario,
          contrasena: this.contrasena,
          imagen: this.imagen
        }};
        JSON.stringify(body);
        response = await this.auth.createAdmin(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getAdmin();
      }
    }
    delete(id: number) {
      Swal.fire({
        title: '¿Seguro que desea eliminar este registro?',
       
        showCancelButton: true,
        confirmButtonColor: '#343A40',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.deleteAdmin(id);
        }
      });
    }



    async deleteAdmin(id: number) {
      const response = await this.auth.deleteAdmin(id);
      if (response) {
        this.getAdmin();
      }
    }
}
