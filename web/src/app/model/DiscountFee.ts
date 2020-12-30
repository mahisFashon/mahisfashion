export class DiscountFee {
    public category: String;
    public type: String;
    public value: number; 
    public amount : number; 
    constructor () {
      this.category = null;
      this.type = null;
      this.value = null; 
      this.amount = null; 
    }
    setValues (discountFeeObj) {
      this.category = discountFeeObj.category ? discountFeeObj.category : null;
      this.type = discountFeeObj.type ? discountFeeObj.type : null;
      this.value = discountFeeObj.value ? discountFeeObj.value : null; 
      this.amount = discountFeeObj.amount ? discountFeeObj.amount : null; 
    }
  }
    