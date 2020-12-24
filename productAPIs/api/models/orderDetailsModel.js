const mysqlDb = require("./mysqldb.js");

// constructor
const OrderDetails = function (orderDetails) {



  this.order_id = orderDetails.order_id;
  this.sku = orderDetails.sku;
  this.qty = orderDetails.qty;
  this.sell_price = orderDetails.sell_price;
  this.discount_amt = orderDetails.discount_amt;
  this.regular_price = orderDetails.regular_price;


};

OrderDetails.create = (newOrderDetails, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO order_details SET ?", newOrderDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderDetails: ", { id: res.insertId, ...newOrderDetails });
    result(null, { id: res.insertId, ...newOrderDetails });
  });
};

OrderDetails.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_details WHERE order_id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderDetails with the id
    result({ kind: "not_found" }, null);
  });
};

//find by phone no

OrderDetails.findBySku = (sku, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM order_details WHERE sku = ?`, [sku], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderDetails with the id
    result({ kind: "not_found" }, null);
  });
};


OrderDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM order_details", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderDetails: ", res);
    result(null, res);
  });
};

OrderDetails.updateById = (id, orderDetails, result) => {
  mysqlDb.getConnection().query(
    "UPDATE order_details SET sku = ?, qty = ?, " +
    " sell_price = ?, discount_amt = ?, regular_price = ?" +
    "WHERE order_id = ?",
    [orderDetails.sku, orderDetails.qty, orderDetails.sell_price,
    orderDetails.discount_amt, orderDetails.regular_price, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderDetails with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated orderDetails: ", { id: id, ...orderDetails });
      result(null, { id: id, ...orderDetails });
    }
  );
};

OrderDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderDetails WHERE order_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderDetails with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted orderDetails with id: ", id);
    result(null, res);
  });
};

OrderDetails.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderDetails`);
    result(null, res);
  });
};

module.exports = OrderDetails; 
