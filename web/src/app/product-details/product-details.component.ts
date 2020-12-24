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
  modelObj = { productDetails : new ProductDetails(), isPromptMessage : false, promptMessage:''  };
  submitted = false;
  productActionObj = {
    action : "",
    productSku : "",
  }

  constructor (private activatedRoute: ActivatedRoute,) {

    this.activatedRoute.queryParams.subscribe(data => {console.log(data)});
  }
  newProductDetails() {
    this.modelObj.productDetails = new ProductDetails();
  }
  onSubmit() { this.submitted = true;
    var xhttp = new XMLHttpRequest();
    var modelObj = this.modelObj;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          modelObj.isPromptMessage = true;
          modelObj.productDetails.setValues(JSON.parse(this.responseText));
          modelObj.promptMessage = "Product with SKU: " + modelObj.productDetails.sku + " created successfully!";
        }
        else {
          alert("Error Occured" + this.responseText) ;
          modelObj.isPromptMessage = true;
          var respMessage = JSON.parse(this.responseText);
          modelObj.promptMessage = "Error Occured while creating product :- " + respMessage.message;
        }
      }
    }
    xhttp.open("POST", "http://localhost:3111/product/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(this.modelObj.productDetails)); 
  }
  ngOnInit() {
  }
  get diagnostic() {return JSON.stringify(this.modelObj); }

  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value; // Dr. IQ
  }

}
