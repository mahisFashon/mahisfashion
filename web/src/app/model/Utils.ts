export class Utils {
  public static pageAction(action, modelObj) {
    var pageIndex = 0;
    if (action == 'first') {
      if (modelObj.currPage > 1)
        pageIndex = 1;
      else return;
    }
    else if (action == 'last') {
      if (modelObj.currPage < modelObj.totalPages)
        pageIndex = modelObj.totalPages;
      else return;
    }
    else if (action == 'prev') {
      if (modelObj.currPage>1)
        pageIndex = --modelObj.currPage;
      else return; // already on first page
    }
    else if (action == 'next') {
      if (modelObj.currPage<modelObj.totalPages)
        pageIndex = ++modelObj.currPage;
      else return; // Already on last page
    }
    modelObj.businessObj.getPageList(pageIndex,modelObj.pageSize,(err, data) => {
      if (err) {
        console.log("Error occured");
        return (err);
      }
      else {
        modelObj.businessObjs = data;
        modelObj.currPage = pageIndex;
      }
    });    
  }
  public static doXMLHttpRequest(method,url,async,data,callBackFn) {
    if(!method || (method != "GET" && method != "POST" && method != "PUT" && method != "DELETE")) return;
    if(!url) return;
    if(!callBackFn) return;
    if(async == undefined) async = true;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) return callBackFn(null,this.responseText);
        else {
          console.log(this.responseText);
          return callBackFn(this.responseText,null);
        }
      }
    }
    xhttp.open(method, url, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    if(!data) xhttp.send();
    else xhttp.send(JSON.stringify(data));
  }
  public static printReceipt(orderDetails) {
    if (!orderDetails['id']) orderDetails['id'] = 333333;
    var headLineOpen = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' + "Mahis Fashion Paradise Receipt"  + '</title>';
    var cssLinks = "<link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css' media='all'>";
    cssLinks += "<link rel='stylesheet' type='text/css' href='/assets/styleForPrint.css' media='all'>";
    //var scriptText = "<script>function printAndClose(){window.print();<window.close();}</script>";
    var scriptText = "<script>function printAndClose(){window.print();}</script>";
    var headLineClose = '</head><body onload="printAndClose()">';
    var bodyTitle = "<div><div style='position:fixed;top:0;'><img width='100%' src='/assets/images/mahisFP-billHeader.png'></div></div>";
    var innerText = this.getInnerText(orderDetails);
    var bodyFooter = "<div style='position:fixed;bottom:0;'><img width='100%' src='/assets/images/mahisFP-billFooter.png'></div>";
    var htmlClose = '</body></html>';
    var htmlDocToPrint = headLineOpen + cssLinks + scriptText + headLineClose + bodyTitle + innerText + bodyFooter + htmlClose;
    //console.log(htmlDocToPrint);
    var mywindow = window.open('', 'PRINT', '');
    mywindow.document.write(htmlDocToPrint);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    //mywindow.print();
    //mywindow.close();

    return true;
  }
  private static getOrderHeaderText(orderDetails) {
    var innerText = "<div class='col-xs-12 order-row insrtHdrMargin'>";// order id date row
    innerText += "<div class='col-xs-6' style='font-weight:bold;'>Bill No: " + orderDetails['id'] + "</div>";
    innerText += "<div class='col-xs-6' style='font-weight:bold;text-align:right;'>Bill Date: " + orderDetails['orderDateTime'] + "</div>";
    innerText += "</div>";// order id date row
    return innerText;
  }
  private static getTableHeaderText(orderDetails) {
    var innerText = "<div class='col-xs-12 order-row order-header'>";// order header row
    innerText += "<div class='col-xs-8' style='color:blue;text-align:center;'>Product</div>";
    innerText += "<div class='col-xs-2' style='color:blue;padding-right:20px;text-align:center;'>Qty</div>";
    innerText += "<div class='col-xs-2' style='color:blue;text-align:center;'>Price</div>";
    innerText += "</div>"; // order header row
    return innerText;
  }
  private static getInnerText(orderDetails) {
    var innerText = "<div class='col-xs-12'>"; // Order Details Section
    innerText += Utils.getOrderHeaderText(orderDetails); var totalRows = 1;
    innerText += Utils.getTableHeaderText(orderDetails); totalRows++;
    var pgBreak = false;
    var totalItems = orderDetails.orderItems;
    for (var i in totalItems) {
        if ((Number(totalRows))%22 == 0) {
            pgBreak = true;
        }
        innerText += "<div class='col-xs-12 order-row";
        if (pgBreak) innerText += " insrtPgBrk";
        innerText += "'>";
        var orderItem = orderDetails.orderItems[i];
        innerText += "<div class='col-xs-8 bkTest'>" + orderItem['sku'] + "</div>";
        innerText += "<div class='col-xs-2' style='text-align:center;'>" + orderItem['itemQty'] + "</div>";
        innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderItem['itemTotal'] + "</div>";
        innerText += "</div>"; // sm-12 and row for items
        if (pgBreak) {
          innerText += Utils.getOrderHeaderText(orderDetails); totalRows++;
          innerText += Utils.getTableHeaderText(orderDetails); totalRows++;
          pgBreak = false;
        }
        totalRows++;
    }
    if (Number(totalRows)%22 > 17) {
        innerText += "<div class='insrtPgBrk'></div>";
        innerText += Utils.getOrderHeaderText(orderDetails); totalRows++;
    }
    innerText += Utils.getTotalsText(orderDetails,totalRows);totalRows+=5;// 5 more rows
    // Check if the payment details can be printed in this page
    if(Number(totalRows)%22 > (22-(orderDetails.paymentInfoItems.length+2))) {
      innerText += "<div class='insrtPgBrk'></div>";
      innerText += Utils.getOrderHeaderText(orderDetails); totalRows++;
    }
    innerText += Utils.getPaymentText(orderDetails,totalRows);
    innerText += "</div>"; // Order Details Section
    return innerText;
  }
  private static getTotalsText(orderDetails,totalRows) {
    var innerText = "<div class='col-xs-12 middleAligned order-row'>"; // Gross Amt Row
    innerText += "<div class='col-xs-10 amt-label-cell'>SubTotal</div>";
    innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderDetails['grossAmt'] + "</div>";
    innerText += "</div>"; totalRows++;//Gross Amt Row
    innerText += "<div class='col-xs-12 middleAligned order-row'>"; // Discount Amt Row
    innerText += "<div class='col-xs-10 amt-label-cell'>Discount</div>";
    innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderDetails['discountAmt'] + "</div>";
    innerText += "</div>"; totalRows++; // Discount Amt Row
    innerText += "<div class='col-xs-12 middleAligned order-row'>";  // Net Amt Row
    innerText += "<div class='col-xs-10 amt-label-cell'>Net Total</div>";
    innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderDetails['netAmt'] + "</div>";
    innerText += "</div>"; totalRows++;// Net Amt row
    innerText += "<div class='col-xs-12 middleAligned order-row'>"; // Paid Amt Row
    innerText += "<div class='col-xs-10 amt-label-cell'>Amount Paid</div>";
    innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderDetails['paidAmt'] + "</div>";
    innerText += "</div>"; totalRows++; //Paid Amt Row
    innerText += "<div class='col-xs-12 middleAligned order-row'>"; // Balance Amt Row
    innerText += "<div class='col-xs-10 amt-label-cell'>Balance Amount</div>";
    innerText += "<div class='col-xs-2 order-amt-cell'>₹ " + orderDetails['balanceAmt'] + "</div>";
    innerText += "</div>"; totalRows++; //Balance Amt Row
    return innerText;
  }
  private static getPaymentText(orderDetails, totalRows) {
    // Three + number of payment infos
    var txtStr = "<div class='col-xs-12 middleAligned order-row'>";//Payment Details
    txtStr += "<div class='col-xs-12 pmnt-dtls-section'>Payment Details</div></div>"; totalRows++;// Payment Details
    txtStr += "<div class='col-xs-12 middleAligned order-row pmnt-dtls-header'>"; //Payment Details Header Row
    txtStr += "<div class='col-xs-8'>Payment Mode</div>";
    txtStr += "<div class='col-xs-4 order-amt-cell'>Amount</div>";
    txtStr += "</div>"; totalRows++; //Payment Details Header Row
    for (var i in orderDetails.paymentInfoItems) {
      var pmntInfo = orderDetails.paymentInfoItems[i];
      txtStr += "<div class='col-xs-12 middleAligned order-row'>"; //Payment Details Row
      txtStr += "<div class='col-xs-8'>"+Utils.getPaymentModeStr(pmntInfo)+"</div>";
      txtStr += "<div class='col-xs-4 order-amt-cell'> ₹ " + pmntInfo.amount + "</div>";
      txtStr += "</div>"; totalRows++;//Payment Details Row
    }
    return txtStr;
  }
  private static getPaymentModeStr(paymentInfo) {
    if (paymentInfo.mode == 'CS') return 'Cash';
    if (paymentInfo.mode == 'CC') {
      var pmntMode = 'Credit/Debit Card';
      if (paymentInfo.modeType == 'MC') return pmntMode + ' Master Card ' + paymentInfo.txnRefNo;
      if (paymentInfo.modeType == 'VC') return pmntMode + ' VISA ' + paymentInfo.txnRefNo;
      if (paymentInfo.modeType == 'AM') return pmntMode + ' AMEX ' + paymentInfo.txnRefNo;
      return pmntMode;
    }
    if (paymentInfo.mode == 'EP') {
      var pmntMode = 'ePayments';
      if (paymentInfo.modeType == 'GP') return pmntMode + ' Google Pay ' + paymentInfo.txnRefNo;
      if (paymentInfo.modeType == 'AP') return pmntMode + ' Amazon Pay ' + paymentInfo.txnRefNo;
      if (paymentInfo.modeType == 'PT') return pmntMode + '  PayTM ' + paymentInfo.txnRefNo;
      if (paymentInfo.modeType == 'UP') return pmntMode + '  UPI ' + paymentInfo.txnRefNo;
      return pmntMode;
    }
  }
}