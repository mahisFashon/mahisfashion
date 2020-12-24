function registerRoutesInternal(app) {
    console.log("ordSummaryDisDtls registerRoutesInternal");
    var ordSummaryDisDtlsController = require('../controllers/ordSummaryDisDtlsController');

    // todoList Routes
    app.route('/ordSummaryDisDtls').get(ordSummaryDisDtlsController.findAll);
    app.route('/ordSummaryDisDtls').post(ordSummaryDisDtlsController.create);


    app.route('/ordSummaryDisDtls/id/:id').get(ordSummaryDisDtlsController.findOne);
    app.route('/ordSummaryDisDtls/orderId/:orderId').get(ordSummaryDisDtlsController.findByOrderId);

    app.route('/ordSummaryDisDtls/:id').put(ordSummaryDisDtlsController.update);
    app.route('/ordSummaryDisDtls/:id').delete(ordSummaryDisDtlsController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
