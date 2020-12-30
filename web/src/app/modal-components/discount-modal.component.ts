import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiscountFeesDialog } from './discountFeesDialog';
import { DiscountFee } from '../model/DiscountFee';

@Component({
  selector: 'app-discount-modal',
  templateUrl: './discount-modal.component.html',
  styleUrls: ['./discount-modal.component.scss']
})
export class DiscountModalComponent implements OnInit {
  discounts = [];

  constructor(public dialog: MatDialog) {
    //add a couple of discount elements
    var discFee = new DiscountFee();
    discFee.setValues({
      category:"D", type:'pct', value:10,amount:200,
    });
    this.discounts.push(discFee);
    var discFee = new DiscountFee();
    discFee.setValues({
      category:"D", type:'flat', value:100,amount:100,
    });
    this.discounts.push(discFee);
  }

  ngOnInit() {
  }
  openDialog() {
    const dialogRef = this.dialog.open(DiscountFeesDialog, {
      width:'700px', data:{ discounts: this.discounts, grossTotal:2000, netTotal:1700 },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.discounts = result;
      console.log('Dialog result: ' + JSON.stringify(result));
    });
  }
}
