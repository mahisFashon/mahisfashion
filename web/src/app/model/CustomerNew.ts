import { BusinessObj } from './BusinessObjNew';
export class Customer extends BusinessObj {
  constructor () {
    super();
    this.className = 'Customer';
    this.classDispNm = 'Customer';
    this.setAttrMetaData();
  }
  getNewInstance() {
    return new Customer();
  }
  setAttrMetaData() {
    this.attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,srchBy:false,listDisp:false});
    this.attrMetaInfos.push({name:'firstName',dataType:'string',required:true,validVal:'AB',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'First Name'});
    this.attrMetaInfos.push({name:'lastName',dataType:'string',required:true,validVal:'AB',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'Last Name'});
    this.attrMetaInfos.push({name:'phone',dataType:'string',required:true,validVal:'PH',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'Phone'});
    this.attrMetaInfos.push({name:'email',dataType:'string',required:false,validVal:'EM',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'email'});
    this.attrMetaInfos.push({name:'addressLine1',dataType:'string',required:false,validVal:'AN',key:false,formField:true,srchBy:false,listDisp:false,dispNm:'AddressLine1'});
    this.attrMetaInfos.push({name:'addressLine2',dataType:'string',required:false,validVal:'AN',key:false,formField:true,srchBy:false,listDisp:false,dispNm:'AddressLine2'});
    this.attrMetaInfos.push({name:'city',dataType:'string',required:false,validVal:'AB',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'City'});
    this.attrMetaInfos.push({name:'state',dataType:'string',required:false,validVal:'AB',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'State'});      
    this.attrMetaInfos.push({name:'country',dataType:'string',required:false,validVal:'AB',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'Country'});
    this.attrMetaInfos.push({name:'postalCode',dataType:'string',required:false,validVal:'AN',key:false,formField:true,srchBy:true,listDisp:true,dispNm:'Post Code'});
    this.setListDisplayColumns();
  }
}