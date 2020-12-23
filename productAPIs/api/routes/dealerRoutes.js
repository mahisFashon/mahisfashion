function registerRoutesInternal(app) {
    console.log("dealer registerRoutesInternal");
    var dealerController = require('../controllers/dealerController');

    // todoList Routes
    app.route('/dealer').get(dealerController.findAll);
    app.route('/dealer').post(dealerController.create);


    app.route('/dealer/id/:id').get(dealerController.findOne);
	 app.route('/dealer/name/:name').get(dealerController.findByName);
     app.route('/dealer/email/:emailId').get(dealerController.findByEmail);
     app.route('/dealer/phone/:number').get(dealerController.findByPhoneNo);
 
    app.route('/dealer/:id').put(dealerController.update);
    app.route('/dealer/:id').delete(dealerController.delete);
}
  
module.exports = { registerRoutes : (app) => {registerRoutesInternal(app);}};
  