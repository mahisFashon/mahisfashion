import {BusinessObj} from './BusinessObj';
import {Customer} from './Customer';
import {Dealer} from './Dealer';
import {Product} from './Product';
export class BusinessObjFactory {
    static getBusinessObjInstance(busObjName) {
        switch (busObjName) {
            case 'Dealer' : return new Dealer();
            case 'Customer' : return new Customer();
            case 'Product' : return new Product();
        }
        return null;
    }
}