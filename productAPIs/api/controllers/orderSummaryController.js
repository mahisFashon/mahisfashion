const OrderDetails = require("../models/OrderDetailsNew.js");
const OrderDiscountFeeDetails = require("../models/OrderDiscountFeeDetailsNew.js");
const OrderPaymentDetails = require("../models/OrderPaymentDetailsNew.js");
const OrderSummary = require("../models/OrderSummaryNew.js");
const BusinessObj = require("../models/BusinessObj.js");
const Utils = require("../models/Utils.js");
const mysqlDb = require('../models/mysqldb');

// Create and Save a new customer
var OrderSummaryController = {};

OrderSummaryController.processOrder = (req, res) => {
  if (!req.body) return res.status(500).send({errors:["Request cannot be empty!"]});
  mysqlDb.getConnection().beginTransaction((beginTxnError) => {
    if (beginTxnError != null) return res.status(500).send({errors:[JSON.stringify(beginTxnError)]});  
    OrderSummaryController.processOrderInner(req.body, 'New', (err,data) => {
      if (err) {
        mysqlDb.getConnection().rollback((rollbackError) => {
          var rollBackMessage = '';
          if(rollbackError != null) rollBackMessage = rollbackError.message;
          else rollBackMessage = 'Successfully Rolled Back';
          console.log(err);
          err.errors.push(rollBackMessage);
          return res.status(500).send(err);
        });
      }
      else {
        mysqlDb.getConnection().commit((commitError) => {
          if(commitError != null) res.status(500).send({errors:[commitError.message]});
          return res.status(200).send(data);
        });
      }
    });
  });
}
OrderSummaryController.getOrderDetails = (req, res) => {
  if(!req.params && !req.params.orderId) {
    return res.status(500).send({
      errors: ["Request cannot be empty and orderId is required!"]
    });
  }
  OrderSummary.getAllRelatedOrders(req.params.orderId,(err,data)=>{
    if(err) {
      console.log(err);
      return res.status(500).send(err);
    }
    var relatedOrders = [];
    var errors = [];
    OrderSummaryController.getOrderDetailsNested(data,0,data.length,relatedOrders,errors,
    (err,data)=>{
      if(err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(relatedOrders);
    });
  });
}
OrderSummaryController.getOrderDetailsNested = (orderIds,currItem,totalItems,orderObjs,errors,callBackFn) =>{
  if (currItem < totalItems && errors.length == 0) {
    OrderSummaryController.getOrderDetailsInner(orderIds[currItem].id, (err, data) => {
      if (err) return; // Just return dont call back the func yet
      orderObjs.push(data);
      OrderSummaryController.getOrderDetailsNested(orderIds, ++currItem,totalItems,orderObjs,errors, callBackFn);
    });
  }
  if (currItem == totalItems) {
    if (errors.length == 0) return callBackFn(null,orderObjs);
    return callBackFn({errors:errors}, null);
  }
}
OrderSummaryController.processRefund = (req, res) => {
  var orderId = req.params.orderId?req.params.orderId:null;
  if (!orderId) {
    return res.status(500).send({errors:["Cannot process refund without order id"]});
  }
  var refundOrder = req.body;
  if (!refundOrder) {
    return res.status(500).send({errors:["Cannot process refund without order id"]});
  }
  // Get the original order from the DB
  var errors = [];
  var orderObj = null;
  OrderSummaryController.getOrderDetailsInner(orderId,(err,data)=>{
    if(err) {
      console.log(err);
      err.errors.push("Error Getting Order for order id " + orderId);
      return res.status(500).send(err);
    }
    orderObj = data;
    OrderSummaryController.validateRefundOrder(req.body,orderObj,(isValid,errors)=>{
      if(isValid == false || errors.length>0) {
        console.log(errors); return res.status(500).send({errors:errors});
      }
      // All validations done now save this order as a dependent order to the original order
      refundOrder.id = null;
      refundOrder.paymentType = 'Refund';
      refundOrder.orderDateTime = new Date();
      mysqlDb.getConnection().beginTransaction((beginTxnError) => {
        if(beginTxnError != null) return res.status(500).send({errors:[JSON.stringify(beginTxnError)]});  
        OrderSummaryController.processOrderInner(refundOrder, 'Refund', (err,data) => {
          if (err) {
            var rollBackMessage = '';
            mysqlDb.getConnection().rollback((rollbackError) => {
              if(rollbackError != null) rollBackMessage = rollbackError.message;
              else rollBackMessage = 'Successfully Rolled Back';
              err.errors.push(rollBackMessage);
              console.log(err);     
              return res.status(500).send(err);
            });
          }
          else {
            // Everything done now lets update the original order status
            OrderSummary.updateOrderForRefund(orderId,'Refund',refundOrder.netAmt, (err,data)=>{
              if(err) {
                var rollBackMessage = '';
                mysqlDb.getConnection().rollback((rollbackError) => {
                  if(rollbackError != null) rollBackMessage = rollbackError.message;
                  else rollBackMessage = 'Successfully Rolled Back';
                  err.errors.push(rollBackMessage);
                  console.log(err);     
                  return res.status(500).send(err);
                });
              }
              else {
                mysqlDb.getConnection().commit((commitError) => {
                  if(commitError != null) res.status(500).send({errors:[JSON.stringify(commitError)]});
                  return res.status(200).send(data);
                });
              }
            });
          }
        });
      });      
    });
  });
}
OrderSummaryController.validateRefundOrder = (refundOrder, orderObj, callBackFn) => {
  // Validate the refund amount with original order
  var errors = [];
  var isValid = true;
  if (refundOrder.netAmt==null || refundOrder.netAmt<=0) {
    isValid = false;
    var errMesg = Utils.formatMessage("Refund Amt : %%1 is invalid for for order id %%2",
    [refundOrder.netAmt,orderObj.id]);
    errors.push(errMesg);
  }
  else {
    if (refundOrder.netAmt > orderObj.netAmt) {
      isValid = false;
      var errMesg = Utils.formatMessage("Refund Amt : %%1 should be less than net amt : %%2 for order id %%3",
      [refundOrder.netAmt,orderObj.netAmt,orderObj.id]);
      errors.push(errMesg);
    }
    if (refundOrder.netAmt + orderObj.amtRefunded > orderObj.netAmt) {
      isValid = false;
      var errMesg = Utils.formatMessage("Refund Amt : %%1 and past refund amt : %%2 " + 
      "should be less than net order amt %%3 for order id %%4",
      [refundOrder.netAmt,orderObj.amtRefunded,orderObj.netAmt, orderObj.id]);
      errors.push(errMesg);
    }
  } 
  if (refundOrder.feeAmt && refundOrder.feeAmt > orderObj.feeAmt) {
    isValid = false;
    var errMesg = Utils.formatMessage("Refund Fee Amt : %%1 should be less than order fee amt : %%2 for order id %%3",
    [refundOrder.feeAmt,orderObj.feeAmt,orderObj.id]);
    errors.push(errMesg);
  }
  if (refundOrder.discountAmt) {
    if (refundOrder.discountAmt < 0 && refundOrder.discountAmt * -1 > orderObj.discountAmt) {
      isValid = false;
      var errMesg = Utils.formatMessage("Refund Discount Amt : %%1 should be less than order discount amt : %%2 for order id %%3",
      [refundOrder.discountAmt,orderObj.discountAmt,orderObj.id]);
      errors.push(errMesg);
    }
    else if (refundOrder.discountAmt > 0 && refundOrder.discountAmt > orderObj.netAmt) {
      isValid = false;
      var errMesg = Utils.formatMessage("Additional Discount Amt : %%1 should be less than " + 
      "order net amt : %%2 for order id %%3",
      [refundOrder.discountAmt,orderObj.netAmt,orderObj.id]);
      errors.push(errMesg);      
    }
  }
  var refundTotal = 0;
  var refundQty = 0;
  for (var i in refundOrder.orderItems) {
    var orderItem = refundOrder.orderItems[i];
    refundTotal = refundTotal + orderItem.itemTotal;
    refundQty = refundQty + orderItem.itemQty;
    if(orderItem.parentOrderId!=orderObj.id) {
      isValid = false;
      var errMesg = Utils.formatMessage("Invalid parentOrderId %%1 for order item %%2",
      [orderItem.parentOrderId,orderItem.sku]);
      errors.push(errMesg);
    }
  }
  // Get the total refunded for all items
  refundTotal = refundTotal + refundOrder.feeAmt;
  refundTotal = refundTotal + refundOrder.discountAmt;
  if (refundTotal != refundOrder.netAmt) {
    isValid = false;
    var errMesg = Utils.formatMessage("Refund Order Amt total : %%1 does not equal new amt : %%2 for order id %%3",
    [refundTotal,refundOrder.netAmt,orderObj.id]);
    errors.push(errMesg);
  }
  if (refundQty != refundOrder.totalItems) {
    isValid = false;
    var errMesg = Utils.formatMessage("Refund Qty : %%1 does not equal order totalItems : %%2 for order id %%3",
    [refundQty, refundOrder.totalItems,orderObj.id]);
    errors.push(errMesg);
  }
  if (orderObj.id != refundOrder.parentOrderId) {
    isValid = false;
    var errMesg = Utils.formatMessage("ParentOderId : %%1 does not equal orderId : %%2",
    [refundOrder.parentOrderId,orderObj.id]);
    errors.push(errMesg);
  }
  if (refundTotal + orderObj.amtRefunded > orderObj.netAmt) {
    isValid = false;
    var errMesg = Utils.formatMessage("Current Refund Amt : %%1 and past refund Amt : %%2" + 
    " should be less than order net amt : %%3 for order id %%4",
    [refundTotal, orderObj.amtRefunded,orderObj.netAmt,orderObj.id]);
    errors.push(errMesg);
  }
  if (refundOrder.discountFeeItems.length > 0) {
    isValid = false;
    errors.push("Cannot have DiscountFee items for refund order ");
  }
  if (refundOrder.paymentInfoItems.length > 0) {
    isValid = false;
    errors.push("Cannot have PaymentInfo items for refund order ");
  }
  if(!isValid || errors.length > 0) return callBackFn(isValid,errors);
  // Validate total refunded against each item as well
  OrderSummary.getRefundedItemTotals(orderObj.id,null,(err,data)=>{
    if(err) return(false,[JSON.stringify(err)]);
    var errors = []; var isValid = true;
    for(var i in data) {
      var sku = data[i].sku;
      var refundOrderItem = refundOrder.orderItems.find(item=>item.sku==sku);
      var orderObjItem = orderObj.orderItems.find(item=>item.sku==sku);
      if((data[i].totalRefunded+refundOrderItem.itemTotal) > orderObjItem.itemTotal) {
        isValid = false;
        var errMesg = Utils.formatMessage(
          "Current Refund Amt %%1 and Past Refund Amt %%2 is greater than itemTotal %%3 for sku %%4",
          [refundOrderItem.itemTotal,data[i].totalRefunded,orderObjItem.itemTotal,sku]);
        errors.push(errMesg);
      }
      if (refundOrderItem.itemQty > 0) {
        var totalToRefAmt = 0;
        if (refundOrderItem.onSale == 'TRUE') totalToRefAmt = refundOrderItem.itemQty * refundOrderItem.salePrice;
        else totalToRefAmt = refundOrderItem.itemQty * refundOrderItem.regularPrice;
        if ((data[i].totalRefunded+refundOrderItem.itemTotal) != totalToRefAmt) {
          isValid = false;
          var errMesg = Utils.formatMessage(
            "Current Refund Amt %%1 and Past Refund Amt %%2 should be equal to itemTotal %%3 for sku %%4",
            [refundOrderItem.itemTotal,data[i].totalRefunded,totalToRefAmt,sku]);
          errors.push(errMesg);
        }
        var totalQtyReturn = refundOrderItem.itemQty + data[i].qtyReturned;
        if(totalQtyReturn>orderObjItem.itemQty) {
          isValid = false;
          var errMesg = Utils.formatMessage(
            "Current Qty %%1 and past returned qty %%2 cannot be more total qty %%3 for sku %%4",
            [refundOrderItem.itemQty,data[i].qtyReturned,orderObjItem.itemQty,sku]);
          errors.push(errMesg);          
        }
      }
    }
    callBackFn(isValid,errors);
  });
}

// Delete a customer with the specified customerId in the request
OrderSummaryController.deleteOrder = (req, res) => {
  if(!req.params && !req.params.orderId) {
    return res.status(500).send({
      errors:["Request cannot be empty and orderId is required!"]
    });
  }
  OrderSummary.getAllRelatedOrders(req.params.orderId,(err,data)=>{
    if(err) {
      console.log(err);
      return res.status(500).send(err);
    }
    var dataObjs = [];
    var errors = [];
    mysqlDb.getConnection().beginTransaction((beginTxnError) => {
      if(beginTxnError != null) return res.status(500).send({errors:[JSON.stringify(beginTxnError)]});
      OrderSummaryController.deleteOrdersNested(data,0,data.length,dataObjs,errors,(err,data)=>{
        if (err) {
          mysqlDb.getConnection().rollback((rollbackError) => {
            var rollBackMessage = '';
            if(rollbackError != null) rollBackMessage = rollbackError.message;
            else rollBackMessage = 'Successfully Rolled Back - After DeleteORdersNested';
            err.errors.push(rollBackMessage); console.log(err);
            console.log(err);
            return res.status(500).send(err);
          });
        }
        mysqlDb.getConnection().commit((commitError) => {
          if(commitError != null) return callBackFn({errors:[JSON.stringify(commitError)]},null);
          return res.status(200).send(dataObjs);
        });
      });
    });
  });
}
OrderSummaryController.deleteOrdersNested = (orderIds,currItem,totalItems,dataObjs,errors,callBackFn) =>{
  if (currItem < totalItems && errors.length == 0) {
    OrderSummaryController.deleteOrderInner(orderIds[currItem].id, (err, data) => {
      if (err) return; // Just return dont call back the func yet
      dataObjs.push(data);
      OrderSummaryController.deleteOrdersNested(orderIds, ++currItem,totalItems,dataObjs,errors,callBackFn);
    });
  }
  if (currItem == totalItems) {
    if (errors.length == 0) return callBackFn(null,dataObjs);
    return callBackFn({errors:errors}, null);
  }
}
OrderSummaryController.getOrderDetailsInner = (orderId, callBackFn) => {
  var orderObj = {};
  if(!orderId) {
    return callBackFn({errors:["orderId is required!"]},null);
  }
  BusinessObj.findByAttribute('OrderSummary','id',orderId, (err, data) => {
    if (err) return callBackFn(err,null);
    orderObj = data;
    // Got the order summary Now lets get order details
    OrderDetails.getAllForOrderId(orderId,(err, data) => {
      if (err) return callBackFn(err,null);
      orderObj['orderItems'] = data;
      // Got the order details Now lets get discount fee details
      OrderDiscountFeeDetails.getAllForOrderId(orderId,(err, data) => {
        if (err) return callBackFn(err,null);
        orderObj['discountFeeItems'] = data;
        OrderPaymentDetails.getAllForOrderId(orderId,(err, data) => {
          if (err) return callBackFn(err,null);
          orderObj['paymentInfoItems'] = data;
          return callBackFn(null,orderObj);
        }); // Payment Details
      }); // Discount fees
    }); // Order Details Get all for orderId
  });//findByAttributeOrderSummary
}
OrderSummaryController.nestedValidate = (orderObj, callBackFn) => {
  var orderItems = orderObj.orderItems;
  //Validate order Items
  var errors = [];
  BusinessObj.nestedValidate('OrderDetails',orderItems,0,orderItems.length,false,errors,
  (isValid,errors = [])=>{
    // Now nested validate 'discount fee'
    var discountFeeItems = orderObj.discountFeeItems;
    BusinessObj.nestedValidate('OrderDiscountFeeDetails',discountFeeItems,0,discountFeeItems.length,false,errors,
    (isValid,errors)=>{
      // Now nested validate 'payment Info'
      var paymentInfoItems = orderObj.paymentInfoItems;
      BusinessObj.nestedValidate('OrderPaymentDetails',paymentInfoItems,0,paymentInfoItems.length,false,errors,
      (isValid,errors)=>{
        return callBackFn(isValid,errors);
      });
    });
  });
}
OrderSummaryController.createOrderTxn = (orderSummary,orderObj,callBackFn) => {
  // Create order Summary
  BusinessObj.create('OrderSummary', orderSummary, (err, data) => {
    if (err) return callBackFn(err,null);
    // Order Summary Created
    //console.log('Order Summary Created Successfully');
    orderSummary.id = data.id?data.id:null;
    orderObj.orderId = orderSummary.id;
    // Now loop through other arrays and set the keys before they are created
    var orderDetailItems = [];
    for (var i in orderObj.orderItems) {
      var orderDetails = new BusinessObj('OrderDetails',orderObj.orderItems[i]);
      orderDetails.orderId = orderSummary.id;
      orderDetailItems.push(orderDetails);
    }
    var discountFeeItems = [];
    for (var i in orderObj.discountFeeItems) {
      var discountFee = new BusinessObj('OrderDiscountFeeDetails',orderObj.discountFeeItems[i]);
      discountFee.orderId = orderSummary.id;
      discountFee.id = Number(i) + 1;
      discountFeeItems.push(discountFee);     
    }
    var paymentInfoItems = [];
    for (var i in orderObj.paymentInfoItems) {
      var paymentInfo = new BusinessObj('OrderPaymentDetails',orderObj.paymentInfoItems[i]);
      paymentInfo.orderId = orderSummary.id;
      paymentInfo.id = Number(i) + 1;
      paymentInfoItems.push(paymentInfo);     
    }      
    // Now nested create the object arrays
    var errFlag = false;
    var errors = [];
    BusinessObj.nestedCreate('OrderDetails', orderDetailItems,0,orderDetailItems.length,errors, (err,data)=> {
      if (err) return callBackFn(err,null);
      else {
        // Now call the discount details
        BusinessObj.nestedCreate('OrderDiscountFeeDetails',discountFeeItems,0,discountFeeItems.length,errors,
        (err, data)=>{            
          if (err) return callBackFn(err,null);
          else {
            // Now create payment details
            BusinessObj.nestedCreate('OrderPaymentDetails',paymentInfoItems,0,paymentInfoItems.length,errors,
            (err, data)=>{            
              if (err) return callBackFn(err,null);
              else { 
                orderSummary['orderItems'] = orderDetailItems;
                orderSummary['discountFeeItems'] = discountFeeItems;
                orderSummary['paymentInfoItems'] = paymentInfoItems;
                return callBackFn(null,orderSummary);
              }
            });
          } // Create payment details
        });
      } // Create discount details
    });
  });
}
OrderSummaryController.processOrderInner = (orderObj, orderType='New', callBackFn) => {
  // Got the order aggregate object
  // Extract order summary from aggregate object
  var orderSummaryReqObj = {
    orderDateTime: new Date(),
    grossAmt: orderObj.grossAmt ? orderObj.grossAmt : null,
    taxAmt: orderObj.taxAmt ? orderObj.taxAmt : 0,
    discountAmt: orderObj.discountAmt ? orderObj.discountAmt : 0,
    feeAmt: orderObj.feeAmt ? orderObj.feeAmt : 0,
    taxAmt: orderObj.taxAmt ? orderObj.taxAmt : 0,
    netAmt: orderObj.netAmt ? orderObj.netAmt : null, 
    paidAmt: orderObj.paidAmt ? orderObj.paidAmt : null,
    balanceAmt: orderObj.balanceAmt ? orderObj.balanceAmt : 0, 
    paymentMode: orderObj.paymentMode ? orderObj.paymentMode : null,
    status: orderObj.status ? orderObj.status : 'completed',
    totalItems: orderObj.totalItems ? orderObj.totalItems : null,
    parentOrderId: orderObj.parentOrderId ? orderObj.parentOrderId : null,
  };
  var orderSummary = new BusinessObj('OrderSummary', orderSummaryReqObj);
  if (orderSummary.balanceAmt > 0) {
    orderSummary.status = 'pending payment';
  }
  //var amountsObj = null;
  if (orderType == 'Refund') {
    orderSummary.status = 'Refund';
  }
  // Validate and if valid create
  BusinessObj.validate('OrderSummary', orderSummary, false, (isValid,errors) => {
      if(!isValid || errors.length > 0) {
        errors.push('OrderSummary Validate failed');
        return callBackFn({errors:errors},false);
      }
      OrderSummaryController.nestedValidate(orderObj,(isValid,errors) => {
        if(!isValid || errors.length > 0) {
          errors.push('OrderSummaryController Nested Validate failed');
          return callBackFn({errors:errors},null);
        }
        OrderSummaryController.createOrderTxn(orderSummary,orderObj,(err,data)=>{
          if(err) return callBackFn(err,null);
          callBackFn(null,data);
        });
      });
  });
}
OrderSummaryController.deleteOrderInner = (orderId, callBackFn) => {
  if(!orderId) return callBackFn({errors:["orderId is required!"]},null);
  BusinessObj.delete('OrderSummary',[{name:'id',value:orderId}], (err, data) => {
    if (err) return callBackFn(err,null);
    // Deleted the order summary Now lets delete order details with stock update
    OrderDetails.deleteAllForOrderId(orderId,(err, data) => {
      if (err) return callBackFn(err,null);
      // Delete Discount Fee
      BusinessObj.delete('OrderDiscountFeeDetails',[{name:'orderId',value:orderId}],(err, data) => {
        if (err && !(err.kind && err.kind == 'not_found')) return callBackFn(err,null);
        // Delete Payment
        BusinessObj.delete('OrderPaymentDetails',[{name:'orderId',value:orderId}],(err, data) => {
          if (err && !(err.kind && err.kind == 'not_found')) return callBackFn(err,null);
          return callBackFn(null,{message:'Successfully Deleted Order ' + orderId});
        }); // Delete OrderPaymentDetails
      }); // Delete OrderDiscountFeeDetails 
    }); // Delete OrderItems
  }); // Delete OrderSummary 
}
OrderSummaryController.totalCount = (req, res) => {
  var time1 = Date.now();
  OrderSummary.totalCount((err, data) => {
    if (err) return res.status(500).send(err);
    console.log("OrderSummaryController.totalCount - Time Taken : " + 
    (Date.now()-time1).toString() + ' milliseconds');
    return res.status(200).send(data);
  });
};
OrderSummaryController.getPage = (req, res) => {
  var time1 = Date.now();
  if (!req.params || !req.params.start || !req.params.pageSize) {
      return res.status(500).send({ errors:["Required request Object start and pageSize!"] });
  }
  OrderSummary.getPage(req.params.start, req.params.pageSize, (err, data) => {
    if (err) return res.status(500).send(err);
    console.log("OrderSummaryController.getPage - Time Taken : " + 
    (Date.now()-time1).toString() + ' milliseconds');
    return res.status(200).send(data);
  });
};
OrderSummaryController.getRefundedItemTotals = (req,res) => {
  var time1 = Date.now();
  if (!req.params || !req.params.orderId) {
      return res.status(500).send({ errors:["Required request Object and orderId!"] });
  }  
  OrderSummary.getRefundedItemTotals(req.params.orderId,null,(err,data) => {
    if(err) return res.status(500).send(err);
    return res.status(200).send(data);    
  });
}
module.exports = OrderSummaryController;