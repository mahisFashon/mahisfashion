const OrderSummaryPayDetails = require("../models/ordSummaryPayDtlsModel.js");

// Create and Save a new customer
var orderSummaryPayDetailsController = {};

orderSummaryPayDetailsController.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
  }
  var errorFlag = false;
  var errorMessages = [];
 
  if (!req.body.order_id) {
    errorFlag = true;
    errorMessages.push("order_id can not be empty!");
  }

  if (!req.body.category) {
    errorFlag = true;
    errorMessages.push("category can not be empty!");
  }
  
  if (!req.body.type) {
    errorFlag = true;
    errorMessages.push("type can not be empty!");
  }

  if (!req.body.amount) {
    errorFlag = true;
    errorMessages.push("amount can not be empty!");
  }
 
  
  
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }  
  // Create a customer
  
 
  const orderDetails = new OrderSummaryPayDetails({
    
  order_id : req.body.order_id,
  category : req.body.category,
  type : req.body.type,
  amount : req.body.amount, 
  payment_id : req.body.payment_id,
 txn_ref_no : req.body.txn_ref_no,
  
     
    
  });
  OrderSummaryPayDetails.create(orderDetails, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the customer."
        });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
orderSummaryPayDetailsController.findAll = (req, res) => {
  OrderSummaryPayDetails.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// Find a single customer with a customerId
orderSummaryPayDetailsController.findOne = (req, res) => {
  OrderSummaryPayDetails.findById(req.params.id, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
orderSummaryPayDetailsController.findByOrderId = (req, res) => {
  OrderSummaryPayDetails.findByOrderId(req.params.orderId, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

// Update a customer identified by the customerId in the request
orderSummaryPayDetailsController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
orderSummaryPayDetailsController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
orderSummaryPayDetailsController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = orderSummaryPayDetailsController; 
