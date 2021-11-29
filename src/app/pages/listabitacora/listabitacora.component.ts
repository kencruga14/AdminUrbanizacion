import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listabitacora',
  templateUrl: './listabitacora.component.html',
  styleUrls: ['./listabitacora.component.css']
})
export class ListabitacoraComponent implements OnInit {
  bitacoras: UsuarioModelo[] = [];
  id_visita: 0;
    cedula: '';
    nombres: '';
    edit: false;
    motivo: '';
    placa: '';
    accesos: '';
    guardia: '';
    id: 0;
    eta=[];

  filterName = '';
  visita = {
    id_visita: 0,
    cedula: '',
    nombres: '',
    edit: false,
    motivo: '',
    placa: '',
    id_casa: 0,
    guardia: '',
    imagen: null,
  };

  menu = [];
  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute ) { }


    ngOnInit() {
      this.getBitacora();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];
      

    }

   

    getBitacora() {
      this.auth.getBitacoraById()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.bitacoras = resp;
      });
    }
   

  }
