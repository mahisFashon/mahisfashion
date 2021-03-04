import { BusinessObj } from './BusinessObjNew';
export class PurchaseDetails extends BusinessObj {
  constructor () {
    super();
    this.className = 'PurchaseDetails';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new PurchaseDetails();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'billId',dataType:'number',required:true,validVal:'AN',key:true,formField:true,listDisp:true,dispNm:'Bill No'});
    this.attrMetaInfos.push({name:'dealerId',dataType:'number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Dealer Id'});
    this.attrMetaInfos.push({name:'purchaseDate',dataType:'date',required:true,validVal:'DT',key:false,formField:true,listDisp:true,dispNm:'Bill Date'});
    this.attrMetaInfos.push({name:'itemQty',dataType:'number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Item Qty'});
    this.attrMetaInfos.push({name:'billAmt',dataType:'number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Bill Amt'});
    this.attrMetaInfos.push({name:'shipAmt',dataType:'number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Tax Amt'});
    this.attrMetaInfos.push({name:'taxAmt',dataType:'number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Ship Amt'});
    this.attrMetaInfos.push({name:'trackingId',dataType:'string',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'Tracking Id'});
    this.attrMetaInfos.push({name:'shipDate',dataType:'date',required:false,validVal:'DT',key:false,formField:true,listDisp:false,dispNm:'Ship Date'});      
    this.attrMetaInfos.push({name:'receivedDate',dataType:'date',required:false,validVal:'DT',key:false,formField:true,listDisp:false,dispNm:'Received Date'});
    this.setListDisplayColumns();
  }
}