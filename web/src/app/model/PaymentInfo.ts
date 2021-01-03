import { BusinessObj } from './BusinessObj';

export class PaymentInfo extends BusinessObj {
    public amount : number;
    public mode:String;
    public modeType: String;
    public modeTypeId : String;
    public txnRefNo: String; 
    constructor () {
      super();
    }
}