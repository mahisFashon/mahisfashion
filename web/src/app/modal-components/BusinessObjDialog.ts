import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BusinessObj } from '../model/BusinessObjNew';
import { Constants } from '../model/Constants';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LookUpValues } from '../model/LookupValues';
import { DateUtils } from '../model/DateUtils';
import { FormGroup } from '@angular/forms';
import { Utils } from '../model/Utils';

@Component({
    selector: 'businessObjDialog',
    templateUrl: './businessObjDialog.html',
    styleUrls: ['./businessObjDialog.scss']
})
export class BusinessObjDialog {
    modelObj = {
        openMode : 'Create',
        businessObj: null,
        closeReason : '',
    }
    disableCount = 0;
    lookUp = LookUpValues;
    profileForm = null;
    constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<BusinessObjDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.modelObj = data;
      this.buildBusObjForm();
    }
    getDialogTitle() {
      return this.modelObj.openMode + ' ' + this.modelObj.businessObj.className;
    }
    getButtonTitle() {
      switch (this.modelObj.openMode) {
        case 'View' : return 'Return';
        default : return this.modelObj.openMode;
      }
    }
    onChange(attrNm) {
      var attrMetaInfo = this.modelObj.businessObj.attrMetaInfos[attrNm];
      if (!attrMetaInfo) return;
    }
    onNoClick(): void {
      this.modelObj.closeReason = 'Cancel';
      //this.dialogRef.close();
    }
    afterFormAction(dbSuccess, dbData) {
      if (dbSuccess) {
        BusinessObj.setAttributesFromDbObj(this.modelObj.businessObj, JSON.parse(dbData));
        this.modelObj.closeReason = 'Success';
        console.log(this.modelObj);
      }
      else {
        this.modelObj.closeReason = 'Error';
      }
      //this.dialogRef.close();
    }
    onAddBusinessObj() {
        var method = '';
        var apiUrl = Constants.apiBaseURL + this.modelObj.businessObj.className.toLowerCase() + '/';
        if (this.modelObj.openMode == 'Create') method = "POST";
        else if (this.modelObj.openMode == 'Update') {
          method = "PUT";
          apiUrl += this.modelObj.businessObj.getIdColumnValue();
        }
        else if (this.modelObj.openMode == 'Delete') {
          method = "DELETE";
          apiUrl += this.modelObj.businessObj.getIdColumnValue();
        }
        var busObj = {};
        for (var i in this.modelObj.businessObj.attrMetaInfos) {
          var attrMetaInfo = this.modelObj.businessObj.attrMetaInfos[i];
          var formCtrl = this.profileForm.get(attrMetaInfo.name);
          busObj[attrMetaInfo.name] = formCtrl?formCtrl.value:'';
          if (attrMetaInfo.validVal == 'DT') {
            if (busObj[attrMetaInfo.name] != '') {
              // Convert to CCYY-MM-DD for DB
              busObj[attrMetaInfo.name] = DateUtils.toDbDate(busObj[attrMetaInfo.name]);
            }
          }
        }                
        Utils.callAPI(method,apiUrl,false,busObj,(err,data)=>{
          if(err) {
            console.log(err);
            // In case of error lets reset to original businessObj before return
            this.afterFormAction(false,err);
          }
          this.afterFormAction(true,data);
        });
    }
    getPlaceHolderText(attrMetaInfo) {
      var placeHolderText = attrMetaInfo.dispNm;
      if (attrMetaInfo.validVal == 'DT') placeHolderText += ' DD-MON-YYYY';
      if(!attrMetaInfo.required) placeHolderText += ' (optional)'
      return placeHolderText;
    }
    buildBusObjForm() {
      var formGrp = {};
      for (var i in this.modelObj.businessObj.attrMetaInfos) {
        var attrMetaInfo = this.modelObj.businessObj.attrMetaInfos[i];
        var validatorArry = [];
        if (attrMetaInfo.formField && attrMetaInfo.required) {
          validatorArry.push(Validators.required);
        }
        if (attrMetaInfo.validVal == 'EM') validatorArry.push(Validators.email);
        else if (attrMetaInfo.validVal != 'VL') 
          validatorArry.push(Validators.pattern(Constants.validPatterns[attrMetaInfo.validVal]));
        var attrVal = '';
        if (this.modelObj.openMode != 'Create')
          attrVal = this.modelObj.businessObj[attrMetaInfo.name];
        attrVal = attrVal?attrVal:'';
        if (this.modelObj.openMode == 'View' || this.modelObj.openMode == 'Delete') {
          formGrp[attrMetaInfo.name] = new FormControl({value:attrVal,disabled:true});
        }
        else {
          formGrp[attrMetaInfo.name] = [attrVal,Validators.compose(validatorArry)];
        }
      }
      if (this.modelObj.openMode == 'View' || this.modelObj.openMode == 'Delete')
        this.profileForm = new FormGroup(formGrp);
      else this.profileForm = this.fb.group(formGrp);
    }
    disableActionButton() {
      var disableFlag = (this.modelObj.openMode=='Update'||this.modelObj.openMode=='Create')&&(this.profileForm.pristine||!this.profileForm.valid);
      return disableFlag;
    }
}