const mysqlDb = require("./mysqldb.js");

// constructor
const OrderShippingDetails = function (orderShippingDetails) {
  //this.id = orderShippingDetails.id;
  this.orderId = orderShippingDetails.orderId?orderShippingDetails.orderId:null;
  this.shippingId = orderShippingDetails.shippingId?orderShippingDetails.shippingId:null;
  this.customerId = orderShippingDetails.customerId?orderShippingDetails.customerId:null;
  this.shipToName = orderShippingDetails.shipToName?orderShippingDetails.shipToName:null;
  this.addressLine1 = orderShippingDetails.addressLine1?orderShippingDetails.addressLine1:null;
  this.addressLine2 = orderShippingDetails.addressLine2?orderShippingDetails.addressLine2:null;
  this.city = orderShippingDetails.city?orderShippingDetails.city:null;
  this.state = orderShippingDetails.state?orderShippingDetails.state:null;
  this.country = orderShippingDetails.country?orderShippingDetails.country:null;
  this.postalCode = orderShippingDetails.postalCode?orderShippingDetails.postalCode:null;
};

OrderShippingDetails.create = (newOrderShippingDetails, result) => {
  var dbConn = mysqlDb.getConnection();


  dbConn.query("INSERT INTO OrderShippingDetails SET ?", newOrderShippingDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderShippingDetails: ", { id: res.insertId, ...newOrderShippingDetails });
    result(null, { id: res.insertId, ...newOrderShippingDetails });
  });
};

OrderShippingDetails.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderShippingDetails WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderShippingDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderShippingDetails with the id
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

OrderShippingDetails.findByOrderId = (orderId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderShippingDetails WHERE orderId = ?`, [orderId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderShippingDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderShippingDetails with the id
    result({ kind: "notFound" }, null);
  });
};

OrderShippingDetails.findByCustomerId = (customerId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderShippingDetails WHERE customerId = ?`, [customerId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderShippingDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderShippingDetails with the id
    result({ kind: "notFound" }, null);
  });
};
OrderShippingDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM OrderShippingDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderShippingDetails: ", res);
    result(null, res);
  });
};

OrderShippingDetails.updateById = (id, orderShippingDetails, result) => {
  mysqlDb.getConnection().query(
    "UPDATE OrderShippingDetails SET orderId = ?, customerId = ?, " +
    "shipToName = ?, addressLine1 = ?, addressLine2 = ?, city = ?, " +
    "state = ?, country = ?, postalCode = ? " +
    "WHERE id = ?",
    [orderShippingDetails.orderId, orderShippingDetails.customerId, orderShippingDetails.shipToName,
    orderShippingDetails.addressLine1, orderShippingDetails.addressLine2, orderShippingDetails.city, 
    orderShippingDetails.state, orderShippingDetails.state, orderShippingDetails.postalCode, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderShippingDetails with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated orderShippingDetails: ", { id: id, ...orderShippingDetails });
      result(null, { id: id, ...orderShippingDetails });
    }
  );
};

OrderShippingDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderShippingDetails WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderShippingDetails with the id
      result({ kind: "notFound" }, null);
      return;
    }

    console.log("deleted orderShippingDetails with id: ", id);
    result(null, res);
  });
};

OrderShippingDetails.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderShippingDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderShippingDetails`);
    result(null, res);
  });
};

module.exports = OrderShippingDetails; 
