const Customer = require("../models/customerModel.js");

// Create and Save a new customer
var CustomerController = {};

CustomerController.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  var errorFlag = false;
  var errorMessages = [];

  if (!req.body.firstName) {
    errorFlag = true;
    errorMessages.push("firstName can not be empty!");
  }
  if (!req.body.lastName) {
    errorFlag = true;
    errorMessages.push("lastName can not be empty!");
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
    firstName: req.body.firstName,
    lastName: !req.body.lastName ? null : req.body.lastName,
    middleName: !req.body.middleName ? null : req.body.middleName,
    email: !req.body.email ? null : req.body.email,
    phone: !req.body.phone ? null : req.body.phone,
    city: !req.body.city ? null : req.body.city,
    state: !req.body.state ? null : req.body.state,
    country: !req.body.country ? null : req.body.country,
    addressLine1: !req.body.addressLine1 ? null : req.body.addressLine1,
    addressLine2: !req.body.addressLine2 ? null : req.body.addressLine2,
    postalCode: !req.body.postalCode ? null : req.body.postalCode,
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
CustomerController.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all customers"
      });
    else res.send(data);
  });
};

// Find a single customer with a customerId
CustomerController.findOne = (req, res) => {
  Customer.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
//find by email

CustomerController.findByEmail = (req, res) => {
  Customer.findByEmail(req.params.emailId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
//find by email

CustomerController.findByPhoneNo = (req, res) => {
  Customer.findByPhoneNo(req.params.number, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};

CustomerController.findByName = (req, res) => {
  Customer.findByName(req.params.firstName, req.params.lastName, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
// Update a customer identified by the customerId in the request
CustomerController.update = (req, res) => {
  res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
CustomerController.delete = (req, res) => {
  res.send("Came into Delete");
};

// Delete all customers from the database.
CustomerController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};
CustomerController.search = (req, res) => {
  Customer.search(request.params.searchStr, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};

module.exports = CustomerController; 
