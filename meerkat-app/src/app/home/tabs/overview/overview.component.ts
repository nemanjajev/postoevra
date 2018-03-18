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
	@Input() consolidator: number;

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
			case InvoiceStatus[InvoiceStatus.ACCEPTED] :
				return "MARK AS PAID";
			case InvoiceStatus[InvoiceStatus.PAID] :
				return "CONFIRM";
		}
	}

	onActionClicked(invoice: Invoice) {
		switch(invoice.status.toString()){
			case InvoiceStatus[InvoiceStatus.NEW]:
				this.dialogService.addDialog(AcceptModalComponent, {
					title:'Accept new invoice', 
					message:'Do you want to accept the invoiced from {bizEntity} with amount: ' + invoice.amount + " ?"})
					.subscribe((isConfirmed)=>{
						if(isConfirmed) {
							this.dataService.acceptInvoice(this.currentUserId, invoice.invoiceId)
								.subscribe(result => console.log('Invoice successfully accepted!'));
						}
					});
				break;
			case InvoiceStatus[InvoiceStatus.ACCEPTED]:
				this.dialogService.addDialog(AcceptModalComponent, {
					title:'Mark invoice as paid', 
					message:'Do you want to mark the invoice from {bizEntity} with amount: ' + invoice.amount + " as paid?"})
					.subscribe((isConfirmed)=>{
						if(isConfirmed) {
							this.dataService.payInvoice(this.currentUserId, invoice.invoiceId)
								.subscribe(result => console.log('Invoice successfully marked as paid!'));
						}
					});	
				break;
			case InvoiceStatus[InvoiceStatus.PAID] :
				this.dialogService.addDialog(AcceptModalComponent, {
					title:'Confirm invoice payment', 
					message:'Do you want to confirm the payment of the invoice from {bizEntity} with amount: ' + invoice.amount + " ?"})
					.subscribe((isConfirmed)=>{
						if(isConfirmed) {
							this.dataService.confirmPaidInvoice(this.currentUserId, invoice.invoiceId)
								.subscribe(result => console.log('Payment of the invoice successfully confirmed!'));
						}
					});
				break;
		}
	}
}
