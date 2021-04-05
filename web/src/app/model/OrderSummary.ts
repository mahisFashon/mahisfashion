import { BusinessObj } from './BusinessObjNew';
import { Constants } from './Constants';
import { LookUpValues } from './LookupValues';
import { Utils } from './Utils';
export class OrderSummary extends BusinessObj {
  constructor () {
    super();
    this.className = 'OrderSummary';
    this.classDispNm = 'Order';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new OrderSummary();
  }
  getDialogActions() {
    if(this['paymentMode']=='Refund') return ['View'];
    else if (this['netAmt'] > this['amtRefunded']) return LookUpValues.getDialogActions(this.className);
    else return ['View','Print','Delete'];
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,listDisp:true,srchBy:true,dispNm:'Order Id'});
    this.attrMetaInfos.push({name:'orderDateTime',dataType:'DateTime',required:true,validVal:'DTM',key:false,formField:false,listDisp:true,srchBy:true,dispNm:'Order Date'});
    this.attrMetaInfos.push({name:'grossAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Gross Amt'});
    this.attrMetaInfos.push({name:'discountAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Discount Amt'});
    this.attrMetaInfos.push({name:'feeAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:false,srchBy:false,dispNm:'Fee Amt'});
    this.attrMetaInfos.push({name:'taxAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:false,srchBy:false,dispNm:'Tax Amt'});
    this.attrMetaInfos.push({name:'netAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,srchBy:true,dispNm:'Net Amt'});
    this.attrMetaInfos.push({name:'paidAmt',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Paid Amt'});
    this.attrMetaInfos.push({name:'balanceAmt',dataType:'Number',required:false,validVal:'NUGTZ',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Bal Amt'});      
    this.attrMetaInfos.push({name:'paymentMode',dataType:'String',required:false,validVal:'AB',key:false,formField:true,listDisp:true,srchBy:true,dispNm:'Payment Mode'});
    this.attrMetaInfos.push({name:'status',dataType:'String',required:false,validVal:'AB',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Status'});
    this.attrMetaInfos.push({name:'totalItems',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Total Items'});
    this.attrMetaInfos.push({name:'parentOrderId',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:false,listDisp:false,srchBy:false,dispNm:'Parent Order'});
    this.attrMetaInfos.push({name:'amtRefunded',dataType:'Number',required:false,validVal:'NUTGTZ',key:false,formField:true,listDisp:true,srchBy:false,dispNm:'Refund Amt'});
    this.attrMetaInfos.push({name:'orderNote',dataType:'String',required:false,validVal:'AN',key:false,formField:false,listDisp:false,srchBy:false,dispNm:'Order Note'});
    this.attrMetaInfos.push({name:'overRideOrderDate',dataType:'Date',required:false,validVal:'DTM',key:false,formField:false,listDisp:false,srchBy:false,dispNm:'Override Order Date'});
    this.setListDisplayColumns();
  }
}