import { BusinessObj } from './BusinessObj';
import { OrderItem } from './OrderItem';
import { DiscountFee } from './DiscountFee';
import { PaymentInfo } from './PaymentInfo';

export class OrderDetails extends BusinessObj {
    public orderId : number;
    public orderDate : string;
    public customerId : number;
    public grossAmt:number;
    public netAmt: number;
    public discountAmt : number;
    public feeAmt : number;
    public taxAmt : number;
    public paidAmt : number;
    public balanceAmt : number;    
    public paymentMode : string;
    public status : string;    
    public orderItems : Array<OrderItem>;
    public discountFeeItems: Array<DiscountFee>; 
    public paymentInfoItems : Array<PaymentInfo>;

    constructor () {
      super();
      this.orderId = null;
      this.orderDate = new Date().toString();
      this.orderDate = this.orderDate.substring(0,this.orderDate.indexOf(" GMT"));
      this.orderItems = new Array<OrderItem>();
      this.discountFeeItems = new Array<DiscountFee>();
      this.paymentInfoItems = new Array<PaymentInfo>();
      this.customerId = null;
      this.netAmt = 0.0;
      this.grossAmt = 0.0;
      this.discountAmt = 0.0;
      this.feeAmt = 0.0;
      this.taxAmt = 0.0;
      this.paidAmt = 0.0;
      this.balanceAmt = 0.0;
      this.paymentMode = null;
      this.status = null;
    }
    setValues(orderDetails) {
      for (var i in orderDetails.orderItems) {
        var orderItem = new OrderItem();
        orderItem.setValues(orderDetails.orderItems[i]);
        this.orderItems.push(orderItem);
      }
      for (var i in orderDetails.discountFeeItems) {
        var discountFee = new DiscountFee();
        discountFee.setValues(orderDetails.discountFeeItems[i]);
        this.discountFeeItems.push(discountFee);
      }
      for (var i in orderDetails.paymentInfoItems) {
        var paymentInfo = new PaymentInfo();
        paymentInfo.setValues(orderDetails.paymentInfoItems[i]);
        this.paymentInfoItems.push(paymentInfo);
      }      
      this.orderId = orderDetails.orderId ? orderDetails.orderId : null;
      this.orderId = orderDetails.orderDate ? orderDetails.orderDate : null;
      this.grossAmt = orderDetails.grossAmt!=null ? orderDetails.grossAmt : null;
      this.customerId = orderDetails.customerId ? orderDetails.customerId  : null;
      this.netAmt = orderDetails.netAmt!=null ? orderDetails.netAmt : null;
      this.discountAmt = orderDetails.discountAmt!=null ? orderDetails.discountAmt : null;
      this.feeAmt = orderDetails.feeAmt!=null ? orderDetails.feeAmt : null;
      this.taxAmt = orderDetails.taxAmt!=null ? orderDetails.taxAmt : null;
      this.paidAmt = orderDetails.paidAmt!=null ? orderDetails.paidAmt : null;
      this.balanceAmt = orderDetails.balanceAmt!=null ? orderDetails.balanceAmt : null;
      this.paymentMode = orderDetails.paymentMode ? orderDetails.paymentMode : null;
      this.status = orderDetails.status ? orderDetails.status : null;
    }
    getNewInstance() {
      return new OrderDetails();
    }    
}