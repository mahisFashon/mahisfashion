import { BusinessObj } from './BusinessObjNew';
import { OrderItem } from './OrderItemNew';
import { DiscountFee } from './DiscountFeeNew';
import { PaymentInfo } from './PaymentInfoNew';

export class OrderDetails extends BusinessObj {
  public orderItems : Array<OrderItem>;
  public discountFeeItems: Array<DiscountFee>; 
  public paymentInfoItems : Array<PaymentInfo>;

  constructor () {
    super();
    this.className = 'OrderDetails';
    this.classDispNm = 'Order Details';
    this.setAttrMetaData();
    this.init();
  }
  init() {
    super.init();
    this.orderItems?this.orderItems.splice(0,this.orderItems.length):this.orderItems = new Array<OrderItem>();
    this.discountFeeItems?this.discountFeeItems.splice(0,this.discountFeeItems.length):this.discountFeeItems = new Array<DiscountFee>();
    this.paymentInfoItems?this.paymentInfoItems.splice(0,this.paymentInfoItems.length):this.paymentInfoItems = new Array<PaymentInfo>();
  }
  setValues(orderDetails, dbObj) {
    this.init();
    if (dbObj)
      BusinessObj.setAttributesFromDbObj(this, orderDetails);
    else 
      BusinessObj.setAttributes(this, orderDetails);
    this.orderItems.splice(0,this.orderItems.length);
    for (var i in orderDetails.orderItems) {
      var orderItem = new OrderItem();
      if (dbObj)
        BusinessObj.setAttributesFromDbObj(orderItem, orderDetails.orderItems[i]);
      else 
        BusinessObj.setAttributes(orderItem, orderDetails.orderItems[i]);
      this.orderItems.push(orderItem);
    }
    this.discountFeeItems.splice(0,this.discountFeeItems.length);
    for (var i in orderDetails.discountFeeItems) {
      var discountFee = new DiscountFee();
      if (dbObj)
        BusinessObj.setAttributesFromDbObj(discountFee, orderDetails.discountFeeItems[i]);
      else
        BusinessObj.setAttributes(discountFee, orderDetails.discountFeeItems[i]);
      this.discountFeeItems.push(discountFee);
    }
    this.paymentInfoItems.splice(0,this.paymentInfoItems.length);
    for (var i in orderDetails.paymentInfoItems) {
      var paymentInfo = new PaymentInfo();
      if (dbObj)
        BusinessObj.setAttributesFromDbObj(paymentInfo, orderDetails.paymentInfoItems[i]);
      else
        BusinessObj.setAttributes(paymentInfo, orderDetails.paymentInfoItems[i]);
      this.paymentInfoItems.push(paymentInfo);
    }
  }
  getNewInstance() {
    return new OrderDetails();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,listDisp:true,dispNm:'Order Id'});
    this.attrMetaInfos.push({name:'orderDateTime',dataType:'DateTime',required:true,validVal:'DTM',key:false,formField:false,listDisp:true,dispNm:'Order Date'});    
    this.attrMetaInfos.push({name:'customerId',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:true,listDisp:false,dispNm:'Customer Id'});
    this.attrMetaInfos.push({name:'grossAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Gross Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'discountAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Discount Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'feeAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Fee Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'taxAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:false,dispNm:'Tax Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'netAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:false,dispNm:'Net Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'paidAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Paid Amt',initVal:0.0});
    this.attrMetaInfos.push({name:'balanceAmt',dataType:'Number',required:false,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Balance Amt',initVal:0.0});      
    this.attrMetaInfos.push({name:'paymentMode',dataType:'String',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Payment Mode'});
    this.attrMetaInfos.push({name:'status',dataType:'String',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Status'});
    this.attrMetaInfos.push({name:'totalItems',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:true,listDisp:true,dispNm:'Total Items',initVal:0});
    this.attrMetaInfos.push({name:'parentOrderId',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:false,listDisp:false,dispNm:'Parent Order Id'});
    this.attrMetaInfos.push({name:'amtRefunded',dataType:'Number',required:false,validVal:'NUTGTZ',key:false,formField:true,listDisp:true,dispNm:'Refund Amt'});
    this.attrMetaInfos.push({name:'orderNote',dataType:'String',required:false,validVal:'AN',key:false,formField:false,listDisp:false,dispNm:'Order Note'});
    this.attrMetaInfos.push({name:'overRideOrderDate',dataType:'Date',required:false,validVal:'DTM',key:false,formField:false,listDisp:false,dispNm:'Override Order Date'});
    this.setListDisplayColumns();
  }
  getValues() {
    var busObj = BusinessObj.getAttributes(this);
    var orderItems = [];
    for (var i in this.orderItems) {
      orderItems.push(BusinessObj.getAttributes(this.orderItems[i]));
    }
    var discountFeeItems = [];
    for (var i in this.discountFeeItems) {
      discountFeeItems.push(BusinessObj.getAttributes(this.discountFeeItems[i]));
    }
    var paymentInfoItems = [];
    for (var i in this.paymentInfoItems) {
      paymentInfoItems.push(BusinessObj.getAttributes(this.paymentInfoItems[i]));
    }
    busObj['orderItems'] = orderItems;
    busObj['discountFeeItems'] = discountFeeItems;
    busObj['paymentInfoItems'] = paymentInfoItems;
    return busObj;
  }
}