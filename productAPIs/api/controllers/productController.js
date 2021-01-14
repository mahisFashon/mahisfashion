const Product = require("../models/Product.js");

// Create and Save a new Product
var ProductController = {};
ProductController.validateRequest = (req, res, errMsgs) => {
  var errorFlag = false;
  if (!req.body.sku) {
    errorFlag = true;
    errMsgs.push("sku can not be empty!");
  }
  if (!req.body.title) {
    errorFlag = true;
    errMsgs.push("title can not be empty!");
  }
  if (!req.body.regularPrice) {
    errorFlag = true;
    errMsgs.push("regularPrice can not be empty!");
  }
  if (!req.body.costPrice) {
    errorFlag = true;
    errMsgs.push("costPrice can not be empty!");
  }
  if (!req.body.category) {
    errorFlag = true;
    errMsgs.push("category can not be empty!");
  }
  if (!req.body.stockQty) {
    errorFlag = true;
    errMsgs.push("stockQty can not be empty!");
  }
  if (!req.body.imageCount) {
    errorFlag = true;
    errMsgs.push("imageCount can not be empty!");
  }
  return errorFlag;
}
ProductController.newProduct = (req, res) => {
  return new Product({
    sku: req.body.sku,
    title: req.body.title,
    description: !req.body.description ? null : req.body.description,
    size: !req.body.size ? null : req.body.size,
    dimensions: !req.body.dimensions ? null : req.body.dimensions,
    salePrice: !req.body.salePrice ? null : req.body.salePrice,
    regularPrice: req.body.regularPrice,
    costPrice: req.body.costPrice,
    category: req.body.category,
    stockQty: req.body.stockQty,
    dealerBillId: !req.body.dealerBillId ? null : req.body.dealerBillId,
    tags: !req.body.tags ? null : req.body.tags,
    imageCount: req.body.imageCount,
    onSale: !req.body.onSale ? null : req.body.onSale,
    manageStock: !req.body.manageStock ? null : req.body.manageStock,        
  });
}
ProductController.create = (req, res) => {
  //console.log("Came into Product Controller CREATE");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  var errorMessages = [];
  
  // Validate request
  if (ProductController.validateRequest(req,res,errorMessages)) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }
  // Create a Product
  var product = ProductController.newProduct(req, res);

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
  //console.log("Logging from Find All");
  Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while getting all Products"
      });
    else res.send(data);
  });
};

// Find a single Product with a customerId
ProductController.findOne = (req, res) => {
  //console.log("Logging from Find All" + req.params.sku);
  //console.log(req.params);
  if (!req.params.sku) {
    //console.log("Error sku not defined");
    res.status(500).send({
      message: "Need SKU to find product Some error occurred while getting Product"
    });
    return;
  }
  Product.findBySku(req.params.sku, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.findOne Some error occurred while getting Product"
      });
    else res.send(data);
  });
};
ProductController.findInRange = (req, res) => {
  // console.log("Logging from Find All" + req.body.sku);
  if (!req.params.start) {
    //console.log("Error start index not defined");
    res.status(400).send({
      message: "Need start index to find product Some error occurred while getting Product"
    });
    return;
  }
  Product.findInRange(req.params.start, req.params.pageSize, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.findOne Some error occurred while getting Product"
      });
    else res.send(data);
  });
};

ProductController.productByIndex = (req, res) => {
  if (!req.query.stIndex) {
    //console.log("Error start index not defined");
    res.status(400).send({
      message: "Need start index to find product Some error occurred while getting Product"
    });
    return;
  }
  if (!req.query.pageSize) {
    //console.log("Error page size is  not defined");
    res.status(400).send({
      message: "Need page size  to find product Some error occurred while getting Product"
    });
    return;
  }
  Product.findInRange(req.query.stIndex, req.query.pageSize, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.findInRange Some error occurred while getting Product"
      });
    else res.send(data);
  });
};
ProductController.totalCount = (req, res) => {
  // console.log("Logging from Find All" + req.body.sku);
  
  Product.totalCount( (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.findOne Some error occurred while getting Product"
      });
    else res.send(data);
  });
};

// Update a Product identified by the sku id in the request
ProductController.update = (req, res) => {
  //console.log("Came into Product Controller UPDATE");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  if (!req.params.sku) {
    //console.log("Error sku not defined");
    res.status(500).send({
      message: "Need SKU to Update product Some error occurred while updating Product"
    });
    return;
  }

  var errorMessages = [];
  
  // Validate request
  if (ProductController.validateRequest(req,res,errorMessages)) {
    res.status(400).send({
      message: errorMessages
    });
    return;
  }
  // Create a Product Object from request
  var product = ProductController.newProduct(req, res);

  Product.update(req.params.sku, product, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Product."
      });
    else res.send(data);
  });
};

// Delete a Product with the specified customerId in the request
ProductController.delete = (req, res) => {
  //console.log("Came into Product Controller DELETE");
  if (!req.params.sku) {
    //console.log("Error sku not defined");
    res.status(500).send({
      message: "Need SKU to Update product Some error occurred while updating Product"
    });
    return;
  }
  Product.delete(req.params.sku, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.Delete Some error occurred while deleting Product"
      });
    else res.send(data);
  });  
};

// Delete all Products from the database.
ProductController.deleteAll = (req, res) => {
  res.send("Came into Delete All");
};

ProductController.searchProductBySKU = (req, res) => {
  if (!req.params.searchSku) {
    //console.log("Error sku not defined");
    res.status(500).send({
      message: "Need Search SKU String to find product Some error occurred in searchProductBySKU"
    });
    return;
  }
  Product.searchProductBySKU(req.params.searchSku, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "From ProductController.searchProductBySKU Some error occurred"
      });
    else res.send(data);
  });
}
module.exports = ProductController; 
