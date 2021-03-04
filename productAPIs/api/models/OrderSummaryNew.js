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
  //console.log(queryStr);
  mySqlDb.getConnection().query(queryStr,[status, amtRefunded, orderId],(err,data)=>{
    //console.log('Update Log');
    if(err) callBackFn(err,null);
    //console.log(data);
    callBackFn(null,data);
  });
}
OrderSummary.totalCount = (result) => {
  mySqlDb.getConnection().query(`SELECT COUNT(*) as count FROM OrderSummary WHERE parentOrderId IS NULL`, (err, res) => {
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
  var queryStr = "SELECT * FROM OrderSummary WHERE parentOrderId IS NULL limit " + startIndex + "," + pageSize;

  mySqlDb.getConnection().query(queryStr, (err, res) => {
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
module.exports = OrderSummary; 
