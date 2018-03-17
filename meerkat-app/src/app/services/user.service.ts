import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { BizEntity } from '../org.meerkat.net';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class UserService {

	
	private NAMESPACE: string = 'BizEntity';
	

    constructor(private dataService: DataService<BizEntity>) {
    };

    public getAll(): Observable<BizEntity[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<BizEntity> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<BizEntity> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<BizEntity> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<BizEntity> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
