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
export class WhitelistService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient, private router: Router) { }

  // function to add a url to whitelist
  addToWhiteList(urlBody: URLBody) {
    return this.http.post(this.BASE_URL + '/whitelist/add', JSON.stringify(urlBody), headeroption)
  }
}
