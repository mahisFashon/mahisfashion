import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetails } from '../model/OrderDetails';

@Component({
    selector: 'payNowDialog',
    templateUrl: './payNowDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class OrderDetailsDialog {
    modelObj = {
        payNow: new OrderDetails(),
    }
    constructor(
      public dialogRef: MatDialogRef<OrderDetailsDialog>,
      @Inject(MAT_DIALOG_DATA) public data: OrderDetails) {
          this.modelObj.payNow.setValues(data);
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    onAddOrderDetails() {
        alert("In Add OrderDetails");
        var xhttp = new XMLHttpRequest();
        var modelObj = this.modelObj;
        
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              //alert(this.responseText);
              modelObj.payNow.setValues(JSON.parse(this.responseText));
              alert("Success " + this.responseText);
            }
            else {
              alert(this.responseText);
            }
          }
        }
        xhttp.open("POST", "http://localhost:3111/payNow/", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(this.modelObj.payNow));         
    }
}