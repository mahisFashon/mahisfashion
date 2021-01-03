export class BusinessObj {
    public indexInArray : number;
    //Common parent class
    constructor() {
        
    }
    getNewInstance() {
        return new BusinessObj();
    }
    setValues(businessObj) {
        if (businessObj == null) return;
    }
}