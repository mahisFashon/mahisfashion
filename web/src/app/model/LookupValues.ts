export class LookUpValues {
    public static cardTypes = [{code: 'MC', value:'Master Card'},
                 {code: 'VC', value:'VISA'},
                 {code: 'AM', value:'AMEX'}];
    public static ePayTypes = [{code: 'GP', value:'Google Pay'},
                {code: 'AP', value:'Amazon Pay'},
                {code: 'PT', value:'PayTM'},
                {code: 'UP', value:'UPI'},];
    public static payModes = [{code: 'CS', value:'Cash', modeType:[{code:'CS', value:'Cash'}]},
                {code: 'CC', value:'Credit Card', modeType : LookUpValues.cardTypes},
                {code: 'EP', value:'ePayments', modeType : LookUpValues.ePayTypes}];
    public static countries = [{code:'IN', value:'India'}];
    public static getPayModeType(mode) : any {
      if (mode == null || mode == '') return null;

      for (var i in LookUpValues.payModes) {
        if (LookUpValues.payModes[i].code == mode) return LookUpValues.payModes[i].modeType;
      }
      return null;
    }
}