import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { UsuarioModelo } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  urbanizaciones: UsuarioModelo[] = [];
  casas: UsuarioModelo[] = [];
  residentes: UsuarioModelo[] = [];
  usuario: string;
  contrasena: string;
  titulo: string;
  etapas: UsuarioModelo[] = [];
  nombre: string;
  correo: string;
  descripcion: string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.getDataUrb();
    this.getDataCasa();
    this.getDataResidente();
    this.getEtapas();
  }

  async gestionContact() {
    let response: any;

    const body = {
      titulo: this.titulo,
      nombre: this.nombre,
      descripcion: this.descripcion,
      correo: this.correo,
    };
    JSON.stringify(body);
    response = await this.auth.createContact(body);
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

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const body = {
      usuario: this.usuario,
      contrasena: this.contrasena,
    };
    JSON.stringify(body);
    Swal.fire({
      icon: "info",
      allowOutsideClick: false,
      text: "Espere por favor",
    });
    Swal.showLoading();

    this.auth.login(body).subscribe(
      (resp) => {
        Swal.close();
        this.router.navigateByUrl("/home");
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error al autenticar",
          text: err.error.message,
        });
      }
    );
  }
}
