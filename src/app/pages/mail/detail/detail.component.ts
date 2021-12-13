import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { MailGlobalVariable, MailService } from '../mail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @ViewChild("utlimo", { static: false }) chat: ElementRef;

  mensaje: any = { adjuntos: [] }
  constructor(public ms: MailGlobalVariable,
    public mailService: MailService, public router: Router, public auth: AuthService,
    public modal: NgbModal) { }

  ngOnInit() {

  }
  global() {
    this.ms.inboxCount = this.mailService.getInbox().
      filter(inbox => inbox.mailbox === 'Recibidos' && inbox.seen === false).length;

  }

  reply() {
    this.ms.replyShow = true;
  }

  sendButtonClick() {
    this.ms.replyShow = false;
  }

  removeClass() {
    this.ms.addClass = false;
  }
  async enviarRespuesta(form) {
    let archivos = this.mensaje.adjuntos

    if (!this.mensaje.adjuntos) {
      archivos = []
    }
    delete this.mensaje.adjuntos

    const response = await this.auth.responderMensaje(this.mensaje.destinatario, this.mensaje)
    if (response[0]) {
      if (archivos.length == 0 || archivos.length) {
        this.auth.showAlert("Correo enviado", "success");
        console.log
        const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
        this.ms.selectedMail.respuestas = response2[1].mensajes
      }
      if (archivos.length > 0) {

        const adjuntos = await this.auth.enviarMensajeAdjunto(response[1], form)
        if (adjuntos) {
          this.auth.showAlert("Correo enviado", "success");
          const response2 = await this.auth.getMensajePorId(this.ms.selectedMail.ID)
          this.ms.selectedMail.respuestas = response2[1].mensajes
        } else {
          this.auth.showAlert("Error al enviar correo.", "error");

        }

      }

    }
    this.mensaje = {}
    this.modal.dismissAll()

  }
  descartar() {
    this.mensaje = {}
  }
  openModal(content: string, mensaje) {
    this.mensaje.destinatario = mensaje.ID
    this.mensaje.titulo = mensaje.titulo
    console.log(this.mensaje.adjuntos)

    this.modal.open(content, { size: 'lg' });
  }
  preview(event: any) {
    if (this.mensaje.adjuntos.length > 10) {
      return
    }
    if (event.target.files && event.target.files[0]) {
      let file = {
        nombre: event.target.files[0].name,
        archivo: null
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        file.archivo = event.target
        // this.url = event.target.result; // called once readAsDataURL is completed
        this.mensaje.adjuntos = [...this.mensaje.adjuntos, file];
        console.log(this.mensaje.adjuntos)
      }
    }
  }
}
