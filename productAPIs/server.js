const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysqlDb = require('./api/models/mysqldb');
const productRoutes = require('./api/routes/productRoutes.js');
const orderSummaryRoutes = require('./api/routes/orderSummaryRoutes.js');
const businessObjRoutes = require('./api/routes/businessObjRoutes');
console.log("Loaded Various Routes files---");

const app = express();
var port = process.env.PORT || 3111;

//var Product = require('./api/models/productModel');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mysqlDb.connectToDb();
console.log("db connected");
productRoutes.registerRoutes(app);
console.log("Product routes registered");
businessObjRoutes.registerRoutes(app);
console.log("Customer, Dealer, Purchase Details, Routes registered through businessObjRoutes");
orderSummaryRoutes.registerRoutes(app);
console.log("orderSummaryRoutes registered");

app.listen(port, () => {
    console.log('Product RESTful API server started on: ' + port);
}); 
