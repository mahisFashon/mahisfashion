const mysqlDb = require("./mysqldb.js");

// constructor
const OrderSummary = function (orderSummary) {



  this.order_date_time = new Date();
  this.total_amt = orderSummary.total_amt;
  this.tax_amt = orderSummary.tax_amt;
  this.discount_amt = orderSummary.discount_amt;
  this.net_amt = orderSummary.net_amt;
  this.status = orderSummary.status;
  this.shipping_id = orderSummary.shipping_id;
  this.payment_id = orderSummary.payment_id;
  this.balance_amt = orderSummary.balance_amt;
  this.tax_id = orderSummary.tax_id;
  this.discount_id = orderSummary.discount_id;
  this.payment_mode = orderSummary.payment_mode;

};

OrderSummary.create = (newOrderSummary, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO order_summary SET ?", newOrderSummary, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderSummary: ", { id: res.insertId, ...newOrderSummary });
    result(null, { id: res.insertId, ...newOrderSummary });
  });
};

OrderSummary.findById = (id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary WHERE id = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderSummary: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderSummary with the id
    result({ kind: "not_found" }, null);
  });
};



OrderSummary.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM order_summary", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderSummary: ", res);
    result(null, res);
  });
};

OrderSummary.updateById = (id, orderSummary, result) => {
  mysqlDb.getConnection().query(
    "UPDATE order_summary SET order_date_time = ?, total_amt = ?, " +
    "net_amt = ?, status = ?, " +
    "tax_amt = ?, shipping_id = ?, " +
    "payment_id = ?, balance_amt = ?, " +
    "tax_id = ?, discount_id = ?, payment_mode = ? " +
    "WHERE id = ?",
    [orderSummary.order_date_time, orderSummary.total_amt, orderSummary.net_amt,
    orderSummary.status, orderSummary.tax_amt, orderSummary.shipping_id, orderSummary.payment_id,
    orderSummary.balance_amt, orderSummary.tax_id, orderSummary.discount_id, orderSummary.payment_mode, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderSummary with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated orderSummary: ", { id: id, ...orderSummary });
      result(null, { id: id, ...orderSummary });
    }
  );
};

OrderSummary.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderSummary WHERE order_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderSummary with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted orderSummary with id: ", id);
    result(null, res);
  });
};

OrderSummary.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderSummary", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderSummary`);
    result(null, res);
  });
};

module.exports = OrderSummary; 
