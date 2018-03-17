import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'app/services/websocket.service';

@Component({
	selector: 'app-events',
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

	private events: any[] = [];
	private shouldHighlight: boolean = false;

	constructor(private wsService: WebsocketService){}

	ngOnInit() {
		this.wsService
			.connect("ws://localhost:3000")
			.subscribe(result => {
				this.events.push(result.data.toString());
				this.shouldHighlight = true;
				setTimeout(() => this.shouldHighlight = false, 1000);
			} );
	}
}
