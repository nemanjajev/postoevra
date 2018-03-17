import { Component, OnInit } from '@angular/core';
import { BizEntity } from '../../org.meerkat.net';
import { UserService } from '../../services/user.service';
import { DataService } from '../../data.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	private biznisEntities: BizEntity[];

	constructor(private userService: UserService, private dataService: DataService<BizEntity>){}
	
	ngOnInit(): void {
		this.userService.getAll().subscribe(result => {
			this.biznisEntities = result;
		})
	}

	onChange(event: any) {
		let selectedUser = this.biznisEntities.find(x=> x.bizEntityId === event.target.value);
		this.dataService.setCurrentUser(selectedUser);
	}

	get currentUser() {
		return this.dataService.getCurrentUser();
	}
}
