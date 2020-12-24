function registerRoutesInternal(app) {
    console.log("orderSummary registerRoutesInternal");
    var orderSummaryController = require('../controllers/orderSummaryController');

    // todoList Routes
    app.route('/orderSummary').get(orderSummaryController.findAll);
    app.route('/orderSummary').post(orderSummaryController.create);


    app.route('/orderSummary/id/:id').get(orderSummaryController.findOne);
	  
    app.route('/orderSummary/:id').put(orderSummaryController.update);
    app.route('/orderSummary/:id').delete(orderSummaryController.delete);
}
  
module.exports = { registerRoutes : (app) => {registerRoutesInternal(app);}};
  