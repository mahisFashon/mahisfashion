import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from '../../model/ProductDetails';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products = []; // Empty array for all products
  currentPage = 1;
  totalPages = 0;
  showActions = false;

  constructor (private router: Router) {}

  routeToDetails(action, sku) {
    this.router.navigate(['/productDetails'], {
      queryParams: {
        productAction: action,
        productSku : sku,
      }
    });
  }

  ngOnInit() {
    var xhttp = new XMLHttpRequest();
    var productsObj = this.products;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var retObjs = JSON.parse(this.responseText);
          for ( var idx in retObjs) {
            var newProdObj = new ProductDetails;
            newProdObj.setValues(retObjs[idx]);
            productsObj.push(newProdObj);
          }
        }
        else {
          alert("Error Occured" + this.responseText) ;
        }
      }
    }
    xhttp.open("GET", "http://localhost:3111/product/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(); 
  }
}
