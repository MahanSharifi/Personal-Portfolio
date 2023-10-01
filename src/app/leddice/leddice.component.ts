import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-leddice',
  templateUrl: './leddice.component.html',
  styleUrls: ['./leddice.component.css'],
})
export class LEDDiceComponent implements OnInit {
  dice = {
    title: '',
    date: '',
    contentA: '',
    caption: '',
  };

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    this.dice = this.config.getConfig().dice;
  }
}
