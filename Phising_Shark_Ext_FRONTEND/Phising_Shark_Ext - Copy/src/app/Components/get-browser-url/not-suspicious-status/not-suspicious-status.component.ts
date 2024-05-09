import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'src/app/Model/Report';
import { GetUrlStatusService } from 'src/app/Services/get-url-status.service';
import { ReportService } from 'src/app/Services/report.service';

@Component({
  selector: 'app-not-suspicious-status',
  standalone: true,
  imports: [],
  templateUrl: './not-suspicious-status.component.html',
  styleUrl: './not-suspicious-status.component.css'
})
export class NotSuspiciousStatusComponent {

  constructor(private http: HttpClient, private getUrlStatusService: GetUrlStatusService, private reportService: ReportService, private router: Router) { }

  report: Report = new Report;
  report_domains: any = []
  report_domains_statuses: any = []

  // function to navigate to the Report page when clicking on the "See Report" button
  seeReport() {
    console.log("Redirecting to the Report page from the Not Suspicious component")
    this.router.navigate(['/getcurrenturl/see-report']);
  }

  // function to navigate to the Manual Check page
  // when clicking on the "Manul Check button"
  manualCheck() {
    console.log("Redirecting to the Manual-check-page from the Not-Suspicious-component")
    this.router.navigate(['/getcurrenturl/manual-check']);
  }

  // function to navigate to the How-to-prevent page
  // when clicking on the "How to prevent" button
  howToPrevent() {
    console.log("Redirecting to the How-to-prevent from the Not-Suspicious-component")
    this.router.navigate(['/getcurrenturl/how-to-prevent']);
  }
}
