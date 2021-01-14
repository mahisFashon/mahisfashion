const mysqlDb = require("./mysqldb.js");

// constructor
const PurchaseDetails = function (purchaseDetails) {
  this.billId = purchaseDetails.billId;
  this.dealerId = purchaseDetails.dealerId;
  this.purchaseDate = new Date(purchaseDetails.purchaseDate);
  this.itemQty = purchaseDetails.itemQty;
  this.billAmt = purchaseDetails.billAmt;
  this.shippingCharges = purchaseDetails.shippingCharges;
  this.taxAmt = purchaseDetails.taxAmt;
};

PurchaseDetails.create = (newPurchaseDetails, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO purchaseDetails SET ?", newPurchaseDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created purchaseDetails: ", { id: res.insertId, ...newPurchaseDetails });
    result(null, { id: res.insertId, ...newPurchaseDetails });
  });
};

PurchaseDetails.findByBillId = (billId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM purchaseDetails WHERE billId = ?`, [billId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found purchaseDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found PurchaseDetails with the id
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

PurchaseDetails.findByDealerId = (dealerId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM purchaseDetails WHERE dealerId = ?`, [dealerId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found purchaseDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found PurchaseDetails with the id
    result({ kind: "notFound" }, null);
  });
};

PurchaseDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM purchaseDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("purchaseDetails: ", res);
    result(null, res);
  });
};
this.billId = purchaseDetails.billId;
  this.dealerId = purchaseDetails.dealerId;
  this.purchaseDate = new Date(purchaseDetails.purchaseDate);
  this.itemQty = purchaseDetails.itemQty;
  this.billAmt = purchaseDetails.billAmt;
  this.shippingCharges = purchaseDetails.shippingCharges;
  this.taxAmt = purchaseDetails.taxAmt;
PurchaseDetails.updateById = (id, purchaseDetails, result) => {
  mysqlDb.getConnection().query(
    "UPDATE purchaseDetails SET dealerId = ?, purchaseDate = ?, " +
    " itemQty = ?, billAmt = ?, shippingCharges = ?, taxAmt = ?" +
    "WHERE billId = ?",
    [purchaseDetails.dealerId, purchaseDetails.purchaseDate, purchaseDetails.itemQty,
    purchaseDetails.billAmt, purchaseDetails.shippingCharges, purchaseDetails.taxAmt, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found PurchaseDetails with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated purchaseDetails: ", { id: id, ...purchaseDetails });
      result(null, { id: id, ...purchaseDetails });
    }
  );
};

PurchaseDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM purchaseDetails WHERE billId = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found PurchaseDetails with the id
      result({ kind: "notFound" }, null);
      return;
    }

    console.log("deleted purchaseDetails with id: ", id);
    result(null, res);
  });
};

PurchaseDetails.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM purchaseDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} purchaseDetails`);
    result(null, res);
  });
};

module.exports = PurchaseDetails; 
