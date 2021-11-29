import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { not } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit {
  noticias: UsuarioModelo[] = [];
  etapas: UsuarioModelo[] =[];
   id_noticia: 0;
    titulo: '';
    cuerpo: '';
    edit: false;
    id: 0;
    eta=[];
    archivos: any;


  filterName = '';
  noticia = {
    id_noticia: 0,
    titulo: '',
    cuerpo: '',
    edit: false,
    archivos: '',
  };
  acceso = {
    accesos: '',
    id_noticia: '',
  };


  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getNoticia();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];

    }



    openAcceso(content, acceso) {
      this.acceso.id_noticia = acceso.id_noticia;
      this.modalService.open(content);
    }


    openNoticia(content, noticia = null) {
      if (noticia) {
        this.id_noticia = noticia.ID;
        this.id = noticia.ID;
        this.titulo = noticia.titulo;
        this.cuerpo = noticia.cuerpo;
        this.noticia.edit = true;
      } else {
        this.id_noticia = 0;
        this.titulo = '';
        this.cuerpo = '';
        this.noticia.edit = false;
      }
      this.modalService.open(content);
    }
    getNoticia() {
      this.auth.getNoticia()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.noticias = resp;
      });
    }


    async gestionNoticia() {
      let response: any;
      if (this.noticia.edit) {
        const body = `titulo=${this.titulo}&cuerpo=${this.cuerpo}&archivos=${this.archivos}`;
       
        response = await this.auth.editNoticia(this.id, body);
      } else {
        const body = new FormData();
        body.append('titulo', this.titulo);
        body.append('cuerpo', this.cuerpo);
        body.append('archivos', this.archivos);
        response = await this.auth.createNoticia(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getNoticia();
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
          this.deleteNoticia(id);
        }
      });
    }



    async deleteNoticia(id: number) {
      const response = await this.auth.deleteNoticia(id);
      if (response) {
        this.getNoticia();
      }
    }
}
