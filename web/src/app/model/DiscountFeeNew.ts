import { BusinessObj } from './BusinessObjNew';
export class DiscountFee extends BusinessObj {
  constructor () {
    super();
    this.className = 'DiscountFee';
    this.classDispNm = 'DiscountFee';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new DiscountFee();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'NU',key:true,formField:false,listDisp:true,dispNm:'Order Id'});
    this.attrMetaInfos.push({name:'id',dataType:'Number',required:true,validVal:'NU',key:true,formField:false,listDisp:true,dispNm:'Discount Fee Id'});
    this.attrMetaInfos.push({name:'category',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Category'});
    this.attrMetaInfos.push({name:'type',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Type'});
    this.attrMetaInfos.push({name:'value',dataType:'Number',required:false,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Value'});
    this.attrMetaInfos.push({name:'amount',dataType:'Number',required:false,validVal:'NUGTZ',key:false,formField:true,listDisp:false,dispNm:'Amount'});
    this.setListDisplayColumns();
  }  
}