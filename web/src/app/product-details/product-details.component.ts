import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../model/Constants';
import { Product } from '../model/Product';
import { Utils } from '../model/Utils';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  categories = ['Saree', 'Kurti'];
  modelObj = { product : new Product(), isPromptMessage : false, promptMessage:'' };
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
  onSubmit() { this.submitted = true;
    if (this.productActionObj.action == 'view') {
      return this.routeToList(this.router, this.productActionObj.action, this.productActionObj.productSku, "");
    }
    if (this.productActionObj.action == 'create') {
      this.productActionObj.productSku += this.modelObj.product.sku;
    }
    var method = '';
    var apiUrl = Constants.apiBaseURL + "product/";
    if (this.productActionObj.action == "delete") {
      method = 'DELETE'; apiUrl += this.productActionObj.productSku;
    }
    else if (this.productActionObj.action == "edit") {
      method = 'PUT'; apiUrl += this.productActionObj.productSku;
    }
    else if (this.productActionObj.action == "create") {
      method = 'POST';
    }
    else {
      var mesg = "Invalid Action " + this.productActionObj.action + " for Product with SKU " + this.productActionObj.productSku;
      this.routeToList(this.router, this.productActionObj.action, this.productActionObj.productSku, mesg);
      return;
    }
    Utils.callAPI(method, apiUrl,false,this.modelObj.product,(err,data)=>{
      if(err) {
        this.modelObj.isPromptMessage = true;
        var respMessage = JSON.parse(err);
        this.modelObj.promptMessage = 
        this.getPromptMessageForAction(this.productActionObj,'error') + " " + respMessage.message;        
      }
      else {
        this.modelObj.isPromptMessage = true;
        this.modelObj.product.setValues(JSON.parse(data));
        this.modelObj.promptMessage = this.getPromptMessageForAction(this.productActionObj,'success');
      }
      this.routeToList(this.router, this.productActionObj.action, this.productActionObj.productSku, 
        this.modelObj.promptMessage);
    });
  }
  ngOnInit() {
    Utils.callAPI("GET", Constants.apiBaseURL + "product/" + this.productActionObj.productSku, true,null,
    (err,data)=>{
      if(err) {
        this.modelObj.isPromptMessage = true;
        var respMessage = JSON.parse(err);
        this.modelObj.promptMessage = "Error Occured while retrieving product :- " + respMessage.message;
        return;
      }
      this.modelObj.product.setValues(JSON.parse(data));
      this.modelObj.isPromptMessage = true;
      this.modelObj.promptMessage = this.getPromptMessageForAction(this.productActionObj,'initial');
    });
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
