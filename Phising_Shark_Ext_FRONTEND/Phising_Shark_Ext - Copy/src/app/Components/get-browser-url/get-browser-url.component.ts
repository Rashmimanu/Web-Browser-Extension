import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailChecker } from 'src/app/Model/EmailChecker';
import { EmailResponse } from 'src/app/Model/EmailResponse';
import { Prediction } from 'src/app/Model/Prediction';
import { Report } from 'src/app/Model/Report';
import { URLBody } from 'src/app/Model/URLBody';
import { BlacklistService } from 'src/app/Services/blacklist.service';
import { DataGrowService } from 'src/app/Services/data-grow.service';
import { EmailCheckerService } from 'src/app/Services/email-checker.service';
import { GetUrlStatusService } from 'src/app/Services/get-url-status.service';
import { WhitelistService } from 'src/app/Services/whitelist.service';

declare function identifyBrowserTab(): void

@Component({
  selector: 'app-get-browser-url',
  templateUrl: './get-browser-url.component.html',
  styleUrls: ['./get-browser-url.component.css'],
})
export class GetBrowserUrlComponent {

  constructor(private getUrlStatusService: GetUrlStatusService, private router: Router, 
    private changeDetect: ChangeDetectorRef, private emailCheckerService: EmailCheckerService, 
    private dataGrowService: DataGrowService, private whitelistService: WhitelistService, private blacklistService: BlacklistService) { }

  // local variables
  currentURL: string = "";
  urlBody: URLBody = new URLBody;
  prediction: Prediction = new Prediction;
  result: Prediction = new Prediction;
  emailCheckerModel: EmailChecker = new EmailChecker;
  emailResponse: EmailResponse = new EmailResponse;
  report: Report = new Report;
  currentStatus: boolean = false;
  report_domains: any = []
  report_domains_statuses: any = []
  linksInTheTab: string = ""
  browserTabId: any = ""
  linkArray: any = [];
  dataset_count = 0

  // HTML variables to load according to the predictions
  imageSource = '../../../assets/images/loading.gif'
  mainTitle = 'Phishing Shark is ready'
  mainDescription = 'We will help you once you navigated to a web site'
  email_visiblity: boolean = false;
  email_secure_status = 'badge bg-success'
  email_secure_text = "Secure"

  ngOnInit() {
    // this.router.navigate(['/getcurrenturl/loading-page'])
    // this.pageRefresh()
    this.growData()
    this.email_visiblity = false;
    this.getCurrentURL();
  }

  // function to get current browser url
  getCurrentURL() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      this.currentURL = String(tabs[0].url);
      console.log(this.currentURL)

      // if the current URL is null or undefined then calling
      // the trainTheModel train the model
      if (this.currentURL == 'undefined' || this.currentURL == "" || this.currentURL == "chrome://newtab/") {
        console.log("currentURL is null")
        this.trainTheModel("")
      }
      
