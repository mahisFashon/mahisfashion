const mysqlDb = require("./mysqldb.js");
const Product = require("./Product.js");
// constructor
const OrderDetails = function (orderDetails) {
  this.orderId = orderDetails.orderId?orderDetails.orderId:null;
  this.sku = orderDetails.sku?orderDetails.sku:null;
  this.itemQty = orderDetails.itemQty;
  this.salePrice = orderDetails.salePrice;
  this.regularPrice = orderDetails.regularPrice;
  this.onSale = orderDetails.onSale?orderDetails.onSale:null;
  this.itemTotal = orderDetails.itemTotal;  
};
OrderDetails.nestedCreate = (orderDetailsItems, currItem, totalItems, errorFlag, result) => {
  console.log("Order Details Nested create log - " + currItem.toString() + " " + totalItems.toString());
  if (currItem < totalItems && errorFlag == false) {
    console.log(JSON.stringify(orderDetailsItems[currItem]));
    mysqlDb.getConnection().query("INSERT INTO orderDetails SET ?", orderDetailsItems[currItem], (err, res) => {
      if (err) {
        errorFlag = true;
        return result(err, null);
      }
      // Update the stockQty for this orderItem's product SKU
      var orderItem = orderDetailsItems[currItem];
      Product.updateStock(orderItem.sku, orderItem.itemQty, 'TRUE', (err, product)=> {
        if (err) {
          errorFlag = true;
          return  result(err, null);
        }
        else {
          OrderDetails.nestedCreate(orderDetailsItems, ++currItem, totalItems, errorFlag, result);
        }
      });
    });
  }
  else if (currItem == totalItems) {
    if (errorFlag == true) return result({'message':'Failed'}, null);
    return result(null, {'message':'Successfully Completed OrderDetails.nestedCreate'});
  }
}
OrderDetails.create = (newOrderDetails, result) => {
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO orderDetails SET ?", newOrderDetails, (err, res) => {
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
  mysqlDb.getConnection().query(`SELECT * FROM orderDetails WHERE orderId = ?`, [orderID], (err, res) => {
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
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

OrderDetails.findBySku = (sku, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM orderDetails WHERE sku = ?`, [sku], (err, res) => {
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
    result({ kind: "notFound" }, null);
  });
};


OrderDetails.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM orderDetails", (err, res) => {
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
    "UPDATE orderDetails SET sku = ?, itemQty = ?, " +
    " salePrice = ?, regularPrice = ?, itemTotal = ?" +
    "WHERE orderId = ?",
    [orderDetails.sku, orderDetails.itemQty, orderDetails.salePrice,
    orderDetails.regularPrice, orderDetails.itemTotal, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found OrderDetails with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated orderDetails: ", { id: id, ...orderDetails });
      result(null, { id: id, ...orderDetails });
    }
  );
};

OrderDetails.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM orderDetails WHERE orderId = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found OrderDetails with the id
      result({ kind: "notFound" }, null);
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
OrderDetails.validate = (orderDetails, errorMessages) => {
  var errorFlag = false;
  if (!orderDetails.sku) {
    errorFlag = true;
    errorMessages.push('SKU is mandatory');
  }
  if (orderDetails.itemQty <= 0) {
    errorFlag = true;
    errorMessages.push('Item Quantity must be positive');
  }
  if (orderDetails.regularPrice <= 0) {
    errorFlag = true;
    errorMessages.push('regularPrice must be positive');
  }
  if (!orderDetails.onSale) {
    errorFlag = true;
    errorMessages.push('OnSale is mandatory');
  }  
  if (orderDetails.itemTotal <= 0) {
    errorFlag = true;
    errorMessages.push('itemTotal must be positive');
  }
  if (!errorFlag) {
    // now check amount sanity
    if (orderDetails.onSale == 'FALSE') {
      if (orderDetails.itemTotal != orderDetails.itemQty * orderDetails.regularPrice) {
        errorFlag = true;
        errorMessages.push('Error: itemTotal does not equal itemQty times regular price');        
      }
    }
    else if (onSale == 'TRUE') {
      if (orderDetails.salePrice <= 0) {
        errorFlag = true;
        errorMessages.push('Error: saleprice for item on sale must be positive!');        
      }
      else if (orderDetails.itemTotal != orderDetails.itemQty * orderDetails.salePrice) {
        errorFlag = true;
        errorMessages.push('Error: itemTotal does not equal itemQty times sale price');        
      }
    }
  }
  return errorFlag;
}
OrderDetails.validateAgainstProduct = (orderDetails, errorMessages) => {
  var errorFlag = false;
  errorFlag = OrderDetails.validate(orderDetails, errorMessages);
  if (errorFlag) return errorFlag;
  var product = null;
  Product.findBySku(orderDetails.sku,  (err, data) => {
    if (err) {
      errorFlag = true;
      errorMessages.push(err.message || 
        "Order Summary Controller Product.findBySku Some error occurred while getting Product for SKU "
         + orderItem.sku);
    }
    else {
      product = data;
      if (product.regularPrice != orderDetails.regularPrice) {
        errorFlag = true;
        errorMessages.push('product regular price does not match with DB for SKU ' + orderDetails.sku);
      }
      if (product.salePrice != orderDetails.salePrice) {
        errorFlag = true;
        errorMessages.push('product sale price does not match with DB for SKU ' + orderDetails.sku);
      }
      if (product.stockQty < orderDetails.itemQty) {
        errorFlag = true;
        errorMessages.push('product quantity less than item itemQty for SKU ' + orderDetails.sku);
      }
      if (orderDetails.onSale) {
        if (orderDetails.itemTotal != orderDetails.itemQty * product.salePrice) {
          errorFlag = true;
          errorMessages.push('product item price does not match for SKU ' + orderDetails.sku);
        }  
      }
      else {
        if (orderDetails.itemTotal != orderDetails.itemQty * product.regularPrice) {
          errorFlag = true;
          errorMessages.push('product item price does not match for SKU ' + orderDetails.sku);
        }
      } 
      return errorFlag;      
    }
  });
}
module.exports = OrderDetails; 
