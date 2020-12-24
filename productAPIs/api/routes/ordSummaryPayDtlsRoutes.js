function registerRoutesInternal(app) {
    console.log("ordSummaryPayDtls registerRoutesInternal");
    var ordSummaryPayDtlsController = require('../controllers/ordSummaryPayDtlsController');

    // todoList Routes
    app.route('/ordSummaryPayDtls').get(ordSummaryPayDtlsController.findAll);
    app.route('/ordSummaryPayDtls').post(ordSummaryPayDtlsController.create);


    app.route('/ordSummaryPayDtls/id/:id').get(ordSummaryPayDtlsController.findOne);
	 app.route('/ordSummaryPayDtls/orderId/:orderId').get(ordSummaryPayDtlsController.findByOrderId);
    
    app.route('/ordSummaryPayDtls/:id').put(ordSummaryPayDtlsController.update);
    app.route('/ordSummaryPayDtls/:id').delete(ordSummaryPayDtlsController.delete);
}
  
module.exports = { registerRoutes : (app) => {registerRoutesInternal(app);}};
  