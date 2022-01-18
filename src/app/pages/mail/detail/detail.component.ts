import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { MailGlobalVariable, MailService } from '../mail.service';
import _ from "lodash";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild("utlimo", { static: false }) chat: ElementRef;
  separatedArrayDetails = [];
  mensaje: any = { adjuntos: [] }
  selectedFiles: FileList;
  myFiles: string[] = [];
  tipo: boolean;
  constructor(public ms: MailGlobalVariable,
    public mailService: MailService, public router: Router, public auth: AuthService,
    public modal: NgbModal) { }
  ngOnDestroy(): void {
    this.ms.selectedMail = null
  }

  ngOnInit() {

  }

  global() {
    this.ms.inboxCount = this.mailService.getInbox().
      filter(inbox => inbox.mailbox === 'Recibidos' && inbox.seen === false).length;

  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }

  async enviarRespuesta(form) {
    const formData: FormData = new FormData();
    if (this.selectedFiles) {
      for (let index = 0; index < this.myFiles.length; index++) {
        const element = this.myFiles[index];
        formData.append('archivos[]', element);
      }
    }
    let archivos = this.mensaje.adjuntos
    console.log(archivos)
    delete this.mensaje.adjuntos
    console.log(this.tipo)
    if (this.tipo) {
      this.mensaje.publico = this.ms.selectedMail.publico
      this.mensaje.destinatarios = this.ms.selectedMail.destinatarios
      const response = await this.auth.responderMensaje(this.ms.selectedMail.ID, this.mensaje)
      if (response[0]) {
        if (archivos.length == 0) {
          this.auth.showAlert("Correo enviado", "success");
          const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
          this.ms.selectedMail.mensajes = response2[1].mensajes.reverse()
          console.log("1", this.ms.selectedMail.mensajes)
        }
        if (archivos.length > 0) {
          const adjuntos = await this.auth.enviarMensajeAdjunto(response[1], formData)
          if (adjuntos) {
            this.auth.showAlert("Correo enviado", "success");
            const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
            this.ms.selectedMail.mensajes = response2[1].mensajes.reverse()
            console.log("2", this.ms.selectedMail.mensajes)
          } else {
            this.auth.showAlert("Error al enviar correo.", "error");

          }
        }

      }
    } else {
      const response = await this.auth.responderMensajeP(this.mensaje.destinatario, this.ms.selectedMail, this.mensaje)
      if (response[0]) {
        if (archivos.length == 0) {
          this.auth.showAlert("Correo enviado", "success");
          const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
          this.ms.selectedMail.mensajes = response2[1].mensajes.reverse()
          console.log("3", this.ms.selectedMail.mensajes)
        }
        if (archivos.length > 0) {
          const adjuntos = await this.auth.enviarMensajeAdjunto(response[1], formData)
          if (adjuntos) {
            this.auth.showAlert("Correo enviado", "success");
            const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
            this.ms.selectedMail.mensajes = response2[1].mensajes.reverse()
            console.log("4", this.ms.selectedMail.mensajes)
          } else {
            this.auth.showAlert("Error al enviar correo.", "error");

          }
        }

      }
    }


    this.modal.dismissAll()
    this.mensaje = { adjuntos: [] }
    this.myFiles = []
    this.selectedFiles = new FileList

  }
  descartar() {
    this.myFiles = []
    this.mensaje = { adjuntos: [] }
    this.myFiles = []
  }
  openModal(content: string, mensaje, tipo) {
    this.tipo = tipo
    this.mensaje.destinatario = mensaje.ID
    this.mensaje.titulo = mensaje.titulo
    console.log(this.mensaje.adjuntos)

    this.modal.open(content, { size: 'lg' });
  }
  async eliminar() {


    Swal.fire({
      title: "¿Seguro que desea eliminar este registro?",

      showCancelButton: true,
      confirmButtonColor: "#343A40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        const response = await this.auth.deleteBuzon(this.ms.selectedMail.ID)
        let temp;
        if (response) {
          let mail = this.ms.selectedMail
          this.ms.selectedMail = null
          this.ms.selectedMailId = 0
          _.remove(this.ms.mailList, function (n) {
            return n.ID == mail.ID;
          });

        }
      }
    });


  }
  preview(event: any) {
    this.selectedFiles = event.target.files;
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }

    for (let index = 0; index < this.selectedFiles.length; index++) {
      const element = this.selectedFiles[index];
      this.mensaje.adjuntos = [...this.mensaje.adjuntos, element.name];
    }

    // if (event.target.files && event.target.files[0]) {
    //   let file = {
    //     nombre: event.target.files[0].name,
    //     archivo: null
    //   }

    //   var reader = new FileReader();
    //   reader.readAsDataURL(event.target.files[0]); // read file as data url
    //   reader.onload = (event) => {
    //     file.archivo = event.target
    //     // this.url = event.target.result; // called once readAsDataURL is completed
    //     this.correo.adjuntos = [...this.correo.adjuntos, file];
    //   }
    // }
  }
  eliminarArchivo(index) {
    let temp = [...this.myFiles];
    temp.splice(index, 1);
    this.myFiles = temp;
    let temp2 = [...this.mensaje.adjuntos];
    temp2.splice(index, 1);
    this.mensaje.adjuntos = temp2
  }
}
