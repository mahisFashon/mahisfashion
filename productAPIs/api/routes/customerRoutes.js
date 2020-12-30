function registerRoutesInternal(app) {
    console.log("customer registerRoutesInternal");
    var CustomerController = require('../controllers/CustomerController');

    // todoList Routes
    app.route('/customer').get(CustomerController.findAll);
    app.route('/customer').post(CustomerController.create);


    app.route('/customer/id/:id').get(CustomerController.findOne);
    app.route('/customer/name/:firstName/:lastName').get(CustomerController.findByName);
    app.route('/customer/email/:emailId').get(CustomerController.findByEmail);
    app.route('/customer/phone/:number').get(CustomerController.findByPhoneNo);
    app.route('/customer/search/:searchStr').get(CustomerController.search);
    
    app.route('/customer/:id').put(CustomerController.update);
    app.route('/customer/:id').delete(CustomerController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
