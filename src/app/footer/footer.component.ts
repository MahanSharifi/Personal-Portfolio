import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  foot = {
    f: ''
  }
  constructor( public config: ConfigService ) { }

  ngOnInit(): void {
    this.foot = this.config.getConfig().foot;
  }

}
