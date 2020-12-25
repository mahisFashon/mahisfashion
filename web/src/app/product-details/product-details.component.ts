import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor (private activatedRoute: ActivatedRoute, private router: Router) {
    var localActionObj = this.productActionObj;
    //console.log('Activated ROute Parent URL ' + JSON.stringify(activatedRoute.parent.url));
    console.log('Activated ROute ' + activatedRoute.toString());
    this.activatedRoute.queryParams.subscribe(data => {
      localActionObj.action = data.productAction;
      localActionObj.productSku = data.productSku;
    });
  }
  newProductDetails() {
    this.modelObj.productDetails = new ProductDetails();
  }
  onSubmit() { this.submitted = true;
    var prodActionObj = this.productActionObj;
    var router = this.router;
    if (prodActionObj.action == 'view') {
      return this.routeToList(router, prodActionObj.action, prodActionObj.productSku, "");
    }
    if (prodActionObj.action == 'create') {
      prodActionObj.productSku += this.modelObj.productDetails.sku;
    }
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    
    var routeToList = this.routeToList;
    var getPromptMessageForAction = this.getPromptMessageForAction;

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          //alert(this.responseText);
          modelObj.isPromptMessage = true;
          modelObj.productDetails.setValues(JSON.parse(this.responseText));
          modelObj.promptMessage = getPromptMessageForAction(prodActionObj,'success');
        }
        else {
          modelObj.isPromptMessage = true;
          var respMessage = JSON.parse(this.responseText);
          modelObj.promptMessage = getPromptMessageForAction(prodActionObj,'error') + " " + respMessage.message;
        }
        routeToList(router, prodActionObj.action, prodActionObj.productSku, modelObj.promptMessage);
      }
    }
    if (prodActionObj.action == "delete") {
      xhttp.open("DELETE", "http://localhost:3111/product/" + prodActionObj.productSku, true);
    }
    else if (prodActionObj.action == "edit") {
      xhttp.open("PUT", "http://localhost:3111/product/" + prodActionObj.productSku, true);
    }
    else if (prodActionObj.action == "create") {
      xhttp.open("POST", "http://localhost:3111/product/", true);
    }
    else {
      var mesg = "Invalid Action " + prodActionObj.action + " for Product with SKU " + prodActionObj.productSku;
      this.routeToList(this.router, prodActionObj.action, prodActionObj.productSku, mesg);
      return;
    }
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(this.modelObj.productDetails)); 
  }
  ngOnInit() {
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    var prodActionObj = this.productActionObj;
    var getPromptMessageForAction = this.getPromptMessageForAction;

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          modelObj.productDetails.setValues(JSON.parse(this.responseText));
          modelObj.isPromptMessage = true;
          modelObj.promptMessage = getPromptMessageForAction(prodActionObj,'initial');
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
  
  getButtonPrompt() {
    switch(this.productActionObj.action) {
      case "edit" : return "Update";
      case "delete" : return "Delete";
      case "view" : return "Back To List";
      default : return "Submit";
    }
  }
  routeToList(router, action, sku, mesg) {
    router.navigate(['/productList'], {
      queryParams: {
        productAction: action,
        productSku : sku,
        promptMessage : mesg
      }
    });
  }
  getPromptMessageForAction(prodActionObj, promptType) {
    if (prodActionObj.action == "delete") {
      if (promptType == 'initial')
        return "Deleting product with SKU " + prodActionObj.productSku;
      if (promptType == 'error')
        return "Error Occured while deleting product with SKU " + prodActionObj.productSku;
      if (promptType == 'success')
        return "Product with SKU " + prodActionObj.productSku + " Successfully Deleted!";
    }
    if (prodActionObj.action == "edit") {
      if (promptType == 'initial')
        return "Updating product with SKU " + prodActionObj.productSku;
      if (promptType == 'error')
        return "Error Occured while Updating product with SKU " + prodActionObj.productSku;
      if (promptType == 'success')
        return "Product with SKU " + prodActionObj.productSku + " Successfully Updated!";
    }
    if (prodActionObj.action == "create") {
      if (promptType == 'initial')
        return "Creating product with SKU " + prodActionObj.productSku;
      if (promptType == 'error')
        return "Error Occured while creating product with SKU " + prodActionObj.productSku;
      if (promptType == 'success')
        return "Product with SKU " + prodActionObj.productSku + " Successfully Created!";
    }    
  }
}
