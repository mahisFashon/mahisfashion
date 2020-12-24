function registerRoutesInternal(app) {
    console.log("ordSummaryTaxDtls registerRoutesInternal");
    var ordSummaryTaxDtlsController = require('../controllers/ordSummaryTaxDtlsController');

    // todoList Routes
    app.route('/ordSummaryTaxDtls').get(ordSummaryTaxDtlsController.findAll);
    app.route('/ordSummaryTaxDtls').post(ordSummaryTaxDtlsController.create);


    app.route('/ordSummaryTaxDtls/id/:id').get(ordSummaryTaxDtlsController.findOne);
	 app.route('/ordSummaryTaxDtls/orderId/:orderId').get(ordSummaryTaxDtlsController.findByOrderId);
   
    app.route('/ordSummaryTaxDtls/:id').put(ordSummaryTaxDtlsController.update);
    app.route('/ordSummaryTaxDtls/:id').delete(ordSummaryTaxDtlsController.delete);
}
  
module.exports = { registerRoutes : (app) => {registerRoutesInternal(app);}};
  