import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Configuration } from './configuration';
import { BizEntity, Invoice } from './org.meerkat.net';

@Injectable()
export class DataService<Type> {
    private resolveSuffix: string = '?resolve=true';
    private actionUrl: string;
    private headers: Headers;
    private currentUser: BizEntity;

    constructor(private http: Http, private _configuration: Configuration) {
        this.actionUrl = _configuration.ServerWithApiUrl;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public setCurrentUser(user: BizEntity) {
        this.currentUser = user;
    }

    public getCurrentUser(): BizEntity {
        if(this.currentUser) {
			return this.currentUser;
		}

		return <BizEntity>{
			bizEntityId: "init",
			name: "init",
			debt: 0,
			claim: 0
		}
    }

    public getInvoicesSentByUser(bizEntityId: string): Observable<Invoice[]> {
        return this.http.get(`${this.actionUrl}/queries/selectInvoicesForUserSender/?entityId=resource%3Aorg.meerkat.net.BizEntity%23${bizEntityId}`)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getInvoicesReceivingByUser(bizEntityId: string): Observable<Invoice[]> {
        return this.http.get(`${this.actionUrl}/queries/selectInvoicesForUserReceiver/?entityId=resource%3Aorg.meerkat.net.BizEntity%23${bizEntityId}`)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public createInvoice(invoiceToAdd: any): Observable<Type> {

        return this.http.post(`${this.actionUrl}/CreateInvoice`, invoiceToAdd)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public acceptInvoice(bizEntityId: string, invoiceId: string): Observable<Type> {
        let transactionBody = {
            "$class": "org.meerkat.net.AcceptInvoice",
            "sender": "org.meerkat.net.BizEntity#" + bizEntityId,
            "invoice": "org.meerkat.net.Invoice#" + invoiceId
        };
        return this.http.post(`${this.actionUrl}/AcceptInvoice`, transactionBody)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public payInvoice(bizEntityId: string, invoiceId: string): Observable<Type> {
        let transactionBody = {
            "$class": "org.meerkat.net.PayInvoice",
            "sender": "org.meerkat.net.BizEntity#" + bizEntityId,
            "invoice": "org.meerkat.net.Invoice#" + invoiceId
        };
        return this.http.post(`${this.actionUrl}/PayInvoice`, transactionBody)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public confirmPaidInvoice(bizEntityId: string, invoiceId: string): Observable<Type> {
        let transactionBody = {
            "$class": "org.meerkat.net.ConfirmPaidInvoice",
            "sender": "org.meerkat.net.BizEntity#" + bizEntityId,
            "invoice": "org.meerkat.net.Invoice#" + invoiceId
        };
        return this.http.post(`${this.actionUrl}/ConfirmPaidInvoice`, transactionBody)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public requestDataAccess(request: any): Observable<Type> {

        return this.http.post(`${this.actionUrl}/CreateAccessRequest`, request)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getAll(ns: string): Observable<Type[]> {
        console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
        return this.http.get(`${this.actionUrl}${ns}`)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getSingle(ns: string, id: string): Observable<Type> {
        console.log('GetSingle ' + ns);

        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public add(ns: string, asset: Type): Observable<Type> {
        console.log('Entered DataService add');
        console.log('Add ' + ns);
        console.log('asset', asset);

        return this.http.post(this.actionUrl + ns, asset)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        console.log('Update ' + ns);
        console.log('what is the id?', id);
        console.log('what is the updated item?', itemToUpdate);
        console.log('what is the updated item?', JSON.stringify(itemToUpdate));
        return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public delete(ns: string, id: string): Observable<Type> {
        console.log('Delete ' + ns);

        return this.http.delete(this.actionUrl + ns + '/' + id)
          .map(this.extractData)
          .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }

}
