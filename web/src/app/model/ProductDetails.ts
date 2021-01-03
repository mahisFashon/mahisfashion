import { BusinessObj } from './BusinessObj';
export class ProductDetails extends BusinessObj {
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
    super();
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
  setValues (prodDetailsObj) {
    if (prodDetailsObj == null) return;
    this.sku = prodDetailsObj.sku ? prodDetailsObj.sku : null;
    this.title = prodDetailsObj.title ? prodDetailsObj.title : null; 
    this.description = prodDetailsObj.description ? prodDetailsObj.description : null;
    this.size = prodDetailsObj.size ? prodDetailsObj.size : null;
    this.dimensions = prodDetailsObj.dimensions ? prodDetailsObj.dimensions : null;
    this.salePrice = prodDetailsObj.salePrice ? prodDetailsObj.salePrice : null; 
    this.regularPrice = prodDetailsObj.regularPrice ? prodDetailsObj.regularPrice : null;
    this.costPrice = prodDetailsObj.costPrice ? prodDetailsObj.costPrice : null; 
    this.category = prodDetailsObj.category ? prodDetailsObj.category : null;
    this.stockQty = prodDetailsObj.stockQty ? prodDetailsObj.stockQty : null;
    this.dealerBillId = prodDetailsObj.dealerBillId ? prodDetailsObj.dealerBillId : null;
    this.tags = prodDetailsObj.tags ? prodDetailsObj.tags : null;
    this.imageCount = prodDetailsObj.imageCount ? prodDetailsObj.imageCount : null;    
    this.onSale = prodDetailsObj.onSale ? prodDetailsObj.onSale : null;
    this.manageStock = prodDetailsObj.manageStock ? prodDetailsObj.manageStock : null;
  }
  getNewInstance() {
    return new ProductDetails();
  }
}