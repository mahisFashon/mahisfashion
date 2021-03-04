import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetails } from '../model/OrderDetailsNew';
import { LookUpValues } from '../model/LookupValues';
import { Utils } from '../model/Utils';

@Component({
    selector: 'printReceiptDialog',
    templateUrl: './printReceiptDialog.html',
    styleUrls: ['./discountFeesDialog.scss', '../mypos/mypos.component.scss',]
})
export class PrintReceiptDialog {
    modelObj = {
        orderDetails: new OrderDetails(),
    }
    cardTypes = LookUpValues.cardTypes;
    ePayTypes = LookUpValues.ePayTypes;
    payModes = LookUpValues.payModes;
    getPayModeType = LookUpValues.getPayModeType;

    constructor(public dialogRef: MatDialogRef<PrintReceiptDialog>,
        @Inject(MAT_DIALOG_DATA) public data: OrderDetails) {
            this.modelObj.orderDetails.setValues(data,false);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    onNewSale() {
        this.dialogRef.close();
    }
    onPrintReceipt() {
        Utils.printReceipt(this.modelObj.orderDetails);
        return true;
    }
}
