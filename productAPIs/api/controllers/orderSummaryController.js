const OrderSummary = require("../models/orderSummaryModel.js");

// Create and Save a new customer
var orderSummaryController = {};

orderSummaryController.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
  }
  var errorFlag = false;
  var errorMessages = [];
 
  if (!req.body.total_amt) {
    errorFlag = true;
    errorMessages.push("total_amt can not be empty!");
  }

  if (!req.body.tax_amt) {
    errorFlag = true;
    errorMessages.push("tax_amt can not be empty!");
  }
  
  if (!req.body.discount_amt) {
    errorFlag = true;
    errorMessages.push("discount_amt can not be empty!");
  }

  if (!req.body.net_amt) {
    errorFlag = true;
    errorMessages.push("net_amt can not be empty!");
  }
  
  if (!req.body.status) {
    errorFlag = true;
    errorMessages.push("discount_amt can not be empty!");
  }

   
  if (!req.body.payment_id) {
    errorFlag = true;
    errorMessages.push("payment_id can not be empty!");
  }
  
  
   if (!req.body.payment_mode) {
    errorFlag = true;
    errorMessages.push("payment_mode can not be empty!");
  }
  
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }  
  // Create a customer
  
 
  const orderSummary = new OrderSummary({
    
  order_date_time : new Date(),
 total_amt : req.body.total_amt,
tax_amt : req.body.tax_amt,
discount_amt : req.body.discount_amt,
net_amt : req.body.net_amt,
status : req.body.status,
shipping_id : req.body.shipping_id,
payment_id : req.body.payment_id,
balance_amt : req.body.balance_amt,
tax_id : req.body.tax_id,
discount_id : req.body.discount_id,
payment_mode : req.body.payment_mode,
    
  
     
    
  });
  OrderSummary.create(orderSummary, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the customer."
        });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
orderSummaryController.findAll = (req, res) => {
  OrderSummary.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// Find a single customer with a customerId
orderSummaryController.findOne = (req, res) => {
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
orderSummaryController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
orderSummaryController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
orderSummaryController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = orderSummaryController; 
