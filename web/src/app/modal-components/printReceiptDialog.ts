import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDetails } from '../model/OrderDetails';
import { LookUpValues } from '../model/LookupValues';

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
          this.modelObj.orderDetails.setValues(data);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    onPrintReceiptTest() {
        //divToPrint
        let printData = document.getElementById('divToPrint').cloneNode(true);
        alert(printData);
        document.body.appendChild(printData);
        window.print();
        document.body.removeChild(printData);
    }
    onPrintReceipt() {
        this.modelObj.orderDetails.orderId = 33;
        var headLineOpen = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + "Mahis Fashion Paradise Receipt"  + '</title>';
        var cssLinks = "<link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css'>";
        cssLinks += "<link rel='stylesheet' type='text/css' href='src/styleForPrint.css'>";
        var cssTxt = this.getCssText();
        var scriptText = "<script>function printAndClose(){window.print();window.close();}</script>";
        var headLineClose = '</head><body onload="printAndClose()">';
        //var bodyTitle = '<h1 style="text-align:center;">' + "Mahis Fashion Paradise Receipt"  + '</h1>';
        //C:\\android-projects\\mahisfashion\\web\\src\\assets\\images\\mahisFP-billHeader.png
        ///assets/images/mahisFP-billHeader.png
        var bodyTitle = "<div class='col-sm-12'><img width='100%' src='/assets/images/mahisFP-billHeader.png'></div>";
        var innerText = this.getInnerText();
        var bodyFooter = "<div style='position:absolute;top:850px;'><img width='100%' src='/assets/images/mahisFP-billFooter.png'></div>";
        var htmlClose = '</body></html>';
        var htmlDocToPrint = headLineOpen + cssTxt + scriptText + headLineClose + bodyTitle + innerText + bodyFooter + htmlClose;
        console.log(htmlDocToPrint);
        var mywindow = window.open('', 'PRINT', 'height=800px,width=1100px');
        mywindow.document.write(htmlDocToPrint);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        //mywindow.print();
        //mywindow.close();
    
        return true;
    }
    getInnerText() {
        var innerText = "<div class='col-sm-12'>";
        innerText += "<div class='col-sm-12 order-item-row-light'>";
        innerText += "<div class='col-sm-6'>Order Id: " + this.modelObj.orderDetails.orderId + "</div>";
        innerText += "<div class='col-sm-6' style='text-align:right;'>Order Date: " + this.modelObj.orderDetails.orderDate + "</div>";
        innerText += "</div>";
        innerText += "<div class='col-sm-12 order-item-container'>";
        innerText += "<div class='col-sm-12 order-header-row'>";
        innerText += "<div class='col-sm-8' style='color:blue;text-align:center;'>Product</div>";
        innerText += "<div class='col-sm-2' style='color:blue;padding-right:20px;text-align:center;'>Qty</div>";
        innerText += "<div class='col-sm-2' style='color:blue;text-align:center;'>Price</div>";
        innerText += "</div>"; // sm-12 order header row
        for (var i in this.modelObj.orderDetails.orderItems) {
            innerText += "<div class='col-sm-12 ";
            if (Number(i)%2==0) innerText += "order-item-row-light'>";
            else innerText += "order-item-row-dark'>";
            var orderItem = this.modelObj.orderDetails.orderItems[i];
            innerText += "<div class='col-sm-8'>" + orderItem.sku + "</div>";
            innerText += "<div class='col-sm-2' style='text-align:center;'>" + orderItem.itemQty + "</div>";
            innerText += "<div class='col-sm-2' style='text-align:right;padding-right:20px;'>" + orderItem.itemTotal + "</div>";
            innerText += "</div>"; // sm-12 and row for items
        }
        innerText += "</div>"; // order item container
        innerText += "<div class='col-sm-12 order-summary-container'>";
        var darkStart = true;
        if (this.modelObj.orderDetails.orderItems.length%2==0) {
            darkStart = false;
        }
        if (darkStart) {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-dark'>";
        }
        else {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-light'>";
        }
        innerText += "<div class='col-sm-6'>SubTotal</div>";
        innerText += "<div class='col-sm-6' style='text-align:right;padding-right:20px;'>" + 
        this.modelObj.orderDetails.grossAmt + "</div>";
        innerText += "</div>"; //row
        if (darkStart) {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-light'>";
        }
        else {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-dark'>";
        }        
        
        innerText += "<div class='col-sm-12 middleAligned' style='text-align:right;'>";
        innerText += "<div class='col-sm-6'></div>";
        innerText += "<div class='col-sm-6' style='text-align:right;padding-right:20px;'>";
        innerText += "<span style='color:blue;'>Fees: " + 
            this.modelObj.orderDetails.feeAmt + "&nbsp;</span>";
        innerText += "<span style='color:green;'>Discount: " + 
            this.modelObj.orderDetails.discountAmt + "</span>";
        innerText += "</div></div>"; // col-sm-12
        innerText += "</div>"; // row
        if (darkStart) {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-dark'>";
        }
        else {
            innerText += "<div class='col-sm-12 middleAligned order-summary-row-light'>";
        }
        innerText += "<div class='col-sm-6'>Order Net Total</div>";
        innerText += "<div class='col-sm-6' style='text-align:right;padding-right:20px;'>" + 
            this.modelObj.orderDetails.netAmt + "</div>";
        innerText += "</div>";// row                         
        innerText += "</div>"; // col-sm-12 order summary container
        innerText += "</div>"; // other sm-12
        return innerText;
    }
    getCssText() {
        var cssText = "<style>@media print {html, body {height: 99%;}}";
        cssText += ".order-header-row {display:flex;align-items:center;border-radius:4px;" ;
        cssText += "background-color:#e5f4fd;height:2.4em;font-weight:bold;} ";
        cssText += ".col-sm-12{width:100%;} .col-sm-8{width:66.66%;margin:10px;} .col-sm-6{width:50%;margin:10px;}";
        cssText += ".col-sm-4{width:33.33%;margin:10px;} .col-sm-2{width:16.66%;margin:10px;}";
        cssText += ".row{width:100%;} .middleAligned{display:flex;align-items:center;}";
        cssText += ".order-summary-row-light, .order-summary-row-dark, .order-item-row-light,";
        cssText += ".order-item-row-dark{display:flex;align-items:center;border-radius:4px;height:2.4em;}";
        cssText += ".order-summary-row-light,.order-item-row-light,{background-color:#ffffff;}";
        cssText += ".order-summary-row-light,.order-item-row-light {border:1px solid #b0defa;}";
        cssText += ".order-item-row-dark,.order-summary-row-dark {background-color:#e5f4fd;border:1px solid #e5f4fd;}";
        cssText += "</style>"
        return cssText;
    }
}
