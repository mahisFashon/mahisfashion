import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { DiscountFeesDialogData } from '../model/DiscountFeesDialogData';
import { DiscountFee } from '../model/DiscountFee';
import { OrderDetails } from '../model/OrderDetails'
import { from } from 'rxjs';

@Component({
    selector: 'discountFeesDialog',
    templateUrl: './discountFeesDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class DiscountFeesDialog {
    modelObj = {
        discountsFees:[],
        grossTotal : 0,
        netTotal : 0,
        totalDiscounts : 0,
        totalFees : 0,
    }
    changedData = false;
    modelObjOrig = {
        discountsFees:[],
        grossTotal : 0,
        netTotal : 0,
        totalDiscounts : 0,
        totalFees : 0,
    }
    addDiscFeeObj = {
        category : 'D',
        type : 'pct',
        val : null
    }
    constructor(public dialogRef: MatDialogRef<DiscountFeesDialog>,
      @Inject(MAT_DIALOG_DATA) public data: OrderDetails) {
        this.copyDiscountsFeesToModelObj(data.discountsFees);
        this.modelObj.grossTotal = data.grossTotal;
        this.modelObj.netTotal = data.netTotal;
        this.modelObj.totalDiscounts = data.totalDiscounts;
        this.modelObj.totalFees = data.totalFees;  
    }
    copyDiscountsFeesToModelObj(discountsFees : Array<DiscountFee>) {
        for (var idx in discountsFees) {
            var discFee = new DiscountFee();
            discFee.setValues(discountsFees[idx]);
            discFee.indexInArray =  discountsFees.length;
            this.modelObj.discountsFees.push(discFee);
        }        
    }
    makeCopy(copyDirection='F') {
        var passed = this.modelObj;
        var local = this.modelObjOrig;
        if (copyDirection == 'R') {
            //Swap
            var temp = local;
            local = passed;
            passed = temp;
        }
        for (var idx in passed.discountsFees) {
            var discFee = new DiscountFee();
            discFee.setValues(passed.discountsFees[idx]);
            discFee.indexInArray =  local.discountsFees.length;
            local.discountsFees.push(discFee);
        }
        local.grossTotal = passed.grossTotal;
        local.netTotal = passed.netTotal;
        local.totalDiscounts = passed.totalDiscounts;
        local.totalFees = passed.totalFees;
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
        var modelObj = this.modelObj;
        var addDiscFeeObj= this.addDiscFeeObj;
        if (!addDiscFeeObj.category || !addDiscFeeObj.type || !addDiscFeeObj.val) return;
        if (addDiscFeeObj.category != 'D' && addDiscFeeObj.category != 'F') return;
        if (addDiscFeeObj.type != 'pct' && addDiscFeeObj.type != 'flat')  return;
        if (addDiscFeeObj.val < 0) return;
        var amount = 0;
        if (addDiscFeeObj.type == 'pct') amount = Math.round(modelObj.netTotal * addDiscFeeObj.val/100);
        else if (addDiscFeeObj.type == 'flat') amount = Number(addDiscFeeObj.val);            
        if (addDiscFeeObj.category == 'D') {
            modelObj.netTotal -= amount;
            modelObj.totalDiscounts += amount;
        }
        else if (addDiscFeeObj.category == 'F') {
            modelObj.netTotal += amount;
            modelObj.totalFees += amount;
        }
        
        var discFee = new DiscountFee();
        discFee.setValues({
            'category': addDiscFeeObj.category,
            'type': addDiscFeeObj.type,
            'value': addDiscFeeObj.val,
            'amount' : amount,
        });
        modelObj.discountsFees.push(discFee);
        addDiscFeeObj.category = 'D';
        addDiscFeeObj.type = 'pct';
        addDiscFeeObj.val = null;
    }
    onDeleteDiscountFee(idx) {
        this.changedData = true;
        var modelObj = this.modelObj;
        if (idx < 0 || idx > modelObj.discountsFees.length) return;
        if (modelObj.discountsFees[idx].category == 'D') {
            modelObj.netTotal += Number(modelObj.discountsFees[idx].amount);
            modelObj.totalDiscounts -= Number(modelObj.discountsFees[idx].amount);
        }
        else if (modelObj.discountsFees[idx].category == 'F') {
            modelObj.netTotal -= Number(modelObj.discountsFees[idx].amount);
            modelObj.totalFees -= Number(modelObj.discountsFees[idx].amount);
        }
        modelObj.discountsFees.splice(idx,1);
    }
}