import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { BusinessObj } from '../model/BusinessObjNew';
import { BusinessObjFactory } from '../model/BusinessObjFactoryNew';
import { MatDialog } from '@angular/material/dialog';
import { DialogFactory } from '../modal-components/DialogFactory';
import { Utils } from '../model/Utils';
import { LookUpValues } from '../model/LookupValues';

@Component({
  selector: 'listPage',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss',]
})
export class ListPageComponent implements OnInit {
  modelObj = {
    displayColumnNames: [],
    businessObjName: null,
    businessObjDispNm: null,
    businessObj: null,
    businessObjs: [],
    rowAction : "",
    rowActionIdColVal : "",
    isPromptMessage : false,
    promptMessage : "",
    currPage : 0,
    totalPages : 0,
    pageSize : 30,
    businessObjCount : 0,
    sortCol : [],
    curSortColIdx : -1,
    //dialogActions:[],
  }
  constructor(public activatedRoute: ActivatedRoute, public dialog: MatDialog, private router: Router) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.modelObj.businessObjName = params['businessObjName'];
      if (!this.modelObj.businessObjName) this.modelObj.businessObjName = 'Product';
      this.modelObj.businessObjName = this.modelObj.businessObjName[0].toUpperCase() + this.modelObj.businessObjName.substring(1);
      this.modelObj.businessObj = BusinessObjFactory.getBusinessObjInstance(this.modelObj.businessObjName);
      this.modelObj.businessObjDispNm = this.modelObj.businessObj.classDispNm;
      //this.modelObj.dialogActions = LookUpValues.getDialogActions(this.modelObj.businessObjName);
      if (this.modelObj.businessObj == null) return;
      this.modelObj.displayColumnNames = this.modelObj.businessObj.getListDisplayColumns();
      for (var i = 0; i < this.modelObj.displayColumnNames.length; i++) {
        this.modelObj.sortCol.push({sort:false, order:'A'});
      }
      this.modelObj.businessObj.getCount((err, data) =>{
        if (err) { return console.log(err);}
        else { this.modelObj.businessObjCount = data.count; }
      });
      this.modelObj.totalPages = Math.ceil(this.modelObj.businessObjCount/this.modelObj.pageSize);      
      this.modelObj.currPage = 1;
      this.modelObj.businessObj.getPageList(this.modelObj.currPage,this.modelObj.pageSize, (err, data) => {
        if (err) {
          if (!err.kind) return;
          if (err.kind != "not_found") {
            return err;
          }
        }
        else this.modelObj.businessObjs = data;
      });
    });
  }
  toggleSort(idx, colNm) {
    if (this.modelObj.curSortColIdx != idx) {
      if (this.modelObj.curSortColIdx != -1) {
        // reset previous sort
        this.modelObj.businessObj.resetSortedArray(this.modelObj.businessObjs);
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
    this.modelObj.businessObj.sortArray(this.modelObj.businessObjs,colNm,this.modelObj.sortCol[idx].order);
    else
    this.modelObj.businessObj.resetSortedArray(this.modelObj.businessObjs);
  }
  pageAction = Utils.pageAction;
  
  openDialog(openMode, idx) {
    var businessObj = null;
    switch (openMode) {
      case 'Create' :
        if (this.modelObj.businessObjName == "OrderSummary") {
          this.router.navigate(['/mypos'], {
            queryParams: {}
          });
          return;
        }        
        businessObj = BusinessObjFactory.getBusinessObjInstance(this.modelObj.businessObjName);
        break;
      case 'View' :
      case 'Update' :
      case 'Delete' :
      case 'Print' :
      case 'Refund' :        
        businessObj = this.modelObj.businessObjs[idx];
        break;
      default:
        return;
    }
    // Create a local temp bus Obj
    var busObj = BusinessObjFactory.getBusinessObjInstance(this.modelObj.businessObjName);
    BusinessObj.setAttributes(busObj, businessObj);
    var dialogData = {openMode : openMode, businessObj : busObj, closeReason : ''}
    new DialogFactory(this.dialog).openDialog(dialogData, (result) => {
      if (result != null && result.closeReason == 'Success') {
        // Think about error code for dialog
        BusinessObj.setAttributes(businessObj,result.businessObj);
        if (openMode == 'Create') return this.modelObj.businessObjs.push(businessObj);
        if (openMode == 'Update') return this.modelObj.businessObjs[idx] = businessObj;
        if (openMode == 'Delete') return this.modelObj.businessObjs.splice(idx,1);
      }
    });    
  }
}
