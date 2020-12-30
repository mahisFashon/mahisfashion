import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DiscountFeesDialogData } from '../model/DiscountFeesDialogData';
import { DiscountFee } from '../model/DiscountFee'

@Component({
    selector: 'discountFeesDialog',
    templateUrl: './discountFeesDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class DiscountFeesDialog {
    modelObj = {
        discounts:[],
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
    constructor(
      public dialogRef: MatDialogRef<DiscountFeesDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DiscountFeesDialogData) {
          this.modelObj.discounts = data.discounts;
          this.modelObj.grossTotal = data.grossTotal;
          this.modelObj.netTotal = data.netTotal;
          this.modelObj.totalDiscounts = data.totalDiscounts;
          this.modelObj.totalFees = data.totalFees;
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    onAddDiscountFee() {
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
        modelObj.discounts.push(discFee);
        addDiscFeeObj.category = 'D';
        addDiscFeeObj.type = 'pct';
        addDiscFeeObj.val = null;
    }
    onDeleteDiscountFee(idx) {
        var modelObj = this.modelObj;
        if (idx < 0 || idx > modelObj.discounts.length) return;
        if (modelObj.discounts[idx].category == 'D') {
            modelObj.netTotal += Number(modelObj.discounts[idx].amount);
            modelObj.totalDiscounts -= Number(modelObj.discounts[idx].amount);
        }
        else if (modelObj.discounts[idx].category == 'F') {
            modelObj.netTotal -= Number(modelObj.discounts[idx].amount);
            modelObj.totalFees -= Number(modelObj.discounts[idx].amount);
        }
        modelObj.discounts.splice(idx,1);
    }
}