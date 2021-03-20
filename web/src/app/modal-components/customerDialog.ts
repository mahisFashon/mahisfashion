import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from '../model/Constants';
import { Customer } from '../model/Customer';

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
        var xhttp = new XMLHttpRequest();
        var modelObj = this.modelObj;
        
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              modelObj.customer.setValues(JSON.parse(this.responseText));
            }
            else {
              // In case of error lets reset to original customer before return
              modelObj.customer.setValues(modelObj.origCustomer);
              console.log(this.responseText);
            }
          }
        }
        var method = '';
        var apiUrl = Constants.apiBaseURL + 'customer/';
        if (modelObj.openMode == 'Create') method = "POST";
        else if (modelObj.openMode == 'Edit') {
          method = "PUT";
          apiUrl += modelObj.customer.id;
        }
        else if (modelObj.openMode == 'Delete') {
          method = "DELETE";
          apiUrl += modelObj.customer.id;
        }
        xhttp.open(method, apiUrl, false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this.modelObj.customer));         
    }
}