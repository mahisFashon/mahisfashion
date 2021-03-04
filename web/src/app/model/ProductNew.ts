import { BusinessObj } from './BusinessObjNew';
export class Product extends BusinessObj {
  constructor () {
    super();
    this.className = 'Product';
    this.classDispNm = 'Product';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new Product();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'sku',dataType:'String',required:true,validVal:'AN',key:true,formField:true,listDisp:true,dispNm:'SKU'});
    this.attrMetaInfos.push({name:'title',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Title'});
    this.attrMetaInfos.push({name:'description',dataType:'String',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'Description'});
    this.attrMetaInfos.push({name:'size',dataType:'String',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'Size'});
    this.attrMetaInfos.push({name:'dimensions',dataType:'String',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'Dimensions'});
    this.attrMetaInfos.push({name:'salePrice',dataType:'Number',required:false,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Sale Price'});
    this.attrMetaInfos.push({name:'regularPrice',dataType:'Number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Regular Price'});
    this.attrMetaInfos.push({name:'costPrice',dataType:'Number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Cost Price'});
    this.attrMetaInfos.push({name:'category',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Category'});
    this.attrMetaInfos.push({name:'stockQty',dataType:'Number',required:true,validVal:'NU',key:false,formField:true,listDisp:true,dispNm:'Stock Qty'});
    this.attrMetaInfos.push({name:'dealerBillId',dataType:'Number',required:false,validVal:'NU',key:false,formField:true,listDisp:false,dispNm:'Purchase Bill Id'});
    this.attrMetaInfos.push({name:'tags',dataType:'String',required:false,validVal:'AB',key:false,formField:true,listDisp:false,dispNm:'Tags'});      
    this.attrMetaInfos.push({name:'imageCount',dataType:'Number',required:true,validVal:'NU',key:false,formField:true,listDisp:false,dispNm:'Image Count'});
    this.attrMetaInfos.push({name:'onSale',dataType:'String',required:true,validVal:'VL',key:false,formField:true,listDisp:true,dispNm:'On Sale',vlNm:'yesNo'});
    this.attrMetaInfos.push({name:'manageStock',dataType:'String',required:true,validVal:'VL',key:false,formField:true,listDisp:false,dispNm:'Manage Stock',vlNm:'yesNo'});
    this.attrMetaInfos.push({name:'allowRefund',dataType:'String',required:true,validVal:'VL',key:false,formField:true,listDisp:false,dispNm:'Allow Refund',vlNm:'yesNo'});
    this.setListDisplayColumns();
  }
}