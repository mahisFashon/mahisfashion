import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../model/ProductDetails';
import { CartItem } from '../model/CartItem';
import { MatDialog } from '@angular/material/dialog';
import { DiscountFeesDialog } from '../modal-components/discountFeesDialog';

@Component({
  selector: 'app-mypos',
  templateUrl: './mypos.component.html',
  styleUrls: ['./mypos.component.scss'],
})
export class MyposComponent implements OnInit {
  modelObj = { searchProduct : '',
    products : [],
    cartItems : [],
    cartGrossTotal : 0,
    cartNetTotal : 0,
    discounts : [],
    totalDiscounts: 0,
    totalFees:0,
    totalProductCount : 0,
    pageSize : 30,
    currentPage : 0,
  }  
  math=Math;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    var pgIndx = 1;
    if (modelObj.currentPage != 0) {
      pgIndx = modelObj.currentPage;
    }
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var retObjs = JSON.parse(this.responseText);
          //modelObj.products.splice(0,modelObj.products.length);
          for ( var idx in retObjs) {
            var newProdObj = new ProductDetails;
            newProdObj.setValues(retObjs[idx]);
            modelObj.products.push(newProdObj);
          }
          modelObj.currentPage = pgIndx;
        }
        else {
          alert("Error Occured" + this.responseText) ;
        }
      }
    }
    var recIndx = 1 + (pgIndx - 1) * modelObj.pageSize;
    xhttp.open("GET", "http://localhost:3111/product/" + recIndx + "/" + modelObj.pageSize, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();    
  }
  onProductClick(idx) {
    //alert('In on product click ' + idx);
    if (idx < 0 || idx > this.modelObj.products.length)
      return; // nothing to do
    var product = this.modelObj.products[idx];
    //alert(JSON.stringify(product));
    if (product.stockQty > 0) {
      product.stockQty--;
      var cartItem = new CartItem();
      cartItem.setValues({
        prodItemIdx:idx,
        sku:product.sku,
        title:product.title,
        salePrice:product.salePrice,
        regularPrice:product.regularPrice,
        onSale:product.onSale,
        itemQty:1,
        itemTotal:product.onSale =='True' ? product.salePrice:product.regularPrice,
      });
      this.modelObj.cartItems.push(cartItem)
    }
    this.updateTotals();
  }
  updateCartItem(idx, action){
    if (idx < 0 || idx > this.modelObj.cartItems.length)
      return; // nothing to do
    var cartItem = this.modelObj.cartItems[idx];
    if (cartItem.prodItemIdx < 0 || cartItem.prodItemIdx > this.modelObj.products.length)
      return; // nothing to do
    var prodInCartItem = this.modelObj.products[cartItem.prodItemIdx];
    if (action == 'add' && prodInCartItem.stockQty > 0) {
      prodInCartItem.stockQty--;
      cartItem.itemQty++;
      cartItem.itemTotal = cartItem.itemQty * prodInCartItem.onSale?prodInCartItem.salePrice:prodInCartItem.regularPrice;
    }
    else if (action == 'subtract') {
      prodInCartItem.stockQty++;
      cartItem.itemQty--;
      if (cartItem.itemQty > 0) {
        cartItem.itemTotal = cartItem.itemQty * prodInCartItem.onSale?prodInCartItem.salePrice:prodInCartItem.regularPrice;
      }
      else {
        this.modelObj.cartItems.splice(idx,1);
      }
    }
    else if (action == 'delete') {
      prodInCartItem.stockQty += cartItem.itemQty;
      this.modelObj.cartItems.splice(idx,1);
    }
    this.updateTotals();
  }
  updateTotals() {
    this.modelObj.cartGrossTotal = 0;
    for (var idx in this.modelObj.cartItems) {
      this.modelObj.cartGrossTotal += this.modelObj.cartItems[idx].itemTotal;
    }
    var totalDiscountsFees = 0;
    for (var idx in this.modelObj.discounts) {
      totalDiscountsFees += this.modelObj.discounts[idx].amount;
    }
    this.modelObj.cartNetTotal = this.modelObj.cartGrossTotal - totalDiscountsFees;
  }
  openDiscountFeeDialog() {
    const dialogRef = this.dialog.open(DiscountFeesDialog, {
      width:'700px', 
      data:{ discounts: this.modelObj.discounts, 
        grossTotal:this.modelObj.cartGrossTotal, 
        netTotal:this.modelObj.cartNetTotal,
        totalDiscounts : this.modelObj.totalDiscounts,
        totalFees : this.modelObj.totalFees,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.modelObj.discounts = result.discounts;
      this.modelObj.cartNetTotal = result.netTotal;
      this.modelObj.totalDiscounts = result.totalDiscounts;
      this.modelObj.totalFees = result.totalFees;
      //console.log('Dialog result: ' + JSON.stringify(result));
    });
  }  
}
