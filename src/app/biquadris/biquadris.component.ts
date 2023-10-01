import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-biquadris',
  templateUrl: './biquadris.component.html',
  styleUrls: ['./biquadris.component.css'],
})
export class BiquadrisComponent implements OnInit {
  biq = {
    title: '',
    date: '',
    contentA: '',
    contentB: '',
    contentC: '',
    contentD: '',
    caption: '',
  };

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    this.biq = this.config.getConfig().biq;
  }
}
