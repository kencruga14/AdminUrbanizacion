import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModelo } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
masters: UsuarioModelo[] =[]; 
  constructor(private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,) { }


  ngOnInit() {
    const infomaster = localStorage.getItem("info");
    this.masters = [JSON.parse(infomaster)];
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
