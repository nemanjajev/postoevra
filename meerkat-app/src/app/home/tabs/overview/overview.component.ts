import { Component, Input, OnChanges } from '@angular/core';
import { Invoice } from '../../../org.meerkat.net';
import { DataService } from '../../../data.service';

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnChanges {
	@Input() currentUserId: string;

	private sentInvoices: Invoice[];
	private receivingInvoices: Invoice[];

	constructor(private dataService: DataService<Invoice>){}

	ngOnChanges(): void {
		this.dataService.getInvoicesSentByUser(this.currentUserId).subscribe(result => {
			this.sentInvoices = result;
		})

		this.dataService.getInvoicesReceivingByUser(this.currentUserId).subscribe(result => {
			this.receivingInvoices = result;
		})
	}
}
