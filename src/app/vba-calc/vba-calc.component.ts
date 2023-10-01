import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-vba-calc',
  templateUrl: './vba-calc.component.html',
  styleUrls: ['./vba-calc.component.css'],
})
export class VBACalcComponent implements OnInit {
  vb = {
    title: '',
    date: '',
    contentA: '',
    contentB: '',
    contentC: '',
    caption: '',
  };

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    this.vb = this.config.getConfig().vb;
  }
}