      // if the currentURL is not null then calling
      // the getPredictions to get URL prediction
      else {
        console.log("currentURL is not null");
        this.getPredictions(this.currentURL);
      }
    })
  }

  // Function to call train_model function in the backend
  // This call will starting to train the model
  trainTheModel(value: string) {
    console.log("trainTheModel function is running")
    this.urlBody.browser_url = value;

      this.getUrlStatusService.trainModel(this.urlBody).subscribe((result: any) => {
        console.log("Results received successfully")
        this.prediction.prediction = result['prediction'];
        this.prediction.status = result['status'];
        console.log(this.prediction);

        if (result['prediction'] == "trained") {
          console.log("Model tranined successfully" )
          this.imageSource = '../../../assets/images/loading.gif'
          this.mainTitle = 'Phishing Shark is ready'
          this.mainDescription = 'We will help you once you navigated to a web site'
          this.changeDetect.detectChanges()
        }
        else {
          console.log("Host unreacherble" )
          this.imageSource = '../../../assets/images/no-connection.gif'
          this.mainTitle = 'Phishing Shark is not yet started'
          this.mainDescription = 'Please check your internet conenction and try again'
          this.changeDetect.detectChanges()
        }
      });
    return this.prediction;
  }

  // Function to get predictons from the backend
  getPredictions(value: string) {
    console.log("getPredictions function is running")
    this.urlBody.browser_url = value;

    this.getUrlStatusService.trainModel(this.urlBody).subscribe((result: any) => {
      console.log("Results received successfully")
      this.prediction.prediction = result['prediction'];
      this.prediction.status = result['status'];

      if (result['status'] == "success") {
        console.log("Host connected");

        if (result['prediction'] == "good") {
          console.log("The URL is not suspicious" )
          this.imageSource = '../../../assets/images/check-green.gif'
          this.mainTitle = 'This site is protected'
          this.mainDescription = 'You can use the web site without any doubts'
          this.changeDetect.detectChanges()
        }

        else if (result['prediction'] == "bad") {
          console.log("The URL is suspicious" )
          this.imageSource = '../../../assets/images/not_protected.gif'
          this.mainTitle = 'This site is not protected'
          this.mainDescription = 'This web site is detected as a melicious web site. So, please carefull when proving personal credentials or any card details'
          this.changeDetect.detectChanges()
        }

        else {
          console.log("The Host is just started" )
          this.imageSource = '../../../assets/images/loading.gif'
          this.mainTitle = 'Phishing Shark is ready'
          this.mainDescription = 'We will help you once you navigated to a web site'
          this.changeDetect.detectChanges()
        }

        // calling the email checker functions after the main predictions are completed
        this.returnAllLinks();
      }

      else {
        console.log("Host unreacherble" )
        this.imageSource = '../../../assets/images/no-connection.gif'
        this.mainTitle = 'Phishing Shark is not yet started'
          this.mainDescription = 'Please check your internet conenction and try again'
          this.changeDetect.detectChanges()
      }
    });
    return this.prediction;
  }

  // function to navigate to the Report page when clicking on the "See Report" button
  seeReport() {
    console.log("Redirecting to the Report page from the Not Suspicious component")
    this.imageSource = ''
    this.mainTitle = ''
    this.mainDescription = ''
    this.changeDetect.detectChanges()
    this.router.navigate(['/see-report']);
  }

  // function to navigate to the Email Report page when clicking on the "Email Report" button
  emailReport() {
    console.log("Redirecting to the Email report page")
    this.imageSource = ''
    this.mainTitle = ''
    this.mainDescription = ''
    this.changeDetect.detectChanges();
    this.router.navigate(['/email-report']);
  }

  // function to navigate to the Manual Check page
  // when clicking on the "Manul Check button"
  manualCheck() {
    console.log("Redirecting to the Manual-check-page from the Not-Suspicious-component")
    this.router.navigate(['/manual-check']);
  }

  // function to navigate to the How-to-prevent page
  // when clicking on the "How to prevent" button
  howToPrevent() {
    console.log("Redirecting to the How-to-prevent from the Not-Suspicious-component")
    this.router.navigate(['/how-to-prevent']);
  }

  // function to return all the links collected
  // from the currentlt acive browser tab
  // this fucntion is using to detect whether the currently opened email of supicious or not
  async returnAllLinks() {
    console.log("returnAllLinks function is calling")

    try {
      const linksObject = await identifyBrowserTab();
      this.emailCheckerModel.email_urls = linksObject['result']
      console.log(this.emailCheckerModel)
      this.emailCheckerService.predictionForEmails(this.emailCheckerModel).subscribe((result: any) => {
        console.log(result);
        this.emailResponse = result;

        // check whether the current website is an email
        if (this.emailResponse.is_email == "email") {
          // current website is an email
          console.log("current website is an email");
          this.email_visiblity = true;

          // check the status of the links (overall status)
          if (this.emailResponse.prediction == "good") {
            console.log("email links statuses are good (secure)")
            this.email_secure_status = 'badge bg-success'
            this.email_secure_text = "Secure"
          }
          else {
            console.log("email links statuses are bad (not-secure)")
            this.email_secure_status = 'badge bg-danger'
            this.email_secure_text = "Not Secure"
          }
          this.changeDetect.detectChanges();
        }
        else {
          // current website is not an email
          console.log("current website is not an email");
          this.email_visiblity = false;
          this.changeDetect.detectChanges()
        }
      })
  } catch (error) {
      console.error("Error:", error);
  }
  }

  // function to grow data into the dataset file
  growData() {
    try {
      this.dataGrowService.growDataset(this.urlBody).subscribe((result: any) => {
        if (result["status"] == "success") {
          console.log("Dataset size or grown status received")
          this.dataset_count = result["size"]
        }
        else {
          console.log("Dataset size or grown status failed!")
        }
        this.changeDetect.detectChanges()
      })
    } 
    catch(error) {
      console.log("Something went wrong!")
    }
  }

  // function to add current url to the Whitelist file (Do Whitelist)
  addToWhitelist() {
    try {
      this.whitelistService.addToWhiteList(this.urlBody).subscribe((result: any) => {
        if (result["status"] == "success") {
          console.log("Dataset grown successfully")
          this.dataset_count = result["size"]
        }
        else {
          console.log("Dataset grown failed!")
        }
      })
    } catch (error) {
      console.log("Something went wrong!")
    }
  }

  // function to add current url to the Blaclist file (Do Blaclist)
  addToBlacklist() {
    try {
      this.blacklistService.addToBlackList(this.urlBody).subscribe((result: any) => {
        if (result["status"] == "success") {
          console.log("The URL Blacklisted successfully")
          this.dataset_count = result["size"]
        }
        else {
          console.log("Blacklisting failed!")
        }
      })
    } catch (error) {
      console.log("Something went wrong!")
    }
  }
}
