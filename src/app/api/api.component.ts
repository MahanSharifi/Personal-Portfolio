import { Component, OnInit } from '@angular/core';
import { GetApiService } from '../get-api.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {

  apiData: any;
  isLoading = true;


  constructor(public apiService: GetApiService) { }

  ngOnInit(): void {
    //this.getApi();
  }

  getApi(): any {
    this.isLoading = true;
    this.apiService.getapi().subscribe(
      data => {
        console.log(data);
        this.isLoading = true;
        this.apiData = data;
      } 
    );
  }
}
