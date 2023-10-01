import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  header = {
    heading: '',
    headingText: '',
  };

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    this.header = this.config.getConfig().header;
  }

  getHeader() {
    return this.config.getConfig().header;
  }
}
