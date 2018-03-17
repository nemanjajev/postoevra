import { Component } from '@angular/core';
import { DataService } from '../../../data.service';
import { Invoice } from '../../../org.meerkat.net';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { InvoiceService } from 'app/services/invoice.service';

@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

	myForm: FormGroup;
  	private allAssets;
  	private asset;
  	private currentId;
	private errorMessage;

	invoiceId = new FormControl("", Validators.required); 
	amount = new FormControl("", Validators.required);  
    receiver = new FormControl("", Validators.required);

	constructor(private invoiceService:InvoiceService, fb: FormBuilder) {
		    this.myForm = fb.group({		
		          invoiceId:this.invoiceId,
		          amount:this.amount,
		          receiver:this.receiver
		    });
	}
}