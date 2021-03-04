import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'alertDialog',
    templateUrl: './alertDialog.html',
    styleUrls: ['./discountFeesDialog.scss']
})
export class AlertDialog {
    modelObj = {
        openMode:'',
        businessObj : {title:'', message:'', subMessage:''},
        closeReason : '',
    }
    constructor(public dialogRef: MatDialogRef<AlertDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.modelObj = data;  
    }
  
    onCancel(): void {
        this.dialogRef.close();
    }
    onDone() : void {
        this.dialogRef.close();
    }
}