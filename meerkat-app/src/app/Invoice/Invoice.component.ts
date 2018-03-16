import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { InvoiceService } from './Invoice.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Invoice',
	templateUrl: './Invoice.component.html',
	styleUrls: ['./Invoice.component.css'],
  providers: [InvoiceService]
})
export class InvoiceComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          invoiceId = new FormControl("", Validators.required);
        
  
      
          amount = new FormControl("", Validators.required);
        
  
      
          status = new FormControl("", Validators.required);
        
  
      
          sender = new FormControl("", Validators.required);
        
  
      
          receiver = new FormControl("", Validators.required);
        
  


  constructor(private serviceInvoice:InvoiceService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          invoiceId:this.invoiceId,
        
    
        
          amount:this.amount,
        
    
        
          status:this.status,
        
    
        
          sender:this.sender,
        
    
        
          receiver:this.receiver
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceInvoice.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.meerkat.net.Invoice",
      
        
          "invoiceId":this.invoiceId.value,
        
      
        
          "amount":this.amount.value,
        
      
        
          "status":this.status.value,
        
      
        
          "sender":this.sender.value,
        
      
        
          "receiver":this.receiver.value
        
      
    };

    this.myForm.setValue({
      
        
          "invoiceId":null,
        
      
        
          "amount":null,
        
      
        
          "status":null,
        
      
        
          "sender":null,
        
      
        
          "receiver":null
        
      
    });

    return this.serviceInvoice.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "invoiceId":null,
        
      
        
          "amount":null,
        
      
        
          "status":null,
        
      
        
          "sender":null,
        
      
        
          "receiver":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.meerkat.net.Invoice",
      
        
          
        
    
        
          
            "amount":this.amount.value,
          
        
    
        
          
            "status":this.status.value,
          
        
    
        
          
            "sender":this.sender.value,
          
        
    
        
          
            "receiver":this.receiver.value
          
        
    
    };

    return this.serviceInvoice.updateAsset(form.get("invoiceId").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceInvoice.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceInvoice.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "invoiceId":null,
          
        
          
            "amount":null,
          
        
          
            "status":null,
          
        
          
            "sender":null,
          
        
          
            "receiver":null 
          
        
      };



      
        if(result.invoiceId){
          
            formObject.invoiceId = result.invoiceId;
          
        }else{
          formObject.invoiceId = null;
        }
      
        if(result.amount){
          
            formObject.amount = result.amount;
          
        }else{
          formObject.amount = null;
        }
      
        if(result.status){
          
            formObject.status = result.status;
          
        }else{
          formObject.status = null;
        }
      
        if(result.sender){
          
            formObject.sender = result.sender;
          
        }else{
          formObject.sender = null;
        }
      
        if(result.receiver){
          
            formObject.receiver = result.receiver;
          
        }else{
          formObject.receiver = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "invoiceId":null,
        
      
        
          "amount":null,
        
      
        
          "status":null,
        
      
        
          "sender":null,
        
      
        
          "receiver":null 
        
      
      });
  }

}
