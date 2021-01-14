import { BusinessObj } from './BusinessObj';

export class PaymentInfo extends BusinessObj {
    public mode:String;
    public modeType: String;
    public modeTypeId : String;
    public txnRefNo: String; 
    public amount : number;
    constructor () {
      super();
      this.init();
    }
    setValues(paymentInfoObj) {
      if (paymentInfoObj == null) return;
      this.mode = paymentInfoObj.mode ? paymentInfoObj.mode : null;
      this.modeType = paymentInfoObj.modeType ? paymentInfoObj.modeType : null;
      this.modeTypeId = paymentInfoObj.modeTypeId ? paymentInfoObj.modeTypeId : null;
      this.txnRefNo = paymentInfoObj.txnRefNo ? paymentInfoObj.txnRefNo : null;
      this.amount = paymentInfoObj.amount ? paymentInfoObj.amount : null;
    }
    init() {
      this.mode = null;
      this.modeType = null;
      this.modeTypeId = null;
      this.txnRefNo = null;      
      this.amount = null;
    }
    getNewInstance() {
      return new PaymentInfo();
    }    
}