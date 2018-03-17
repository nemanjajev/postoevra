import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Invoice } from '../org.meerkat.net';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class InvoiceService {

	
		private NAMESPACE: string = 'Invoice';
	



    constructor(private dataService: DataService<Invoice>) {
    };

    public getAll(): Observable<Invoice[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Invoice> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Invoice> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Invoice> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Invoice> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
