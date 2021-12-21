import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';

import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UsuarioModelo } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ViewportScroller } from "@angular/common";



@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild('header', { static: false }) top: Element;
  urbanizaciones: UsuarioModelo[] = [];
  casas: UsuarioModelo[] = [];
  residentes: UsuarioModelo[] = [];
  usuario: string;
  contrasena: string;
  validacionUsuario: any;
  titulo: string= null;
  etapas: UsuarioModelo[] = [];
  nombre: string = null;
  correo: string = null;
  descripcion: string;
  banderaLogin: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private scroll: ViewportScroller
  ) { }
  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  ngOnInit() {
    this.getDataUrb();
    this.getDataCasa();
    this.getDataResidente();
    this.getEtapas();
  }

  async gestionContact() {
    if(!this.nombre){
      Swal.fire({
        title: "Por favor llene todos los campos",
        confirmButtonColor: "#343A40",
        confirmButtonText: "OK",
      })
    }else{
    let response: any;
    const body = {
      titulo: this.titulo,
      nombre: this.nombre,
      descripcion: this.descripcion,
      correo: this.correo,
    };
    JSON.stringify(body);
    response = await this.auth.createContact(body);
    if(response){
      this.nombre="";
      this.titulo="";
      this.descripcion="";
      this.correo="";
    }
  }
  }

  getDataUrb() {
    this.auth.getDataUrb().subscribe((resp: any) => {
      console.log(resp);
      this.urbanizaciones = resp;
    });
  }

  getEtapas() {
    this.auth.getDataUrb().subscribe((res: any) => {
      console.log("etapas: ", this.etapas);
    });
  }

  getDataCasa() {
    this.auth.getDataCasa().subscribe((resp: any) => {
      console.log(resp);
      this.casas = resp;
    });
  }

  getDataResidente() {
    this.auth.getDataResidentes().subscribe((resp: any) => {
      console.log(resp);
      this.residentes = resp;
    });
  }

  login() {

    const body = {
      usuario: this.usuario,
      contrasena: this.contrasena,
    };
    JSON.stringify(body);
    // Swal.fire({
    //   icon: "info",
    //   allowOutsideClick: false,
    //   text: "Espere por favor",
    // });
    // Swal.showLoading();
    this.auth.login(body).subscribe(
      (resp) => {
        Swal.close();
        this.router.navigateByUrl("/home");
      },
      (err) => {
        console.log(err);
        this.banderaLogin=true;
        // Swal.fire({
        //   icon: "error",
        //   title: "Error al autenticar",
        //   text: err.error.message,
        // });
      }
    );
  
  }

  capturarUsuario() {
    // console.log("usuario valor: ", this.usuario);
    if (this.usuario) {
      let usuario = this.usuario;
      let body = {
        usuario: this.usuario,
      };
      this.auth.solicitudPassword(body).subscribe(
        (resp) => {
          this.router.navigate(["/cambiarcontrasena", usuario], {
            skipLocationChange: true,
          });
        },
        (err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.error.respuesta,
          });
        }
      );
    } else {
      Swal.fire("Por favor ingrese su usuario");
    }
  }
  scrollToTop($element) {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
}
