function registerRoutesInternal(app) {
    console.log("orderSummary registerRoutesInternal");
    var orderSummaryController = require('../controllers/orderSummaryController');

    // todoList Routes
    // OrderSummary Routes
    app.route('/orderSummary/count').get(orderSummaryController.totalCount);
    app.route('/orderSummary/:start/:pageSize').get(orderSummaryController.getPage);

    app.route('/processOrder').post(orderSummaryController.processOrder);
    app.route('/getOrderDetails/:orderId').get(orderSummaryController.getOrderDetails);
    app.route('/processRefund/:orderId').put(orderSummaryController.processRefund);
    app.route('/deleteOrder/:orderId').delete(orderSummaryController.deleteOrder);
    app.route('/getRefundedItemTotals/:orderId').get(orderSummaryController.getRefundedItemTotals);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
