function registerRoutesInternal(app) {
    console.log("orderDetails registerRoutesInternal");
    var orderDetailsController = require('../controllers/orderDetailsController');

    // todoList Routes
    app.route('/orderDetails').get(orderDetailsController.findAll);
    app.route('/orderDetails').post(orderDetailsController.create);


    app.route('/orderDetails/id/:id').get(orderDetailsController.findOne);
    app.route('/orderDetails/sku/:sku').get(orderDetailsController.findBySku);

    app.route('/orderDetails/:id').put(orderDetailsController.update);
    app.route('/orderDetails/:id').delete(orderDetailsController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
