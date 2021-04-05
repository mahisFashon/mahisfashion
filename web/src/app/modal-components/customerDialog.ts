import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from '../model/Constants';
import { Customer } from '../model/Customer';
import { Utils } from '../model/Utils';

@Component({
    selector: 'customerDialog',
    templateUrl: './customerDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class CustomerDialog {
    modelObj = {
        openMode : 'Create',
        customer: new Customer(),
        origCustomer : null,
    }
    constructor(
      public dialogRef: MatDialogRef<CustomerDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
          this.modelObj.customer.setValues(data.businessObj);
          this.modelObj.origCustomer = data.businessObj;
          this.modelObj.openMode = data.openMode;
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    onAddCustomer() {
      var method = '';
      var apiUrl = Constants.apiBaseURL + 'customer/';
      if (this.modelObj.openMode == 'Create') method = "POST";
      else if (this.modelObj.openMode == 'Edit') {
        method = "PUT";
        apiUrl += this.modelObj.customer.id;
      }
      else if (this.modelObj.openMode == 'Delete') {
        method = "DELETE";
        apiUrl += this.modelObj.customer.id;
      }
      Utils.callAPI(method,apiUrl,false,this.modelObj.customer,(err,data)=>{
        if(err) {
          // In case of error lets reset to original customer before return
          this.modelObj.customer.setValues(this.modelObj.origCustomer);
          return console.log(err);
        }
        return this.modelObj.customer.setValues(JSON.parse(data));
      });
    }
}