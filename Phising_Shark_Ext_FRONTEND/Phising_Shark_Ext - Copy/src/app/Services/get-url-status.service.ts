import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { URLBody } from '../Model/URLBody';
import { catchError, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';

const headeroption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GetUrlStatusService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient, private router: Router) { }

  // function to connect with the python backend
  // and share the current browser url and retreive the prediction
  trainModel(urlBody: URLBody) {
    return this.http.post(this.BASE_URL + '/', JSON.stringify(urlBody), headeroption).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Function to navigate to no-connection page if cannot communicate with the back-end
  handleError() {
    console.log("back-end not connected properly!")
    return "error"
  }
}
