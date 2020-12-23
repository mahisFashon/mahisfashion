const Customer = require("../models/customerModel.js");

// Create and Save a new customer
var customerController = {};

customerController.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
  }
  var errorFlag = false;
  var errorMessages = [];
 
  if (!req.body.first_name) {
    errorFlag = true;
    errorMessages.push("first_name can not be empty!");
  }
  if (!req.body.last_name) {
    errorFlag = true;
    errorMessages.push("last_name can not be empty!");
  }
  
  if (!req.body.email) {
    errorFlag = true;
    errorMessages.push("email can not be empty!");
  }
  if (!req.body.phone) {
    errorFlag = true;
    errorMessages.push("phone can not be empty!");
  }
  
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }  
  // Create a customer
  
 
  const customer = new Customer({
    
    first_name : req.body.first_name,
    last_name : !req.body.last_name ? null : req.body.last_name ,
    middle_name : !req.body.middle_name ? null : req.body.middle_name ,
    email : !req.body.email ? null : req.body.email ,
    phone : !req.body.phone ? null : req.body.phone ,
    city : !req.body.city ? null : req.body.city ,
    state : !req.body.state ? null : req.body.state ,
    country : !req.body.country ? null : req.body.country ,
    address_line1 : !req.body.address_line1 ? null : req.body.address_line1 ,
    address_line2 : !req.body.address_line2 ? null : req.body.address_line2 ,
    postal_code : !req.body.postal_code ? null : req.body.postal_code, 
    
  
     
    
  });
  Customer.create(customer, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the customer."
        });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
customerController.findAll = (req, res) => {
  Customer.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// Find a single customer with a customerId
customerController.findOne = (req, res) => {
  Customer.findById(req.params.id, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

customerController.findByEmail = (req, res) => {
  Customer.findByEmail(req.params.emailId, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

customerController.findByPhoneNo = (req, res) => {
  Customer.findByPhoneNo(req.params.number, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};

customerController.findByName = (req, res) => {
  Customer.findByName(req.params.firstName,req.params.lastName, (err, data) => {
      if (err) 
          res.status(500).send({
              message: err.message || "Some error occurred while getting customer"
          });
      else res.send(data);
  });
};
// Update a customer identified by the customerId in the request
customerController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
customerController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
customerController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = customerController; 
