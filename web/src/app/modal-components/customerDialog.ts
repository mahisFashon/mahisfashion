import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../model/customer';

@Component({
    selector: 'discountFeesDialog',
    templateUrl: './discountFeesDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class CustomerDialog {
    modelObj = {
        customer: new Customer(),
    }
    constructor(
      public dialogRef: MatDialogRef<CustomerDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Customer) {
          this.modelObj.customer = data;
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    onAddCustomer() {
        var modelObj = this.modelObj;
    }
}