const mysqlDb = require("./mysqldb.js");

var OrderDiscountFeeDetails = {};
OrderDiscountFeeDetails.getAttrMetaInfos = () => {
    var attrMetaInfos = [];
    attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:true});
    attrMetaInfos.push({name:'id',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:true});
    attrMetaInfos.push({name:'category',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'type',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});    
    attrMetaInfos.push({name:'value',dataType:'String',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    attrMetaInfos.push({name:'amount',dataType:'String',required:true,validVal:'NUGTZ',srchBy:false,key:false});
    return attrMetaInfos;
}
module.exports = OrderDiscountFeeDetails;
OrderDiscountFeeDetails.customValidate = (orderDiscountFeeDetails, callBackFn,dbConn=null) => {
  var errorMessages = [];
  var isValid = true;
  if (orderDiscountFeeDetails.category && 
    orderDiscountFeeDetails.category != 'D' &&
    orderDiscountFeeDetails.category != 'F' ) {
      isValid = false;
      errorMessages.push('Invalid Value for category');
  }
  if (orderDiscountFeeDetails.type && 
    orderDiscountFeeDetails.type != 'pct' &&
    orderDiscountFeeDetails.type != 'flat' ) {
      isValid = false;
      errorMessages.push('Invalid Value for type');
  }
  if (orderDiscountFeeDetails.value == null) {
      isValid = false;
      errorMessages.push('Invalid Value - value is mandatory');
  }
  if (orderDiscountFeeDetails.amount < 0) {
    isValid = false;
    errorMessages.push('Invalid Value - discountFeeAmount cannot be negative');
  }
  if (!isValid) {
  }
  return callBackFn(isValid,errorMessages);
}
module.exports = OrderDiscountFeeDetails; 
