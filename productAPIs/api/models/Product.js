const Utils = require("./Utils.js");

// constructor
const Product = function (product) {
  this.sku = product.sku;
  this.title = product.title;
  this.description = product.description;
  this.size = product.size;
  this.dimensions = product.dimensions;
  this.salePrice = product.salePrice;
  this.regularPrice = product.regularPrice;
  this.costPrice = product.costPrice;
  this.category = product.category;
  this.stockQty = product.stockQty;
  this.dealerBillId = product.dealerBillId;
  this.tags = product.tags;
  this.imageCount = product.imageCount;
  this.onSale = product.onSale;
  this.manageStock = product.manageStock;
  this.allowRefund = product.allowRefund;
}
Product.create = (newProduct, callBackFn,dbConn=null) => {
  dbConn.query("INSERT INTO product SET ?", newProduct, (err, data) => {
    if (err) { return callBackFn({errors:[JSON.stringify(err)]}, null); }
    callBackFn(null, { sku: data.insertId, ...newProduct });
  });
}
Product.updateStock = (sku, stockQty, decreaseFlag, callBackFn,dbConn=null) => {
  var queryStr = null;
  if (decreaseFlag == 'TRUE')
    queryStr = "UPDATE product set stockQty = stockQty - ? WHERE sku = ? and manageStock = 'TRUE' and stockQty >= ?";
  else if (decreaseFlag == 'FALSE')
    queryStr = "UPDATE Product set stockQty = stockQty + ? WHERE sku = ? and manageStock = 'TRUE'";
  else return callBackFn({
    errors:[Utils.formatMessage('Product.updateStock failed - Invalid Decrease Flag %%1 for sku: %%2',
    [decreaseFlag,sku])]},null);
  dbConn.query(queryStr,[stockQty,sku,stockQty],(err,data)=>{
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null,data);
  });  
}
Product.findBySku = (sku, callBackFn,dbConn=null) => {
  dbConn.query(`SELECT * FROM product WHERE sku = ?`, [sku], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length == 1) {
      return callBackFn(null, data[0]);
    }
    // not found Product with the sku
    callBackFn({ kind: "not_found" }, null);
  });
}
Product.searchProduct = (searchQueryStr, paramArray, callBackFn,dbConn=null) => {
  if(searchQueryStr == null || searchQueryStr == '') return;
  if(paramArray == null || paramArray.length == 0) return;
  dbConn.query(searchQueryStr, paramArray, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length) return callBackFn(null, data);
    // not found Product with the sku
    callBackFn({ kind: "not_found" }, null);
  });
}
Product.searchProductBySKU = (searchSku, callBackFn,dbConn=null) => {
  var queryStr = `SELECT * FROM product WHERE sku LIKE ?`;
  var paramArray = ['%' + searchSku.toUpperCase() + '%'];
  return Product.searchProduct(queryStr, paramArray, callBackFn,dbConn);
}
Product.totalCount = (sellable, callBackFn,dbConn=null) => {
  var queryStr = "SELECT category, COUNT(category) as count FROM product";
  if (sellable) queryStr += " WHERE manageStock = 'TRUE' AND stockQty > 0";
  queryStr += " GROUP BY category";
  dbConn.query(queryStr, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length > 0) {
      return callBackFn(null, data);
    }   
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.findInRange = (startIndex, pageSize, sellable, callBackFn,dbConn=null) => {
  var sqlQueryToExe = "SELECT * FROM product";
  if (sellable) sqlQueryToExe += " WHERE manageStock = 'TRUE' AND stockQty > 0";
  sqlQueryToExe += " limit " + startIndex + " , " + pageSize;
  dbConn.query(sqlQueryToExe, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length) {
      return callBackFn(null, data);
    }
    // not found Product with the sku
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.getAll = (callBackFn,dbConn=null) => {
  dbConn.query("SELECT * FROM product", (err, data) => {
    if (err) return callBackFn(null, err);
    if(data.length) return callBackFn(null, data);
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.update = (sku, product, callBackFn,dbConn=null) => {
  dbConn.query(
    "UPDATE product SET title = ?, description = ?, size = ?, dimensions = ?, salePrice = ?, regularPrice = ?, " +
    "onSale = ?, costPrice = ?, category = ?, stockQty = ?, dealerBillId = ?, tags = ?, imageCount = ? ," + 
    "manageStock = ?, allowRefund = ? WHERE sku = ?",
    [product.title, product.description, product.size, product.dimensions, product.salePrice, product.regularPrice, 
     product.onSale, product.costPrice, product.category, product.stockQty, product.dealerBillId, product.tags, 
     product.imageCount, product.manageStock, product.allowRefund, sku],
    (err, data) => {
      if (err) return callBackFn(null, err);
      if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
      callBackFn(null, { sku: sku, ...product });
    }
  );
}
Product.delete = (sku, callBackFn,dbConn=null) => {
  dbConn.query("DELETE FROM product WHERE sku = ?", sku, (err, data) => {
    if (err) return callBackFn(null, err);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    return callBackFn(null, data);
  });
}

Product.removeAll = callBackFn => {
  return callBackFn({errors:['Remove All Not Implemented Use DB access to clean table!']}, null);
}

module.exports = Product; 
