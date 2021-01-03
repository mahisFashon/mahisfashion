import { BusinessObj } from './BusinessObj';
import { OrderItem } from './OrderItem';
import { DiscountFee } from './DiscountFee';
import { PaymentDetails } from './PaymentDetails';

export class OrderDetails extends BusinessObj {
    public orderItems : Array<OrderItem>;
    public grossTotal:number;
    public netTotal: number;
    public discountsFees: Array<DiscountFee>; 
    public totalDiscounts : number;
    public totalFees : number;
    public paymentDetails : PaymentDetails;
    constructor () {
      super();
      this.orderItems = new Array<OrderItem>();
      this.discountsFees = new Array<DiscountFee>();
      this.paymentDetails = new PaymentDetails();
      this.netTotal = 0;
      this.grossTotal = 0;
      this.totalDiscounts = 0;
      this.totalFees = 0;
    }
}