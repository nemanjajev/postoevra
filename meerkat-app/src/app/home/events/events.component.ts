import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'app/services/websocket.service';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

	private events: any[] = [];

	constructor(private wsService: WebsocketService){}

	ngOnInit() {
		this.wsService
			.connect("ws://localhost:3000")
			.subscribe(result => {
				this.events.push(result.data.toString());
			} );
	}
}
