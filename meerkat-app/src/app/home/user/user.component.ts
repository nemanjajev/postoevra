import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BizEntity } from '../../org.meerkat.net';
import { UserService } from '../../services/user.service';
import { DataService } from '../../data.service';
import { WebsocketService } from 'app/services/websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

export interface Message {
    author: string,
    message: string
}

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {
	@Input() consolidator: number;

	private biznisEntities: BizEntity[];
	private messages;
	private currentUserId: string;

	constructor(private userService: UserService, private dataService: DataService<BizEntity>){}
	
	ngOnInit(): void {
		this.userService.getAll().subscribe(result => {
			this.biznisEntities = result;
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.refreshCurrentUser();
	}

	onChange(event: any) {
		this.updateCurrentUser(event.target.value);
	}

	get currentUser() {
		return this.dataService.getCurrentUser();
	}

	private refreshCurrentUser() {
		this.userService.getAll().subscribe(result => {
			this.biznisEntities = result;
			this.updateCurrentUser(this.currentUser.bizEntityId);
		})
	}

	private updateCurrentUser(userId: string) {
		let selectedUser = this.biznisEntities.find(x=> x.bizEntityId === userId);
		this.currentUserId = userId;
		this.dataService.setCurrentUser(selectedUser);
	}
}
