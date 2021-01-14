const OrderDetails = require("../models/OrderDetails.js");
const OrderDiscountFeeDetails = require("../models/OrderDiscountFeeDetails.js");
const OrderPaymentDetails = require("../models/OrderPaymentDetails.js");
const OrderSummary = require("../models/OrderSummary.js");
const mysqlDb = require('../models/mysqldb');

// Create and Save a new customer
var OrderSummaryController = {};

OrderSummaryController.processOrder = (req, res) => {
  console.log(req.body);
  var orderDetailsDBItems = [];
  var discountFeeDBItems = [];
  var paymentDetailsDBItems = [];
  // Got the order aggregate object
  // Extract order summary from aggregate object
  var orderSummary = new OrderSummary({
    orderDateTime: new Date(),
    grossAmt: req.body.grossAmt ? req.body.grossAmt : null,
    taxAmt: req.body.taxAmt ? req.body.taxAmt : 0,
    discountAmt: req.body.discountAmt ? req.body.discountAmt : 0,
    feeAmt: req.body.feeAmt ? req.body.feeAmt : 0,
    taxAmt: req.body.taxAmt ? req.body.taxAmt : 0,
    netAmt: req.body.netAmt ? req.body.netAmt : null, 
    paidAmt: req.body.paidAmt ? req.body.paidAmt : null,
    balanceAmt: req.body.balanceAmt ? req.body.balanceAmt : 0, 
    paymentMode: req.body.paymentMode ? req.body.paymentMode : null,
    status: req.body.status ? req.body.status : 'processing',
  });
  var errorFlag = false;
  var errorMessages = [];
  
  errorFlag = OrderSummary.validate(orderSummary, errorMessages);
  if (errorFlag) {
    res.status(500).send({
      message: errorMessages
    });
    return;
  }
  var orderItems = req.body.orderItems;
  for (var i in orderItems) {
    var orderItem = orderItems[i];
    var orderDetailsDb = new OrderDetails({
      orderId:null, sku:orderItem.sku,
      itemQty:orderItem.itemQty,
      salePrice:orderItem.salePrice,
      discountAmt:orderItem.discountAmt,
      regularPrice:orderItem.regularPrice,
      onSale:orderItem.onSale,
      itemTotal:orderItem.itemTotal,
    });
    // Validate SKU and Prices for all products in the order
    var errorFlagTemp = OrderDetails.validateAgainstProduct(orderDetailsDb, errorMessages);
    if (errorFlagTemp) {
      errorFlag = errorFlagTemp;
      continue;
    }
    orderDetailsDBItems.push(orderDetailsDb);
  }
  var discountFeeItems = req.body.discountFeeItems;
  for (var i in discountFeeItems) {
    var discountFee = discountFeeItems[i];
    var orderDiscountFeeDetails = new OrderDiscountFeeDetails({
      discountFeeFlag : discountFee.category?discountFee.category:null,
      discountFeeType : discountFee.type?discountFee.type:null,
      discountFeeTypeVal : discountFee.value?discountFee.value:null,
      discountFeeAmt : discountFee.amount?discountFee.amount:null,
    });
    var erroFlagTemp = OrderDiscountFeeDetails.validate(orderDiscountFeeDetails, errorMessages);
    if (errorFlagTemp) {
      errorFlag = errorFlagTemp;
      continue;
    }
    discountFeeDBItems.push(orderDiscountFeeDetails);
  }
  var paymentInfoItems = req.body.paymentInfoItems;
  for (var i in paymentInfoItems) {
    var paymentInfo = paymentInfoItems[i];
    var orderPaymentDetails = new OrderPaymentDetails({
      mode : paymentInfo.mode?paymentInfo.mode:null,
      modeType : paymentInfo.modeType?paymentInfo.modeType:null,
      modeTypeId : paymentInfo.modeTypeId?paymentInfo.modeTypeId:null,
      txnRefNo : paymentInfo.txnRefNo?paymentInfo.txnRefNo:null,
      amount : paymentInfo.amount?paymentInfo.amount:null,
    });
    var errorFlagTemp = OrderPaymentDetails.validate(orderPaymentDetails, errorMessages);
    if (errorFlagTemp) {
      errorFlag = errorFlagTemp;
      continue;
    }
    paymentDetailsDBItems.push(orderPaymentDetails);
  }
  if (errorFlag == true) {
    res.status(500).send({message: errorMessages,});
    return;
  }
  // console.log(paymentInfoItems);
  // console.log(paymentDetailsDBItems);
  mysqlDb.getConnection().beginTransaction((beginTxnError) => {
    if(beginTxnError != null) {
      res.status(500).send(beginTxnError.message);
    } else {
      //res.status(500).send("rollback successful!");
      // Create order Summary
      OrderSummary.create(orderSummary, (err, data) => {
        if (err) {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the order summary."
          });
          return;
        }
        else {
          orderSummary.id = data.id?data.id:null;
          req.body.orderId = orderSummary.id;
          // Now loop through other arrays and create other records
          for (var idx in orderDetailsDBItems) {
            var i = Number(idx);
            orderDetailsDBItems[i].orderId = orderSummary.id;
          }
          for (var idx in discountFeeDBItems) {
            var i = Number(idx);
            discountFeeDBItems[i].orderId = orderSummary.id;
            discountFeeDBItems[i].discountFeeId = i + 1;  
          }
          for (var idx in paymentDetailsDBItems) {
            var i = Number(idx);
            paymentDetailsDBItems[i].orderId = orderSummary.id;
            paymentDetailsDBItems[i].paymentId = i + 1;          
          }
          var errFlag = false;
          OrderDetails.nestedCreate(orderDetailsDBItems,0,orderDetailsDBItems.length,errFlag, (err,data)=> {
            if (err) {
              errorFlag = true;
              mysqlDb.getConnection().rollback((rollbackError) => {
                if(rollbackError != null) {
                  err.rollbackMesg = rollbackError.message;
                } else {
                  err.rollbackMesg = 'Successfully Rolled Back';
                }
                console.log("error: ", err);
                return res.status(500).send({
                  message: err.message || "Some error occurred while creating the object."
                });
              });
            }
            else {
              // Now call the discount details
              OrderDiscountFeeDetails.nestedCreate(discountFeeDBItems,0,discountFeeDBItems.length,
                errFlag,(err, data)=>{            
                  if (err) {
                    errorFlag = true;
                    mysqlDb.getConnection().rollback((rollbackError) => {
                      if(rollbackError != null) {
                        err.rollbackMesg = rollbackError.message;
                      } else {
                        err.rollbackMesg = 'Successfully Rolled Back';
                      }
                      console.log("error: ", err);
                      return res.status(500).send({
                        message: err.message || "Some error occurred while creating the object."
                      });
                    });     
                }
                else {
                  // Now create payment details
                  OrderPaymentDetails.nestedCreate(paymentDetailsDBItems,0,paymentDetailsDBItems.length,
                    errFlag,(err, data)=>{            
                      if (err) {
                        errorFlag = true;
                        mysqlDb.getConnection().rollback((rollbackError) => {
                          if(rollbackError != null) {
                            err.rollbackMesg = rollbackError.message;
                          } else {
                            err.rollbackMesg = 'Successfully Rolled Back';
                          }
                          console.log("error: ", err);
                          return res.status(500).send({
                            message: err.message || "Some error occurred while creating the object."
                          });
                        });
                    }
                    else { 
                      // Now lets commit
                      mysqlDb.getConnection().commit((commitError) => {
                        if(commitError != null) {
                          res.status(500).send(commitError.message);
                        } else {
                          res.status(200).send(req.body);
                        }
                      });                  
                    }
                  });                  
                } // Create payment details
              });
            } // Create discount details
          });
        } // Create order items
      });
    } // Begin txn
  });
}
OrderSummaryController.nestedCreate = (arrayObjects, currCount, arryLen, errFlag) => {
}
OrderSummaryController.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(500).send({ message: "Content can not be empty!" });
  }
  // Create order summary
  const orderSummary = new OrderSummary({
    orderDateTime: new Date(),
    grossAmt: req.body.grossAmt?req.body.grossAmt:null,
    taxAmt: req.body.taxAmt?req.body.taxAmt:null,
    discountAmt: req.body.discountAmt?req.body.discountAmt:null,
    netAmt: req.body.netAmt?req.body.netAmt:null,
    status: req.body.status?req.body.status:null,
    shippingId: req.body.shippingId?req.body.shippingId:null,
    paymentId: req.body.paymentId?req.body.paymentId:null,
    balanceAmt: req.body.balanceAmt?req.body.balanceAmt:null,
    taxId: req.body.taxId?req.body.taxId:null,
    discountId: req.body.discountId?req.body.discountId:null,
    paymentMode: req.body.paymentMode?req.body.paymentMode:null,
  });
  var errorFlag = false;
  var errorMessages = [];
  errorFlag = OrderSummary.validate(orderSummary, errorMessages);
  if (errorFlag) {
    res.status(500).send({
      message: errorMessages
    });
    return;
  }

  OrderSummary.create(orderSummary, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the customer."
      });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
OrderSummaryController.findAll = (req, res) => {
  OrderSummary.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all customers"
      });
    else res.send(data);
  });
};

// Find a single customer with a customerId
OrderSummaryController.findOne = (req, res) => {
  OrderSummary.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};

//find by email

// Update a customer identified by the customerId in the request
OrderSummaryController.update = (req, res) => {
  res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
OrderSummaryController.delete = (req, res) => {
  res.send("Came into Delete");
};

// Delete all customers from the database.
OrderSummaryController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};

module.exports = OrderSummaryController; 
