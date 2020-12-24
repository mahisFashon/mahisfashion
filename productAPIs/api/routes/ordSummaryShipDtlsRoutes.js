function registerRoutesInternal(app) {
    console.log("ordSummaryShipDtls registerRoutesInternal");
    var ordSummaryShipDtlsController = require('../controllers/ordSummaryShipDtlsController');

    // todoList Routes
    app.route('/ordSummaryShipDtls').get(ordSummaryShipDtlsController.findAll);
    app.route('/ordSummaryShipDtls').post(ordSummaryShipDtlsController.create);


    app.route('/ordSummaryShipDtls/id/:id').get(ordSummaryShipDtlsController.findOne);
    app.route('/ordSummaryShipDtls/orderId/:orderId').get(ordSummaryShipDtlsController.findByOrderId);
    app.route('/ordSummaryShipDtls/customerId/:customerId').get(ordSummaryShipDtlsController.findByCustomerId);

    app.route('/ordSummaryShipDtls/:id').put(ordSummaryShipDtlsController.update);
    app.route('/ordSummaryShipDtls/:id').delete(ordSummaryShipDtlsController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
