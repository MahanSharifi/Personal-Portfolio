import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-tech-experiences',
  templateUrl: './tech-experiences.component.html',
  styleUrls: ['./tech-experiences.component.css']
})
export class TechExperiencesComponent implements OnInit {
  display0 = "none";
  display = "none";
  display2 = "none";
  display3 = "none";
  display4 = "none";
  
  openModal0() {
    this.display0 = "block";
  }

  openModal() {
    this.display = "block";
  }
  openModal2() {
    this.display2 = "block";
  }

  openModal3() {
    this.display3 = "block";
  }

  openModal4() {
    this.display4 = "block";
  }

  onCloseHandled0() {
    this.display0 = "none";
  }
  onCloseHandled() {
    this.display = "none";
  }
  onCloseHandled2() {
    this.display2 = "none";
  }

  onCloseHandled3() {
    this.display3 = "none";
  }

  onCloseHandled4() {
    this.display4 = "none";
  }

  tech = {
    title: '',
    sub: ''
  }

  coop = {
    title: '',
    contentA: '',
    contentB: '',
    contentC: '',
    contentD: '',
    date: ''
  }

  youth = {
    title: '',
    date: '',
    content: ''
  }

  robot = {
    title: '',
    date: '',
    content: ''
  }
  
  deca = {
    title: '',
    date: '',
    content: '',
    contentB: '',
    contentC: ''
  }

  football = {
    title: '',
    date: '',
    content: ''
  }

  constructor( public config: ConfigService ) { }

  ngOnInit(): void {
    this.coop = this.config.getConfig().coop;
    this.tech = this.config.getConfig().tech;
    this.youth = this.config.getConfig().youth;
    this.robot = this.config.getConfig().robot;
    this.deca = this.config.getConfig().deca;
    this.football = this.config.getConfig().football;
  }

}
