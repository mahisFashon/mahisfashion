import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../model/ProductDetails';
import { OrderItem } from '../model/OrderItem';
import { MatDialog } from '@angular/material/dialog';
import { DiscountFeesDialog } from '../modal-components/discountFeesDialog';
import { CustomerDialog } from '../modal-components/customerDialog';
import { PayNowDialog } from '../modal-components/payNowDialog';
import { PrintReceiptDialog } from '../modal-components/printReceiptDialog';
import { Customer } from '../model/Customer';
import { OrderDetails } from '../model/OrderDetails';
import { DiscountFee } from '../model/DiscountFee';

@Component({
  selector: 'app-mypos',
  templateUrl: './mypos.component.html',
  styleUrls: ['./mypos.component.scss'],
})
export class MyposComponent implements OnInit {
  modelObj = { productSrchStr : '', customerSrchStr:'',
    products : [],
    orderItems : [],
    grossAmt : 0,
    netAmt : 0,
    discounts : [],
    discountAmt: 0,
    feeAmt:0,
    orderDetails : new OrderDetails(),
    totalProductCount : 0,
    pageSize : 30,
    currentPage : 0,
  }
  //customerSrchCtrl : FormControl = new FormControl();
  customerSuggests = [];
  productSuggests = [];
  customers = [];
  productSrchFocus = false;
  customerSrchFocus = false;
  selectedProductIdx = -1;
  selectedCustomerIdx = -1;
  scanMode = true;
  math=Math;

