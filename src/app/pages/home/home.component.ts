import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ScriptService } from '../../services/script.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu = ['Home', 'Page 1', 'Page 2'];
  constructor(private scriptServ: ScriptService, public requestServ: AuthService) { }

  ngOnInit() {
    this.loadScripts();
    this.requestServ.dimensionPantalla();
    // this.handleLayout()
  }

  // @HostListener("window:resize", ["$event"])
  // onResize(event) {
  //   this.handleLayout();
  // }

  // toggleSidebar() {
  //   this.showMinisidebar = !this.showMinisidebar;
  // }


  // handleLayout() {
  //   this.innerWidth = window.innerWidth;
  //   if (this.innerWidth < 1170) {
  //     this.showMinisidebar = true;
  //   } else {
  //     this.showMinisidebar = false;
  //   }
  // }

  private loadScripts() {
    this.scriptServ.load('slimscroll', 'sidebarmenu', 'sticky', 'sparkline', 'custom').then(data => {
      console.log('Correcto');
    }).catch(error => console.log(error));
  }
}
