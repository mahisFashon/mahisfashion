import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetails } from '../model/OrderDetailsNew';
import { PaymentInfo } from '../model/PaymentInfoNew';
import { LookUpValues } from '../model/LookupValues';

@Component({
    selector: 'payNowDialog',
    templateUrl: './payNowDialog.html',
    styleUrls: ['./discountFeesDialog.scss', '../mypos/mypos.component.scss',]
})
export class PayNowDialog {
  modelObj = {
    orderDetails: new OrderDetails(),
    paymentInfo : null,
    paymentInfoItems : null,
  }
  
  cardTypes = LookUpValues.cardTypes;
  ePayTypes = LookUpValues.ePayTypes;
  payModes = LookUpValues.payModes;
  getPayModeType = LookUpValues.getPayModeType;
  
  paymentModeChange(payMode) : any {
    if (payMode == null) return;
    this.modelObj.paymentInfo.init();
    if (this.modelObj.paymentInfoItems.length > 1)
      this.modelObj.paymentInfoItems.splice(1,this.modelObj.paymentInfoItems.length);
    this.modelObj.orderDetails['paymentMode'] = payMode;
    this.updatePaidAmt(0,'reset');
    switch(payMode) {
      case 'cash' :
        this.modelObj.paymentInfo['mode'] = 'CS';
        this.modelObj.paymentInfo['modeType'] = 'CS';
        this.modelObj.paymentInfo['modeTypeId'] = 'Cash';
        this.modelObj.paymentInfo['txnRefNo'] = 'Cash';
        return;
      case 'card' :
        this.modelObj.paymentInfo['mode'] = 'CC';
        this.modelObj.paymentInfo['amount'] = this.modelObj.orderDetails['netAmt'];
        this.updatePaidAmt(0,'full');
        return;
      case 'ePay' :
        this.modelObj.paymentInfo['mode'] = 'EP';
        this.modelObj.paymentInfo['amount'] = this.modelObj.orderDetails['netAmt'];
        this.updatePaidAmt(0,'full');
        return;
    }
    return;
  }
  modeOptionChange(idx) {
    var paymentInfoItems = this.modelObj.paymentInfoItems;
    if (idx == null || idx < 0 || idx > paymentInfoItems.length) return;
    if (paymentInfoItems[idx].mode == 'CS') {
      paymentInfoItems[idx].modeType = 'CS';
      paymentInfoItems[idx].modeTypeId = 'Cash';
      paymentInfoItems[idx].txnRefNo = 'Cash';
    }
  }
  constructor(public dialogRef: MatDialogRef<PayNowDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.modelObj.orderDetails.setValues(data.orderDetails, false);
        this.modelObj.orderDetails.paymentInfoItems.push(new PaymentInfo());
        this.modelObj.paymentInfo = this.modelObj.orderDetails.paymentInfoItems[0];
        this.modelObj.paymentInfoItems = this.modelObj.orderDetails.paymentInfoItems;
        this.modelObj.orderDetails['balanceAmt'] = this.modelObj.orderDetails['netAmt'];
        this.modelObj.orderDetails['paidAmt'] = 0;
        this.paymentModeChange('cash');
  }
  addPaymentInfo() {
    this.modelObj.paymentInfoItems.push(new PaymentInfo());
  }
  deletePaymentInfo(idx) {
    if (idx == 0 && this.modelObj.paymentInfoItems.length == 1)
      this.modelObj.paymentInfoItems[0].init();
    else
      this.modelObj.paymentInfoItems.splice(idx,1);
    this.updatePaidAmt(idx);
  }
  onAmountChange(idx) {
    this.updatePaidAmt(idx);
  }
  onNoClick(): void {
    this.data.closeReason='Cancel';
    this.dialogRef.close();
  }
  updatePaidAmt(idx, action='') {
    var paymentInfoItems = this.modelObj.paymentInfoItems;
    if (idx == null || idx < 0 || idx > paymentInfoItems.length) return;
    if(action == 'full') {
      this.modelObj.orderDetails['paidAmt'] = this.modelObj.orderDetails['netAmt'];
    }
    else if(action == 'reset') {
      this.modelObj.orderDetails['paidAmt'] = 0;
    }
    else {
      this.modelObj.orderDetails['paidAmt'] = 0;
      for (var i in this.modelObj.paymentInfoItems) {
        // Get sum of all paid amounts
        this.modelObj.orderDetails['paidAmt'] = Number(this.modelObj.orderDetails['paidAmt']) + 
        Number(this.modelObj.paymentInfoItems[i].amount);
      }
    }
    this.modelObj.orderDetails['balanceAmt'] = 
    Number(this.modelObj.orderDetails['netAmt']) - Number(this.modelObj.orderDetails['paidAmt']);
  }
  onPayNow() {
    if (this.modelObj.orderDetails['paymentMode'] == 'cash') {
      this.modelObj.orderDetails['paidAmt'] = this.modelObj.orderDetails['netAmt']; 
      this.modelObj.orderDetails['balanceAmt'] = 0;
    }
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    var dialogData = this.data;
    
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var respObj = JSON.parse(this.responseText);
          modelObj.orderDetails.setValues(respObj, true);
          dialogData.orderDetails = modelObj.orderDetails;
          dialogData.closeReason = 'OrderCreated';
        }
        else {
          console.log("Error " + this.responseText);
          dialogData.closeReason = 'OrderCreationFailed';
        }
      }
    }
    xhttp.open("POST", "http://localhost:3111/processOrder/", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    var busObj = this.modelObj.orderDetails.getValues();
    var data = JSON.stringify(busObj);
    xhttp.send(data);         
  }
}