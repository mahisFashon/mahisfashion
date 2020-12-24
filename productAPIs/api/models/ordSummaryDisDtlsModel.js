const mysqlDb = require("./mysqldb.js");

// constructor
const OrderSummaryDiscount = function(orderSummaryDiscount) {
 
 
     
  //this.id = orderSummaryDiscount.id;
   this.order_id = orderSummaryDiscount.order_id;
    this.discount_name = orderSummaryDiscount.discount_name;
  this.discount_type = orderSummaryDiscount.discount_type;
  this.discount_amt = orderSummaryDiscount.discount_amt; 
  this.discount_type_val = orderSummaryDiscount.discount_type_val;
 
 
};

OrderSummaryDiscount.create = (newOrderSummaryDiscount, result) => {
    var dbConn = mysqlDb.getConnection();


    dbConn.query("INSERT INTO order_summary_discount_details SET ?", newOrderSummaryDiscount, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderSummaryDiscount: ", { id: res.insertId, ...newOrderSummaryDiscount });
    result(null, { id: res.insertId, ...newOrderSummaryDiscount });
  });
};

OrderSummaryDiscount.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_discount_details WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderSummaryDiscount: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderSummaryDiscount with the id
    result({ kind: "not_found" }, null);
  });
};

//find by phone no

OrderSummaryDiscount.findByOrderId = (order_id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_discount_details WHERE order_id = ?`, [order_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderSummaryDiscount: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderSummaryDiscount with the id
    result({ kind: "not_found" }, null);
  });
};


OrderSummaryDiscount.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM order_summary_discount_details", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderSummaryDiscount: ", res);
    result(null, res);
  });
};

OrderSummaryDiscount.updateById = (id, orderSummaryDiscount, result) => {
  mysqlDb.getConnection().query(
    "UPDATE order_summary_discount_details SET order_id = ?, discount_name = ?, " + 
    " discount_type = ?, discount_amt = ?, discount_type_val = ?" +  
    "WHERE id = ?",
    [orderSummaryDiscount.order_id, orderSummaryDiscount.discount_name, orderSummaryDiscount.discount_type, 
     orderSummaryDiscount.discount_amt, orderSummaryDiscount.discount_type_val, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderSummaryDiscount with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated orderSummaryDiscount: ", { id: id, ...orderSummaryDiscount });
      result(null, { id: id, ...orderSummaryDiscount });
    }
  );
};

OrderSummaryDiscount.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderSummaryDiscount WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderSummaryDiscount with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted orderSummaryDiscount with id: ", id);
    result(null, res);
  });
};

OrderSummaryDiscount.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderSummaryDiscount", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderSummaryDiscount`);
    result(null, res);
  });
};

module.exports = OrderSummaryDiscount; 
