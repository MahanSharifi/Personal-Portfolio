import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  jSon = {
    title: '',
    date: '',
    tools: '',
    content: '',
  }

  biqq = {
    title: '',
    date: '',
    tools: '',
    content: '',
    contentB: ''
  }

  web = {
    title: '',
    date: '',
    tools: '',
    content: '',
  }
  
  led = {
    title: '',
    date: '',
    tools: '',
    content: '',
  }
  
  vba = {
    title: '',
    date: '',
    tools: '',
    content: '',
    contentB: ''
  }

  rock = {
    title: '',
    date: '',
    tools: '',
    content: '',
    contentB: ''
  }

  constructor( public config: ConfigService ) { }

  ngOnInit(): void {
    this.jSon = this.config.getConfig().jSon;
    this.biqq = this.config.getConfig().biqq;
    this.web = this.config.getConfig().web;
    this.led = this.config.getConfig().led;
    this.vba = this.config.getConfig().vba;
    this.rock = this.config.getConfig().rock;

  }

}
