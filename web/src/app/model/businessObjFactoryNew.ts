import { Customer } from './CustomerNew';
import { Dealer } from './DealerNew';
import { OrderSummary } from './OrderSummary';
import { Product } from './ProductNew';
import { PurchaseDetails } from './PurchaseDetails';
export class BusinessObjFactory {
    static getBusinessObjInstance(busObjName) {
        switch (busObjName.toLowerCase()) {
            case 'dealer' : return new Dealer();
            case 'customer' : return new Customer();
            case 'product' : return new Product();
            case 'purchasedetails' : return new PurchaseDetails();
            case 'ordersummary' : return new OrderSummary();
        }
        return null;
    }
} 