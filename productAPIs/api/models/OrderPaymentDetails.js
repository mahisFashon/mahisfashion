const mysqlDb = require("./mysqldb.js");

// constructor
const OrderPaymentDetails = function (orderPaymentDetails) {
  this.orderId = orderPaymentDetails.orderId?orderPaymentDetails.orderId:null;
  this.paymentId = orderPaymentDetails.paymentId?orderPaymentDetails.paymentId:null;
  this.mode = orderPaymentDetails.mode?orderPaymentDetails.mode:null;
  this.modeType = orderPaymentDetails.modeType?orderPaymentDetails.modeType:null;
  this.modeTypeId = orderPaymentDetails.modeTypeId?orderPaymentDetails.modeTypeId:null;
  this.txnRefNo = orderPaymentDetails.txnRefNo?orderPaymentDetails.txnRefNo:null;
  this.amount = orderPaymentDetails.amount;
};
OrderPaymentDetails.modes = {'CS':'Cash','CC':'Credit Card','EP':'ePayments'};
OrderPaymentDetails.modeTypes = {'CS':{'CS':'Cash'},
    'CC':{'MC':'Master Card','VC':'VISA','AM':'AMEX'},
    'EP':{'GP':'Google Pay','AP':'Amazon Pay','PT':'PayTM','UP':'UPI'}};
OrderPaymentDetails.validate = (orderPaymentDetails, errorMessages) => {
  var errorFlag = false;
  if (!orderPaymentDetails.mode || 
      !OrderPaymentDetails.modes[orderPaymentDetails.mode]) {
        errorFlag = true;
        errorMessages.push("Payment mode is invalid");
  }
  if (!orderPaymentDetails.modeType || !orderPaymentDetails.mode||
      !OrderPaymentDetails.modeTypes[orderPaymentDetails.mode][orderPaymentDetails.modeType]) {
        errorFlag = true;
        errorMessages.push("Payment mode type is invalid");
  }  
  if (!orderPaymentDetails.modeTypeId) {
      errorFlag = true;
      errorMessages.push("Payment mode type id is mandatory");
  }
  if (!orderPaymentDetails.txnRefNo) {
    errorFlag = true;
    errorMessages.push("Payment txnRefNo is mandatory");
  }
  if (orderPaymentDetails.amount <= 0) {
    errorFlag = true;
    errorMessages.push("Payment amount must be positive");
  }
  return errorFlag;
}
OrderPaymentDetails.nestedCreate = (orderPaymentDetailsItems, currItem, totalItems, errorFlag, result) => {
  if (currItem < totalItems && errorFlag == false) {
    mysqlDb.getConnection().query("INSERT INTO OrderPaymentDetails SET ?", orderPaymentDetailsItems[currItem], (err, data) => {
      if (err) {
        errorFlag = true;
        console.log("error: ", err);
        mysqlDb.getConnection().rollback((rollbackError) => {
          if(rollbackError != null) {
            return result({'message':rollbackError.message},null);
          } else {
            return result({'message':'rollback successful'},null);
          }
        });
        return  result({'message':'Failed'}, null);;
      }
      OrderPaymentDetails.nestedCreate(orderPaymentDetailsItems, ++currItem, totalItems, errorFlag, result);
    });
  }
  else if (currItem == totalItems) {
    if (errorFlag == true) return result({'message':'Failed'}, null);
    return result(null, {'message':'Success'});
  }
}
OrderPaymentDetails.create = (newOrderPaymentDetails, result) => {
  var dbConn = mysqlDb.getConnection();
  dbConn.query("INSERT INTO OrderPaymentDetails SET ?", newOrderPaymentDetails, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created orderPaymentDetails: ", { id: res.insertId, ...newOrderPaymentDetails });
    result(null, { id: res.insertId, ...newOrderPaymentDetails });
  });
};

OrderPaymentDetails.findById = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderPaymentDetails WHERE id = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderPaymentDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderPaymentDetails with the id
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

OrderPaymentDetails.findByOrderId = (orderId, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderPaymentDetails WHERE orderId = ?`, [orderId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found orderPaymentDetails: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found OrderPaymentDetails with the id
    result({ kind: "notFound" }, null);
  });
};


OrderPaymentDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM OrderPaymentDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("orderPaymentDetails: ", res);
    result(null, res);
  });
};

OrderPaymentDetails.updateById = (id, orderPaymentDetails, result) => {
  mysqlDb.getConnection().query(
    "UPDATE OrderPaymentDetails SET orderId = ?, modeType = ?, " +
    " amount = ?, modeTypeId = ?, txnRefNo = ?" +
    "WHERE id = ?",
    [orderPaymentDetails.orderId, orderPaymentDetails.modeType, orderPaymentDetails.amount,
    orderPaymentDetails.modeTypeId, orderPaymentDetails.txnRefNo, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderPaymentDetails with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated orderPaymentDetails: ", { id: id, ...orderPaymentDetails });
      result(null, { id: id, ...orderPaymentDetails });
    }
  );
};

OrderPaymentDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderPaymentDetails WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderPaymentDetails with the id
      result({ kind: "notFound" }, null);
      return;
    }

    console.log("deleted orderPaymentDetails with id: ", id);
    result(null, res);
  });
};

OrderPaymentDetails.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM orderPaymentDetails", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} orderPaymentDetails`);
    result(null, res);
  });
};

module.exports = OrderPaymentDetails; 
