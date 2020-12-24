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
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO product SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created product: ", { sku: res.insertId, ...newProduct });
    result(null, { sku: res.insertId, ...newProduct });
  });
};

Product.findBySku = (sku, result) => {
  console.log("From Product.findBySku");
  mysqlDb.getConnection().query(`SELECT * FROM product WHERE sku = ?`, [sku], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the sku
    result({ kind: "not_found" }, null);
  });
};
Product.findInRange = (startIndex, pageSize, result) => {
  console.log("From Product.findBySku");
  var sqlQueryToExe = "SELECT * FROM product limit " + startIndex + "," + pageSize;

  mysqlDb.getConnection().query(sqlQueryToExe, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product: ", res);
      result(null, res);
      return;
    }

    // not found Product with the sku
    result({ kind: "not_found" }, null);
  });
};

Product.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM product", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("product: ", res);
    result(null, res);
  });
};

Product.update = (sku, product, result) => {
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

      console.log("updated product: ", { sku: sku, ...product });
      result(null, { sku: sku, ...product });
    }
  );
};

Product.delete = (sku, result) => {
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

    console.log("deleted product with sku: ", sku);
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
