import { Component, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import { Invoice, InvoiceStatus } from '../../../org.meerkat.net';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { InvoiceService } from 'app/services/invoice.service';

@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
	@Input() currentUserId: string;

	private sentInvoices: Invoice[];
	private receivingInvoices: Invoice[];

	myForm: FormGroup;
  	private allAssets;
  	private asset;
  	private currentId;
	private errorMessage;

	invoiceId = new FormControl("", Validators.required); 
	amount = new FormControl("", Validators.required);  
    receiver = new FormControl("", Validators.required);

	constructor(private invoiceService:InvoiceService, private dataService: DataService<Invoice>, fb: FormBuilder) {
		    this.myForm = fb.group({		
		          invoiceId:this.invoiceId,
		          amount:this.amount,
		          receiver:this.receiver
		    });
	}

	ngOnChanges(): void {
		this.dataService.getInvoicesSentByUser(this.currentUserId).subscribe(result => {
			this.sentInvoices = result;
		})

		this.dataService.getInvoicesReceivingByUser(this.currentUserId).subscribe(result => {
			this.receivingInvoices = result;
		})
	}

	createInvoiceClicked() {
		this.asset = {
			"$class": "org.meerkat.net.CreateInvoice",
			"invoiceId": this.currentUserId + "_" + this.invoiceId.value,
			"amount": this.amount.value,
			"sender": "resource:org.meerkat.net.BizEntity#" + this.currentUserId,
			"receiver": "resource:org.meerkat.net.BizEntity#" + this.receiver.value
		};
			
		this.myForm.setValue({
			"invoiceId":null,
			"amount":null,
			"receiver":null
		});
	
		return this.invoiceService.addAsset(this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
			this.myForm.setValue({
				"invoiceId":null,
				"amount":null,
				"receiver":null 
			});
			console.log("Invoice successfully created!")
		})
		.catch((error) => {
			if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else{
				this.errorMessage = error;
			}
		});
	}
}
