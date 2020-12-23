const Product = require("../models/productModel.js");

// Create and Save a new Product
var ProductController = {};

ProductController.create = (req, res) => {
    // Validate request
  if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
  }
  var errorFlag = false;
  var errorMessages = [];
  if (!req.body.sku) {
      errorFlag = true;
      errorMessages.push("sku can not be empty!");
  }
  if (!req.body.title) {
    errorFlag = true;
    errorMessages.push("title can not be empty!");
  }
  if (!req.body.regularPrice) {
    errorFlag = true;
    errorMessages.push("regularPrice can not be empty!");
  }
  if (!req.body.costPrice) {
    errorFlag = true;
    errorMessages.push("costPrice can not be empty!");
  }
  if (!req.body.category) {
    errorFlag = true;
    errorMessages.push("category can not be empty!");
  }
  if (!req.body.stockQty) {
    errorFlag = true;
    errorMessages.push("stockQty can not be empty!");
  }
  if (!req.body.imageCount) {
    errorFlag = true;
    errorMessages.push("imageCount can not be empty!");
  }
  if (errorFlag) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }  
  // Create a Product
  const product = new Product({
    sku : req.body.sku,
    title : req.body.title,
    description : !req.body.description ? null : req.body.description ,
    size : !req.body.size ? null : req.body.size ,
    dimensions : !req.body.dimensions ? null : req.body.dimensions ,
    salePrice : !req.body.salePrice ? null : req.body.salePrice ,
    regularPrice : req.body.regularPrice,
    onSale : !req.body.onSale ? null : req.body.onSale ,
    costPrice : req.body.costPrice,
    category : req.body.category,
    stockQty : req.body.stockQty,
    dealerBillId : !req.body.dealerBillId ? null : req.body.dealerBillId ,
    tags : !req.body.tags ? null : req.body.tags ,
    imageCount : req.body.imageCount,
  });
  Product.create(product, (err, data) => {
    if (err) 
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
        });
    else res.send(data);
  });
};

// Retrieve all Products from the database.
ProductController.findAll = (req, res) => {
    Product.getAll( (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting all Products"
            });
        else res.send(data);
    });
};

// Find a single Product with a customerId
ProductController.findOne = (req, res) => {
    Product.findBySku(req.params.sku, (err, data) => {
        if (err) 
            res.status(500).send({
                message: err.message || "Some error occurred while getting Product"
            });
        else res.send(data);
    });
};

// Update a Product identified by the customerId in the request
ProductController.update = (req, res) => {
    res.send("Came into Update All");
};

// Delete a Product with the specified customerId in the request
ProductController.delete = (req, res) => {
    res.send("Came into Delete");
};

// Delete all Products from the database.
ProductController.deleteAll = (req, res) => {
    res.send("Came into Delete All");
};

module.exports = ProductController; 
