import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './home/user/user.component';
import { TabsComponent } from './home/tabs/tabs.component';
import { EventsComponent } from './home/events/events.component';

import { InvoiceComponent } from './Invoice/Invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TabsComponent,
    EventsComponent,
    UserComponent,
    InvoiceComponent
		
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
