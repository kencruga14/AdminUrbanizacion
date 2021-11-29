import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-alicuota',
  templateUrl: './alicuota.component.html',
  styleUrls: ['./alicuota.component.css']
})
export class AlicuotaComponent implements OnInit {
  casas: UsuarioModelo[] = [];
  alicuotas: UsuarioModelo[] =[];
   id_casa: 0;
    valor: '';
    fecha_pago: '';
    edit: false;
    id: 0;
    id_alicuota: '';
    changeFoto = false;
    eta=[];


  filterName = '';
  alicuota = {
    id_casa: 0,
    valor: '',
    fecha_pago: '',
    edit: false,
    id_alicuota: '',
  };
  acceso = {
    accesos: '',
    id_alicuota: '',
  };

  constructor(public auth: AuthService,
              private router: Router,
              private modalService: NgbModal, ) { }


    ngOnInit() {
      this.getCasa();
      this.getAlicuota();
      const info_eta = localStorage.getItem("info_etapa");
      const info_urb = localStorage.getItem("info_urb");
      this.eta = [JSON.parse(info_urb),JSON.parse(info_eta)];
    }

    getCasa() {
      this.auth.getCasa()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.casas = resp;
      });
    }

    openAcceso(content, acceso) {
      this.acceso.id_alicuota = acceso.id_alicuota;
      this.modalService.open(content);
    }


    openAlicuota(content, alicuota = null) {
      if (alicuota) {
        this.id_alicuota = alicuota.ID;
        this.id = alicuota.ID;
        this.valor = alicuota.valor;
        this.fecha_pago = alicuota.fecha_pago;
        this.alicuota.edit = true;
        this.id_casa = alicuota.id_casa
      } else {
        this.id_casa = 0;
        this.valor = '';
        this.fecha_pago = '';
        this.alicuota.edit = false;
        this.id_alicuota = '';
      }
      this.modalService.open(content);
    }
    getAlicuota() {
      this.auth.getAlicuota()
      .subscribe( (resp: any) => {
        console.log(resp);
        this.alicuotas = resp;
      });
    }


    async gestionAlicuota() {
      let response: any;
      if (this.alicuota.edit) {
        const body = {

          valor: parseFloat(this.valor),
          fecha_pago: this.fecha_pago,
          id_casa: this.id_casa
        };
        JSON.stringify(body);
        response = await this.auth.editAlicuota(this.id, body);
      } else {
        const body =  {
          valor: parseFloat(this.valor),
          fecha_pago: this.fecha_pago,
          id_casa: this.id_casa
        };
        JSON.stringify(body);
        response = await this.auth.createAlicuota(body);
      }
      if (response) {
        this.modalService.dismissAll();
        this.getAlicuota();
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
}
