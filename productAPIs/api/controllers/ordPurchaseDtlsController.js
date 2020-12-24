const OrdPurchaseDetails = require("../models/ordPurchaseDtlsModel.js");

// Create and Save a new customer
var ordPurchaseDtlsController = {};

ordPurchaseDtlsController.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
  }
  var errorFlag = false;
  var errorMessages = [];
 
  if (!req.body.bill_id) {
    errorFlag = true;
    errorMessages.push("bill_id can not be empty!");
  }

  if (!req.body.dealer_id) {
    errorFlag = true;
    errorMessages.push("dealer_id can not be empty!");
  }
  
  if (!req.body.purchase_date) {
    errorFlag = true;
    errorMessages.push("purchase_date can not be empty!");
  }

  if (!req.body.item_qty) {
    errorFlag = true;
    errorMessages.push("item_qty can not be empty!");
  }
 
  if (!req.body.bill_amt) {
    errorFlag = true;
    errorMessages.push("bill_amt can not be empty!");
  }
  
  if (!req.body.shipping_charges) {
    errorFlag = true;
    errorMessages.push("shipping_charges can not be empty!");
  }
   if (!req.body.tax_amt) {
    errorFlag = true;
    errorMessages.push("tax_amt can not be empty!");
  }
  
  
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }  
  // Create a customer
  
 
  const orderDetails = new OrdPurchaseDetails({
    
  bill_id : req.body.bill_id,
 dealer_id : req.body.dealer_id,
 purchase_date : req.body.purchase_date,
 item_qty : req.body.item_qty, 
 bill_amt : req.body.bill_amt,
 shipping_charges : req.body.shipping_charges,
 tax_amt : req.body.tax_amt,

     
    
  });
  OrdPurchaseDetails.create(orderDetails, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the customer."
        });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
ordPurchaseDtlsController.findAll = (req, res) => {
  OrdPurchaseDetails.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// // Find a single customer with a customerId
// ordPurchaseDtlsController.findOne = (req, res) => {
//   OrdPurchaseDetails.findById(req.params.id, (err, data) => {
//         if (err) 
//             res.status(500).send({
//                 message: err.message || "Some error occurred while getting customer"
//             });
//         else res.send(data);
//     });
// };
ordPurchaseDtlsController.findByBillId = (req, res) => {
  OrdPurchaseDetails.findByBillId(req.params.billId, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
ordPurchaseDtlsController.findByDealerId = (req, res) => {
  OrdPurchaseDetails.findByDealerId(req.params.billId, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

// Update a customer identified by the customerId in the request
ordPurchaseDtlsController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
ordPurchaseDtlsController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
ordPurchaseDtlsController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = ordPurchaseDtlsController; 
