import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../../model/ProductDetails';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  categories = ['Saree', 'Kurti'];
  model = { productDetails : new ProductDetails() };
  submitted = false;

  constructor ( ) { 

  }
  newProductDetails() {
    this.model.productDetails = new ProductDetails();
  }
  onSubmit() { this.submitted = true;
    alert("In Submit Function product-details component");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              alert(this.responseText);
          }
          else {
            alert(this.responseText);
          }
    };
    xhttp.open("POST", "http://localhost:3111/product/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    alert("Sending " + JSON.stringify(this.model.productDetails));
    xhttp.send(JSON.stringify(this.model.productDetails)); 
  }
  ngOnInit() {
  }
  get diagnostic() {return JSON.stringify(this.model); }

  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value; // Dr. IQ
  }

}
