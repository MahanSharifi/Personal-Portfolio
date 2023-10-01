import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contact = {
    title: '',
    data: '',
  };

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    this.contact = this.config.getConfig().contact;
  }
}
