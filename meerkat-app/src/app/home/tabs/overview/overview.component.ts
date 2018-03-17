import { Component, Input, OnChanges } from '@angular/core';
import { Invoice, InvoiceStatus } from '../../../org.meerkat.net';
import { DataService } from '../../../data.service';
import { Observable } from 'rxjs/Observable';
import { InvoiceService } from '../../../services/invoice.service';
import { AcceptModalComponent } from '../../../shared/modal/acceptModal.component';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnChanges {
	@Input() currentUserId: string;

	private pendingActionsInvoices: Invoice[];

	constructor(private dialogService: DialogService,  private dataService: DataService<Invoice>){}

	ngOnChanges(): void {
		Observable.forkJoin(
			this.dataService.getInvoicesSentByUser(this.currentUserId),
			this.dataService.getInvoicesReceivingByUser(this.currentUserId)
		).subscribe(result => {
			const [sent, receiving] = result;

			let sentInvoicesWithPendingActions = sent.filter(s => {
				if (s.status.toString() === InvoiceStatus[InvoiceStatus.PAID]) {
					return s;
				}
			})

			let receivingInvoicesWithPendingActions = receiving.filter(s => {
				if (s.status.toString() === InvoiceStatus[InvoiceStatus.NEW] ||
					s.status.toString() === InvoiceStatus[InvoiceStatus.ACCEPTED]) {
					return s;
				}
			})

			this.pendingActionsInvoices = sentInvoicesWithPendingActions.concat(receivingInvoicesWithPendingActions);
		})
	}

	getInvoiceAction(invoice: Invoice) {
		switch(invoice.status.toString()){
			case InvoiceStatus[InvoiceStatus.NEW] :
				return "ACCEPT";
			case InvoiceStatus[InvoiceStatus.PAID] :
				return "CONFIRM";
		}
	}

	onActionClicked(invoice: Invoice) {
		switch(invoice.status.toString()){
			case InvoiceStatus[InvoiceStatus.NEW] :
				let disposable = this.dialogService.addDialog(AcceptModalComponent, {
					title:'New invoice action', 
					message:'Do you want to accept the invoiced from {bizEntity} with ammount' + invoice.amount + "?"})
					.subscribe((isConfirmed)=>{
						if(isConfirmed) {
							this.dataService.acceptInvoice(this.currentUserId, invoice.invoiceId)
								.subscribe(result => alert('accepted'));
						}
					});
			case InvoiceStatus[InvoiceStatus.PAID] :
				return "CONFIRM";
		}
	}
}
