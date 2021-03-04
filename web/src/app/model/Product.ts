import { BusinessObj } from './BusinessObj';
export class Product extends BusinessObj {
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
    this.className = 'Product';
  }
  setValues (product) {
    if (product == null) return;
    this.sku = product.sku ? product.sku : null;
    this.title = product.title ? product.title : null; 
    this.description = product.description ? product.description : null;
    this.size = product.size ? product.size : null;
    this.dimensions = product.dimensions ? product.dimensions : null;
    this.salePrice = product.salePrice ? product.salePrice : null; 
    this.regularPrice = product.regularPrice ? product.regularPrice : null;
    this.costPrice = product.costPrice ? product.costPrice : null; 
    this.category = product.category ? product.category : null;
    this.stockQty = product.stockQty ? product.stockQty : null;
    this.dealerBillId = product.dealerBillId ? product.dealerBillId : null;
    this.tags = product.tags ? product.tags : null;
    this.imageCount = product.imageCount ? product.imageCount : null;    
    this.onSale = product.onSale ? product.onSale : null;
    this.manageStock = product.manageStock ? product.manageStock : null;
  }
  getNewInstance() {
    return new Product();
  }
  getListDisplayColumns() {
    this.displayColumnNames.push({ colNm:'sku', dispNm:'SKU'});
    this.displayColumnNames.push({ colNm:'title', dispNm:'Title'});
    this.displayColumnNames.push({ colNm:'category', dispNm:'Category'});
    this.displayColumnNames.push({ colNm:'regularPrice', dispNm:'Price'});
    this.displayColumnNames.push({ colNm:'stockQty', dispNm:'Qty'});
    this.displayColumnNames.push({ colNm:'costPrice', dispNm:'Cost Price'});
    this.displayColumnNames.push({ colNm:'onSale', dispNm:'On Sale'});
    this.displayColumnNames.push({ colNm:'salePrice', dispNm:'Sale Price'});    
    return this.displayColumnNames;
  }
  getIdColumnValue() {
    return this.sku;
  }
  setIdColumnValue(val) {
    this.sku = val?val:this.sku;
  }      
}