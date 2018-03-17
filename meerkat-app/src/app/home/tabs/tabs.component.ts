import { Component } from '@angular/core';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
	private readonly HOME = 'home';
	private readonly INVOICES = 'invoices';
	private readonly REPORTS = 'reports';

	private activeTab: string = this.HOME;
	
	constructor(){}

	clickedTabItem(tabItem) {
		this.activeTab = tabItem;
	}

	isHomeActive(): boolean {
		return this.activeTab === this.HOME;
	}

	isInvoicesActive(): boolean {
		return this.activeTab === this.INVOICES;
	}

	isReportsActive(): boolean {
		return this.activeTab === this.REPORTS;
	}
}
