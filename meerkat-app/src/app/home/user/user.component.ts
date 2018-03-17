import { Component, OnInit } from '@angular/core';
import { BizEntity } from '../../org.meerkat.net';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	private biznisEntities: BizEntity[];

	constructor(private userService: UserService){}
	
	ngOnInit(): void {
		this.userService.getAll().subscribe(result => {
			this.biznisEntities = result;
			console.log(this.biznisEntities);
		})
	}

}
