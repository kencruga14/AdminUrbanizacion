import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  imagenes: UsuarioModelo[] = [];

  id_galeria: 0;
    titulo: '';
    edit: false;
    imagen=null;
    id: 0;
    changeFoto = false;
    eta = [];


  filterName = '';
  galeria = {
    id_galeria: 0,
    titulo: '',
    edit: false,
    imagen:null,
  };
  acceso = {
    accesos: '',
    id_galeria: '',
  };


  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getGaleria();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];

    }

    openAcceso(content, acceso) {
      this.acceso.id_galeria = acceso.id_galeria;
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

    openGaleria(content, galeria = null) {
      if (galeria) {
        this.id_galeria = galeria.ID;
        this.id = galeria.ID;
        this.titulo = galeria.titulo;
        this.galeria.edit = true;
        this.imagen = null;
      } else {
        this.id_galeria = 0;
        this.titulo = '';
        this.galeria.edit = false;
        this.imagen = null;
      }
      this.modalService.open(content);
    }
    getGaleria() {
      this.auth.getGaleria()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.imagenes = resp;
      });
    }




    async gestionGaleria() {
      let response: any;
      if (this.galeria.edit) {
        const body = {
          titulo : this.titulo,
          imagen : this.imagen,
        };

        response = await this.auth.editGaleria(this.id, body);
      } else {
        const body =  {
          titulo : this.titulo,
          imagen : this.imagen,
        };

        response = await this.auth.createGaleria(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getGaleria();
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
          this.deleteGaleria(id);
        }
      });
    }



    async deleteGaleria(id: number) {
      const response = await this.auth.deleteGaleria(id);
      if (response) {
        this.getGaleria();
      }
    }
}
