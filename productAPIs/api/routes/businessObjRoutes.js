function registerRoutesInternal(app) {
    var BusinessObjController = require('../controllers/BusinessObjController');

    // Customer Routes
    app.route('/customer').get(BusinessObjController.getAll);
    app.route('/customer').post(BusinessObjController.create);
    app.route('/customer/search/:searchStr').get(BusinessObjController.search);
    app.route('/customer/count').get(BusinessObjController.totalCount);
    app.route('/customer/:start/:pageSize').get(BusinessObjController.getPage);
    app.route('/customer/:id').put(BusinessObjController.update);
    app.route('/customer/:id').delete(BusinessObjController.delete);
    // Dealer Routes
    app.route('/dealer').get(BusinessObjController.getAll);
    app.route('/dealer').post(BusinessObjController.create);
    app.route('/dealer/search/:searchStr').get(BusinessObjController.search);
    app.route('/dealer/count').get(BusinessObjController.totalCount);
    app.route('/dealer/:start/:pageSize').get(BusinessObjController.getPage);
    app.route('/dealer/:id').put(BusinessObjController.update);
    app.route('/dealer/:id').delete(BusinessObjController.delete);
    // PurchaseDetails Routes
    app.route('/purchaseDetails').get(BusinessObjController.getAll);
    app.route('/purchaseDetails').post(BusinessObjController.create);
    app.route('/purchaseDetails/search/:searchStr').get(BusinessObjController.search);
    app.route('/purchaseDetails/count').get(BusinessObjController.totalCount);
    app.route('/purchaseDetails/:start/:pageSize').get(BusinessObjController.getPage);
    app.route('/purchaseDetails/:id').put(BusinessObjController.update);
    app.route('/purchaseDetails/:id').delete(BusinessObjController.delete);    
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
