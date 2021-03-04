const mysqlDb = require("./mysqldb.js");
const LookUps = require("./LookUps.js");

var OrderPaymentDetails = {};

OrderPaymentDetails.getAttrMetaInfos = () => {
  var attrMetaInfos = [];
  attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:true,key:true});
  attrMetaInfos.push({name:'id',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:true});
  attrMetaInfos.push({name:'mode',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
  attrMetaInfos.push({name:'modeType',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});    
  attrMetaInfos.push({name:'modeTypeId',dataType:'String',required:true,validVal:'AN',srchBy:false,key:false});
  attrMetaInfos.push({name:'txnRefNo',dataType:'String',required:true,validVal:'AN',srchBy:false,key:false});
  attrMetaInfos.push({name:'amount',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
  return attrMetaInfos;
}
OrderPaymentDetails.customValidate = (orderPaymentDetails, errorMessages) => {
  var isValid = true;
  if (!orderPaymentDetails.mode || 
      !LookUps.modes[orderPaymentDetails.mode]) {
        isValid = false;
        errorMessages.push("Payment mode is invalid");
  }
  if (!orderPaymentDetails.modeType || !orderPaymentDetails.mode||
      !LookUps.modeTypes[orderPaymentDetails.mode][orderPaymentDetails.modeType]) {
        isValid = false;
        errorMessages.push("Payment mode type is invalid");
  }  
  if (!orderPaymentDetails.modeTypeId) {
      isValid = false;
      errorMessages.push("Payment mode type id is mandatory");
  }
  if (!orderPaymentDetails.txnRefNo) {
    isValid = false;
    errorMessages.push("Payment txnRefNo is mandatory");
  }
  if (orderPaymentDetails.amount <= 0) {
    isValid = false;
    errorMessages.push("Payment amount must be positive");
  }
  return errorFlag;
}
OrderPaymentDetails.getAllForOrderId = (orderID, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM OrderPaymentDetails WHERE orderId = ?`, [orderID], (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, res);
  });
};
module.exports = OrderPaymentDetails; 
