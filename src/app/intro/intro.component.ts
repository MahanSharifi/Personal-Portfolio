import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { GetApiService } from '../get-api.service';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  
  title = {
    titleText:'',
    titleHeader:''
  };

  University = {
    title: '',
    about: ''
  };

  tools = {
    title: '',
    about: ''
  };

  freeTime = {
    title: '',
    about: ''
  };

  lang = {
    title: '',
    about: ''
  };

  content = {
    data1: '',
    data2: '',
    data3: ''
  }


  
  constructor( public config: ConfigService ) { }

  ngOnInit(): void {
    this.title = this.config.getConfig().title;
    this.University = this.config.getConfig().University;
    this.tools = this.config.getConfig().tools;
    this.freeTime = this.config.getConfig().freeTime;
    this.lang = this.config.getConfig().lang;
    this.content = this.config.getConfig().content;
  }

}


