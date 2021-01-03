import { BusinessObj } from './BusinessObj';
import { PaymentInfo } from './PaymentInfo';
import { DiscountFee } from './DiscountFee';

export class PaymentDetails extends BusinessObj {
    public paymentInfoItems : Array<PaymentInfo>;
    public totalAmtPaid:number;
    public balanceAmt: number;
    public amtTotal: number; 
    constructor () {
      super();
      this.paymentInfoItems = new Array<PaymentInfo>();
    }
}