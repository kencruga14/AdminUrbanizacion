import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { Category, mailbox, filter, label } from '../categories';
import { MailGlobalVariable, MailService } from '../mail.service';
import { getUser } from '../user-data';
import _ from "lodash";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  public showSidebar = false;
  public config: PerfectScrollbarConfigInterface = {};
  mailboxes: Category[] = mailbox;
  filters: Category[] = filter;
  labels: Category[] = label;
  correo: any = { adjuntos: [] }
  casas = []
  manzanaselector: [];
  casasselector: [];
  manzana: any;
  id_villa: any;
  id_casa: 0;
  residentes = []
  enviados = []
  recibidos = []
  loading = false
  selectedFiles: FileList;

  constructor(public modal: NgbModal, public ms: MailGlobalVariable, public mailService: MailService, public router: Router, private auth: AuthService) {
    if (this.ms.type === null || this.ms.type === '' || this.ms.type === undefined) {
      this.router.navigate(['home/mail/inbox']);
    }
    this.ms.type = 'Recibidos';
  }

  ngOnInit() {
    this.mailboxesChanged("Recibidos")
    this.ms.collectionSize = this.recibidos.length;

    for (const mail of this.recibidos) {
      // tslint:disable-next-line: no-non-null-assertion
      this.ms.users!.push!(getUser!(mail.fromId)!);
    }
    this.ms.topLable = 'Recibidos';
    this.global();
    this.getCasa()

  }
  getResidente() {
    this.auth.getResidente().subscribe((resp: any) => {
      this.residentes = resp;
      console.log("residentes: ", this.residentes);
    });
  }
  global() {

    // this.ms.inboxCount = this.mailService.getInbox().
    //   filter(inbox => inbox.mailbox === 'Recibidos' ).length;

  }
  mobileSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  openModal(content: string) {
    console.log(this.correo.adjuntos)

    this.modal.open(content, { size: 'lg' });
  }
  changeCaterories(category: string) {

    this.ms.users = [];
    for (const mail of this.ms.mailList) {
      // tslint:disable-next-line: no-non-null-assertion
      this.ms.users.push(getUser(mail.fromId)!);
    }
    this.ms.selectedMail = null

    this.ms.topLable = category;
  }

  async mailboxesChanged(type: string) {
    if (type === 'Recibidos') {
      const response = await this.auth.getBuzonRecibidos()
      if (response[0]) {
        this.recibidos = response[1]
        let cont = 0
        this.recibidos.forEach(recibido => {
          if (!recibido.leido) {
            cont++

          }
        });
        this.ms.inboxCount = cont
      }
      this.ms.mailList = this.recibidos;
      this.ms.collectionSize = this.recibidos.length;
      this.changeCaterories(type);
      this.ms.type = 'Recibidos';
      this.router.navigate(['home/mail/inbox']);
    } else if (type === 'Enviado') {
      const response = await this.auth.getBuzonEnviados()
      if (response[0]) {
        this.enviados = response[1]
      }
      this.ms.mailList = this.enviados;
      this.ms.collectionSize = this.enviados.length;
      this.changeCaterories(type);
      this.ms.type = 'Enviado';
      this.router.navigate(['home/mail/enviado']);
    }

  }
  add() {

    // this.casas = [...this.casas, { id_casa: this.id_casa }]
    // console.log(this.casas)
  }
  preview(event: any) {
    this.selectedFiles = event.target.files;

    for (let index = 0; index < this.selectedFiles.length; index++) {
      const element = this.selectedFiles[index];
      this.correo.adjuntos = [...this.correo.adjuntos, element.name];
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
  async enviarCorreo(form) {
    const formData: FormData = new FormData();
    console.log(this.selectedFiles)
    if (this.selectedFiles) {
      for (let index = 0; index < this.selectedFiles.length; index++) {
        const element = this.selectedFiles[index];
        formData.append('file', element);
      }
    }

    this.correo.destinatarios = [{ id_casa: this.id_casa }]
    if (this.correo.publico) {
      delete this.correo.destinatarios
    }
    const archivos = this.correo.adjuntos
    delete this.correo.adjuntos
    const response = await this.auth.enviarMensaje(this.correo)
    if (response[0]) {
      if (archivos.length == 0) {

        this.auth.showAlert("Correo enviado", "success");

      }
      if (archivos.length > 0) {
        const adjuntos = await this.auth.enviarMensajeAdjunto(response[1], formData)
        if (adjuntos) {
          this.auth.showAlert("Correo enviado", "success");
        } else {
          this.auth.showAlert("Error al enviar correo.", "error");

        }
      }

    }

    this.id_casa = 0
    this.manzana = 0
    this.correo = { adjuntos: [] }
    this.mailboxesChanged("Recibidos")
    this.modal.dismissAll()
  }
  descartar() {
    this.id_casa = 0
    this.manzana = 0
    this.correo = { adjuntos: [] }
  }
  getCasa() {
    this.auth.getCasa().subscribe((resp: any) => {
      console.log("casas: ", resp);
      this.casas = resp;
      this.manzanaselector = _.uniqBy(resp, (obj) => obj.manzana);
      console.log("Manzana selector: ", this.manzanaselector);
    });
  }
  getVillas(value) {
    this.auth.getCasasByManzana(value).subscribe((resp: any) => {
      console.log("getCasasByManzana: ", resp);
      this.casasselector = resp;
      // this.c = _.uniqBy(resp, (obj) => obj.manzana);
      // console.log("Manzana selector: ", this.casasselector);
    });
  }
  async mailSelected(mail) {

    this.ms.selectedMail = mail;
    if (!mail.leido) {
      this.ms.inboxCount--
    }
    this.ms.selectedMail.seen = true;
    mail.leido = true
    mail.seen = true;
    this.ms.addClass = true;
    this.global();
    const response = await this.auth.getMensajePorId(mail.ID)
    if (response[0]) {
      this.ms.selectedMail.respuestas = response[1].mensajes
      console.log(this.ms.selectedMail.respuestas)
    } else {
      this.ms.selectedMail.respuestas = []

    }
    if (this.ms.type === 'Recibidos') {
      this.router.navigate(['home/mail/inbox', mail.ID]);
    }

    if (this.ms.type === 'Enviado') {
      this.router.navigate(['home/mail/enviado', mail.ID]);
    }
  }
  async getBuzonEnviados() {

  }
  async getBuzonRecibidos() {
    this.loading = true;
    const response = await this.auth.getBuzonRecibidos()
    if (response[0]) {
      this.recibidos = response[1]
    }
    this.loading = false;

    this.ms.mailList = this.recibidos;
  }

}
