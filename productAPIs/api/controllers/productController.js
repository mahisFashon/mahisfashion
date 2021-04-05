const BusinessObj = require("../models/BusinessObj.js");
const mySqlDb = require("../models/mysqldb.js");
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
  if (!req.body) return res.status(500).send({ errors:["Content can not be empty!"]});
  var errorMessages = [];
  
  // Validate request
  if (ProductController.validateRequest(req,res,errorMessages))
    return res.status(500).send({errors:errorMessages});
  // Create a Product
  var product = ProductController.newProduct(req, res);
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    Product.create(product, (err, data) => {
      dbConn.release();
      if (err) return res.status(500).send({
        errors:[JSON.stringify(err), "Some error occurred while creating the Product."]
      });
      return res.send(data);
    },dbConn);
  });
}

// Retrieve all Products from the database.
ProductController.findAll = (req, res) => {
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
        errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    Product.getAll((err, data) => {
      dbConn.release();
      if (err) return res.status(500).send({
        errors:[JSON.stringify(err), "Some error occurred while getting all Product."]
      });
      return res.send(data);
    },dbConn);    
  });
}

// Find a single Product with a customerId
ProductController.findOne = (req, res) => {
  if (!req.params.sku) return res.status(500).send({
    errors: ["Need SKU to find product Some error occurred while getting Product"]
  });
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
        errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    Product.findBySku(req.params.sku, (err, data) => {
      dbConn.release();
      if (err) return res.status(500).send({errors: [JSON.stringify(err)]});
      return res.send(data);
    },dbConn);    
  });
}
ProductController.getPageByCategory = (req, res) => {
  if (!req.params.start) return res.status(500).send({errors: ["Need start index to find a product page"]});
  if (!req.params.pageSize) return res.status(500).send({errors:["Need pageSize to find a product page"]});
  if (!req.params.category) return res.status(500).send({errors:["Need category to find a product page"]});
  var whereCond = "category = ?";
  if (req.params.sellable) whereCond = "manageStock = 'TRUE' AND stockQty > 0 AND category = ?";
  var whereParamArray = [req.params.category];
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    BusinessObj.getPage('Product',req.params.start,req.params.pageSize,whereCond,
    whereParamArray,(err,data)=>{
      dbConn.release();
      if(err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);
  });  
}
ProductController.getPage = (req,res) => {
  if (!req.params.start) return res.status(500).send({errors: ["Need start index to find a product page"]});
  if (!req.params.pageSize) return res.status(500).send({errors:["Need pageSize to find a product page"]});
  var whereCond = null;
  if (req.params.sellable) whereCond = "manageStock = 'TRUE' AND stockQty > 0";
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    BusinessObj.getPage('Product',req.params.start,req.params.pageSize,whereCond,null,(err,data)=>{
      dbConn.release();
      if(err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);
  });
}
ProductController.totalCount = (req, res) => {
  var whereCond = null;
  if (req.params.sellable) whereCond = "manageStock = 'TRUE' AND stockQty > 0";
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }  
    BusinessObj.totalCount('Product', whereCond, null, 'category',(err, data) => {
      dbConn.release();
      if (err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);
  });
}

// Update a Product identified by the sku id in the request
ProductController.update = (req, res) => {
  if (!req.body) return res.status(400).send({ errors:["Content can not be empty!"]});
  if (!req.params.sku) return res.status(500).send({
    errors:["Need SKU to Update product Some error occurred while updating Product"]
  });

  var errorMessages = [];
  
  // Validate request
  if (ProductController.validateRequest(req,res,errorMessages)) 
    return res.status(400).send({errors: errorMessages});
  // Create a Product Object from request
  var product = ProductController.newProduct(req, res);
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }  
    Product.update(req.params.sku, product, (err, data) => {
      dbConn.release();
      if (err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);
  });
}

// Delete a Product with the specified customerId in the request
ProductController.delete = (req, res) => {
  if (!req.params.sku) return res.status(500).send({
    errors:["Need SKU to Update product Some error occurred while updating Product"]
  });
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }  
    Product.delete(req.params.sku, (err, data) => {
      dbConn.release();
      if (err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);
  });  
}

// Delete all Products from the database.
ProductController.deleteAll = (req, res) => {
  res.send("Delete All is Not Implemented!! Use DB to delete all products!!");
}

ProductController.searchProductBySKU = (req, res) => {
  if (!req.params.searchSku) return res.status(500).send({
    errors:["Need Search SKU String to find product Some error occurred in searchProductBySKU"]
  });
  mySqlDb.getConnFromPool((err,dbConn) => {
    if(err) { console.log(err); return res.status(500).send({
      errors:[JSON.stringify(err), "Some error occurred while getting connection."]});
    }
    Product.searchProductBySKU(req.params.searchSku, (err, data) => {
      dbConn.release();
      if (err) {console.log(err);return res.status(500).send({errors: [JSON.stringify(err)]});}
      return res.send(data);
    },dbConn);      
  });
}
module.exports = ProductController;