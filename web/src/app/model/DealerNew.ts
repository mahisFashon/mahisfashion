import { BusinessObj } from './BusinessObjNew';
export class Dealer extends BusinessObj {
  constructor () {
    super();
    this.className = 'Dealer';
    this.classDispNm = 'Dealer';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new Dealer();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,listDisp:false});
    this.attrMetaInfos.push({name:'name',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Dealer Name'});
    this.attrMetaInfos.push({name:'phone',dataType:'string',required:true,validVal:'PH',key:false,formField:true,listDisp:true,dispNm:'Phone'});
    this.attrMetaInfos.push({name:'addressLine1',dataType:'string',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'AddressLine1'});
    this.attrMetaInfos.push({name:'addressLine2',dataType:'string',required:false,validVal:'AN',key:false,formField:true,listDisp:false,dispNm:'AddressLine2'});
    this.attrMetaInfos.push({name:'city',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'City'});
    this.attrMetaInfos.push({name:'state',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'State'});      
    this.attrMetaInfos.push({name:'country',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Country'});
    this.attrMetaInfos.push({name:'postalCode',dataType:'string',required:false,validVal:'AN',key:false,formField:true,listDisp:true,dispNm:'Post Code'});
    this.setListDisplayColumns();
  }
}