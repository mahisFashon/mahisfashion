const mysqlDb = require("./mysqldb.js");

// constructor
const OrdShipDtls = function (ordShipDtls) {



  //this.id = ordShipDtls.id;
  this.order_id = ordShipDtls.order_id;
  this.customer_id = ordShipDtls.customer_id;
  this.ship_to_name = ordShipDtls.ship_to_name;
  this.addr_line1 = ordShipDtls.addr_line1;
  this.addr_line2 = ordShipDtls.addr_line2;
  this.city = ordShipDtls.city;

  this.state = ordShipDtls.state;
  this.country = ordShipDtls.country;
  this.postal_code = ordShipDtls.postal_code;


};

OrdShipDtls.create = (newOrdShipDtls, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO order_summary_shipping_details SET ?", newOrdShipDtls, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created ordShipDtls: ", { id: res.insertId, ...newOrdShipDtls });
    result(null, { id: res.insertId, ...newOrdShipDtls });
  });
};

OrdShipDtls.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_shipping_details WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found ordShipDtls: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrdShipDtls with the id
    result({ kind: "not_found" }, null);
  });
};

//find by phone no

OrdShipDtls.findByOrderId = (order_id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_shipping_details WHERE order_id = ?`, [order_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found ordShipDtls: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrdShipDtls with the id
    result({ kind: "not_found" }, null);
  });
};

OrdShipDtls.findByCustomerId = (customer_id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_shipping_details WHERE customer_id = ?`, [customer_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found ordShipDtls: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrdShipDtls with the id
    result({ kind: "not_found" }, null);
  });
};
OrdShipDtls.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM order_summary_shipping_details", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("ordShipDtls: ", res);
    result(null, res);
  });
};

OrdShipDtls.updateById = (id, ordShipDtls, result) => {
  mysqlDb.getConnection().query(
    "UPDATE order_summary_shipping_details SET order_id = ?, type = ?, " +
    " amount = ?, payment_id = ?, txn_ref_no = ?" +
    "WHERE id = ?",
    [ordShipDtls.order_id, ordShipDtls.type, ordShipDtls.amount,
    ordShipDtls.payment_id, ordShipDtls.txn_ref_no, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrdShipDtls with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated ordShipDtls: ", { id: id, ...ordShipDtls });
      result(null, { id: id, ...ordShipDtls });
    }
  );
};

OrdShipDtls.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM ordShipDtls WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrdShipDtls with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted ordShipDtls with id: ", id);
    result(null, res);
  });
};

OrdShipDtls.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM ordShipDtls", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} ordShipDtls`);
    result(null, res);
  });
};

module.exports = OrdShipDtls; 
