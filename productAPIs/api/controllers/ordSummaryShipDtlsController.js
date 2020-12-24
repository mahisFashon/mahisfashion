const OrdSummaryShipDetails = require("../models/ordSummaryShipDtlsModel.js");

// Create and Save a new customer
var ordSummaryShipDtlsController = {};

ordSummaryShipDtlsController.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  var errorFlag = false;
  var errorMessages = [];

  if (!req.body.order_id) {
    errorFlag = true;
    errorMessages.push("order_id can not be empty!");
  }

  if (!req.body.ship_to_name) {
    errorFlag = true;
    errorMessages.push("ship_to_name can not be empty!");
  }

  if (!req.body.addr_line1) {
    errorFlag = true;
    errorMessages.push("addr_line1 can not be empty!");
  }

  if (!req.body.postal_code) {
    errorFlag = true;
    errorMessages.push("postal_code can not be empty!");
  }



  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }
  // Create a customer


  const orderDetails = new OrdSummaryShipDetails({


    order_id: req.body.order_id,
    customer_id: req.body.customer_id,
    ship_to_name: req.body.ship_to_name,
    addr_line1: req.body.addr_line1,
    addr_line2: req.body.addr_line2,
    city: req.body.city,

    state: req.body.state,
    country: req.body.country,
    postal_code: req.body.postal_code,



  });
  OrdSummaryShipDetails.create(orderDetails, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the customer."
      });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
ordSummaryShipDtlsController.findAll = (req, res) => {
  OrdSummaryShipDetails.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all customers"
      });
    else res.send(data);
  });
};

// Find a single customer with a customerId
ordSummaryShipDtlsController.findOne = (req, res) => {
  OrdSummaryShipDetails.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
ordSummaryShipDtlsController.findByOrderId = (req, res) => {
  OrdSummaryShipDetails.findByOrderId(req.params.orderId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
ordSummaryShipDtlsController.findByCustomerId = (req, res) => {
  OrdSummaryShipDetails.findByCustomerId(req.params.customerId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
//find by email

// Update a customer identified by the customerId in the request
ordSummaryShipDtlsController.update = (req, res) => {
  res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
ordSummaryShipDtlsController.delete = (req, res) => {
  res.send("Came into Delete");
};

// Delete all customers from the database.
ordSummaryShipDtlsController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};

module.exports = ordSummaryShipDtlsController; 
