import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs';
import { EmailChecker } from '../Model/EmailChecker';

const headeroption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmailCheckerService {

  BASE_URL = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient, private router: Router) { }

  //
  predictionForEmails(emailChecker: EmailChecker) {
    return this.http.post(this.BASE_URL + '/email', JSON.stringify(emailChecker), headeroption).pipe(
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
