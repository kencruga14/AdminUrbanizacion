import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-camaras',
  templateUrl: './camaras.component.html',
  styleUrls: ['./camaras.component.css']
})
export class CamarasComponent implements OnInit {
  @ViewChild('fullScreen', { static: false }) divRef;
  eta = []
  filterName = ''
  camaras = []
  nombrePerfil: string
  imagenPerfil: any
  urlSafe: SafeResourceUrl;
  camarasLoading: boolean = false
  camara: any
  url: any

  constructor(public auth: AuthService, public sanitizer: DomSanitizer, private modalService: NgbModal) { }

  ngOnInit() {
    this.getCamaras()
    const info_eta = localStorage.getItem("info_etapa");
    const info_urb = localStorage.getItem("info_urb");
    this.eta = [JSON.parse(info_urb), JSON.parse(info_eta)];
  }
  getCamaras() {
    this.camarasLoading = true
    this.auth.getCamaras().subscribe((resp: any) => {
      this.camaras = resp;
      this.camarasLoading = false

    });

  }
  openImage(admin) {
    this.imagenPerfil = admin;
  }
  openUrl(camara) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl("http://68.2.123.195:8888/");
    this.nombrePerfil = camara.nombre
  }

  delete(id) {
    Swal.fire({
      title: "¿Seguro que desea eliminar este registro?",
   
      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.deleteCamara(id);
      }
    });
  }
  async deleteCamara(id: number) {
    const response = await this.auth.deleteCamara(id);
    if (response) {
      this.getCamaras();
    }
  }

  preview(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        // this.url = event.target.result; // called once readAsDataURL is completed
        this.camara.imagen = this.url
      }
    }
  }
  async gestionCamara() {
    let response;
    if (this.camara.edit) {
      if (!this.url) {
        delete this.camara.imagen
      }
      response = await this.auth.editCamara(this.camara.ID, this.camara)
      if (response) {
        this.getCamaras();
      }
    } else {
      response = await this.auth.createCamara(this.camara)
      if (response) {
        this.getCamaras();
      }

    }
    this.modalService.dismissAll()
  }
  openModal(contentcamara, camara = null) {
    if (camara) {
      this.camara = camara
      this.camara.edit = true

    } else {
      this.camara = {}
      this.camara.edit = false
    }
    this.modalService.open(contentcamara);

  }
  openFullscreen(elem: any) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

}


