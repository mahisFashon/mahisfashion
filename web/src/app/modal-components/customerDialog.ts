import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../model/Customer';

@Component({
    selector: 'customerDialog',
    templateUrl: './customerDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class CustomerDialog {
    modelObj = {
        customer: new Customer(),
    }
    constructor(
      public dialogRef: MatDialogRef<CustomerDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Customer) {
          this.modelObj.customer.setValues(data);
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    onAddCustomer() {
        alert("In Add Customer");
        var xhttp = new XMLHttpRequest();
        var modelObj = this.modelObj;
        
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              //alert(this.responseText);
              modelObj.customer.setValues(JSON.parse(this.responseText));
              alert("Success " + this.responseText);
            }
            else {
              alert(this.responseText);
            }
          }
        }
        xhttp.open("POST", "http://localhost:3111/customer/", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this.modelObj.customer));         
    }
}