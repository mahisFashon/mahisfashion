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
    cssLinks += "<link rel='stylesheet' type='text/css' href='/assets/styleForPrint.css'>";
    var cssTxt = this.getCssText();
    var scriptText = "<script>function printAndClose(){window.print();window.close();}</script>";
    var headLineClose = '</head><body onload="printAndClose()">';
    var bodyTitle = "<div><div style='position:fixed;top:0;'><img width='100%' src='/assets/images/mahisFP-billHeader.png'></div></div>";
    var innerText = this.getInnerText(orderDetails);
    var bodyFooter = "<div style='position:fixed;bottom:0;'><img width='100%' src='/assets/images/mahisFP-billFooter.png'></div>";
    var htmlClose = '</body></html>';
    var htmlDocToPrint = headLineOpen + cssLinks + scriptText + headLineClose + bodyTitle + innerText + bodyFooter + htmlClose;
    console.log(htmlDocToPrint);
    var mywindow = window.open('', 'PRINT', 'height=800px,width=1100px');
    mywindow.document.write(htmlDocToPrint);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    //mywindow.print();
    //mywindow.close();

    return true;
  }
  private static getTableHeaderText(orderDetails) {
    var innerText = "<div class='col-xs-12 order-item-row-light insrtHdrMargin'>";
    innerText += "<div class='col-xs-6' style='font-weight:bold;'>Bill No: " + orderDetails['id'] + "</div>";
    innerText += "<div class='col-xs-6' style='font-weight:bold;text-align:right;'>Bill Date: " + orderDetails['orderDateTime'] + "</div>";
    innerText += "</div>";
    innerText += "<div class='col-xs-12 order-item-container'>";
    innerText += "<div class='col-xs-12 order-header-row'>";
    innerText += "<div class='col-xs-8' style='color:blue;text-align:center;'>Product</div>";
    innerText += "<div class='col-xs-2' style='color:blue;padding-right:20px;text-align:center;'>Qty</div>";
    innerText += "<div class='col-xs-2' style='color:blue;text-align:center;'>Price</div>";
    innerText += "</div>"; // sm-12 order header row
    return innerText;
  }
  private static getInnerText(orderDetails) {
    var innerText = "<div class='col-xs-12'>";
    innerText += this.getTableHeaderText(orderDetails);
    var pgBreak = false;
    var totalItems = orderDetails.orderItems;
    for (var i in totalItems) {
        if ((Number(i)+1)%20 == 0) {
            pgBreak = true;
        }
        innerText += "<div class='col-xs-12 ";
        if (Number(i)%2==0) innerText += "order-item-row-light";
        else innerText += "order-item-row-dark";
        if (pgBreak) innerText += " insrtPgBrk'>";
        else  innerText += "'>";
        var orderItem = orderDetails.orderItems[i];
        innerText += "<div class='col-xs-8'>" + orderItem['sku'] + "</div>";
        innerText += "<div class='col-xs-2' style='text-align:center;'>" + orderItem['itemQty'] + "</div>";
        innerText += "<div class='col-xs-2' style='text-align:right;padding-right:20px;'>₹ " + orderItem['itemTotal'] + "</div>";
        innerText += "</div>"; // sm-12 and row for items
        if (pgBreak) {
            innerText += this.getTableHeaderText(orderDetails);
            pgBreak = false;
        }
    }
    innerText += "</div>"; // order item container
    if (Number(totalItems)%20 > 17) {
        innerText += "<div class='insrtPgBrk'></div>";
        innerText += "<div class='col-xs-12 order-summary-container insrtHdrMargin'>";
    }
    else
        innerText += "<div class='col-xs-12 order-summary-container'>";
    var darkStart = true;
    if (orderDetails.orderItems.length%2==0) {
        darkStart = false;
    }
    if (darkStart) {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-dark'>";
    }
    else {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-light'>";
    }
    innerText += "<div class='col-xs-6'>SubTotal</div>";
    innerText += "<div class='col-xs-6' style='text-align:right;padding-right:20px;'>₹ " + 
    orderDetails['grossAmt'] + "</div>";
    innerText += "</div>"; //row
    if (darkStart) {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-light'>";
    }
    else {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-dark'>";
    }        
    innerText += "<div class='col-xs-6'></div>";
    innerText += "<div class='col-xs-6' style='text-align:right;padding-right:20px;'>";
    //innerText += "<span style='color:blue;'>Fees: ₹ " + 
    //    orderDetails.feeAmt + "&nbsp;</span>";
    innerText += "<span style='color:green;'>Discount: ₹ " + 
        orderDetails['discountAmt'] + "</span>";
    innerText += "</div></div>"; // col-xs-12
    if (darkStart) {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-dark'>";
    }
    else {
        innerText += "<div class='col-xs-12 middleAligned order-summary-row-light'>";
    }
    innerText += "<div class='col-xs-6'>Order Net Total</div>";
    innerText += "<div class='col-xs-6' style='text-align:right;padding-right:20px;'>₹ " + 
        orderDetails['netAmt'] + "</div>";
    innerText += "</div>";// row                         
    innerText += "</div>"; // col-xs-12 order summary container
    innerText += "</div>"; // other sm-12
    return innerText;
  }
  private static getCssText() {
    var cssText = "<style>@media print {html, body {height: 99%;}}";
    cssText += ".order-header-row {display:flex;align-items:center;border-radius:4px;" ;
    cssText += "background-color:#e5f4fd;height:2.4em;font-weight:bold;} ";
    cssText += ".col-xs-12{width:100%;} .col-xs-8{width:66.66%;margin:10px;} .col-xs-6{width:50%;margin:10px;}";
    cssText += ".col-xs-4{width:33.33%;margin:10px;} .col-xs-2{width:16.66%;margin:10px;}";
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