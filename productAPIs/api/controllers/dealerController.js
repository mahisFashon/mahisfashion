const Dealer = require("../models/dealerModel.js");

// Create and Save a new customer
var dealerController = {};

dealerController.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    }
    var errorFlag = false;
    var errorMessages = [];

    if (!req.body.name) {
        errorFlag = true;
        errorMessages.push("first_name can not be empty!");
    }

    if (errorFlag) {
        res.status(400).send({
            message: errorMessages
        });
        return;
    }
    // Create a dealer object
    const dealer = new Dealer({
        name: req.body.name,
        email: !req.body.email ? null : req.body.email,
        phone: !req.body.phone ? null : req.body.phone,
        city: !req.body.city ? null : req.body.city,
        state: !req.body.state ? null : req.body.state,
        country: !req.body.country ? null : req.body.country,
        address_line1: !req.body.address_line1 ? null : req.body.address_line1,
        address_line2: !req.body.address_line2 ? null : req.body.address_line2,
        postal_code: !req.body.postal_code ? null : req.body.postal_code,
    });
    Dealer.create(dealer, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the customer."
            });
        else res.send(data);
    });
};

// Retrieve all customers from the database.
dealerController.findAll = (req, res) => {
    Dealer.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while getting all customers"
            });
        else res.send(data);
    });
};

// Find a single customer with a customerId
dealerController.findOne = (req, res) => {
    Dealer.findById(req.params.id, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

dealerController.findByEmail = (req, res) => {
    Dealer.findByEmail(req.params.emailId, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
//find by email

dealerController.findByPhoneNo = (req, res) => {
    Dealer.findByPhoneNo(req.params.number, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};

dealerController.findByName = (req, res) => {
    Dealer.findByName(req.params.name, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while getting customer"
            });
        else res.send(data);
    });
};
// Update a customer identified by the customerId in the request
dealerController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a customer with the specified customerId in the request
dealerController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all customers from the database.
dealerController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = dealerController; 
