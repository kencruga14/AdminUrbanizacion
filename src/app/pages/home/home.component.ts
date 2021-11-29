import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptService } from '../../services/script.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu = ['Home', 'Page 1', 'Page 2'];
  constructor(private scriptServ: ScriptService) { }

  ngOnInit() {
    this.loadScripts();
  }

  private loadScripts() {
    this.scriptServ.load('slimscroll', 'sidebarmenu', 'sticky', 'sparkline', 'custom').then(data => {
      console.log('Correcto');
    }).catch(error => console.log(error));
  }
}
