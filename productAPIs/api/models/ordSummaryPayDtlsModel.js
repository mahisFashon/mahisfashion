const mysqlDb = require("./mysqldb.js");

// constructor
const OrderPayDiscount = function(orderPayDiscount) {
 
 
     
  //this.id = orderPayDiscount.id;
   this.order_id = orderPayDiscount.order_id;
    this.category = orderPayDiscount.category;
  this.type = orderPayDiscount.type;
  this.amount = orderPayDiscount.amount; 
  this.payment_id = orderPayDiscount.payment_id;
 this.txn_ref_no = orderPayDiscount.txn_ref_no;
 
 
};

OrderPayDiscount.create = (newOrderPayDiscount, result) => {
    var dbConn = mysqlDb.getConnection();


    dbConn.query("INSERT INTO order_summary_payment_details SET ?", newOrderPayDiscount, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderPayDiscount: ", { id: res.insertId, ...newOrderPayDiscount });
    result(null, { id: res.insertId, ...newOrderPayDiscount });
  });
};

OrderPayDiscount.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_payment_details WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderPayDiscount: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderPayDiscount with the id
    result({ kind: "not_found" }, null);
  });
};

//find by phone no

OrderPayDiscount.findByOrderId = (order_id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_summary_payment_details WHERE order_id = ?`, [order_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderPayDiscount: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderPayDiscount with the id
    result({ kind: "not_found" }, null);
  });
};


OrderPayDiscount.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM order_summary_payment_details", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderPayDiscount: ", res);
    result(null, res);
  });
};

OrderPayDiscount.updateById = (id, orderPayDiscount, result) => {
  mysqlDb.getConnection().query(
    "UPDATE order_summary_payment_details SET order_id = ?, type = ?, " + 
    " amount = ?, payment_id = ?, txn_ref_no = ?" +  
    "WHERE id = ?",
    [orderPayDiscount.order_id, orderPayDiscount.type, orderPayDiscount.amount, 
     orderPayDiscount.payment_id, orderPayDiscount.txn_ref_no, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderPayDiscount with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated orderPayDiscount: ", { id: id, ...orderPayDiscount });
      result(null, { id: id, ...orderPayDiscount });
    }
  );
};

OrderPayDiscount.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderPayDiscount WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderPayDiscount with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted orderPayDiscount with id: ", id);
    result(null, res);
  });
};

OrderPayDiscount.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderPayDiscount", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderPayDiscount`);
    result(null, res);
  });
};

module.exports = OrderPayDiscount; 
