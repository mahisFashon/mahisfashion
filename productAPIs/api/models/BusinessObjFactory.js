const Customer = require("./CustomerNew.js");
const Dealer = require("./Dealer.js");
const PurchaseDetails = require("./PurchaseDetails.js");
const OrderSummary = require("./OrderSummaryNew.js");
const OrderDiscountFeeDetails = require("./OrderDiscountFeeDetailsNew.js");
const OrderPaymentDetails = require("./OrderPaymentDetailsNew.js");
const OrderDetails = require("./OrderDetailsNew.js");

var BusinessObjFactory = {};

BusinessObjFactory.getAttrMetaInfos = (busObjName) => {
    switch (busObjName.toLowerCase()) {
        case 'customer': return Customer.getAttrMetaInfos();
        case 'dealer': return Dealer.getAttrMetaInfos();
        case 'purchasedetails': return PurchaseDetails.getAttrMetaInfos();
        case 'ordersummary': return OrderSummary.getAttrMetaInfos();
        case 'orderdiscountfeedetails' : return OrderDiscountFeeDetails.getAttrMetaInfos();
        case 'orderpaymentdetails' : return OrderPaymentDetails.getAttrMetaInfos();
        case 'orderdetails' : return OrderDetails.getAttrMetaInfos();
        default : return null;
    }
}
BusinessObjFactory.hasOverrideNestedCreate = (busObjName) => {
    switch (busObjName.toLowerCase()) {
        case 'orderdetails': return true;
        default : return false;
    }
}
BusinessObjFactory.nestedCreate = (busObjName, busObjs, currItem, totalItems, errors, callBackFn,dbConn=null) => {
    switch (busObjName.toLowerCase()) {
        case 'orderdetails': return OrderDetails.nestedCreate(busObjs, currItem, totalItems, errors, callBackFn,dbConn);
        default : return undefined;
    }
}
BusinessObjFactory.customValidate = (busObjName, businessObj, callBackFn,dbConn=null) => {
    switch (busObjName.toLowerCase()) {
        case 'ordersummary': return OrderSummary.customValidate(businessObj, callBackFn,dbConn);
        case 'orderdetails': return OrderDetails.customValidate(businessObj, callBackFn,dbConn);
        case 'orderdiscountfeedetails': return OrderDiscountFeeDetails.customValidate(businessObj, callBackFn,dbConn);
        default : return callBackFn(true,[]);
    }
}
BusinessObjFactory.validateAttribute = (attrNm, attrVal, attrMetaData) => {
    if(!attrNm || !attrVal || !attrMetaData || attrNm != attrMetaData.name) return false;
    switch(attrMetaData.validVal) {
        case 'AB' : return attrVal.match(/[a-zA-Z]+[\s]?[a-zA-Z]+/g)==null?false:true;
        case 'AN' : return attrVal.match(/[a-zA-Z0-9]+[\s]?[a-zA-Z0-9]*/g)==null?false:true;
        case 'EM' : return attrVal.match(/[A-Za-z_.0-9-]+@{1}[a-z]+([.]{1}[a-z]{2,4})+/gi)==null?false:true;
        case 'PH' : return attrVal.match(/[+]?[0-9]{0,2}[\s]?[0-9]+[0-9-]*/)==null?false:true;
        case 'NU' : return attrVal.match(/^(-?\d+\.\d+)$|^(-?\d+)$/)==null?false:true;
        case 'NUGTZ' : return attrVal.match(/^(\d+\.\d+)$|^(\d+)$/)==null?false:true;
        case 'INTGTZ' : return attrVal.match(/^(\d+)$/)==null?false:true;
        default : return true;
    }
}
BusinessObjFactory.getCustomSearchCondition = (busObjName) => {
    switch (busObjName.toLowerCase()) {
        case 'ordersummary': return OrderSummary.getCustomSearchCondition();
        default : return "";
    }
}
module.exports = BusinessObjFactory; 