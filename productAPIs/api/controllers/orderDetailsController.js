const OrderDetails = require("../models/OrderDetails.js");

// Create and Save a new customer
var orderDetailsController = {};

orderDetailsController.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  var errorFlag = false;
  var errorMessages = [];

  if (!req.body.sku) {
    errorFlag = true;
    errorMessages.push("sku can not be empty!");
  }

  if (!req.body.qty) {
    errorFlag = true;
    errorMessages.push("quantity can not be empty!");
  }

  if (!req.body.sell_price) {
    errorFlag = true;
    errorMessages.push("sell price can not be empty!");
  }

  if (!req.body.order_id) {
    errorFlag = true;
    errorMessages.push("order_id can not be empty!");
  }

  if (!req.body.discount_amt) {
    errorFlag = true;
    errorMessages.push("discount_amt can not be empty!");
  }


  if (!req.body.regular_price) {
    errorFlag = true;
    errorMessages.push("regular_price can not be empty!");
  }



  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }
  // Create a customer


  const orderDetails = new OrderDetails({

    order_id: req.body.order_id,
    sku: req.body.sku,
    qty: req.body.qty,
    sell_price: req.body.sell_price,
    discount_amt: req.body.discount_amt,
    regular_price: req.body.regular_price,




  });
  OrderDetails.create(orderDetails, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the customer."
      });
    else res.send(data);
  });
};

// Retrieve all customers from the database.
orderDetailsController.findAll = (req, res) => {
  OrderDetails.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all customers"
      });
    else res.send(data);
  });
};

// Find a single customer with a customerId
orderDetailsController.findOne = (req, res) => {
  OrderDetails.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
orderDetailsController.findBySku = (req, res) => {
  OrderDetails.findBySku(req.params.sku, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting customer"
      });
    else res.send(data);
  });
};
//find by email

// Update a customer identified by the customerId in the request
orderDetailsController.update = (req, res) => {
  res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
orderDetailsController.delete = (req, res) => {
  res.send("Came into Delete");
};

// Delete all customers from the database.
orderDetailsController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};

module.exports = orderDetailsController; 
