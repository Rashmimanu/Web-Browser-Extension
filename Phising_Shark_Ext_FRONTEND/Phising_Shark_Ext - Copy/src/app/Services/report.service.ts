import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from '../Model/Report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient) { }

  // function to get report details by connecting to the ML back-end
  getReport() {
    return this.http.get<any>(this.BASE_URL + '/report')
  }

  // function to get email report details from the backend
  getEmailReport() {
    return this.http.get<any>(this.BASE_URL + '/email/report')
  }
}
