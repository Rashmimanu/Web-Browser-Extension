import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-to-prevent',
  templateUrl: './how-to-prevent.component.html',
  styleUrl: './how-to-prevent.component.css'
})
export class HowToPreventComponent {

  constructor(private router: Router) { }


  // function to go to the loading page again once clicked on the "Back" button
  goToBackPage() {
    console.log("Redirecting to the Loading-page from the Get-Report-Component")
    this.router.navigate(['/getcurrenturl']);
  }

  // function to navigate to the Report page when clicking on the "See Report" button
  seeReport() {
    console.log("Redirecting to the Report page from the Not Suspicious component")
    this.router.navigate(['/see-report']);
  }

  // function to navigate to the Manual Check page
  // when clicking on the "Manul Check button"
  manualCheck() {
    console.log("Redirecting to the Manual-check-page from the Not-Suspicious-component")
    this.router.navigate(['/manual-check']);
  }
}
