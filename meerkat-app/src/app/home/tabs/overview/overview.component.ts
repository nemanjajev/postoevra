import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from '../../../org.meerkat.net';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
	@Input() currentUserId: string;

	private invoices: Invoice[];

	constructor(private invoiceService: InvoiceService){}

	ngOnInit(): void {
		console.log(this.currentUserId);
		this.invoiceService.getAll().subscribe(result => {
			this.invoices = result;
		})
	}
}
