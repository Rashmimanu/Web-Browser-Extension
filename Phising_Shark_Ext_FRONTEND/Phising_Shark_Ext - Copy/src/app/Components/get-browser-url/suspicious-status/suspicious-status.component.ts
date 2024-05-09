import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suspicious-status',
  standalone: true,
  imports: [],
  templateUrl: './suspicious-status.component.html',
  styleUrl: './suspicious-status.component.css'
})
export class SuspiciousStatusComponent {

  constructor(private router: Router) { }

  ngOnInit() {
  }

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
