const mysqlDb = require("./mysqldb.js");

// constructor
const OrderDiscountFeeDetails = function (orderDiscountFeeDetails) {
  this.orderId = orderDiscountFeeDetails.orderId?orderDiscountFeeDetails.orderId:null;
  this.discountFeeId = orderDiscountFeeDetails.discountFeeId?orderDiscountFeeDetails.discountFeeId:null;
  this.discountFeeFlag = orderDiscountFeeDetails.discountFeeFlag?orderDiscountFeeDetails.discountFeeFlag:null;
  this.discountFeeType = orderDiscountFeeDetails.discountFeeType?orderDiscountFeeDetails.discountFeeType:null;
  this.discountFeeTypeVal = orderDiscountFeeDetails.discountFeeTypeVal?orderDiscountFeeDetails.discountFeeTypeVal:null;
  this.discountFeeAmt = orderDiscountFeeDetails.discountFeeAmt;
};
OrderDiscountFeeDetails.validate = (orderDiscountFeeDetails, errorMessages) => {
  var errorFlag = false;
  if (!orderDiscountFeeDetails.discountFeeFlag || 
    orderDiscountFeeDetails.discountFeeFlag != 'D' ||
    orderDiscountFeeDetails.discountFeeFlag != 'F' ) {
      errorFlag = true;
      errorMessages.push('Invalid Value for discountFeeFlag');
  }
  if (!orderDiscountFeeDetails.discountFeeType || 
    orderDiscountFeeDetails.discountFeeType != 'pct' ||
    orderDiscountFeeDetails.discountFeeType != 'flat' ) {
      errorFlag = true;
      errorMessages.push('Invalid Value for discountFeeType');
  }
  if (!orderDiscountFeeDetails.discountFeeTypeVal) {
      errorFlag = true;
      errorMessages.push('Invalid Value - discountFeeTypeVal is mandatory');
  }
  if (orderDiscountFeeDetails.discountFeeAmt < 0) {
    errorFlag = true;
    errorMessages.push('Invalid Value - discountFeeAmount cannot be negative');
  }    
}
OrderDiscountFeeDetails.nestedCreate = (orderDiscountFeeDetailsItems, currItem, totalItems, errorFlag, result) => {
  console.log("Nested create log Disc Fees- " + currItem.toString() + " " + totalItems.toString());
  if (currItem < totalItems && errorFlag == false) {
    console.log(JSON.stringify(orderDiscountFeeDetailsItems[currItem]));
    mysqlDb.getConnection().query("INSERT INTO OrderDiscountFeeDetails SET ?", orderDiscountFeeDetailsItems[currItem], (err, data) => {
      if (err) {
        errorFlag = true;
        return  result(err, null);;
      }
      OrderDiscountFeeDetails.nestedCreate(orderDiscountFeeDetailsItems, ++currItem, totalItems, errorFlag, result);
    });
  }
  else if (currItem == totalItems) {
    if (errorFlag == true) return result({'message':'Failed'}, null);
    return result(null, {'message':'Successfully Completed OrderDiscountFeeDetails.nestedCreate'});
  }
}
OrderDiscountFeeDetails.create = (newOrderDiscountFeeDetails, result) => {
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO orderDiscountFeeDetails SET ?", newOrderDiscountFeeDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderDiscountFeeDetails: ", { id: res.insertId, ...newOrderDiscountFeeDetails });
    result(null, { id: res.insertId, ...newOrderDiscountFeeDetails });
  });
};

OrderDiscountFeeDetails.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM orderDiscountFeeDetails WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderDiscountFeeDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderDiscountFeeDetails with the id
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

OrderDiscountFeeDetails.findByOrderId = (orderId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM orderDiscountFeeDetails WHERE orderId = ?`, [orderId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderDiscountFeeDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderDiscountFeeDetails with the id
    result({ kind: "notFound" }, null);
  });
};


OrderDiscountFeeDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM orderDiscountFeeDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderDiscountFeeDetails: ", res);
    result(null, res);
  });
};

OrderDiscountFeeDetails.updateById = (id, orderDiscountFeeDetails, result) => {
  mysqlDb.getConnection().query(
    "UPDATE orderDiscountFeeDetails SET orderId = ?, discountFeeFlag = ?, " +
    " discountFeeType = ?, discountFeeAmt = ?, discountFeeTypeVal = ?" +
    "WHERE id = ?",
    [orderDiscountFeeDetails.orderId, orderDiscountFeeDetails.discountFeeFlag, orderDiscountFeeDetails.discountFeeType,
    orderDiscountFeeDetails.discountFeeAmt, orderDiscountFeeDetails.discountFeeTypeVal, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderDiscountFeeDetails with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated orderDiscountFeeDetails: ", { id: id, ...orderDiscountFeeDetails });
      result(null, { id: id, ...orderDiscountFeeDetails });
    }
  );
};

OrderDiscountFeeDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderDiscountFeeDetails WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderDiscountFeeDetails with the id
      result({ kind: "notFound" }, null);
      return;
    }

    console.log("deleted orderDiscountFeeDetails with id: ", id);
    result(null, res);
  });
};

OrderDiscountFeeDetails.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderDiscountFeeDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderDiscountFeeDetails`);
    result(null, res);
  });
};

module.exports = OrderDiscountFeeDetails; 
