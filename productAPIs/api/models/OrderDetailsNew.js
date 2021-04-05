const mysqlDb = require("./mysqldb.js");
const Product = require("./Product.js");
const Utils = require("./Utils.js");
// constructor
var OrderDetails = {};

OrderDetails.getAttrMetaInfos = () => {
  var attrMetaInfos = [];
  attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:true,key:true});
  attrMetaInfos.push({name:'sku',dataType:'String',required:true,validVal:'AN',srchBy:true,key:true});
  attrMetaInfos.push({name:'itemQty',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:false});
  attrMetaInfos.push({name:'salePrice',dataType:'Number',required:false,validVal:'NUGTZ',srchBy:false,key:false});    
  attrMetaInfos.push({name:'regularPrice',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
  attrMetaInfos.push({name:'onSale',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
  attrMetaInfos.push({name:'itemTotal',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
  attrMetaInfos.push({name:'refundItem',dataType:'String',required:false,validVal:'AB',srchBy:false,key:false});
  attrMetaInfos.push({name:'parentOrderId',dataType:'Number',required:false,validVal:'NUGTZ',srchBy:false,key:false});
  
  return attrMetaInfos;
}
OrderDetails.nestedCreate = (orderDetailsItems, currItem, totalItems, errors, callBackFn,dbConn=null) => {
  if (currItem < totalItems && errors.length == 0) {
    dbConn.query("INSERT INTO orderDetails SET ?", orderDetailsItems[currItem], (err, data) => {
      if (err) { errors.push(JSON.stringify(err)); return; }
      // Update the stockQty for this orderItem's product SKU
      var orderItem = orderDetailsItems[currItem];
      var decreaseFlag = 'TRUE';
      if (orderItem['refundItem'] == 'TRUE') decreaseFlag = 'FALSE';
      Product.updateStock(orderItem.sku, orderItem.itemQty, decreaseFlag, (err, product)=> {
        if (err) { errors.push(JSON.stringify(err)); return; }
        OrderDetails.nestedCreate(orderDetailsItems, ++currItem, totalItems, errors, callBackFn,dbConn);
      },dbConn);
    });
  }
  else if (currItem == totalItems) {
    if (errors.length > 0) return callBackFn({errors:errors}, null);
    return callBackFn(null, {message:'Successfully Completed OrderDetails.nestedCreate'});
  }
}
OrderDetails.getAllForOrderId = (orderId, callBackFn,dbConn=null) => {
  if(!orderId) return callBackFn({errors:['OrderDetails.getAllForOrderId orderId is mandatory!']},null);  
  dbConn.query(`SELECT * FROM orderDetails WHERE orderId = ?`, [orderId], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null,data);
  });
};
OrderDetails.deleteAllForOrderId = (orderId, callBackFn,dbConn=null) => {
  if(!orderId) return callBackFn({errors:['OrderDetails.deleteAllForOrderId orderId is mandatory!']},null);
  var stockUpdateQuery = "Update product p JOIN orderDetails od on p.sku=od.sku ";
  stockUpdateQuery += "set p.stockQty = p.stockQty + od.itemQty where od.orderId = ? ";
  stockUpdateQuery += "and (od.refundItem IS NULL or od.refundItem <> 'TRUE')";
  dbConn.query(stockUpdateQuery,[orderId],(err,data) => {
    if(err) {
      return callBackFn({errors:[JSON.stringify(err)]},null);
    }
    // Reverse the refunded itemQty
    stockUpdateQuery = "Update product p JOIN orderDetails od on p.sku=od.sku ";
    stockUpdateQuery += "set p.stockQty = p.stockQty - od.itemQty where od.orderId = ? ";
    stockUpdateQuery += "and od.refundItem IS NOT NULL and od.refundItem = 'TRUE'";    
    dbConn.query(stockUpdateQuery,[orderId],(err,data) => {
      if(err) {
        return callBackFn({errors:[JSON.stringify(err)]},null);
      }    
      // Now we can delete order details
      dbConn.query(`DELETE FROM orderDetails WHERE orderId = ?`, [orderId], (err, data) => {
        if (err) {
          return callBackFn({errors:[JSON.stringify(err)]}, null);
        }
        return callBackFn(null,data);
      });
    });
  });
}
OrderDetails.nestedUpdateStock = (orderDetailsItems, currItem, totalItems, errors, callBackFn,dbConn=null) => {
  if (currItem < totalItems && errors.length == 0) {
    // Update the stockQty for this orderItem's product SKU
    var orderItem = orderDetailsItems[currItem];
    Product.updateStock(orderItem.sku, orderItem.itemQty, 'FALSE', (err, product)=> {
      if (err) return errors.push(JSON.stringify(err));
      else OrderDetails.nestedUpdateStock(orderDetailsItems, ++currItem, totalItems, errors, callBackFn,dbConn);
    },dbConn);
  }
  else if (currItem == totalItems) {
    if (errors.length > 0) return callBackFn({errors:errors}, null);
    return callBackFn(null, {message:'Successfully Completed OrderDetails.nestedStockUpdate'});
  }
}
OrderDetails.customValidate = (orderDetails, callBackFn,dbConn=null) => {
  var isValid = true;
  var errors = [];
  if (orderDetails.refundItem != 'TRUE' && orderDetails.itemQty <= 0) {
    isValid = false;
    var errMesg = Utils.formatMessage("Item Quantity : %%1 must be positive for order item sku - %%2",
    [orderDetails.itemQty ,orderDetails.sku]);
    errors.push(errMesg);
  }
  if (orderDetails.regularPrice <= 0) {
    isValid = false;
    var errMesg = Utils.formatMessage("Regular Price : %%1 must be positive for order item sku - %%2",
    [orderDetails.regularPrice ,orderDetails.sku]);    
    errors.push(errMesg);
  }
  if (orderDetails.itemTotal <= 0) {
    isValid = false;
    var errMesg = Utils.formatMessage("Item Total : %%1 must be positive for order item sku - %%2",
    [orderDetails.itemTotal ,orderDetails.sku]);    
    errors.push(errMesg);    
  }
  if (isValid) {
    // now check amount sanity
    if (orderDetails.onSale == 'FALSE') {
      if (orderDetails.itemQty>0) {
        if (orderDetails.itemTotal > orderDetails.itemQty * orderDetails.regularPrice) {
          isValid = false;
          var errMesg = Utils.formatMessage("Error Item Total : %%1 " + 
          "cannot be greater than itemQty * original regular price : %%2 for sku - %%3",
          [orderDetails.itemTotal,orderDetails.itemQty * orderDetails.regularPrice,orderDetails.sku]);
          errors.push(errMesg);          
        }        
      }
      else {
        if (orderDetails.refundItem == 'TRUE') {
          if (orderDetails.itemTotal > orderDetails.regularPrice) {
            isValid = false;
            var errMesg = Utils.formatMessage("Error Item Total : %%1 " + 
            "cannot be greater than original regular price : %%2 for sku - %%3",
            [orderDetails.itemTotal,orderDetails.regularPrice,orderDetails.sku]);
            errors.push(errMesg);            
          }
        }
      }
    }
    else if (onSale == 'TRUE') {
      if (orderDetails.salePrice <= 0) {
        isValid = false;
        var errMesg = Utils.formatMessage("Error salePrice : %%1 " + 
        "for item on sale must be positive for sku - %%2",
        [orderDetails.salePrice,orderDetails.sku]);
        errors.push(errMesg);        
      }
      else if (orderDetails.itemQty>0) {
        if (orderDetails.itemTotal > orderDetails.itemQty * orderDetails.salePrice) {
          isValid = false;
          var errMesg = Utils.formatMessage("Error Item Total : %%1 " + 
          "cannot be greater than itemQty * original sale price : %%2 for sku - %%3",
          [orderDetails.itemTotal,orderDetails.itemQty * orderDetails.salePrice,orderDetails.sku]);
          errors.push(errMesg);
        }        
      }
      else {
        if (orderDetails.refundItem == 'TRUE') {
          if (orderDetails.itemTotal > orderDetails.salePrice) {
            isValid = false;
            var errMesg = Utils.formatMessage("Error Item Total : %%1 " + 
            "cannot be greater than original sale price : %%2 for sku - %%3",
            [orderDetails.itemTotal,orderDetails.salePrice,orderDetails.sku]);
            errors.push(errMesg);
          }
        }
      }
    }
  }
  if (!isValid) 
    return callBackFn(isValid, errors);

  OrderDetails.validateAgainstProduct(orderDetails, (isValid,errors)=>{
    return callBackFn(isValid, errors);
  },dbConn);
}
OrderDetails.validateAgainstProduct = (orderDetails, callBackFn,dbConn=null) => {
  var isValid = true;
  // This will be called from customValidate so no need to call it again
  //isValid = OrderDetails.customValidate(orderDetails, errors);
  //if (!isValid) return isValid;
  var errors = [];
  var product = null;
  Product.findBySku(orderDetails.sku, (err, data) => {
    if (err) {
      isValid = false;
      errors.push(JSON.stringify(err));
      return callBackFn(isValid,errors);
    }
    product = data;
    if (product.regularPrice != orderDetails.regularPrice) {
      isValid = false;
      var errMesg = Utils.formatMessage("Order Regular Price : %%1 " + 
      "does not match Product Regular Price : %%2 for sku - %%3",
      [orderDetails.regularPrice,product.regularPrice,orderDetails.sku]);
      errors.push(errMesg);
    }
    if (product.salePrice != null && product.salePrice != orderDetails.salePrice) {
      isValid = false;
      var errMesg = Utils.formatMessage("Order Sale Price : %%1 " + 
      "does not match Product Sale Price : %%2 for sku - %%3",
      [orderDetails.salePrice,product.salePrice,orderDetails.sku]);
      errors.push(errMesg);      
    }
    if (orderDetails.refundItem != 'TRUE' && product.stockQty < orderDetails.itemQty ) {
      isValid = false;
      var errMesg = Utils.formatMessage("Order itemQty : %%1 " + 
      "is more than available quantity : %%2 for sku - %%3",
      [orderDetails.itemQty,product.stockQty,orderDetails.sku]);
      errors.push(errMesg);      
    }
    var correctTotal = 0;
    if (orderDetails.onSale == 'TRUE') {
      correctTotal = orderDetails.itemQty * product.salePrice;
      if (orderDetails.refundItem != 'TRUE' && orderDetails.itemTotal != correctTotal) {
        isValid = false;
        var errMesg = Utils.formatMessage("Error Order Item Total : %%1 " + 
        "does not match DB sale price total : %%2 for sku - %%3",
        [orderDetails.itemTotal,correctTotal,orderDetails.sku]);
        errors.push(errMesg);
      }
      else if (orderDetails.refundItem == 'TRUE' && 
      orderDetails.itemTotal >  (correctTotal>0?correctTotal:product.salePrice)) {
        isValid = false;
        var errMesg = Utils.formatMessage("Error Order Item Total : %%1 " + 
        "cannot be greater than sale price : %%2 for sku - %%3",
        [orderDetails.itemTotal,(correctTotal>0?correctTotal:product.salePrice),orderDetails.sku]);
        errors.push(errMesg);  
      }
    }
    else {
      correctTotal = orderDetails.itemQty * product.regularPrice;
      if (orderDetails.refundItem != 'TRUE' && orderDetails.itemTotal != correctTotal) {
        isValid = false;
        var errMesg = Utils.formatMessage("Error Order Item Total : %%1 " + 
        "does not match DB regular price total : %%2 for sku - %%3",
        [orderDetails.itemTotal,correctTotal,orderDetails.sku]);
        errors.push(errMesg);        
      }
      else if (orderDetails.refundItem == 'TRUE' && 
      orderDetails.itemTotal > (correctTotal>0?correctTotal:product.regularPrice)) {
        isValid = false;
        var errMesg = Utils.formatMessage("Error Order Item Total : %%1 " + 
        "cannot be greater than regular price : %%2 for sku - %%3",
        [orderDetails.itemTotal,(correctTotal>0?correctTotal:product.regularPrice),orderDetails.sku]);
        errors.push(errMesg);        
      }      
    }
    return callBackFn(isValid,errors);
  },dbConn);
}
module.exports = OrderDetails;