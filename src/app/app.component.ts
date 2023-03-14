import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLinear = true; // for mat-horizontal-stepper
  title = 'Test 1';

  durations$ = [ 3, 6, 12 ];
  gigabytes$ = [ 5, 10, 50 ];
  upfrontPayments$ = [ "yes", "no" ];
  totalPrice: number = 2*5; // initialize totalprice with default price_usd_per_gb (2 for 12 months) and default gigabyte (5)
  priceUSDPerGb = 2;
  
  // init order FormGroup
  orderFormGroup: UntypedFormGroup; 
  orderFormGroup1: UntypedFormGroup; 
  orderFormGroup2: UntypedFormGroup; 

  summary: any; // to store the summary of the subscription in real-time
  readAndApproved = false; // terms and conditions checkbox variable
  loading = false; // to show a progress bar when updating total price

  // init Subscription prices array to better filter when summarize selected subscription
  subscriptionPlans = [
    {
      durationMonths: 3,
      priceUSDPerGb: 3
    },
    {
      durationMonths: 6,
      priceUSDPerGb: 2.5
    },
    {
      durationMonths: 12,
      priceUSDPerGb: 2
    }
  ]

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.orderFormGroup = this._formBuilder.group({
      duration: [12, Validators.required],
      gigabyte: [5, Validators.required],
      upfrontPayment: ['no', Validators.required],
    });
    this.orderFormGroup1 = this._formBuilder.group({
      creditCardNo: ['', Validators.required],
      creditCardExp: ['', Validators.required],
      creditCardSC: ['', Validators.required],
    });
    this.orderFormGroup2 = this._formBuilder.group({
      email: ['', Validators.required]
    });
    
    // init summary object 
    this.loadRecap();
  }

  loadRecap ($event = null) {
    this.loading = true;
    let totalPriceUpdate: number = this.totalPrice;

    // check if some input change before updating total price
    if ($event) {
      let subscriptionPlan = this.subscriptionPlans.filter(subs => 
        { if(subs.durationMonths === this.orderFormGroup?.get('duration')?.value) 
            return subs; 
          else return null; 
        }
      )

      totalPriceUpdate = Number(subscriptionPlan[0]?.priceUSDPerGb * this.orderFormGroup?.get('gigabyte')?.value);
    }

    // check current values in the console
    console.log("totalPriceUpdate", totalPriceUpdate);
    console.log("this.totalPrice", this.totalPrice);
    
    if (this.orderFormGroup?.get('upfrontPayment')?.value === "yes") 
      totalPriceUpdate = totalPriceUpdate - (totalPriceUpdate * 0.1);

    // update this.totalPrice if something change
    if (totalPriceUpdate != this.totalPrice)
      this.totalPrice = totalPriceUpdate;
    
    this.summary = {
      "totalPrice": totalPriceUpdate,
      "duration": this.orderFormGroup?.get('duration')?.value ?? 12,
      "gigabyte": this.orderFormGroup?.get('gigabyte')?.value ?? 5,
      "upfrontPayment": this.orderFormGroup?.get('upfrontPayment')?.value ?? "no",
    }
    
    this.loading = false;
  }

  // update readAndApproved boolean for Terms and conditions before submitting the form
  checkedTerms () {
    this.readAndApproved = !this.readAndApproved;
  }

  submit () {
    
    this.loading = true;

    console.log("this.summary", this.summary);
    console.log("Subscription parameters", this.orderFormGroup?.value);
    console.log("Payment data", this.orderFormGroup1?.value);
    console.log("Confirmation", this.orderFormGroup2?.value);
    
    // collect our inputs and send them to an API here
    //....

  }
   
}
