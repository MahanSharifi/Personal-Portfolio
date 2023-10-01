import { Component, OnInit } from '@angular/core';
import { GetApiService } from './get-api.service';
import { TestBed, async } from '@angular/core/testing'; // 1

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  apiData: any;
  isLoading = true;
  title = 'Mazzie';
  onActivate() {
    window.scroll(0, 400);
  }

  constructor(public apiService: GetApiService) {}

  ngOnInit(): void {
    this.getApi();
  }

  getApi(): any {
    this.isLoading = true;
    this.apiService.getapi().subscribe((data) => {
      console.log(data);
      this.isLoading = true;
      this.apiData = data;
    });
  }
}
