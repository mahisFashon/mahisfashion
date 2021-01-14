const OrderDiscountFeeDetails = require("../models/OrderDiscountFeeDetails.js");

// Create and Save a new customer
var OrderDiscountFeeDetailsController = {};

OrderDiscountFeeDetailsController.create = (req, res) => {
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

  if (!req.body.discount_name) {
    errorFlag = true;
    errorMessages.push("discount_name can not be empty!");
  }

  if (!req.body.discount_type) {
    errorFlag = true;
    errorMessages.push("discount_type can not be empty!");
  }

  if (!req.body.discount_type_val) {
    errorFlag = true;
    errorMessages.push("discount_type_val can not be empty!");
  }

  if (!req.body.discount_amt) {
    errorFlag = true;
    errorMessages.push("discount_amt can not be empty!");
  }
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }
  // Create a customer

  const orderDetails = new OrderDiscountFeeDetails({
    order_id: req.body.order_id,
    discount_name: req.body.discount_name,
    discount_type: req.body.discount_type,
    discount_amt: req.body.discount_amt,
    discount_type_val: req.body.discount_type_val,
  });
  OrderDiscountFeeDetails.create(orderDetails, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the customer."
      });
    else res.send(data);
  });
};

OrderDiscountFeeDetailsController.findAll = (req, res) => {
  OrderDiscountFeeDetails.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all customers"
      });
    else res.send(data);
  });
};

// Find a single customer with a customerId
OrderDiscountFeeDetailsController.findOne = (req, res) => {
  OrderDiscountFeeDetails.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
OrderDiscountFeeDetailsController.findByOrderId = (req, res) => {
  OrderDiscountFeeDetails.findByOrderId(req.params.orderId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
//find by email

// Update a customer identified by the customerId in the request
OrderDiscountFeeDetailsController.update = (req, res) => {
  res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
OrderDiscountFeeDetailsController.delete = (req, res) => {
  res.send("Came into Delete");
};

// Delete all customers from the database.
OrderDiscountFeeDetailsController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};

module.exports = OrderDiscountFeeDetailsController; 
