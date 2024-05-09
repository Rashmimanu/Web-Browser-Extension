import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EmailReport } from 'src/app/Model/EmailReport';
import { ReportService } from 'src/app/Services/report.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-email-report',
  // standalone: true,
  // imports: [],
  templateUrl: './email-report.component.html',
  styleUrl: './email-report.component.css'
})
export class EmailReportComponent {

  constructor(private http: HttpClient, private router: Router, private emailReportService: ReportService, private changeDetect: ChangeDetectorRef) {}

  report: EmailReport = new EmailReport;
  report_table_data: string[][] = []

  ngOnInit() {
    this.report_table_data.push(["data 01", "data 02"], ["data 03", "data 04"])
    this.getEmailReport()
  }

  // function to get email report
  getEmailReport() {
    console.log("getEmailReport function is running")

    this.emailReportService.getEmailReport().subscribe((result: any) => {
      this.report = result

      if (this.report.status == "success") {
        console.log("Email Report results received successfully")

        for (var i=0 ; i<this.report.report.length ; i++) {
          var split_data = this.report.report[i].split(',')
          this.report_table_data.push([split_data[0], split_data[1]])
        }
        console.log(this.report_table_data)
      }
      else {
        console.log("Email Report receiving failed!")
      }
    })
    this.changeDetect.detectChanges()
  }

  // function to go to the loading page again once clicked on the "Back" button
  goToBackPage() {
    console.log("Redirecting to the Loading-page from the Get-Report-Component")
    this.router.navigate(['/getcurrenturl']);
  }

  // PDF download related settings
  // function to download current report table as a PDF
  @ViewChild('reportTable2', {static: false}) el!: ElementRef;

  downloadPDF() {
    let pdf = new jsPDF('p', 'pt', 'A4');
    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save("Phishing Shark E-Report");
      }
    })
  }
}
