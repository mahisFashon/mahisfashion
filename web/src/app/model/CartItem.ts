export class CartItem {
    public prodItemIdx: number;
    public sku: String;
    public title: String; 
    public salePrice : number; 
    public regularPrice : number;
    public onSale : boolean;
    public itemQty : number;
    public itemTotal : number;
    constructor () {
      this.prodItemIdx = null;
      this.sku = null;
      this.title = null; 
      this.salePrice = null; 
      this.regularPrice = null;
      this.onSale = null;
      this.itemQty = null;
      this.itemTotal = null;
    }
    setValues (cartItemObj) {
      this.prodItemIdx = cartItemObj.prodItemIdx ? cartItemObj.prodItemIdx : null;
      this.sku = cartItemObj.sku ? cartItemObj.sku : null;
      this.title = cartItemObj.title ? cartItemObj.title : null; 
      this.salePrice = cartItemObj.salePrice ? cartItemObj.salePrice : null; 
      this.regularPrice = cartItemObj.regularPrice ? cartItemObj.regularPrice : null;
      this.onSale = cartItemObj.onSale ? cartItemObj.onSale : null;
      this.itemQty = cartItemObj.itemQty ? cartItemObj.itemQty : null;
      this.itemTotal = cartItemObj.itemTotal ? cartItemObj.itemTotal : null;
    }
  }
    