import { BusinessObj } from './BusinessObjNew';
export class OrderItem extends BusinessObj {
    constructor () {
      super();
      this.className = 'OrderItem';
      this.classDispNm = 'Order Item';
      this.setAttrMetaData();
    }
    getNewInstance() {
      return new OrderItem();
    }
    setAttrMetaData() {
      this.attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',key:true,formField:false,listDisp:true,dispNm:'Order Id'});
      this.attrMetaInfos.push({name:'sku',dataType:'Number',required:true,validVal:'AN',key:true,formField:true,listDisp:true,dispNm:'SKU'});
      this.attrMetaInfos.push({name:'title',dataType:'String',required:true,validVal:'AN',key:false,formField:true,listDisp:true,dispNm:'Title'});
      this.attrMetaInfos.push({name:'salePrice',dataType:'Number',required:false,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Sale Price'});
      this.attrMetaInfos.push({name:'regularPrice',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Regular Price'});
      this.attrMetaInfos.push({name:'onSale',dataType:'String',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'On Sale'});
      this.attrMetaInfos.push({name:'itemQty',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:true,dispNm:'Item Qty'});
      this.attrMetaInfos.push({name:'itemTotal',dataType:'Number',required:true,validVal:'NUGTZ',key:false,formField:true,listDisp:false,dispNm:'Total'});
      this.attrMetaInfos.push({name:'refundItem',dataType:'String',required:false,validVal:'AB',key:false,formField:false,listDisp:false,dispNm:'Refund Item'});
      this.attrMetaInfos.push({name:'parentOrderId',dataType:'Number',required:false,validVal:'INTGTZ',key:false,formField:false,listDisp:false,dispNm:'Parent Order Id'});
      this.setListDisplayColumns();
    }
  }  