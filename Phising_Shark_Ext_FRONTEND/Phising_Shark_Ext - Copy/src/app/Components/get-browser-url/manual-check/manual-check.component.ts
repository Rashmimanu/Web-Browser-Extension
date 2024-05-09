import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Prediction } from 'src/app/Model/Prediction';
import { URLBody } from 'src/app/Model/URLBody';
import { GetUrlStatusService } from 'src/app/Services/get-url-status.service';
import { ReportService } from 'src/app/Services/report.service';

@Component({
  selector: 'app-manual-check',
  templateUrl: './manual-check.component.html',
  styleUrl: './manual-check.component.css'
})
export class ManualCheckComponent {

  // global variables
  m_check_visibility = false
  m_check_class = 'badge bg-success'
  m_check_secure_text = 'Good'

  constructor(private http: HttpClient, private getUrlStatusService: GetUrlStatusService, private reportService: ReportService, private router: Router, private changeDetect: ChangeDetectorRef) { }

  // public variables
  webURL: string = "";
  urlBody: URLBody = new URLBody();
  prediction: Prediction = new Prediction();

  // function to get user input of the URL text field
  // and then call the GetUrlStatusService by passing the value in the "webURL"
  checkUrl() {
    if (this.webURL != "") {
      this.urlBody.browser_url = this.webURL;
      
      this.getUrlStatusService.trainModel(this.urlBody).subscribe((result: any) => {
        console.log(result)
        this.getPredictions(result);
      });
    }
    else {
      this.m_check_visibility = true
      this.m_check_class = 'badge bg-info'
      this.m_check_secure_text = 'Please enter an URL'
    }
    this.changeDetect.detectChanges()
  }

  // Function to get predictons from the backend
  getPredictions(result: any) {
    console.log("getPredictions function is running")

      if (result['prediction'] == "good") {
        this.m_check_visibility = true
        this.m_check_class = 'badge bg-success'
        this.m_check_secure_text = 'Good'
      }
      else if (result['prediction'] == "bad") {
        this.m_check_visibility = true
        this.m_check_class = 'badge bg-danger'
        this.m_check_secure_text = 'Bad'
      }
      else if (this.prediction.prediction != "trained") {
        this.m_check_visibility = false
        this.m_check_class = 'badge bg-danger'
        this.m_check_secure_text = 'Bad'
      }

      else {
        this.m_check_visibility = true
        this.m_check_class = 'badge bg-primary'
        this.m_check_secure_text = 'Application restarted. Please check again!'
      }
      this.changeDetect.detectChanges()
    }

  // function to go to the loading page again once clicked on the "Back" button
  goToBackPage() {
    console.log("Redirecting to the Loading-page from the Get-Report-Component")
    this.router.navigate(['/getcurrenturl']);
  }

  // function to navigate to the How-to-prevent page
  // when clicking on the "How to prevent" button
  howToPrevent() {
    console.log("Redirecting to the How-to-prevent from the Not-Suspicious-component")
    this.router.navigate(['/how-to-prevent']);
  }
}
