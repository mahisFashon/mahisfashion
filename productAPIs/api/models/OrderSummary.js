const mysqlDb = require("./mysqldb.js");

// constructor
const OrderSummary = function (orderSummary) {
  this.orderDateTime = orderSummary.orderDateTime?orderSummary.orderDateTime:new Date();
  this.grossAmt = orderSummary.grossAmt;
  this.discountAmt = orderSummary.discountAmt;
  this.feeAmt = orderSummary.feeAmt;
  this.taxAmt = orderSummary.taxAmt;  
  this.netAmt = orderSummary.netAmt;
  this.paidAmt = orderSummary.paidAmt;
  this.balanceAmt = orderSummary.balanceAmt;  
  this.paymentMode = orderSummary.paymentMode?orderSummary.paymentMode:null;
  this.status = orderSummary.status?orderSummary.status:null;
};
OrderSummary.validate = (orderSummary, errorMessages) => {
  var errorFlag = false;
  if (orderSummary.grossAmt <= 0) {
    errorFlag = true;
    errorMessages.push("grossAmt must be positive!");
  }
  if (orderSummary.discountAmt < 0) {
    errorFlag = true;
    errorMessages.push("discountAmt can not be negative!");
  }
  if (orderSummary.feeAmt < 0) {
    errorFlag = true;
    errorMessages.push("feeAmt can not be negative!");
  }
  if (orderSummary.taxAmt < 0) {
    errorFlag = true;
    errorMessages.push("taxAmt can not be negative!");
  }
  if (orderSummary.netAmt <= 0) {
    errorFlag = true;
    errorMessages.push("netAmt must be positive!");
  }
  if (orderSummary.paidAmt <= 0) {
    errorFlag = true;
    errorMessages.push("paidAmt must be positive!");
  }
  if (orderSummary.balanceAmt < 0) {
    errorFlag = true;
    errorMessages.push("BalanceAmt cannot be negative!");
  }
  if (orderSummary.paymentMode == null) {
    errorFlag = true;
    errorMessages.push("paymentMode can not be empty!");
  }  
  if (orderSummary.status == null) {
    errorFlag = true;
    errorMessages.push("status can not be empty!");
  }
  if (!errorFlag) {
    // Now check amount sanities
    if (orderSummary.netAmt != 
      (orderSummary.grossAmt - orderSummary.discountAmt + orderSummary.taxAmt + orderSummary.feeAmt)) {
        errorFlag = true;
        errorMessages.push("Net Amount does not equal gross less discounts + fees and taxes!");
    }
    if (orderSummary.paidAmt + orderSummary.balanceAmt != orderSummary.netAmt) {
      errorFlag = true;
      errorMessages.push("Net Amount does not equal paid amount and balance amount!");
    }
    if (orderSummary.grossAmt <= 0 || orderSummary.netAmt <= 0) {
      errorFlag = true;
      errorMessages.push("Gross or Net amount must be positive!");      
    }
  }
  return errorFlag;
}
OrderSummary.create = (newOrderSummary, result) => {
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO orderSummary SET ?", newOrderSummary, (err, res) => {
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
  mysqlDb.getConnection().query(`SELECT * FROM orderSummary WHERE id = ?`, [id], (err, res) => {
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
    result({ kind: "notFound" }, null);
  });
};

OrderSummary.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM orderSummary", (err, res) => {
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
    "UPDATE orderSummary SET orderDateTime = ?, grossAmt = ?, discountAmt = ?, feeAmt = ? " +
    "taxAmt = ?, netAmt = ?, paidAmt = ?, balanceAmt = ?, paymentMode = ?, status = ?, WHERE id = ?",
    [orderSummary.orderDateTime, orderSummary.grossAmt, orderSummary.discountAmt,
    orderSummary.feeAmt, orderSummary.taxAmt, orderSummary.netAmt, orderSummary.paidAmt,
    orderSummary.balanceAmt, orderSummary.paymentMode, orderSummary.status, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderSummary with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated orderSummary: ", { id: id, ...orderSummary });
      result(null, { id: id, ...orderSummary });
    }
  );
};

OrderSummary.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderSummary WHERE orderId = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderSummary with the id
      result({ kind: "notFound" }, null);
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
