const OrdSummaryTaxDetails = require("../models/ordSummaryTaxDtlsModel.js");

// Create and Save a new customer
var ordSummaryTaxDtlsController = {};

ordSummaryTaxDtlsController.create = (req, res) => {
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

  if (!req.body.tax_name) {
    errorFlag = true;
    errorMessages.push("tax_name can not be empty!");
  }
  
  if (!req.body.tax_type) {
    errorFlag = true;
    errorMessages.push("tax_type can not be empty!");
  }

  if (!req.body.tax_type_val) {
    errorFlag = true;
    errorMessages.push("tax_type_val can not be empty!");
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
  
 
  const orderDetails = new OrdSummaryTaxDetails({
    
 
  order_id : req.body.order_id,
   tax_name : req.body.tax_name,
 tax_type : req.body.tax_type,
 tax_type_val : req.body.tax_type_val, 
 tax_amt : req.body.tax_amt,

     
    
  });
  OrdSummaryTaxDetails.create(orderDetails, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the customer."
        });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
ordSummaryTaxDtlsController.findAll = (req, res) => {
  OrdSummaryTaxDetails.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// Find a single customer with a customerId
ordSummaryTaxDtlsController.findOne = (req, res) => {
  OrdSummaryTaxDetails.findById(req.params.id, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
ordSummaryTaxDtlsController.findByOrderId = (req, res) => {
  OrdSummaryTaxDetails.findByOrderId(req.params.orderId, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

// Update a customer identified by the customerId in the request
ordSummaryTaxDtlsController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
ordSummaryTaxDtlsController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
ordSummaryTaxDtlsController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = ordSummaryTaxDtlsController; 
