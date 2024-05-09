import { Component } from '@angular/core';


declare function identifyBrowserTab(): void

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Phising_Shark_Ext';
  returningArray:any = [];

  constructor() {
    // this.returnAllLinks();
  }

  // // function to return all the links collected
  // // from the currentlt acive browser tab
  // async returnAllLinks() {
  //   try {
  //     const linksObject = await identifyBrowserTab();
  //     console.log("Line 26")
  //     console.log(linksObject['result']);
  // } catch (error) {
  //     console.error("Error:", error);
  // }
  // }
}
