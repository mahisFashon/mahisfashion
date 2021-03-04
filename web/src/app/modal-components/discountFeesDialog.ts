import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountFee } from '../model/DiscountFeeNew';
import { OrderDetails } from '../model/OrderDetailsNew';

@Component({
    selector: 'discountFeesDialog',
    templateUrl: './discountFeesDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class DiscountFeesDialog {
    modelObj = {
        discountFeeItems:[],
        grossAmt : 0,
        netAmt : 0,
        discountAmt : 0,
        feeAmt : 0,
    }
    changedData = false;
    modelObjOrig = {
        discountFeeItems:[],
        grossAmt : 0,
        netAmt : 0,
        discountAmt : 0,
        feeAmt : 0,
    }
    addDiscFeeObj = {
        category : 'D',
        type : 'pct',
        val : null
    }
    constructor(public dialogRef: MatDialogRef<DiscountFeesDialog>,
      @Inject(MAT_DIALOG_DATA) public data: OrderDetails) {
        this.copyDiscountsFeesToModelObj(data.discountFeeItems);
        this.modelObj.grossAmt = data['grossAmt'];
        this.modelObj.netAmt = data['netAmt'];
        this.modelObj.discountAmt = data['discountAmt'];
        this.modelObj.feeAmt = data['feeAmt'];  
    }
    copyDiscountsFeesToModelObj(discountFeeItems : Array<DiscountFee>) {
        for (var idx in discountFeeItems) {
            var discFee = new DiscountFee();
            discFee.setValues(discountFeeItems[idx],false);
            discFee.indexInArray =  discountFeeItems.length;
            this.modelObj.discountFeeItems.push(discFee);
        }        
    }
    makeCopy(copyDirection='F') {
        var fromObj = this.modelObj;
        var toObj = this.modelObjOrig;
        if (copyDirection == 'R') {
            //Swap
            var temp = toObj;
            toObj = fromObj;
            fromObj = temp;
        }
        for (var idx in fromObj.discountFeeItems) {
            var discFee = new DiscountFee();
            discFee.setValues(fromObj.discountFeeItems[idx], false);
            discFee.indexInArray =  toObj.discountFeeItems.length;
            toObj.discountFeeItems.push(discFee);
        }
        toObj.grossAmt = fromObj.grossAmt;
        toObj.netAmt = fromObj.netAmt;
        toObj.discountAmt = fromObj.discountAmt;
        toObj.feeAmt = fromObj.feeAmt;
    }
  
    onCancel(): void {
        // Case of abandon
        // Reverse the copy
        this.makeCopy('R');
        this.dialogRef.close();
    }
    onDone() : void {
        this.dialogRef.close();
    }
    onAddDiscountFee() {
        this.changedData = true;
        if (!this.addDiscFeeObj.category || !this.addDiscFeeObj.type || !this.addDiscFeeObj.val) return;
        if (this.addDiscFeeObj.category != 'D' && this.addDiscFeeObj.category != 'F') return;
        if (this.addDiscFeeObj.type != 'pct' && this.addDiscFeeObj.type != 'flat')  return;
        if (this.addDiscFeeObj.val <= 0) return;
        var amount = 0;
        if (this.addDiscFeeObj.type == 'pct') 
            amount = Math.round(this.modelObj.netAmt * this.addDiscFeeObj.val/100);
        else if (this.addDiscFeeObj.type == 'flat') 
            amount = Number(this.addDiscFeeObj.val);            
        if (this.addDiscFeeObj.category == 'D') {
            this.modelObj.netAmt = Number(this.modelObj.netAmt) - amount;
            this.modelObj.discountAmt = Number(this.modelObj.discountAmt) + amount;
        }
        else if (this.addDiscFeeObj.category == 'F') {
            this.modelObj.netAmt = Number(this.modelObj.netAmt) + amount;
            this.modelObj.feeAmt = Number(this.modelObj.feeAmt) + amount;
        }
        
        var discFee = new DiscountFee();
        discFee.setValues({
            'category': this.addDiscFeeObj.category,
            'type': this.addDiscFeeObj.type,
            'value': this.addDiscFeeObj.val,
            'amount' : amount,
        }, true);
        this.modelObj.discountFeeItems.push(discFee);
        this.addDiscFeeObj.category = 'D';
        this.addDiscFeeObj.type = 'pct';
        this.addDiscFeeObj.val = null;
    }
    onDeleteDiscountFee(idx) {
        this.changedData = true;
        if (idx < 0 || idx > this.modelObj.discountFeeItems.length) return;
        if (this.modelObj.discountFeeItems[idx].category == 'D') {
            this.modelObj.netAmt = Number(this.modelObj.netAmt) + Number(this.modelObj.discountFeeItems[idx].amount);
            this.modelObj.discountAmt = Number(this.modelObj.discountAmt) - Number(this.modelObj.discountFeeItems[idx].amount);
        }
        else if (this.modelObj.discountFeeItems[idx].category == 'F') {
            this.modelObj.netAmt = Number(this.modelObj.netAmt) - Number(this.modelObj.discountFeeItems[idx].amount);
            this.modelObj.feeAmt = Number(this.modelObj.feeAmt) - Number(this.modelObj.discountFeeItems[idx].amount);
        }
        this.modelObj.discountFeeItems.splice(idx,1);
    }
}