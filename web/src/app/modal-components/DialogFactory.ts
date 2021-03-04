import { MatDialog } from '@angular/material/dialog';
import { BusinessObjDialog } from './BusinessObjDialog';
import { OrderDialog } from './orderDialog';

export class DialogFactory {
    constructor(public dialog: MatDialog) { }
    openDialog(dialogData, result) {
        switch(dialogData.businessObj.className.toLowerCase()) {
            case 'customer' :
            case 'dealer' :
            case 'product' :
            case 'purchasedetails' :
                var dialogRef = this.dialog.open(BusinessObjDialog, {
                    width:'900px', 
                    data: dialogData,
                });
                return dialogRef.afterClosed().subscribe(result);
            case 'ordersummary' :
                var orderDialogRef = this.dialog.open(OrderDialog, {
                    width:'900px', 
                    data: dialogData,
                });
                return orderDialogRef.afterClosed().subscribe(result);                
            default :
                return;
        }      
    }
}