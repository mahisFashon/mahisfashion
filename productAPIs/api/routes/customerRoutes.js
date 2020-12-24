function registerRoutesInternal(app) {
    console.log("customer registerRoutesInternal");
    var customerController = require('../controllers/customerController');

    // todoList Routes
    app.route('/customer').get(customerController.findAll);
    app.route('/customer').post(customerController.create);


    app.route('/customer/id/:id').get(customerController.findOne);
    app.route('/customer/name/:firstName/:lastName').get(customerController.findByName);
    app.route('/customer/email/:emailId').get(customerController.findByEmail);
    app.route('/customer/phone/:number').get(customerController.findByPhoneNo);

    app.route('/customer/:id').put(customerController.update);
    app.route('/customer/:id').delete(customerController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
