const mysqlDb = require("./mysqldb.js");

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
};

Product.create = (newProduct, result) => {
  var time1 = Date.now();
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO product SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    var time2 = Date.now();
    console.log("Created Product : " + res.insertId + ' in ' + (time2-time1).toString() + ' milliseconds');
    result(null, { sku: res.insertId, ...newProduct });
  });
};

Product.findBySku = (sku, result) => {
  console.log("from Product.findBySku " + sku);
  var time1 = Date.now();
  mysqlDb.getConnection().query(`SELECT * FROM product WHERE sku = ?`, [sku], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length == 1) {
      var time2 = Date.now();
      console.log("Product.FindBySku Time Taken : " + (time2-time1).toString() + ' milliseconds');
      result(null, res[0]);
      return; 
    }
    console.log("Product.findBySku Did not find the product ");
    // not found Product with the sku
    result({ kind: "not_found" }, null);
  });
};
Product.searchProduct = (searchQueryStr, paramArray, result) => {
  var time1 = Date.now();
  if(searchQueryStr == null || searchQueryStr == '') return;
  if(paramArray == null || paramArray.length == 0) return;
  var time1 = Date.now();
  mysqlDb.getConnection().query(searchQueryStr, paramArray, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    var time2 = Date.now();
    console.log("Product.searchProduct Time Taken : " + (time2-time1).toString() + ' milliseconds');
    result(null, res);
    return 

    // not found Product with the sku
    result({ kind: "not_found" }, null);
  });  
}
Product.searchProductBySKU = (searchSku, result) => {
  console.log("From Product.searchProductBySKU");
  var queryStr = `SELECT * FROM product WHERE sku LIKE ?`;
  var paramArray = ['%' + searchSku.toUpperCase() + '%'];
  console.log("From Product.searchProductBySKU " + queryStr);
  return Product.searchProduct(queryStr, paramArray, result);
};
Product.totalCount = ( result) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query(`SELECT COUNT(*) as count FROM product`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      var time2 = Date.now();
      console.log("Product.totalCount Time Taken : " + (time2-time1).toString() + ' milliseconds');

      result(null, res[0]);
      return;
    }
   
    result({ kind: "not_found" }, null);
  });
};
Product.findInRange = (startIndex, pageSize, result) => {
  var time1 = Date.now();
  var sqlQueryToExe = "SELECT * FROM product limit " + startIndex + "," + pageSize;

  mysqlDb.getConnection().query(sqlQueryToExe, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      var time2 = Date.now();
      console.log("Product.findInRange Time Taken : "  + (time2-time1).toString() + ' milliseconds');
  
      result(null, res);
      return;
    }

    // not found Product with the sku
    result({ kind: "not_found" }, null);
  });
};

Product.getAll = result => {
  var time1 = Date.now();
  mysqlDb.getConnection().query("SELECT * FROM product", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    var time2 = Date.now();
    console.log("Product.getAll Time Taken : " + (time2-time1).toString() + ' milliseconds');
    result(null, res);
  });
};

Product.update = (sku, product, result) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query(
    "UPDATE product SET title = ?, description = ?, size = ?, dimensions = ?, salePrice = ?, regularPrice = ?, " +
    "onSale = ?, costPrice = ?, category = ?, stockQty = ?, dealerBillId = ?, tags = ?, imageCount = ? ," + 
    "manageStock = ? WHERE sku = ?",
    [product.title, product.description, product.size, product.dimensions, product.salePrice, product.regularPrice, 
     product.onSale, product.costPrice, product.category, product.stockQty, product.dealerBillId, product.tags, 
     product.imageCount, product.manageStock, sku],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Product with the sku
        result({ kind: "not_found" }, null);
        return;
      }

      var time2 = Date.now();
      console.log("Product.update Time Taken : " + (time2-time1).toString() + ' milliseconds');

      result(null, { sku: sku, ...product });
    }
  );
};

Product.delete = (sku, result) => {
  var time1 = Date.now();
  mysqlDb.getConnection().query("DELETE FROM product WHERE sku = ?", sku, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the sku
      result({ kind: "not_found" }, null);
      return;
    }

    var time2 = Date.now();
    console.log("Product.Delete Time Taken : " + (time2-time1).toString() + ' milliseconds');

    result(null, res);
  });
};

Product.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM product", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} product`);
    result(null, res);
  });
};

module.exports = Product; 
