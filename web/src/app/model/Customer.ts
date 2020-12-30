export class Customer {
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
    setValues (prodDetailsObj) {
      this.firstName = prodDetailsObj.firstName ? prodDetailsObj.firstName : null;
      this.lastName = prodDetailsObj.lastName ? prodDetailsObj.lastName : null; 
      this.email = prodDetailsObj.email ? prodDetailsObj.email : null;
      this.addressLine1 = prodDetailsObj.addressLine1 ? prodDetailsObj.addressLine1 : null;
      this.addressLine2 = prodDetailsObj.addressLine2 ? prodDetailsObj.addressLine2 : null;
      this.country = prodDetailsObj.country ? prodDetailsObj.country : null; 
      this.state = prodDetailsObj.state ? prodDetailsObj.state : null;
      this.city = prodDetailsObj.city ? prodDetailsObj.city : null;
      this.postalCode = prodDetailsObj.postalCode ? prodDetailsObj.postalCode : null; 
      this.phone = prodDetailsObj.phone ? prodDetailsObj.phone : null;
    }
  }
    