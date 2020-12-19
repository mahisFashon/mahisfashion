import { Component, OnInit } from '@angular/core';
import { ProductDetails } from '../ProductDetails';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  categories = ['Saree', 'Kurti'];
  model = new ProductDetails('SRA010010','Saree', 'Saree');
  submitted = false;

  constructor ( ) {

  }
  newProductDetails() {
    this.model = new ProductDetails('SRA010010','Saree', 'Saree');
  }
  onSubmit() { this.submitted = true; }
  ngOnInit() {
  }
  get diagnostic() {return JSON.stringify(this.model); }

  showFormControls(form: any) {
    return form && form.controls.name &&
    form.controls.name.value; // Dr. IQ
  }

}
