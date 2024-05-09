import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Report } from 'src/app/Model/Report';
import { GetUrlStatusService } from 'src/app/Services/get-url-status.service';
import { ReportService } from 'src/app/Services/report.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-get-report',
  // standalone: true,
  // imports: [],
  templateUrl: './get-report.component.html',
  styleUrl: './get-report.component.css'
})
export class GetReportComponent {

  constructor(private http: HttpClient, private getUrlStatusService: GetUrlStatusService, private reportService: ReportService, private router: Router) { }

  report: Report = new Report;
  report_table_data: string[][] = []

  ngOnInit() {
    this.seeReport();
  }

  // function to get all the report data from the back-end
  // by calling the getReport function in the reportService class
  seeReport() {
    console.log("seeReport function is running")
    this.reportService.getReport().subscribe((result: any) => {
      console.log("Report results received successfully")

      this.report.report = result['report'];
      this.report.status = result['status'];
      this.report.good_status_count = result['good_status_count'];
      this.report.bad_status_count = result['bad_status_count'];
      this.report.total_status_count = result['total_status_count'];

      for (var i=0 ; i<this.report.report.length ; i++) {
        var split_data = this.report.report[i].split(',')
        this.report_table_data.push([split_data[0], split_data[1]])
      }
      console.log(this.report_table_data)
    })
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

  // function to navigate to the Manual Check page
  // when clicking on the "Manul Check button"
  manualCheck() {
    console.log("Redirecting to the Manual-check-page from the Not-Suspicious-component")
    this.router.navigate(['/manual-check']);
  }


  // PDF download related settings
  // function to download current report table as a PDF
  @ViewChild('reportTable', {static: false}) el!: ElementRef;

  downloadPDF() {
    let pdf = new jsPDF('p', 'pt', 'A4');
    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save("Phishing Shark G-Report");
      }
    })
  }
}
