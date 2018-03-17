import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { UserService }     from './services/user.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './home/user/user.component';
import { TabsComponent } from './home/tabs/tabs.component';
import { EventsComponent } from './home/events/events.component';
import { OverviewComponent } from './home/tabs/overview/overview.component';
import { InvoiceComponent } from './home/tabs/invoice/invoice.component';
import { AcceptModalComponent } from "./shared/modal/acceptModal.component";
import { InvoiceService } from './services/invoice.service';
import { WebsocketService } from './services/websocket.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TabsComponent,
    EventsComponent,
    UserComponent,
    OverviewComponent,
    InvoiceComponent,
    AcceptModalComponent
  ],
  entryComponents: [
    AcceptModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    BootstrapModalModule
  ],
  providers: [
    Configuration,
    DataService,
    UserService,
    InvoiceService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
