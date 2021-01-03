import { BusinessObj } from './BusinessObj';
export class DiscountFee extends BusinessObj {
  public category: String;
  public type: String;
  public value: number; 
  public amount : number; 
  constructor () {
    super();
    this.category = null;
    this.type = null;
    this.value = null; 
    this.amount = null; 
  }
  setValues (discountFeeObj) {
    if (discountFeeObj == null) return;
    this.category = discountFeeObj.category ? discountFeeObj.category : null;
    this.type = discountFeeObj.type ? discountFeeObj.type : null;
    this.value = discountFeeObj.value ? discountFeeObj.value : null; 
    this.amount = discountFeeObj.amount ? discountFeeObj.amount : null; 
  }
  getNewInstance() {
    return new DiscountFee();
  }
}    