import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../model/Product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  modelObj = {
    products : [],
    displayColumnNames : [],
    productAction : "",
    productSku : "",
    isPromptMessage : false,
    promptMessage : "",
    currPage : 0,
    totalPages : 0,
    pageSize : 30,
    productCount : 0,
    sortCol : [],
    curSortColIdx : -1,
  }
  toggleSort(idx, colNm) {
    if (this.modelObj.curSortColIdx != idx) {
      if (this.modelObj.curSortColIdx != -1) {
        // reset previous sort
        new Product().resetSortedArray(this.modelObj.products);
      }
      this.modelObj.curSortColIdx = idx;
      this.modelObj.sortCol[idx].order = 'A';
      this.modelObj.sortCol[idx].sort = true;
    }
    else {
      if (this.modelObj.sortCol[idx].sort == false) {
        this.modelObj.sortCol[idx].order = 'A';
        this.modelObj.sortCol[idx].sort = true;        
      }
      else {
        if (this.modelObj.sortCol[idx].order == 'A')
          this.modelObj.sortCol[idx].order = 'D';
        else {
          this.modelObj.sortCol[idx].order = 'A';
          this.modelObj.sortCol[idx].sort = false;          
        }
      }
    }
    if (this.modelObj.sortCol[idx].sort)
      new Product().sortArray(this.modelObj.products,colNm,this.modelObj.sortCol[idx].order);
    else
    new Product().resetSortedArray(this.modelObj.products);
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
    this.modelObj.displayColumnNames = new Product().getListDisplayColumns();
    for (var i = 0; i < this.modelObj.displayColumnNames.length; i++) {
      this.modelObj.sortCol.push({sort:false, order:'A'});
    }
  }
  routeToDetails(action, sku) {
    this.router.navigate(['/productDetails'], {
      queryParams: {
        productAction: action,
        productSku : sku,
      }
    });
  }
  pageAction(action) {
    var pageIndex = 0;
    if (action == 'first') {
      if (this.modelObj.currPage > 1)
        pageIndex = 1;
      else return;
    }
    else if (action == 'last') {
      if (this.modelObj.currPage < this.modelObj.totalPages)
        pageIndex = this.modelObj.totalPages;
      else return;
    }
    else if (action == 'prev') {
      if (this.modelObj.currPage>1)
        pageIndex = --this.modelObj.currPage;
      else return; // already on first page
    }
    else if (action == 'next') {
      if (this.modelObj.currPage<this.modelObj.totalPages)
        pageIndex = ++this.modelObj.currPage;
      else return; // Already on last page
    }
    new Product().getPageList(pageIndex,this.modelObj.pageSize,(err, data) => {
      if (err) {
        console.log("Error occured");
        return (err);
      }
      else {
        this.modelObj.products = data;
        this.modelObj.currPage = pageIndex;
      }
    });    
  }
  ngOnInit() {
    var product = new Product();
    product.getCount((err, data) =>{
      if (err) {
        console.log("Error occured");
        return (err);
      }
      else {
        this.modelObj.productCount = data.count;
      }
    });
    this.modelObj.totalPages = Math.ceil(this.modelObj.productCount/this.modelObj.pageSize);
    product.getPageList(0,this.modelObj.pageSize,(err, data) => {
      if (err) {
        console.log("Error occured");
        return (err);
      }
      else {
        this.modelObj.products = data;
        this.modelObj.currPage = 1;
      }
    });
  }
}