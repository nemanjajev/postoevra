import { Component, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { BizEntity } from '../../org.meerkat.net';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
	@Input() consolidator: number;
	private readonly HOME = 'home';
	private readonly INVOICES = 'invoices';
	private readonly REPORTS = 'reports';

	private activeTab: string = this.HOME;
	
	constructor(private dataService: DataService<BizEntity>){}

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
