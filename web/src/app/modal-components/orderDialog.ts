import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetails } from '../model/OrderDetailsNew';
import { Utils } from '../model/Utils';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from './alertDialog';
import { OrderItem } from '../model/OrderItemNew';
import { DateUtils } from '../model/DateUtils';
import { Constants } from '../model/Constants';

@Component({
    selector: 'orderDialog',
    templateUrl: './orderDialog.html',
    styleUrls: ['./discountFeesDialog.scss', '../mypos/mypos.component.scss',]
})
export class OrderDialog {
  modelObj = {
    openMode : 'Create',
    businessObj: null,
    closeReason : '',
  }
  refundOrder = new OrderDetails();
  refundOrderFlag = false;
  orderDetailsAll = [];
  totalRefundAmt = 0;
  constructor(public dialogRef: MatDialogRef<OrderDialog>, 
  @Inject(MAT_DIALOG_DATA) public data: any, 
  public dialog:MatDialog) {
    if (!data) return;
    this.modelObj = data;
  }
  ngOnInit(){
    // Get order info from server
    var modelObj = this.modelObj;
    var orderId = modelObj.businessObj['id'];
    Utils.callAPI("GET",Constants.apiBaseURL + "getOrderDetails/" + orderId,false,null,(err,data) => {
      if(err) {
        console.log("Error " + err.message);
        alert(err);
      }
      else {
        //alert(data);
        var respObj = JSON.parse(data);
        if(Array.isArray(respObj)) {
          // Multiple order Objs returned bcos this order has refund entries
          this.refundOrderFlag = true;
          for (var i in respObj) {
            var orderDetails = new OrderDetails();
            orderDetails.setValues(respObj[i],true);
            if (Number(i) > 0) {
              orderDetails['hideOrder']=true;
              this.totalRefundAmt = this.totalRefundAmt + Number(orderDetails['netAmt']);
            }
            else orderDetails['hideOrder']=false;
            this.orderDetailsAll.push(orderDetails);
          }
        }
        else {
          var orderDetails = new OrderDetails();
          orderDetails.setValues(respObj,true);
          orderDetails['hideOrder']=false;
          this.orderDetailsAll.push(orderDetails);
        }
        if(this.modelObj.openMode == 'Refund') {
          Utils.callAPI("GET",Constants.apiBaseURL + "getRefundedItemTotals/" + orderId,false,null,
          (err,data) => {
            if(err) {
              console.log("Error " + err.errors);
              alert(err);
            }
            else {
              var refundedItems = JSON.parse(data);
              console.log(refundedItems);
              var origOrder = this.orderDetailsAll[0];
              this.refundOrder.setValues(origOrder,false);
              console.log(this.refundOrder);
              this.refundOrder['parentOrderId'] = this.refundOrder['id'];
              this.refundOrder['id'] = null;
              this.refundOrder['netAmt'] = 0;
              this.refundOrder['grossAmt'] = 0;
              this.refundOrder['feeAmt'] = 0;
              this.refundOrder['taxAmt'] = 0;
              this.refundOrder['discountAmt'] = 0;
              this.refundOrder['paidAmt'] = 0;
              this.refundOrder['balanceAmt'] = 0;
              this.refundOrder['status'] = 'Refund';
              this.refundOrder['paymentMode'] = 'Refund';
              this.refundOrder['totalItems'] = '0';
              for (var i in this.orderDetailsAll[0].orderItems) {
                this.refundOrder.orderItems[i]['itemQty'] = 0;
                this.refundOrder.orderItems[i]['itemTotal'] = 0;
                this.refundOrder.orderItems[i]['refundItem'] = 'TRUE';
                this.refundOrder.orderItems[i]['parentOrderId'] = this.refundOrder['parentOrderId'];
                this.refundOrder.orderItems[i]['disableQty'] = false;
                this.refundOrder.orderItems[i]['disableAmt'] = false;
                var refundItem = refundedItems.find(item=>item.sku==this.refundOrder.orderItems[i]['sku']);
                if(refundItem) {
                  if(origOrder.orderItems[i]['itemQty'] == refundItem.qtyReturned) {
                    this.refundOrder.orderItems[i]['disableQty'] = true;
                    this.refundOrder.orderItems[i]['itemQty'] = refundItem.qtyReturned;
                  }
                  if(origOrder.orderItems[i]['itemTotal'] == refundItem.totalRefunded) {
                    this.refundOrder.orderItems[i]['disableAmt'] = true;
                    this.refundOrder.orderItems[i]['itemTotal'] = refundItem.totalRefunded;
                  }                  
                }
              }
              this.refundOrder.paymentInfoItems.splice(0,this.refundOrder.paymentInfoItems.length);
              this.refundOrder.discountFeeItems.splice(0,this.refundOrder.discountFeeItems.length);              
            }
          });
        }
      }
    });
  }
  toggleRefund(idx) {
    if(idx<=0) return;
    this.orderDetailsAll[idx]['hideOrder'] = !this.orderDetailsAll[idx]['hideOrder']; 
  }
  isOrderOrRefund(idx) {
    if(idx == 0) return "Order";
    if(idx > 0) return "Refund";
  }
  onRefundQtyUpdate(idx) {
    if(this.refundOrder.orderItems[idx]['onSale']=='FALSE')
      this.refundOrder.orderItems[idx]['itemTotal'] = 
      this.refundOrder.orderItems[idx]['itemQty'] * this.refundOrder.orderItems[idx]['regularPrice'];
    else
      this.refundOrder.orderItems[idx]['itemTotal'] = 
      this.refundOrder.orderItems[idx]['itemQty'] * this.refundOrder.orderItems[idx]['salePrice'];
    this.calculateRefundAmt();
  }
  calculateRefundAmt() {
    this.refundOrder['netAmt'] = 0;
    this.refundOrder['totalItems'] = 0;
    for (var i in this.refundOrder.orderItems) {
      var orderItem = this.refundOrder.orderItems[i];
      if(orderItem['disableAmt'] == false)
        this.refundOrder['netAmt'] = this.refundOrder['netAmt'] + orderItem['itemTotal'];
      if(orderItem['disableQty'] == false)
        this.refundOrder['totalItems'] = this.refundOrder['totalItems'] + orderItem['itemQty'];
    }
    this.refundOrder['netAmt'] = this.refundOrder['netAmt'] + this.refundOrder['discountAmt'];
    this.refundOrder['netAmt'] = this.refundOrder['netAmt'] + this.refundOrder['feeAmt'];
    this.refundOrder['grossAmt'] = this.refundOrder['netAmt'];
  }
  onRefundAmtUpdate() {
    this.calculateRefundAmt();
  }
  onFeeUpdate() {
    this.calculateRefundAmt();
  }
  onDiscountUpdate() {
    this.calculateRefundAmt();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOrder() {
    //alert("In on Order");
    var orderId = this.modelObj.businessObj['id'];
    switch(this.modelObj.openMode) {
      case 'Delete':
        return this.doServerAction('Delete',orderId,"DELETE",Constants.apiBaseURL + "deleteOrder/",null,
        (err)=>{
          if(err) {
            console.log(err); this.modelObj.closeReason = 'Error';
          }
          else this.modelObj.closeReason = 'Success';
        });
      case 'Refund' :
        var refundOrderDb = this.getRefundOrderForDB();
        alert(JSON.stringify(refundOrderDb));
        return this.doServerAction('Refund',orderId,"PUT",Constants.apiBaseURL + "processRefund/",
        refundOrderDb, (err)=>{
          if(err) {
            console.log(err); this.modelObj.closeReason = 'Error';
          }
          else this.modelObj.closeReason = 'Success';
        });
      case 'Print' :
        this.modelObj.closeReason = 'Success';
        return Utils.printReceipt(this.orderDetailsAll[0]);        
      default :
        this.modelObj.closeReason = 'Success';
    }
  }
  getRefundOrderForDB(){
    var refundOrderForDb = this.refundOrder.getValues();
    for (var i in refundOrderForDb['orderItems']) {
      var orderItem = refundOrderForDb['orderItems'][i];
      var refundOrderItem = this.refundOrder['orderItems'].find(item=>item['sku']==orderItem.sku);
      if((orderItem['itemQty'] == 0 && orderItem['itemTotal'] == 0) || (refundOrderItem && 
        refundOrderItem['disableAmt'] == true && refundOrderItem['disableQty'] == true)) {
        // Delete empty order Item from the array
        refundOrderForDb['orderItems'].splice(i,1);
      }
      else orderItem['parentOrderId'] = this.refundOrder['parentOrderId'];
    }
    return refundOrderForDb;
  }
  getButtonTitle() {
    switch (this.modelObj.openMode) {
      case 'View' : return 'Return';
      default : return this.modelObj.openMode;
    }
  }
  updateOrderItem(idx,action){
    if(idx < 0 || idx >= this.orderDetailsAll[0].orderItems.length) return;
    var orderItems = this.orderDetailsAll[0].orderItems;
    switch(action) {
      case 'Subtract':
        if (orderItems[idx]['itemQty'] > 1 ) {

        }
      case 'Delete' :
      default:
        return;
    }
  }
  doServerAction(actionName, orderId, method, url, data, callBackFn) {
    return Utils.callAPI(method,url + orderId,false,data,
    (err,data) => {
      if(err) { 
        alert(JSON.stringify(err));
        this.modelObj.closeReason = 'Error';
        return callBackFn(err);
      }
      else {
        this.modelObj.closeReason = 'Success';
        var dataObj = JSON.parse(data);
        this.modelObj.businessObj['amtRefunded'] = dataObj.amtRefunded;
        var dialogRef = this.dialog.open(AlertDialog, {
          width:'400px', 
          data: {
            openMode:'View',
            businessObj: {
              title:'Order ' + orderId,
              message:'Order ' + orderId + ' ' + actionName + ' completed successfully!', 
              subMessage:'Order ' + actionName + ' completed!'
            },
            closeReason:''
          },
        });
        return dialogRef.afterClosed().subscribe(callBackFn);          
      }
    });
  }
}
