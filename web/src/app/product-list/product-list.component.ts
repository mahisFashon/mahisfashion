import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetails } from '../model/ProductDetails';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  modelObj = {
    products : [],
    productAction : "",
    productSku : "",
    isPromptMessage : false,
    promptMessage : "",  
  }

  constructor (private activatedRoute: ActivatedRoute, private router: Router) {
    var modelObj = this.modelObj;
    this.activatedRoute.queryParams.subscribe(data => {
      modelObj.productAction = data.productAction;
      modelObj.productSku = data.productSku;
      if (data.promptMessage) {
        modelObj.isPromptMessage = true;
        modelObj.promptMessage = data.promptMessage;
      }
      else {
        modelObj.isPromptMessage = false;
        modelObj.promptMessage = "";
      }
    });
  }

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
    var productsObj = this.modelObj.products;
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