import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { URLBody } from '../Model/URLBody';

const headeroption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataGrowService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient, private router: Router) { }

  // function to grow data and get the current dataset size
  growDataset(urlBody: URLBody) {
    return this.http.post(this.BASE_URL + '/dataset/grow', JSON.stringify(urlBody), headeroption)
  }
}
