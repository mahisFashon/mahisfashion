function registerRoutesInternal(app) {
    console.log("ordPurchaseDtls registerRoutesInternal");
    var ordPurchaseDtlsController = require('../controllers/ordPurchaseDtlsController');

    // todoList Routes
    app.route('/ordPurchaseDtls').get(ordPurchaseDtlsController.findAll);
    app.route('/ordPurchaseDtls').post(ordPurchaseDtlsController.create);


    app.route('/ordPurchaseDtls/billId/:billId').get(ordPurchaseDtlsController.findByBillId);
    app.route('/ordPurchaseDtls/dealerId/:dealerId').get(ordPurchaseDtlsController.findByDealerId);

    app.route('/ordPurchaseDtls/:id').put(ordPurchaseDtlsController.update);
    app.route('/ordPurchaseDtls/:id').delete(ordPurchaseDtlsController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
