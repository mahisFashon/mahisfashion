const mysqlDb = require("./mysqldb.js");

// constructor
const OrdTaxDtls = function (ordTaxDtls) {



  this.bill_id = ordTaxDtls.bill_id;
  this.dealer_id = ordTaxDtls.dealer_id;
  var d = new Date(ordTaxDtls.purchase_date);
  this.purchase_date = d;
  this.item_qty = ordTaxDtls.item_qty;
  this.bill_amt = ordTaxDtls.bill_amt;
  this.shipping_charges = ordTaxDtls.shipping_charges;
  this.tax_amt = ordTaxDtls.tax_amt;


};

OrdTaxDtls.create = (newOrdTaxDtls, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO purchase_details SET ?", newOrdTaxDtls, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created ordTaxDtls: ", { id: res.insertId, ...newOrdTaxDtls });
    result(null, { id: res.insertId, ...newOrdTaxDtls });
  });
};

OrdTaxDtls.findByBillId = (billId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM purchase_details WHERE bill_id = ?`, [billId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found ordTaxDtls: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrdTaxDtls with the id
    result({ kind: "not_found" }, null);
  });
};

//find by phone no

OrdTaxDtls.findByDealerId = (dealerId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM purchase_details WHERE dealer_id = ?`, [dealerId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found ordTaxDtls: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrdTaxDtls with the id
    result({ kind: "not_found" }, null);
  });
};

OrdTaxDtls.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM purchase_details", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("ordTaxDtls: ", res);
    result(null, res);
  });
};

OrdTaxDtls.updateById = (id, ordTaxDtls, result) => {
  mysqlDb.getConnection().query(
    "UPDATE purchase_details SET order_id = ?, type = ?, " +
    " amount = ?, payment_id = ?, txn_ref_no = ?" +
    "WHERE bill_id = ?",
    [ordTaxDtls.order_id, ordTaxDtls.type, ordTaxDtls.amount,
    ordTaxDtls.payment_id, ordTaxDtls.txn_ref_no, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrdTaxDtls with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated ordTaxDtls: ", { id: id, ...ordTaxDtls });
      result(null, { id: id, ...ordTaxDtls });
    }
  );
};

OrdTaxDtls.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM ordTaxDtls WHERE bill_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrdTaxDtls with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted ordTaxDtls with id: ", id);
    result(null, res);
  });
};

OrdTaxDtls.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM ordTaxDtls", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} ordTaxDtls`);
    result(null, res);
  });
};

module.exports = OrdTaxDtls; 
