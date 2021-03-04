import { BusinessObj } from './BusinessObj';
export class Customer extends BusinessObj {
  public srchSlug : String;
  public id:number;
  public firstName: String;
  public lastName: String; 
  public phone : String;
  public email : String;
  public addressLine1 : String;
  public addressLine2 : String;
  public country : String; 
  public state : String;
  public city : String;
  public postalCode : String;
  constructor () {
    super();
    this.srchSlug = null;
    this.id = null;
    this.firstName = null;
    this.lastName = null;
    this.phone = null;
    this.email = null;
    this.addressLine1 = null;
    this.addressLine2 = null;
    this.country = null; 
    this.state = null;
    this.city = null;
    this.postalCode = null; 
    this.className = 'Customer';
    this.setAttrMetaData();
  }
  setValues (customerObj) {
    if (customerObj == null) return;
    this.id = customerObj.id ? customerObj.id : null;
    this.firstName = customerObj.firstName ? customerObj.firstName : null;
    this.lastName = customerObj.lastName ? customerObj.lastName : null; 
    this.email = customerObj.email ? customerObj.email : null;
    this.addressLine1 = customerObj.addressLine1 ? customerObj.addressLine1 : null;
    this.addressLine2 = customerObj.addressLine2 ? customerObj.addressLine2 : null;
    this.country = customerObj.country ? customerObj.country : null; 
    this.state = customerObj.state ? customerObj.state : null;
    this.city = customerObj.city ? customerObj.city : null;
    this.postalCode = customerObj.postalCode ? customerObj.postalCode : null; 
    this.phone = customerObj.phone ? customerObj.phone : null;
    this.srchSlug = this.firstName + ' ' + this.lastName + ' ' + this.phone;
  }
  getNewInstance() {
    return new Customer();
  }
  getListDisplayColumns() {
    return this.displayColumnNames;
  }
  setAttrMetaData() {
    this.attrMetaDataArry.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,listDisp:false});
    this.attrMetaDataArry.push({name:'firstName',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'First Name'});
    this.attrMetaDataArry.push({name:'lastName',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Last Name'});
    this.attrMetaDataArry.push({name:'phone',dataType:'string',required:true,validVal:'PH',key:false,formField:true,listDisp:true,dispNm:'Phone'});
    this.attrMetaDataArry.push({name:'email',dataType:'string',required:false,validVal:'EM',key:false,formField:true,listDisp:true,dispNm:'email'});
    this.attrMetaDataArry.push({name:'addressLine1',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:false,dispNm:'AddressLine1'});
    this.attrMetaDataArry.push({name:'addressLine2',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:false,dispNm:'AddressLine2'});
    this.attrMetaDataArry.push({name:'city',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'City'});
    this.attrMetaDataArry.push({name:'state',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'State'});      
    this.attrMetaDataArry.push({name:'country',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Country'});
    this.attrMetaDataArry.push({name:'postalCode',dataType:'string',required:false,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Post Code'});
    this.setListDisplayColumns();
    //console.log(this.attrMetaDataArry);
  }
  setListDisplayColumns() {
    for (var i in this.attrMetaDataArry) {
      if (this.attrMetaDataArry[i].listDisp) {
          this.displayColumnNames.push({ colNm:this.attrMetaDataArry[i].name,
            dispNm : this.attrMetaDataArry[i].dispNm});
      }
      this.attributes[this.attrMetaDataArry[i].name] = '';
    }
  }
  getIdColumnValue() {
    return this.id;
  }
  setIdColumnValue(val) {
    this.id = val?val:this.id;
  }
}