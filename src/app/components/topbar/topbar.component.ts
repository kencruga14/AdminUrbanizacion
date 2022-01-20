import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
masters: UsuarioModelo[] =[]; 
  constructor(public auth: AuthService,
    private router: Router,
    private modalService: NgbModal,) { }


  ngOnInit() {
    const infomaster = localStorage.getItem("info");
    this.masters = [JSON.parse(infomaster)];
    console.log("usuario nabvar: ", this.masters)

  }

  logout() {
    Swal.fire({
      title: "¿Seguro que quiere salir ?",
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        // setTimeout(() => {this.auth.logout(),5000})
        this.auth.logout();
        this.router.navigateByUrl('/login');
      }
    });
    
  }

  

  openLogOut(content, item ) {
    this.modalService.open(content, { size: "sm" });
  }



  cancelar(){
    this.modalService.dismissAll();
  }

}
