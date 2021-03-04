import { BusinessObj } from './BusinessObjNew';

export class PaymentInfo extends BusinessObj {
  constructor () {
    super();
    this.className = 'PaymentInfo';
    this.classDispNm = 'Payment Info';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new PaymentInfo();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',key:true,formField:false,listDisp:true,dispNm:'Order Id'});
    this.attrMetaInfos.push({name:'id',dataType:'Number',required:true,validVal:'INTGTZ',key:true,formField:false,listDisp:true,dispNm:'Id'});
    this.attrMetaInfos.push({name:'mode',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Pay Mode'});
    this.attrMetaInfos.push({name:'modeType',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Pay Mode Type'});
    this.attrMetaInfos.push({name:'modeTypeId',dataType:'Number',required:true,validVal:'AN',key:false,formField:true,listDisp:true,dispNm:'Pay Mode Type Id'});
    this.attrMetaInfos.push({name:'txnRefNo',dataType:'Number',required:true,validVal:'AN',key:false,formField:true,listDisp:true,dispNm:'Txn Ref No'});
    this.attrMetaInfos.push({name:'amount',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Amount'});
    this.setListDisplayColumns();
  }  
}