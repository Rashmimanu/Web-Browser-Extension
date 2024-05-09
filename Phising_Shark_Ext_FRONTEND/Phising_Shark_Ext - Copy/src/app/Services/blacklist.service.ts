import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URLBody } from '../Model/URLBody';

const headeroption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class BlacklistService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient, private router: Router) { }

   // function to add a url to whitelist
   addToBlackList(urlBody: URLBody) {
    return this.http.post(this.BASE_URL + '/blacklist/add', JSON.stringify(urlBody), headeroption)
  }
}
