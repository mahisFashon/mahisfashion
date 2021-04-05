function registerRoutesInternal(app) {
    var productController = require('../controllers/productController');

    // todoList Routes
    app.route('/product').get(productController.findAll);
    app.route('/product').post(productController.create);

    app.route('/product/:start/:pageSize/').get(productController.getPage);
    app.route('/product/:start/:pageSize/:sellable').get(productController.getPage);
    app.route('/searchProduct/:searchSku').get(productController.searchProductBySKU);
    app.route('/productByCategory/:start/:pageSize/:category').get(productController.getPageByCategory);
    app.route('/productByCategory/:category/:start/:pageSize/:sellable').get(productController.getPageByCategory);    
    app.route('/product/count').get(productController.totalCount);
    app.route('/product/count/:sellable').get(productController.totalCount);
    app.route('/product/:sku').get(productController.findOne);
    app.route('/product/:sku').put(productController.update);
    app.route('/product/:sku').delete(productController.delete);
}

module.exports = { registerRoutes: (app) => { registerRoutesInternal(app); } };
