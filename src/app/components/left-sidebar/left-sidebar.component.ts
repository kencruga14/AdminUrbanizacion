import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  masters: UsuarioModelo[] = [];
  tipo_usuario: '';
  permisos: any = {}
  modulos: any = {}
  is_master

  constructor(public auth: AuthService,
    private router: Router,
    private modalService: NgbModal,) { }

  ngOnInit() {
    const infomaster = localStorage.getItem("info");
    this.permisos = JSON.parse(localStorage.getItem("permisos"))
    this.modulos = JSON.parse(localStorage.getItem("modulos"))
    this.is_master = JSON.parse(localStorage.getItem("is_master"))
    this.masters = JSON.parse(infomaster);
    console.log("master", this.is_master)
    // this.tipo_usuario = this.masters["rol"]["nombres"];
  }

}
