import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
@Component({
  selector: "app-cambiarcontrasena",
  templateUrl: "./cambiarcontrasena.component.html",
  styleUrls: ["./cambiarcontrasena.component.css"],
})
export class CambiarcontrasenaComponent implements OnInit {
  navigationSubscription;
  usuario: any;
  codigoTemporal: any;
  password: any;
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initializar();
      }
    });
  }

  initializar() {
    if (this.route.snapshot.params.usuario.length) {
      this.usuario = this.route.snapshot.params.usuario;
    }
  }

  ngOnInit() {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const body = {
      usuario: this.usuario,
      codigo_temporal: this.codigoTemporal,
      nueva_contrasena: this.password,
    };
    // console.log("body cambiar contraseña: ", body);
    JSON.stringify(body);
    this.auth.modificarContraseña(body).subscribe(
      (resp) => {
        Swal.fire({
          icon: "success",
          title: "Contraseña modificada exitosamente",
          text: "",
        });
        this.router.navigateByUrl("/login");
      },
      (err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error al modificar contraseña",
          text: err.error.respuesta,
        });
      }
    );
  }

  
}
