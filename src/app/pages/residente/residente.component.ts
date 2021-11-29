import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-residente',
  templateUrl: './residente.component.html',
  styleUrls: ['./residente.component.css']
})
export class ResidenteComponent implements OnInit {
  residentes: UsuarioModelo[] = [];
  casas: UsuarioModelo[] = [];
  id_residente: 0;
  id_casa: 0;
    nombres: '';
    edit: false;
    telefono: '';
    imagen=null;
    id: 0;
    correo: '';
    celular: '';
    usuario: '';
    cedula: '';
    contrasena: '';
    changeFoto = false;
    is_principal : boolean;
    eta=[];


  filterName = '';
  residente = {
    id_casa: 0,
    celular: '',
    id_residente: 0,
    nombres: '',
    edit: false,
    imagen:null,
    correo: '',
    telefono: '',
    usuario: '',
    cedula:'',
    contrasena:'',
    is_principal: false
  };
  acceso = {
    accesos: '',
    id_residente: '',
  };

  menu = ['Residentes'];
  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getResidente();
      this.getCasa();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];


    }
    getResidente() {
      this.auth.getResidente()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.residentes = resp;
      });
    }
    getCasa() {
      this.auth.getCasa()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.casas = resp;
      });
    }
    openAcceso(content, acceso) {
      this.acceso.id_residente = acceso.id_etapa;
      this.modalService.open(content);
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

    openResidente(content, residente = null) {
      if (residente) {
        this.id_residente = residente.ID;
        this.id = residente.ID;
        this.celular = residente.celular;
        this.contrasena = residente.contrasena;
        this.cedula = residente.cedula;
        this.correo = residente.usuario.correo;
        this.nombres = residente.usuario.nombres;
        this.residente.edit = true;
        this.telefono = residente.usuario.telefono;
        this.usuario = residente.usuario.usuario;
        this.imagen = null;
        this.id_casa = residente.id_casa;
        this.is_principal = residente.is_principal
      } else {
        this.id_residente = 0;
        this.correo = '';
        this.contrasena = '';
        this.cedula = '';
        this.celular = '';
        this.nombres = '';
        this.residente.edit = false;
        this.telefono = '';
        this.imagen = null;
        this.usuario = '';
        this.id_casa = 0;
        this.is_principal = false
      }
      this.modalService.open(content);
    }




    async gestionResidente() {
      let response: any;
      if (this.residente.edit) {
        const body = {
          id_casa: this.id_casa,
          is_principal : this.is_principal,
          usuario:
        {

          correo : this.correo,
          celular : this.celular,
          nombres : this.nombres,
          telefono : this.telefono,
          imagen : this.imagen,
          usuario : this.usuario,
          cedula : this.cedula,
          contrasena : this.contrasena,

        }};

        response = await this.auth.editResidente(this.id, body);
      } else {
        const body =  {
          id_casa: this.id_casa,
          is_principal : this.is_principal,
          usuario:{
          correo : this.correo,
          celular: this.celular,
          nombres : this.nombres,
          telefono : this.telefono,
          imagen : this.imagen,
          usuario : this.usuario,
          cedula : this.cedula,
          contrasena : this.contrasena,
        }};

        response = await this.auth.createResidente(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getResidente();
      }
    }
    delete(id: number) {
      Swal.fire({
        title: '¿Seguro que desea eliminar este registro?',
        text: 'Esta acción no se puede reversar',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#343A40',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.deleteResidente(id);
        }
      });
    }



    async deleteResidente(id: number) {
      const response = await this.auth.deleteResidente(id);
      if (response) {
        this.getResidente();
      }
    }
}
