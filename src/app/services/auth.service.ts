import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from './../../environments/environment';
import { UsuarioModelo } from '../models/usuario.model';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import * as moment from 'moment';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  loading = false;
  master: UsuarioModelo;
  private apikey = '';
  userToken: string;
  info: any;
  infoGuard: any;
  constructor(private http: HttpClient) {
    this.leerToken();
    moment.locale('es');
  }

logout() {
 localStorage.removeItem('token');
 localStorage.removeItem('info');
}

login(body) {
 return this.http.post(
   `https://api.practical.com.ec/auth/admin-etapa`,
   body
 ).pipe(
   map( (resp: any) => {
     this.guardarToken( resp.respuesta);
     console.log(resp.respuesta.token);
     return resp;
   })
 );
}

private guardarToken( idToken: any) {
 this.userToken = idToken.token;
 console.log(this.userToken)
 this.info = JSON.stringify(idToken);
 this.infoGuard = 1;
 localStorage.setItem('token', idToken.token);
 localStorage.setItem('info', JSON.stringify(idToken.usuario));
 localStorage.setItem('info_etapa', JSON.stringify(idToken.nombre_etapa,idToken.nombre_urbanizacion));
 localStorage.setItem('info_urb', JSON.stringify(idToken.nombre_urbanizacion));

}

leerToken() {
 if ( localStorage.getItem('token') ) {
   this.userToken = localStorage.getItem('token');
   this.info = JSON.parse(localStorage.getItem('info'));
   this.infoGuard = 1;
 } else {
   this.userToken = '';
 }
 return this.userToken;

}
//DATOS LOGIN
getDataUrb() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/data/urbanizaciones`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}
getDataCasa() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/data/casas`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}
getDataResidentes() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/data/residentes`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}

// ADMINISTRADOR
getAdmin() {
  console.log("hola");
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/admin-garita`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createAdmin(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/admin-garita`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editAdmin(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteAdmin(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// CASA
getCasa() {

  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/casa`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createCasa(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/casa`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editCasa(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/casa/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteCasa(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/casa/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}
//NOTICIA
getNoticia() {

  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/noticias`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createNoticia(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/noticias-media`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editNoticia(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/noticias/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteNoticia(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/noticias/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}
// ALICUOTA
getAlicuota() {

  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/alicuota`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createAlicuota(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/alicuota`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editAlicuota(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/alicuota/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteAlicuota(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/alicuota/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}



// RESIDENTE
getResidente() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/residente`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}

createResidente(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/residente`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editResidente(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/residente/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteResidente(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/residente/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// CONTACTO
getContacto() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/contactos`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createContacto(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/contactos`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editContacto(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/contactos/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteContacto(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/contactos/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// GAELRIA
getGaleria() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/galeria`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createGaleria(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/galeria`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editGaleria(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/galeria/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteGaleria(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/galeria/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// ADMINISTRATIVOS
getAdministrativos() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/administrativos`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createAdministrativos(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/administrativos`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editAdministrativos(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/admnistrativos/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteAdministrativos(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/administrativos/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

//CONTACTANOS

createContact(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/data/contacto`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// ADMINISTRATIVOS
getAreaSocial() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/area-social`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createAreaSocial(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/area-social`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editAreaSocial(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/area-social/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteAreaSocial(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/area-social/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}


//VOTACION
getEncuesta() {

  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/votacion`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );
}


createEncuesta(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/votacion`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editEncuesta(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/votacion/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteEncuesta(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/votacion/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

//ADMINISTRADOR GARITA
getAdminGarita() {

  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/admin-garita`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );    
}


createAdminGarita(data) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.post(`${environment.apiUrl}/admin-etapa/admin-garita`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

editAdminGarita(id: number, data: any) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.put(`${environment.apiUrl}/admin-etapa/admin-garita/${id}`, data, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

deleteAdminGarita(id: number) {
  this.loading = true;
  const headers = new HttpHeaders({
    token: this.userToken
  });
  return new Promise(resolve => {
    this.http.delete(`${environment.apiUrl}/admin-etapa/votacion/${id}`, {headers}).subscribe((response: any) => {
      this.showAlert(response.message, 'success', 'Listo');
      resolve(true);
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.showAlert(error.error.message, 'error');
      resolve(false);
    });
  });
}

// BITACORA
getBitacoraById() {
  const headers = new HttpHeaders({
    token: this.userToken

  });
  return this.http.get(`${environment.apiUrl}/admin-etapa/visita`, {headers})
  .pipe(
    map( (resp: any) => {
      return resp.respuesta;
    })
  );    
}

  // RECUPERAR CONTRASEÑA

  enviarCodigo(data: string) {
    this.loading = true;
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/recuperar/contrasena`, data).subscribe((response: any) => {
        this.loading = false;
        this.showAlert('Si el correo existe enviaremos una código a su cuenta', 'success', 'Listo');
        resolve(true);
      }, (error: any) => {
        this.loading = false;
        if (this.tokenIsValid(error.status)) {
          this.showAlert('Si el correo existe enviaremos una código a su cuenta', 'success', 'Listo');
        }
        resolve(false);
      });
    });
  }

  recover(data: string) {
    this.loading = true;
    return new Promise(resolve => {
      this.http.put(`${environment.apiUrl}/recuperar/contrasena/update`, data).subscribe((response: any) => {
        this.loading = false;
        this.showAlert('Se cambio con éxito su contraseña', 'success', 'Listo');
        resolve(true);
      }, (error: any) => {
        this.loading = false;
        if (this.tokenIsValid(error.status)) {
          this.showAlert(error.error.respuesta, 'error');
        }
        resolve(false);
      });
    });
  }



showAlert(message: string, tipo: any, confirmBtnText: string = 'Intentar nuevamente') {
  Swal.fire({
    title: '',
    text: message,
    icon: tipo,
    confirmButtonText: confirmBtnText
  });
}



tokenIsValid(status: number) {
  if (status === 405) {
    this.logout();
    return false;
  }
  return true;
}

}