  constructor(public dialog: MatDialog) { }
  onCustomerSelect(idx) {
    this.customerSrchFocus = false;
    this.selectedCustomerIdx = idx;
    this.modelObj.customerSrchStr = this.customers[idx].srchSlug;
    this.modelObj.orderDetails.customerId = this.customers[idx].id;
  }
  onProductSelect(idx) {
    this.productSrchFocus = false;
    this.selectedProductIdx = idx;
    this.modelObj.productSrchStr = "";
    this.onProductClick(idx);
  }  
  searchCustomer() {
    this.customerSuggests = this.customers.filter(
      (item)=> item.srchSlug.toUpperCase().includes(
        this.modelObj.customerSrchStr.toUpperCase())).slice(0,10);
  }
  scanProduct() {
    if (this.scanMode==true) {
      var sku = this.modelObj.productSrchStr;
      this.modelObj.productSrchStr = "";
      var product = this.modelObj.products.find((item)=>item.sku==sku);
      if (product) {
        return this.onProductClick(product.arrayIndex);
      }
      else {
        var callUrl = "http://localhost:3111/product/" + sku.toUpperCase();
        var outProducts = new Array();
        this.doGetRequest(callUrl, outProducts, new ProductDetails(),false);
        if (outProducts.length == 1) {
          outProducts[0].arrayIndex = this.modelObj.products.length;
          this.modelObj.products.push(outProducts[0]);
          return this.onProductClick(outProducts[0].arrayIndex);
        }
      }
      return;
    }
  }
  searchProduct() {
    if (this.scanMode==true) {
      return;
    }
    var sku = this.modelObj.productSrchStr.toUpperCase();
    this.productSuggests = this.modelObj.products.filter(
      (item)=> item.sku.toUpperCase().includes(sku)).slice(0,10);
    if (this.productSuggests.length == 0 && sku.length > 2) {
      // try to search SKU in DB
      // results from DB could have duplicates in current product page
      // discard duplicates and add new to products array
      //http://localhost:3111//product/searchSku/:searchSku
      var callUrl = "http://localhost:3111/searchProduct/" + sku;
      var outProducts = new Array();
      this.doGetRequest(callUrl, outProducts, new ProductDetails(),false);
      this.handleDuplicate(outProducts, this.modelObj.products);
      this.productSuggests = this.modelObj.products.filter(
        (item)=> item.sku.toUpperCase().includes(sku)).slice(0,10);      
    }
  }
  handleDuplicate(srcArry, tgtArry) {
    for (var idx in srcArry) {
      var sku = srcArry[idx].sku;
      if (!tgtArry.find((item)=>item.sku==sku)) {
        srcArry[idx].indexInArray = tgtArry.length;
        tgtArry.push(srcArry[idx]);
      }
    }
  }
  onClickOutSide(e) {
    if(e.target.id != 'customerSrchStr' ) this.customerSrchFocus=false;
    if(e.target.id != 'productSrchStr' ) this.productSrchFocus=false;
  }
  ngOnInit() {
    this.getCustomers();
    this.getProductPage(1);
    document.getElementById('productSrchStr').focus();
    document.getElementById('myPosContainer').scrollIntoView();
  }
  getCustomers() {
    this.doGetRequest("http://localhost:3111/customer/",this.customers,new Customer(), true);
  }    
  getProductPage(pgIndx) {
    var modelObj = this.modelObj;
    if (modelObj.currentPage != 0) {
      pgIndx = modelObj.currentPage;
    }
    var recIndx = 1 + (pgIndx - 1) * modelObj.pageSize;
    var callUrl = "http://localhost:3111/product/" + recIndx + "/" + modelObj.pageSize;
    this.doGetRequest(callUrl,modelObj.products,new ProductDetails(),true);    
  }
  onProductClick(idx) {
    //alert('In on product click ' + idx);
    if (idx < 0 || idx > this.modelObj.products.length)
      return; // nothing to do
    var product = this.modelObj.products[idx];
    //alert(JSON.stringify(product));
    if (product.stockQty > 0) {
      product.stockQty--;
      var orderItem = new OrderItem();
      orderItem.setValues({
        prodItemIdx:idx,
        sku:product.sku,
        title:product.title,
        salePrice:product.salePrice,
        regularPrice:product.regularPrice,
        onSale:product.onSale,
        itemQty:1,
        itemTotal:product.onSale =='True' ? product.salePrice:product.regularPrice,
      });
      this.modelObj.orderDetails.orderItems.push(orderItem)
    }
    this.updateTotals();
  }
  updateOrderItem(idx, action){
    if (idx < 0 || idx > this.modelObj.orderDetails.orderItems.length)
      return; // nothing to do
    var orderItem = this.modelObj.orderDetails.orderItems[idx];
    if (orderItem.prodItemIdx < 0 || orderItem.prodItemIdx > this.modelObj.products.length)
      return; // nothing to do
    var prodInOrderItem = this.modelObj.products[orderItem.prodItemIdx];
    if (action == 'add' && prodInOrderItem.stockQty > 0) {
      prodInOrderItem.stockQty--;
      orderItem.itemQty++;
      orderItem.itemTotal = orderItem.itemQty * prodInOrderItem.onSale?prodInOrderItem.salePrice:prodInOrderItem.regularPrice;
    }
    else if (action == 'subtract') {
      prodInOrderItem.stockQty++;
      orderItem.itemQty--;
      if (orderItem.itemQty > 0) {
        orderItem.itemTotal = orderItem.itemQty * prodInOrderItem.onSale?prodInOrderItem.salePrice:prodInOrderItem.regularPrice;
      }
      else {
        this.modelObj.orderDetails.orderItems.splice(idx,1);
      }
    }
    else if (action == 'delete') {
      prodInOrderItem.stockQty += orderItem.itemQty;
      this.modelObj.orderDetails.orderItems.splice(idx,1);
    }
    if (this.modelObj.orderDetails.orderItems.length == 0) {
      // Delete all discounts too
      this.modelObj.orderDetails.discountFeeItems.splice(0,this.modelObj.orderDetails.discountFeeItems.length);
      this.modelObj.orderDetails.discountAmt = 0;
      this.modelObj.orderDetails.feeAmt = 0;
    }
    this.updateTotals();
  }
  updateTotals() {
    this.modelObj.orderDetails.grossAmt = 0;
    for (var idx in this.modelObj.orderDetails.orderItems) {
      this.modelObj.orderDetails.grossAmt += this.modelObj.orderDetails.orderItems[idx].itemTotal;
    }
    this.modelObj.orderDetails.netAmt = this.modelObj.orderDetails.grossAmt - this.modelObj.orderDetails.discountAmt +
    this.modelObj.orderDetails.feeAmt;
  }
  openDiscountFeeDialog() {
    const dialogRef = this.dialog.open(DiscountFeesDialog, {
      width:'700px', 
      data:this.modelObj.orderDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result != '') {
        if (result.discountFeeItems.length == 0) {
          this.modelObj.orderDetails.discountFeeItems.splice(0,
            this.modelObj.orderDetails.discountFeeItems.length);
        }
        else {
          for(var idx in result.discountFeeItems) {
            var discFee = new DiscountFee();
            discFee.setValues(result.discountFeeItems[idx]);
            discFee.indexInArray =  result.discountFeeItems.length;
            this.modelObj.orderDetails.discountFeeItems.push(discFee);
          }
        }
        this.modelObj.orderDetails.netAmt = result.netAmt;
        this.modelObj.orderDetails.discountAmt = result.discountAmt;
        this.modelObj.orderDetails.feeAmt = result.feeAmt;
      }
    });
  }
  openCustomerDialog() {
    const dialogRef = this.dialog.open(CustomerDialog, {
      width:'700px', 
      data:new Customer(),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.id != null && result.id != '') {
        var customer = new Customer();
        customer.setValues(result);
        customer.indexInArray = this.customers.length;
        this.customers.push(customer);
        this.onCustomerSelect(this.customers.length-1);
      }
    });    
  }
  openPayNowDialog() {
    const dialogRef = this.dialog.open(PayNowDialog, {
      width:'1100px', 
      data:this.modelObj.orderDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.orderId != null && result.orderId != '') {
        this.modelObj.orderDetails.setValues(result);
        this.openPrintReceiptDialog();
      }
    });    
  }
  openPrintReceiptDialog() {
    const dialogRef = this.dialog.open(PrintReceiptDialog, {
      width:'700px', 
      data:this.modelObj.orderDetails,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id != null && result.id != '') {
      }
    });    
  }  
  doGetRequest(callUrl, outArray, businessObject, async) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var retObjs = JSON.parse(this.responseText);
          //modelObj.products.splice(0,modelObj.products.length);
          if (retObjs && Array.isArray(retObjs) == false) {
            var newObj = businessObject.getNewInstance();
            newObj.setValues(retObjs);
            newObj.indexInArray = outArray.length;
            outArray.push(newObj);
            return;
          }
          for ( var idx in retObjs) {
            var newObj = businessObject.getNewInstance();
            newObj.setValues(retObjs[idx]);
            newObj.indexInArray = outArray.length;
            outArray.push(newObj);
          }
          retObjs = null;
        }
        else {
          alert("Error Occured" + this.responseText) ;
        }
      }
    }
    xhttp.open("GET", callUrl, async);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }       
}