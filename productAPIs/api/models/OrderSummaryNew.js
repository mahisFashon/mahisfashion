//const OrderDetails = require("../models/OrderDetailsNew.js");
//const OrderDiscountFeeDetails = require("../models/OrderDiscountFeeDetailsNew.js");
//const OrderPaymentDetails = require("../models/OrderPaymentDetailsNew.js");
//const BusinessObj = require("../models/BusinessObj.js");
const mySqlDb = require("../models/mysqldb.js");

var OrderSummary = {};
OrderSummary.getAttrMetaInfos = () => {
    var attrMetaInfos = [];
    attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NU',srchBy:false,key:true});
    attrMetaInfos.push({name:'orderDateTime',dataType:'DateTime',required:true,validVal:'DT',srchBy:false,key:false});
    attrMetaInfos.push({name:'grossAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'discountAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});    
    attrMetaInfos.push({name:'feeAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'taxAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'netAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'paidAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'balanceAmt',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'paymentMode',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'status',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'totalItems',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'parentOrderId',dataType:'Number',required:false,validVal:'INTGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'amtRefunded',dataType:'Number',required:false,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'orderNote',dataType:'String',required:false,validVal:'AN',srchBy:false,key:false});
    return attrMetaInfos;
}

OrderSummary.customValidate = (orderSummary, callBackFn) => {
  var isValid = true;
  var errorMessages = [];
  // Now check amount sanities
  if(orderSummary['status'] == 'Refund') return callBackFn(isValid, errorMessages);
  if (orderSummary['netAmt'] != 
    (orderSummary['grossAmt'] - orderSummary['discountAmt'] + orderSummary['taxAmt'] + orderSummary['feeAmt'])) {
      isValid = false;
      errorMessages.push("Net Amount does not equal gross less discounts + fees and taxes!");
  }
  if (orderSummary['paidAmt'] + orderSummary['balanceAmt'] != orderSummary['netAmt']) {
    isValid = false;
    errorMessages.push("Net Amount does not equal paid amount and balance amount!");
  }
  if (orderSummary['grossAmt'] <= 0 || orderSummary['netAmt'] <= 0) {
    isValid = false;
    errorMessages.push("Gross or Net amount must be positive!");      
  }
  return callBackFn(isValid, errorMessages);
}
OrderSummary.updateOrderStatus = (orderId, status, callBackFn) => {
  if(!orderId || !status) return callBackFn({message:'UpdateOrderStatus - OrderId and Status required!'},null);
  queryStr = "UPDATE OrderSummary SET status = ? WHERE id = ?";
  //console.log(queryStr);
  mySqlDb.getConnection().query(queryStr,[status, orderId],(err,data)=>{
    //console.log('Update Log');
    if(err) callBackFn(err,null);
    //console.log(data);
    callBackFn(null,data);
  });
}
OrderSummary.updateOrderForRefund = (orderId, status, amtRefunded, callBackFn) => {
  if(!orderId || !status || !amtRefunded) return callBackFn({message:'UpdateOrderStatus - OrderId, Status and AmtRefunded required!'},null);
  queryStr = "UPDATE OrderSummary SET status = ?, amtRefunded = amtRefunded + ? WHERE id = ?";
  mySqlDb.getConnection().query(queryStr,[status, amtRefunded, orderId],(err,data)=>{
    if(err) callBackFn(err,null);
    callBackFn(null,data);
  });
}
OrderSummary.getOrderStats = (fromDate, toDate, callBackFn) => {
  console.log(fromDate.toString() + ' ' + toDate.toString());
  var stDate = fromDate?new Date(fromDate+'T00:00:00'):null;
  var endDate = toDate?new Date(toDate+'T23:59:59'):null;
  if (stDate && stDate.toString() == 'Invalid Date') stDate=new Date('2000-01-01T00:00:00Z');
  if (endDate && endDate.toString() == 'Invalid Date') endDate=new Date();
  console.log(stDate.toString() + ' ' + endDate.toString());
  var groupCols = "SELECT YEAR(orderDateTime) as year,MONTH(orderDateTime) as month,DAY(orderDateTime) AS day, "
  var sumCols = "SUM(grossAmt) AS totalSales, SUM(netAmt) AS netSales, " + 
  "SUM(discountAmt) AS totalDiscounts, sum(amtRefunded) as totalRefunds ";
  var fromWhere = "FROM ordersummary WHERE orderDateTime between ? and ? ";
  var groupBy = "GROUP BY YEAR(orderDateTime),MONTH(orderDateTime),DAY(orderDateTime)";
  mySqlDb.getConnection().query(groupCols + sumCols + fromWhere + groupBy, [stDate, endDate], (err,data)=>{
    if (err) {
      console.log(err);
      return callBackFn(err, null);
    }
    // Loop through the sums and create the grand totals
    var grandTotal = {
      year:null, month:null,day:null, totalSales : 0, netSales : 0, totalDiscounts : 0, totalRefunds : 0
    }
    for(var i in data) {
      grandTotal.totalSales += data[i].totalSales;
      grandTotal.netSales += data[i].netSales;
      grandTotal.totalDiscounts += data[i].totalDiscounts;
      grandTotal.totalRefunds += data[i].totalRefunds;
    }
    data.push(grandTotal);
    console.log('Total Stats Returned ' + data.length.toString() + ' For Range ' + stDate.toString() + ' - ' + endDate.toString());
    return callBackFn(null,data);  
  });
}
OrderSummary.totalCount = (result) => {
  mySqlDb.getConnection().query(`SELECT COUNT(*) as count FROM OrderSummary WHERE parentOrderId = 0 OR parentOrderId IS NULL`, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};
OrderSummary.getPage = (startIndex, pageSize, result) => {
  var queryStr = "SELECT * FROM OrderSummary WHERE " + 
  "parentOrderId = 0 OR parentOrderId IS NULL ORDER BY orderDateTime DESC limit ?, ?";

  mySqlDb.getConnection().query(queryStr, [Number(startIndex),Number(pageSize)], (err, res) => {
    if (err) {console.log(err); return result(err, null);}
    if (res.length > 0) {
      return result(null, res);
    }
    console.log(res);
    result({ kind: "not_found" }, null);
  });
};
OrderSummary.getAllRelatedOrders = (orderId, result) => {
  var queryStr = "SELECT id FROM OrderSummary WHERE id = ? OR parentOrderId = ?"; 
  mySqlDb.getConnection().query(queryStr, [orderId, orderId], (err, res) => {
    if (err) {console.log(err); return result(err, null);}
    if (res.length > 0) {
      return result(null, res);
    }
    console.log(res);
    result({ kind: "not_found" }, null);
  });  
}
OrderSummary.getRefundedItemTotals = (parentOrderId,skus,callBackFn) => {
  if(!parentOrderId) return callBackFn({
    errors:['OrderDetails.getRefundedItemTotals sku and parentOrderId are mandatory!']},null);
  var queryStr = 'SELECT sku, SUM(itemTotal) as totalRefunded, SUM(itemQty) as qtyReturned ' + 
  'FROM orderDetails WHERE parentOrderId = ? ';
  if (skus != null && skus.length > 0) queryStr += 'AND sku in (?) ';
  queryStr +=  'group by sku';
  mySqlDb.getConnection().query(queryStr, [parentOrderId, skus], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null,data);
  });
}
OrderSummary.getOrderDate = (overRideOrderDate) => {
  if(overRideOrderDate) {
    var timeStr = new Date().toTimeString().substring(0,8);
    // console.log(overRideOrderDate);
    // console.log(timeStr);
    // console.log(overRideOrderDate + 'T' + timeStr + 'Z');
    return new Date(overRideOrderDate + 'T' + timeStr + 'Z');
  }
  return new Date();
}
module.exports = OrderSummary; 
