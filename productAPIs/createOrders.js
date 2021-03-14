const { error } = require('console');
var fs = require('fs');
var args = process.argv.slice(2);
var http = require('http');

function getOrderObj(dbJson) {
  var orderObj = {id:null, orderDateTime:null,customerId:null,
    grossAmt:null, discountAmt:null,feeAmt:null,
    taxAmt:null,netAmt:null,paidAmt:null,
    balanceAmt:0,paymentMode:null,status:null,
    totalItems:null,parentOrderId:null,amtRefunded:0,
    orderNote:null,overRideOrderDate:null,
    orderItems:[],discountFeeItems:[],paymentInfoItems:[]
  }
  if (!dbJson) return orderObj;
  if(dbJson.orderNote) {
    orderObj.overRideOrderDate = getOrderDateFromNote(dbJson.orderNote);
    orderObj.orderNote = dbJson.orderNote;
  }
  orderObj.customerId = dbJson.customerId?dbJson.customerId:null;
  orderObj.grossAmt = dbJson.grossAmt?dbJson.grossAmt:null;
  orderObj.netAmt = dbJson.netAmt?dbJson.netAmt:null;
  orderObj.totalItems = dbJson.totalItems?dbJson.totalItems:null;
  orderObj.discountAmt = orderObj.grossAmt - orderObj.netAmt;
  orderObj.paymentMode = dbJson.paymentMode.substring(dbJson.paymentMode.indexOf("_")+1);
  switch (dbJson.status) {
    case 'wc-completed': 
      orderObj.status = 'completed';
      orderObj.paidAmt = orderObj.netAmt;
      break;
    case 'wc-pending': 
      orderObj.status = 'pending payment'; 
      orderObj.paidAmt = 0;orderObj.balanceAmt = orderObj.netAmt;
      break;
    case 'wc-refunded': 
      status = 'Refund'; 
      orderObj.paidAmt = orderObj.netAmt;
      orderObj.amtRefunded = orderObj.netAmt;
      break;
  }
  if(orderObj.paidAmt>0) {
    orderObj.paymentInfoItems.push(getPaymentObj(orderObj.paidAmt));
  }
  return orderObj;
}
function getOrderDateFromNote(orderNote){
  if (!orderNote) return null;
  var yearPos = orderNote.indexOf("-2020");
  if (yearPos == -1) yearPos = orderNote.indexOf("-2021");
  if (yearPos == -1) return null;
  var dateStr = orderNote.substring(yearPos -6,yearPos + 5);
  var dateObj = new Date(dateStr);
  if (dateObj.toString() == 'Invalid Date') return null;
  var year = dateObj.getFullYear().toString();
  var mon = (dateObj.getMonth()+1).toString();
  mon = mon.length!=2?"0"+mon:mon;
  var day = dateObj.getDate().toString();
  day = day.length!=2?"0"+day:day;  
  var dbDate =  year + '-' + mon + '-' + day;
  return dbDate;
}
function getOrderDetailsObj(odDbObj) {
  var orderDetailsObj = {
    orderId:null,sku:odDbObj&&odDbObj.sku?odDbObj.sku:null,
    itemQty:odDbObj&&odDbObj.itemQty?odDbObj.itemQty:null,salePrice:null,
    regularPrice:odDbObj&&odDbObj.regularPrice?odDbObj.regularPrice:null,
    onSale:odDbObj&&odDbObj.onSale?odDbObj.onSale:null,
    itemTotal:odDbObj&&odDbObj.onSale?odDbObj.onSale:null,refundItem:'FALSE',refundAllowed:null,
    parentOrderId:null,
  }
  return orderDetailsObj;
}
function getDiscountObj(discountAmt) {
  var discAmt = discountAmt?Number(discountAmt)<0?Number(discountAmt)*-1:Number(discountAmt):null;
  var discountObj = {
    orderId:null,id:null,category:'D',
    type:'flat',
    value:discAmt,
    amount:discAmt
  }
  return discountObj;
}
function getPaymentObj(paymentAmt) {
  var paymentObj = {
    orderId:null,id:null,mode:'CS',
    modeType:"CS",modeTypeId:'Cash',
    txnRefNo:'Cash',amount:paymentAmt?paymentAmt:null
  }
  return paymentObj;
}
function generateOrderData() {
  if(args.length != 3) {
    console.log("Error - 3 Arguments needed!!");
    console.log("Usage : node createOrders.js OrderJsonFile OrderItemsJsonFile discountsJsonFile");
    console.log("Terminating Execution!!");
    return;
  }
  fs.readFile(args[0],(err,data)=>{
    if(err) {
      console.log("Error Reading File " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    // Data Received
    var orderDataArry = JSON.parse(data);
    if(!orderDataArry || !orderDataArry[2] || !orderDataArry[2].data) {
      console.log("Error Parsing JSON from file " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    orderDataArry = orderDataArry[2].data;
    fs.readFile(args[1],(err,data)=>{
      if(err) {
        console.log("Error Reading File " + args[1]);
        console.log("Terminating Execution!!");
        return;
      }
      // Data Received
      var orderItemArry = JSON.parse(data);
      if(!orderItemArry || !orderItemArry[2] || !orderItemArry[2].data) {
        console.log("Error Parsing JSON from file " + args[1]);
        console.log("Terminating Execution!!");
        return;
      }
      orderItemArry = orderItemArry[2].data;
      fs.readFile(args[2],(err,data)=>{
        if(err) {
          console.log("Error Reading File " + args[2]);
          console.log("Terminating Execution!!");
          return;
        }
        // Data Received
        var orderDiscountArry = JSON.parse(data);
        if(!orderDiscountArry || !orderDiscountArry[2] || !orderDiscountArry[2].data) {
          console.log("Error Parsing JSON from file " + args[2]);
          console.log("Terminating Execution!!");
          return;
        }
        orderDiscountArry = orderDiscountArry[2].data;          
        // Now loop through the ordersummary array and generate insert statements
        // for (var i in orderDataArry) {
        //   var orderObj = buildOrderObj(orderDataArry[i],orderItemArry,orderDiscountArry);
        //   console.log(orderObj);
        // }
        processOrdersNested(orderDataArry,0,orderDataArry.length,orderItemArry,orderDiscountArry,(err,data)=>{
          if(err) console.log(err);
          else console.log(data);
        });
      });
    });
  });
}
function buildOrderObj(orderDbObj,orderItemArry,orderDiscountArry) {
  var orderObj = getOrderObj(orderDbObj);
  var orderId = orderDbObj.id;
  var idx = orderItemArry.findIndex((item)=>item.id==orderId);
  if(idx != -1) {
    while (idx < orderItemArry.length && orderId == orderItemArry[idx].id) {
      orderObj.orderItems.push(getOrderDetailsObj(orderItemArry[idx]));
      idx++;
    }
  }
  var discObj = orderDiscountArry.find((item)=>item.id==orderId);
  if(discObj) {
    orderObj.discountFeeItems.push(getDiscountObj(discObj.itemTotal));
  }
  return orderObj;
}
function processOrdersNested(orderArry,currItem,totalItems,orderItemArry,orderDiscountArry,callBackFn) {
  if(currItem < totalItems) {
    var orderObj = buildOrderObj(orderArry[currItem],orderItemArry,orderDiscountArry);
    callProcessOrder(orderObj, (err,data) => {
      if(err) console.log(err);
      else console.log('Successfully Processed ' + orderArry[currItem].id);
      processOrdersNested(orderArry,++currItem,totalItems,orderItemArry,orderDiscountArry,callBackFn);
    });
  }
  if(currItem == totalItems) return callBackFn(null,{message:'success'});
}
function callProcessOrder(data, callBackFn) {
  var httpData = JSON.stringify(data);
  var options = {
    hostname:'localhost',
    port:3111,
    path:'/processOrder',
    method:'POST',
    headers:{
      'Content-Type': 'application/json',
      'Content-Length': httpData.length
    }
  }
  var req = http.request(options,(res)=>{
    console.log(`statusCode:${res.statusCode}`);
    res.on('data',d=>{
      console.log('From onData');
      console.log(JSON.parse(d));
      callBackFn(null,d);
    });
    res.on('error',e=>{
      console.log('From onError');
      console.log(JSON.parse(e));
      callBackFn(e,null);
    });
  });
  req.on('error',e=>{
    console.log(e);
    callBackFn(e,null);
  });
  req.write(httpData);
  req.end();
}
generateOrderData();
// function getOrderDateFn(overRideOrderDate) {  
//   if(overRideOrderDate) {
//     var timeStr = new Date().toTimeString().substring(0,8);
//     //console.log(overRideOrderDate);
//     //console.log(timeStr);
//     //console.log(overRideOrderDate + 'T' + timeStr + 'Z');
//     return new Date(overRideOrderDate + 'T' + timeStr + 'Z');
//   }
//   return new Date();

// }
// function testOrderDate() {
//   console.log(getOrderDateFn('2020-1-2'));
//   console.log(getOrderDateFn('2020-12-2'));
//   console.log(getOrderDateFn('2020-1-20'));
//   console.log(getOrderDateFn('2020-01-02'));
//   console.log(getOrderDateFn('2020-12-02'));
//   console.log(getOrderDateFn('2020-12-29'));  
// }
// testOrderDate();