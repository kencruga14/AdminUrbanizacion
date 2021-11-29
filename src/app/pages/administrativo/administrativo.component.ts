import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-administrativo',
  templateUrl: './administrativo.component.html',
  styleUrls: ['./administrativo.component.css']
})
export class AdministrativoComponent implements OnInit {
  admins: UsuarioModelo[] = [];
  id_adminis: 0;
    correo: '';
    nombre: '';
    edit: false;
    cedula: '';
    celular: '';
    telefono: '';
    accesos: '';
    id: 0;
    cargo: '';
    imagen=null;
    changeFoto = false;
    eta= [];


  filterName = '';
  admin = {
    id_adminis: 0,
    cargo: '',
    correo: '',
    nombre: '',
    edit: false,
    cedula: '',
    celular: '',
    telefono: '',
    imagen: null,
  };
  acceso = {
    accesos: '',
    id_adminis: '',
  };


  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getAdministrativos();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];

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
      this.acceso.id_adminis = acceso.id_adminis;
      this.modalService.open(content);
    }

    openAdmin(content, admin = null) {
      if (admin) {
        this.id_adminis = admin.id_adminis;
        this.id = admin.ID;
        this.correo = admin.correo;
        this.cedula = admin.cedula;
        this.nombre = admin.nombre;
        this.admin.edit = true;
        this.cargo = admin.cargo;
        this.celular = admin.celular;
        this.telefono = admin.telefono;
        this.imagen = null;
      } else {
        this.id_adminis = 0;
        this.correo = '';
        this.nombre = '';
        this.cargo = '';
        this.cedula = '';
        this.admin.edit = false;
        this.telefono = '';
        this.celular = '';
        this.imagen = null;
      }
      this.modalService.open(content);
    }
    getAdministrativos() {
      this.auth.getAdministrativos()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.admins = resp;
      });
    }


    async gestionAdmin() {
      let response: any;
      if (this.admin.edit) {
        const body = {
          nombre: this.nombre,
          correo: this.correo,
          telefono: this.telefono,
          cedula: this.cedula,
          cargo: this.cargo,
          celular: this.celular,
          imagen: this.imagen
        };
        JSON.stringify(body);
        response = await this.auth.editAdministrativos(this.id, body);
      } else {
        const body =  {

          nombre: this.nombre,
          correo: this.correo,
          telefono: this.telefono,
          cedula: this.cedula,
          cargo: this.cargo,
          celular: this.celular,
          imagen: this.imagen
        };
        JSON.stringify(body);
        response = await this.auth.createAdministrativos(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getAdministrativos();
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
          this.deleteAdministrativos(id);
        }
      });
    }



    async deleteAdministrativos(id: number) {
      const response = await this.auth.deleteAdministrativos(id);
      if (response) {
        this.getAdministrativos();
      }
    }
}
