import { BusinessObj } from './BusinessObj';
export class Customer extends BusinessObj {
    public srchSlug : String;
    public id:number;
    public firstName: String;
    public lastName: String; 
    public email : String;
    public addressLine1 : String;
    public addressLine2 : String;
    public country : String; 
    public state : String;
    public city : String;
    public postalCode : String; 
    public phone : String;
    constructor () {
      super();
      this.srchSlug = null;
      this.id = null;
      this.firstName = null;
      this.lastName = null; 
      this.email = null;
      this.addressLine1 = null;
      this.addressLine2 = null;
      this.country = null; 
      this.state = null;
      this.city = null;
      this.postalCode = null; 
      this.phone = null;
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
  }