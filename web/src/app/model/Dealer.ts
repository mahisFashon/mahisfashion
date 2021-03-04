import { BusinessObj } from './BusinessObj';
export class Dealer extends BusinessObj {
    public srchSlug : String;
    public id:number;
    public name: String;
    public phone : String;
    public city : String;
    public state : String;
    public country : String; 
    public addressLine1 : String;
    public addressLine2 : String;
    public postalCode : String; 
    constructor () {
      super();
      this.srchSlug = null;
      this.id = null;
      this.name = null;
      this.phone = null;
      this.city = null;
      this.state = null;
      this.country = null; 
      this.addressLine1 = null;
      this.addressLine2 = null;
      this.postalCode = null; 
      this.className = 'Dealer';
      this.setAttrMetaData();
    }
    setValues (dealerObj) {
      if (dealerObj == null) return;
      this.id = dealerObj.id ? dealerObj.id : null;
      this.name = dealerObj.name ? dealerObj.name : null;
      this.addressLine1 = dealerObj.addressLine1 ? dealerObj.addressLine1 : null;
      this.addressLine2 = dealerObj.addressLine2 ? dealerObj.addressLine2 : null;
      this.country = dealerObj.country ? dealerObj.country : null; 
      this.state = dealerObj.state ? dealerObj.state : null;
      this.city = dealerObj.city ? dealerObj.city : null;
      this.postalCode = dealerObj.postalCode ? dealerObj.postalCode : null; 
      this.phone = dealerObj.phone ? dealerObj.phone : null;
      this.srchSlug = this.name + ' ' + this.city + ' ' + this.phone;
    }
    getNewInstance() {
      return new Dealer();
    }
    getListDisplayColumns() {
      return this.displayColumnNames;
    }
    setAttrMetaData() {
      this.attrMetaDataArry.push({name:'id',dataType:'Auto',required:true,validVal:'NA',key:true,formField:false,listDisp:false});
      this.attrMetaDataArry.push({name:'name',dataType:'string',required:true,validVal:'AB',key:false,formField:true,listDisp:true,dispNm:'Dealer Name'});
      this.attrMetaDataArry.push({name:'phone',dataType:'string',required:true,validVal:'PH',key:false,formField:true,listDisp:true,dispNm:'Phone'});
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