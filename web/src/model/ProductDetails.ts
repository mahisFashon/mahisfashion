export class ProductDetails {
  public sku: String;
  public title: String; 
  public description : String;
  public size : String;
  public dimensions : String;
  public salePrice : number; 
  public regularPrice : number;
  public onSale : boolean;
  public costPrice : number; 
  public category : String;
  public manageStock : boolean;
  public stockQty : number;
  public dealerBillId : String;
  public tags : String;
  public imageCount : number;
  constructor () {
    this.sku = null;
    this.title = null; 
    this.description = null;
    this.size = null;
    this.dimensions = null;
    this.salePrice = null; 
    this.regularPrice = null;
    this.onSale = null;
    this.costPrice = null; 
    this.category = null;
    this.manageStock = null;
    this.stockQty = null;
    this.dealerBillId = null;
    this.tags = null;
    this.imageCount = null;
  }
}
  