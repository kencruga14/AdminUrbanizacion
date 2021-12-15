import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import Swal from "sweetalert2";
import { environment } from "./../../environments/environment";
import { UsuarioModelo } from "../models/usuario.model";
import { AngularWaitBarrier } from "blocking-proxy/built/lib/angular_wait_barrier";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  permisos: any = {};
  loading = false;
  master: UsuarioModelo;
  private apikey = "";
  userToken: string;
  info: any;
  infoGuard: any;
  constructor(private http: HttpClient) {
    this.leerToken();
    moment.locale("es");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("info");
    localStorage.removeItem("permisos");
  }

  login(body) {
    return this.http
      .post(`https://api.practical.com.ec/auth/admin-etapa`, body)
      .pipe(
        map((resp: any) => {
          this.guardarToken(resp.respuesta);
          //  console.log(resp.respuesta.token);
          return resp;
        })
      );
  }

  solicitudPassword(body) {
    return this.http
      .post(`https://api.practical.com.ec/auth/recover/admin-etapa`, body)
      .pipe(
        map(
          (resp: any) => {
            // console.log("usuario si existe: ");
          },
          (error: any) => {
            // console.log("error: ", error.error.respuesta);
            // Swal.fire(error.error.respuesta);
          }
        )
      );
  }

  modificarContraseña(body) {
    return this.http
      .post(
        `https://api.practical.com.ec/auth/recover/admin-etapa/cambio`,
        body
      )
      .pipe(
        map(
          (resp: any) => {
            // console.log("usuario si existe: ");
          },
          (error: any) => {
            // console.log("error: ", error.error.respuesta);
            // Swal.fire(error.error.respuesta);
          }
        )
      );
  }

  private guardarToken(idToken: any) {
    this.userToken = idToken.token;
    console.log("guardar token: ", idToken);
    this.info = JSON.stringify(idToken);
    this.infoGuard = 1;
    localStorage.setItem("token", idToken.token);
    localStorage.setItem("info", JSON.stringify(idToken.usuario));
    localStorage.setItem("permisos", JSON.stringify(idToken.permisos));
    localStorage.setItem("is_master", JSON.stringify(idToken.is_master));

    localStorage.setItem(
      "info_etapa",
      JSON.stringify(idToken.nombre_etapa, idToken.nombre_urbanizacion)
    );
    localStorage.setItem(
      "info_urb",
      JSON.stringify(idToken.nombre_urbanizacion)
    );
    localStorage.setItem("id_urbanizacion", JSON.stringify(idToken.ID));
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
      this.info = JSON.parse(localStorage.getItem("info"));
      this.permisos = JSON.parse(localStorage.getItem("permisos"));

      this.infoGuard = 1;
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }
  //DATOS LOGIN
  getDataUrb() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/data/urbanizaciones`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getDataCasa() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http.get(`${environment.apiUrl}/data/etapas`, { headers }).pipe(
      map((resp: any) => {
        return resp.respuesta;
      })
    );
  }
  getDataResidentes() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/data/residentes`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  // ADMINISTRADOR
  getAdmin() {
    // console.log("hola");
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/admin-garita`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  obtenerEmprendimeintos() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/emprendimiento`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getCategorias() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/categoria`, { headers })
      .pipe(
        map((resp: any) => {
          console.log({ resp });
          return resp.respuesta;
        })
      );
  }

  getEmprendimientos(categoriaID) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(
        `${environment.apiUrl}/admin-etapa/emprendimiento?id_categoria=${categoriaID}`,
        { headers }
      )
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createAdmin(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/admin-garita`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editAdmin(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteAdmin(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // CASA
  getCasa() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/casa`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getCasaByUrbanizacion(id) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/urbanizacion/${id}/casas`, {
        headers,
      })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getAlicuotasByMz(mz: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/alicuota?mz=${mz}`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getAlicuotasByMzVil(mz: number, villa: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(
        `${environment.apiUrl}/admin-etapa/alicuota?mz=${mz}&villa=${villa}`,
        { headers }
      )
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getAlicuotasByMzVilEstado(mz: number, villa: number, estado: string) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(
        `${environment.apiUrl}/admin-etapa/alicuota?mz=${mz}&villa=${villa}&estado=${estado}`,
        { headers }
      )
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getCasasByManzana(id: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/casa?mz=${id}`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }
  alicuotasFilter(mz, villa) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/casa?mz=${mz}&villa=${villa}`, {
        headers,
      })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  // Expreso
  getExpresos() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/autorizados`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createExpreso(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/autorizados`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editExpreso(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/autorizados/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteExpreso(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/autorizados/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  createCasa(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/casa`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editCasa(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/casa/${id}`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteCasa(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/casa/${id}`, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  //NOTICIA
  getNoticia() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/noticias`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createNoticia(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/noticias-media`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editNoticia(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/noticias/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteNoticia(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/noticias/${id}`, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  // ALICUOTA
  getAlicuota() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/alicuota`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createAlicuota(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/alicuota/bulk`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editAlicuota(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/alicuota/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }


  
  editTodasAlicuota( data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/alicuotas/bulk`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteAlicuota(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/alicuota/${id}`, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // RESIDENTE
  getResidente() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/residente`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createResidente(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/residente`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.respuesta, "error");
            console.log("error crear residente: ", error.error.respuesta);

            resolve(false);
          }
        );
    });
  }

  editResidente(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/residente/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.respuesta, "error");
            resolve(false);
          }
        );
    });
  }

  deleteResidente(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/residente/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // CONTACTO
  getContacto() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/contactos`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createContacto(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/contactos`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editContacto(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/contactos/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteContacto(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/contactos/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // GAELRIA
  getGaleria() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/galeria`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createGaleria(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/galeria`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editGaleria(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/galeria/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteGaleria(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/galeria/${id}`, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // ADMINISTRATIVOS
  getAdministrativos() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/administrativos`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createAdministrativos(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/administrativos`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editAdministrativos(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/administrativos/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  deleteEmprendimiento(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/emprendimiento/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteAdministrativos(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/administrativos/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  //CONTACTANOS

  createContact(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/data/contacto`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // ADMINISTRATIVOS
  getAreaSocial() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/area-social`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  getReservasAreaSocialxId(id: string) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/area-social/${id}`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }


  getRecaudacionesAreaSocialxId(id: string, fecha1: string, fecha2: string) {
    let params = new HttpParams();
    params = params.append("fecha_inicio", fecha1)
    params = params.append("fecha_fin", fecha2)
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/area-social/${id}`, { headers, params })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }


  getBuzonRecibidos() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .get(`${environment.apiUrl}/admin-etapa/buzon-recibidos`, { headers })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
          },
          (error: any) => {
            console.log(error);
            if (!this.tokenIsValid(error.status)) {
              // this.showAlert("Error al cargar miembros", "error");
            }
            resolve([false]);
          }
        );
    });
  }
  getMensajePorId(id) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .get(`${environment.apiUrl}/admin-etapa/buzon/${id}`, { headers })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
          },
          (error: any) => {
            console.log(error);
            if (!this.tokenIsValid(error.status)) {
              // this.showAlert("Error al cargar miembros", "error");
            }
            resolve([false]);
          }
        );
    });
  }
  getAutorizaciones(tipo, estado, id_casa) {
    let params = new HttpParams();
    if (tipo || tipo == "") params = params.append("tipo", tipo)
    if (estado || estado == "") params = params.append("estado", estado)
    if (id_casa) params = params.append("id_casa", id_casa)

    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .get(`${environment.apiUrl}/admin-etapa/autorizacion`, { headers, params })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
          },
          (error: any) => {
            console.log(error);
            if (!this.tokenIsValid(error.status)) {
              // this.showAlert("Error al cargar miembros", "error");
            }
            resolve([false]);
          }
        );
    });
  }

  getBuzonEnviados() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .get(`${environment.apiUrl}/admin-etapa/buzon-enviados`, { headers })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
          },
          (error: any) => {
            console.log(error);
            if (!this.tokenIsValid(error.status)) {
              // this.showAlert("Error al cargar miembros", "error");
            }
            resolve([false]);
          }
        );
    });
  }

  createAreaSocial(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/area-social`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  enviarMensaje(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/buzon`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  responderMensaje(id, data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/buzon/${id}/responder`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            resolve([true, response.respuesta]);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  enviarMensajeAdjunto(id, data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/buzon/${id}/archivos`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert("error", "error");
            resolve(false);
          }
        );
    });
  }

  editAreaSocial(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/area-social/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteAreaSocial(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/area-social/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  //VOTACION
  getEncuesta() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/votacion`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createEncuesta(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/votacion`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  getEncuestaById(id: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/votacion/${id}`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  editEncuesta(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/votacion/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteEncuesta(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/votacion/${id}`, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  //ADMINISTRADOR GARITA
  getAdminGarita() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/admin-garita`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  visitasByFilter(mz: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/visita?mz=${mz}`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  visitasByFilterMzVillas(mz: number, villa: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/visita?mz=${mz}&villa=${villa}`, {
        headers,
      })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  visitasByFilterMzVillasDate(mz: number, villa: number, fecha) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(
        `${environment.apiUrl}/admin-etapa/visita?mz=${mz}&villa=${villa}&fecha=${fecha}`,
        {
          headers,
        }
      )
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  filterBitacoraFecha(valor) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/visita?fecha=${valor}`, {
        headers,
      })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  createAdminGarita(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/admin-garita`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editAdminGarita(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  getUrbanizaciones() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/master/etapa`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  deleteAdminGarita(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // BITACORA
  getBitacoraById() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/visita`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  // RECUPERAR CONTRASEÑA

  enviarCodigo(data: string) {
    this.loading = true;
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/recuperar/contrasena`, data)
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.showAlert(
              "Si el correo existe enviaremos una código a su cuenta",
              "success",
              "Listo"
            );
            resolve(true);
          },
          (error: any) => {
            this.loading = false;
            if (this.tokenIsValid(error.status)) {
              this.showAlert(
                "Si el correo existe enviaremos una código a su cuenta",
                "success",
                "Listo"
              );
            }
            resolve(false);
          }
        );
    });
  }

  recover(data: string) {
    this.loading = true;
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/recuperar/contrasena/update`, data)
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.showAlert(
              "Se cambio con éxito su contraseña",
              "success",
              "Listo"
            );
            resolve(true);
          },
          (error: any) => {
            this.loading = false;
            if (this.tokenIsValid(error.status)) {
              this.showAlert(error.error.respuesta, "error");
            }
            resolve(false);
          }
        );
    });
  }

  showAlert(
    message: string,
    tipo: any,
    confirmBtnText: string = "Intentar nuevamente"
  ) {
    Swal.fire({
      title: "",
      text: message,
      icon: tipo,
      confirmButtonText: confirmBtnText,
    });
  }

  tokenIsValid(status: number) {
    if (status === 405) {
      this.logout();
      return false;
    }
    return true;
  }
  getCamaras() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/camaras`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }
  deleteCamara(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/camaras/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  editCamara(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/camaras/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  createCamara(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/camaras`, data, { headers })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  getAutorizados() {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return this.http
      .get(`${environment.apiUrl}/admin-etapa/admin-etapa`, { headers })
      .pipe(
        map((resp: any) => {
          return resp.respuesta;
        })
      );
  }

  editAutorizado(id: number, data: any) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/admin-etapa/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
          },
          (error: any) => {
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  createAutorizado(data) {
    console.log(data);
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/admin-etapa`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
  deleteAutorizado(id: number) {
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/admin-etapa/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  // horarios

  createHorario(data) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .post(`${environment.apiUrl}/admin-etapa/area-horarios`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  editHorario(id: number, data: any) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .put(`${environment.apiUrl}/admin-etapa/area-horarios/${id}`, data, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }

  deleteHorario(id: number) {
    this.loading = true;
    const headers = new HttpHeaders({
      token: this.userToken,
    });
    return new Promise((resolve) => {
      this.http
        .delete(`${environment.apiUrl}/admin-etapa/area-horarios/${id}`, {
          headers,
        })
        .subscribe(
          (response: any) => {
            this.showAlert(response.message, "success", "Listo");
            resolve(true);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.showAlert(error.error.message, "error");
            resolve(false);
          }
        );
    });
  }
}
