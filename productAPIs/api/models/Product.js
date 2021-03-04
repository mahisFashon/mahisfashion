const mysqlDb = require("./mysqldb.js");
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
Product.create = (newProduct, callBackFn) => {
  var time1 = Date.now();
  mysqlDb.getConnection().dbConn.query("INSERT INTO product SET ?", newProduct, (err, data) => {
    if (err) { console.log(err); return callBackFn({errors:[JSON.stringify(err)]}, null); }
    console.log("Created Product : " + data.insertId + ' in ' + (Date.now()-time1).toString() + ' milliseconds');
    callBackFn(null, { sku: data.insertId, ...newProduct });
  });
}
Product.updateStock = (sku, stockQty, decreaseFlag, callBackFn) => {
  var queryStr = null;
  if (decreaseFlag == 'TRUE')
    queryStr = "UPDATE Product set stockQty = stockQty - ? WHERE sku = ? and manageStock = 'TRUE' and stockQty >= ?";
  else if (decreaseFlag == 'FALSE')
    queryStr = "UPDATE Product set stockQty = stockQty + ? WHERE sku = ? and manageStock = 'TRUE'";
  else return callBackFn({
    errors:[Utils.formatMessage('Product.updateStock failed - Invalid Decrease Flag %%1 for sku: %%2',
    [decreaseFlag,sku])]},null);
  mysqlDb.getConnection().query(queryStr,[stockQty,sku,stockQty],(err,data)=>{
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null,data);
  });  
}
Product.findBySku = (sku, callBackFn) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query(`SELECT * FROM product WHERE sku = ?`, [sku], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length == 1) {
      var time2 = Date.now();
      console.log("Product.FindBySku Time Taken : " + (time2-time1).toString() + ' milliseconds');
      return callBackFn(null, data[0]);
    }
    // not found Product with the sku
    callBackFn({ kind: "not_found" }, null);
  });
}
Product.searchProduct = (searchQueryStr, paramArray, callBackFn) => {
  var time1 = Date.now();
  if(searchQueryStr == null || searchQueryStr == '') return;
  if(paramArray == null || paramArray.length == 0) return;
  var time1 = Date.now();
  mysqlDb.getConnection().query(searchQueryStr, paramArray, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    console.log("Product.searchProduct Time Taken : " + (Date.now()-time1).toString() + ' milliseconds');
    if (data.length) return callBackFn(null, data);
    // not found Product with the sku
    callBackFn({ kind: "not_found" }, null);
  });
}
Product.searchProductBySKU = (searchSku, callBackFn) => {
  var queryStr = `SELECT * FROM product WHERE sku LIKE ?`;
  var paramArray = ['%' + searchSku.toUpperCase() + '%'];
  return Product.searchProduct(queryStr, paramArray, callBackFn);
}
Product.totalCount = (sellable, callBackFn) => {
  var time1 = Date.now();
  var queryStr = `SELECT COUNT(*) as count FROM product`;
  if (sellable) queryStr += " WHERE manageStock = 'TRUE' AND stockQty > 0";
  mysqlDb.getConnection().query(queryStr, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length) {
      console.log("Product.totalCount Time Taken : " + (Date.now()-time1).toString() + ' milliseconds');
      return callBackFn(null, data[0]);
    }   
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.findInRange = (startIndex, pageSize, sellable, callBackFn) => {
  var time1 = Date.now();
  var sqlQueryToExe = "SELECT * FROM product";
  if (sellable) sqlQueryToExe += " WHERE manageStock = 'TRUE' AND stockQty > 0";
  sqlQueryToExe += " limit " + startIndex + " , " + pageSize;
  mysqlDb.getConnection().query(sqlQueryToExe, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length) {
      console.log("Product.findInRange Time Taken : "  + (Date.now()-time1).toString() + ' milliseconds');
      return callBackFn(null, data);
    }
    // not found Product with the sku
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.getAll = callBackFn => {
  var time1 = Date.now();
  mysqlDb.getConnection().query("SELECT * FROM product", (err, data) => {
    if (err) return callBackFn(null, err);
    console.log("Product.getAll Time Taken : " + (Date.now()-time1).toString() + ' milliseconds');
    if(data.length) return callBackFn(null, data);
    return callBackFn({ kind: "not_found" }, null);
  });
}
Product.update = (sku, product, callBackFn) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query(
    "UPDATE product SET title = ?, description = ?, size = ?, dimensions = ?, salePrice = ?, regularPrice = ?, " +
    "onSale = ?, costPrice = ?, category = ?, stockQty = ?, dealerBillId = ?, tags = ?, imageCount = ? ," + 
    "manageStock = ?, allowRefund = ? WHERE sku = ?",
    [product.title, product.description, product.size, product.dimensions, product.salePrice, product.regularPrice, 
     product.onSale, product.costPrice, product.category, product.stockQty, product.dealerBillId, product.tags, 
     product.imageCount, product.manageStock, product.allowRefund, sku],
    (err, data) => {
      if (err) return callBackFn(null, err);
      if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
      console.log("Product.update Time Taken : " + (Date.now()-time1).toString() + ' milliseconds');
      callBackFn(null, { sku: sku, ...product });
    }
  );
}
Product.delete = (sku, callBackFn) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query("DELETE FROM product WHERE sku = ?", sku, (err, data) => {
    if (err) return callBackFn(null, err);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    console.log("Product.Delete Time Taken : " + (Date.now()-time1).toString() + ' milliseconds');
    return callBackFn(null, data);
  });
}

Product.removeAll = callBackFn => {
  return callBackFn({errors:['Remove All Not Implemented Use DB access to clean table!']}, null);
}

module.exports = Product; 
