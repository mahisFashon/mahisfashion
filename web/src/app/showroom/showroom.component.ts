import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessObj } from '../model/BusinessObj';
import { BusinessObjFactory } from '../model/BusinessObjFactoryNew';
import { Utils } from '../model/Utils';

@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent implements OnInit {
  modelObj = {
    filterBy : '',
    businessObjs : [],
    businessObj : null,
    businessObjCount : 0,
    currPage : 0,
    totalPages : 0,
    pageSize : 30,
    sortBusObjsBy : 'popularity',
  }
  pageAction = Utils.pageAction;
  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.modelObj.filterBy = params['filterBy'];
      if (!this.modelObj.filterBy) this.modelObj.filterBy = 'none';
      this.modelObj.businessObj = BusinessObjFactory.getBusinessObjInstance('Product');
      if (this.modelObj.businessObj == null) return;
      this.modelObj.businessObj.getCount((err, data) =>{
        if (err) { return console.log(err);}
        else { this.modelObj.businessObjCount = data.count; }
      });
      this.modelObj.totalPages = Math.ceil(this.modelObj.businessObjCount/this.modelObj.pageSize);      
      this.modelObj.businessObj.getPageList(1,this.modelObj.pageSize, (err, data) => {
        if (err) {
          if (!err.kind) return;
          if (err.kind != "not_found") {
            return err;
          }
        }
        else {
          this.modelObj.currPage = 1;
          this.modelObj.businessObjs = data;
        }
      });
    });    
  }
  sortBusObjs() {
    var businessObj = this.modelObj.businessObj;
    switch(this.modelObj.sortBusObjsBy) {
      case 'priceLow' :
        return businessObj.sortArray(this.modelObj.businessObjs,'regularPrice','A')
      case 'priceHigh' :
        return businessObj.sortArray(this.modelObj.businessObjs,'regularPrice','D');
      default :
        return businessObj.resetSortedArray(this.modelObj.businessObjs);
    }
  }
}
