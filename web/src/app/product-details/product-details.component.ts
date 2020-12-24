import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../../model/ProductDetails';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  categories = ['Saree', 'Kurti'];
  modelObj = { productDetails : new ProductDetails(), isPromptMessage : false, promptMessage:'' };
  submitted = false;
  productActionObj = {
    action : "",
    productSku : "",
  }

  constructor (private activatedRoute: ActivatedRoute,) {
    var localActionObj = this.productActionObj;
    this.activatedRoute.queryParams.subscribe(data => {
      localActionObj.action = data.productAction;
      localActionObj.productSku = data.productSku;
    });
  }
  newProductDetails() {
    this.modelObj.productDetails = new ProductDetails();
  }
  onSubmit() { this.submitted = true;
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    var prodActionObj = this.productActionObj;
    var onSuccessMesg = "";
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          alert(this.responseText);
          modelObj.isPromptMessage = true;
          modelObj.productDetails.setValues(JSON.parse(this.responseText));
          modelObj.promptMessage = onSuccessMesg;
        }
        else {
          modelObj.isPromptMessage = true;
          var respMessage = JSON.parse(this.responseText);
          modelObj.promptMessage = "Error Occured while creating product :- " + respMessage.message;
        }
      }
    }
    if (prodActionObj.action == "delete") {
      xhttp.open("DELETE", "http://localhost:3111/product/" + prodActionObj.productSku, true);
      onSuccessMesg = "Product with SKU: " + modelObj.productDetails.sku + " Deleted successfully!";
    }
    else if (prodActionObj.action == "edit") {
      xhttp.open("PUT", "http://localhost:3111/product/" + prodActionObj.productSku, true);
      onSuccessMesg = "Product with SKU: " + modelObj.productDetails.sku + " Updated successfully!";
    }
    else {
      xhttp.open("POST", "http://localhost:3111/product/", true);
      onSuccessMesg = "Product with SKU: " + modelObj.productDetails.sku + " Created successfully!";
    }
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(this.modelObj.productDetails)); 
  }
  ngOnInit() {
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    var prodActionObj = this.productActionObj;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          modelObj.productDetails.setValues(JSON.parse(this.responseText));
          modelObj.isPromptMessage = true;
          if (prodActionObj.action == 'view') {
            modelObj.promptMessage = "Viewing Product with SKU: " + prodActionObj.productSku;  
          }
          else if (prodActionObj.action == 'edit') {
            modelObj.promptMessage = "Editing Product with SKU: " + prodActionObj.productSku;  
          }
          else if (prodActionObj.action == 'delete') {
            modelObj.promptMessage = "Deleting Product with SKU: " + prodActionObj.productSku;  
          }          
        }
        else {
          modelObj.isPromptMessage = true;
          var respMessage = JSON.parse(this.responseText);
          modelObj.promptMessage = "Error Occured while retrieving product :- " + respMessage.message;
        }
      }
    }
    xhttp.open("GET", "http://localhost:3111/product/" + prodActionObj.productSku, true);
    xhttp.send();    
  }
  get diagnostic() {return JSON.stringify(this.modelObj); }
  getButtonPrompt() {
    switch(this.productActionObj.action) {
      case "edit" : return "Update";
      case "delete" : return "Delete";
      default : return "Submit";
    }
  }
}
