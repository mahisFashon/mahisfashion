import { BusinessObj } from './BusinessObj';
export class OrderItem extends BusinessObj {
    public prodItemIdx: number;
    public sku: String;
    public title: String; 
    public salePrice : number; 
    public regularPrice : number;
    public onSale : boolean;
    public itemQty : number;
    public itemTotal : number;
    constructor () {
      super();
      this.prodItemIdx = null;
      this.sku = null;
      this.title = null; 
      this.salePrice = null; 
      this.regularPrice = null;
      this.onSale = null;
      this.itemQty = null;
      this.itemTotal = null;
    }
    setValues (orderItemObj) {
      if (orderItemObj == null) return;
      this.prodItemIdx = orderItemObj.prodItemIdx ? orderItemObj.prodItemIdx : null;
      this.sku = orderItemObj.sku ? orderItemObj.sku : null;
      this.title = orderItemObj.title ? orderItemObj.title : null; 
      this.salePrice = orderItemObj.salePrice ? orderItemObj.salePrice : null; 
      this.regularPrice = orderItemObj.regularPrice ? orderItemObj.regularPrice : null;
      this.onSale = orderItemObj.onSale ? orderItemObj.onSale : null;
      this.itemQty = orderItemObj.itemQty ? orderItemObj.itemQty : null;
      this.itemTotal = orderItemObj.itemTotal ? orderItemObj.itemTotal : null;
    }
    getNewInstance() {
      return new OrderItem();
    }
  }  