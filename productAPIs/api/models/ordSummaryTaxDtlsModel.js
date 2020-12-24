const mysqlDb = require("./mysqldb.js");

// constructor
const OrdTaxDtls = function(ordTaxDtls) {
 
 
  
 this.order_id = ordTaxDtls.order_id;
 this.tax_name = ordTaxDtls.tax_name;
 this.tax_type = ordTaxDtls.tax_type;
 this.tax_type_val = ordTaxDtls.tax_type_val; 
 this.tax_amt = ordTaxDtls.tax_amt;
 
 
};

OrdTaxDtls.create = (newOrdTaxDtls, result) => {
    var dbConn = mysqlDb.getConnection();


    dbConn.query("INSERT INTO order_summary_tax_details SET ?", newOrdTaxDtls, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created ordTaxDtls: ", { id: res.insertId, ...newOrdTaxDtls });
    result(null, { id: res.insertId, ...newOrdTaxDtls });
  });
};

OrdTaxDtls.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_tax_details WHERE id = ?`, [orderID], (err, res) => {
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

OrdTaxDtls.findByOrderId = (order_id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_tax_details WHERE order_id = ?`, [order_id], (err, res) => {
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
  mysqlDb.getConnection().query("SELECT * FROM order_summary_tax_details", (err, res) => {
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
    "UPDATE order_summary_tax_details SET order_id = ?, type = ?, " + 
    " amount = ?, payment_id = ?, txn_ref_no = ?" +  
    "WHERE id = ?",
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
  mysqlDb.getConnection().query("DELETE FROM ordTaxDtls WHERE id = ?", id, (err, res) => {
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
