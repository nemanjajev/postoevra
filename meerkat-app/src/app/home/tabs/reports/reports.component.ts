import { Component, Input, OnChanges } from '@angular/core';
import { Invoice, InvoiceStatus } from '../../../org.meerkat.net';
import { DataService } from '../../../data.service';
import { Observable } from 'rxjs/Observable';
import { InvoiceService } from '../../../services/invoice.service';
import { AcceptModalComponent } from '../../../shared/modal/acceptModal.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnChanges {
	@Input() currentUserId: string;
	@Input() consolidator: number;

	myForm: FormGroup;
	receiver = new FormControl("", Validators.required);

	private pendingRequests: any[] = [];

	private approvedRequests: any[] = [];
	
	constructor(private dialogService: DialogService,  private dataService: DataService<Invoice>, fb: FormBuilder){
		this.myForm = fb.group({		
			receiver:this.receiver
	  });
	}

	ngOnChanges(): void {
		this.pendingRequests = [];
		this.approvedRequests = [];
		this.dataService.getAccessGrant(this.currentUserId).subscribe(result => {
			if(result.requested !== result.granted) {
				this.pendingRequests.push(result);
			} else {
				if(!result.granted.endsWith(this.currentUserId)) {
					this.approvedRequests.push(result);
				}
			}
		});
	}

	requestClicked() {
		let request = {
			"$class": "org.meerkat.net.CreateAccessRequest",
			"sender": "resource:org.meerkat.net.BizEntity#" + this.currentUserId,
			"receiver": "resource:org.meerkat.net.BizEntity#" + this.receiver.value
		};
			
		this.myForm.setValue({
			"receiver":null
		});

		this.dataService.requestDataAccess(request).subscribe(result => console.log(result));
	}

	acceptClicked() {
		let request = {
			"$class": "org.meerkat.net.RespondAccessRequest",
			"sender": "resource:org.meerkat.net.BizEntity#" + this.currentUserId
		};

		this.dataService.acceptDataAccess(request).subscribe(result => console.log(result));
	}
}
