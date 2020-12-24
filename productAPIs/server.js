const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysqlDb = require('./api/models/mysqldb');
console.log("mysql loaded---");
const product = require('./api/routes/productRoutes.js');
console.log("product route loaded---");
const customer = require('./api/routes/customerRoutes.js');
console.log("customer route loaded---");
const dealer = require('./api/routes/dealerRoutes.js');
console.log("dealer route loaded---");

const orderDetails = require('./api/routes/orderDetailsRoutes.js');
console.log("order details route loaded---");


const orderSummary = require('./api/routes/orderSummaryRoutes.js');
console.log("order summary route loaded---");

const ordSummaryDisDtls = require('./api/routes/ordSummaryDisDtlsRoutes.js');
console.log("discount  summary route loaded---");

const ordSummaryPayDtls = require('./api/routes/ordSummaryPayDtlsRoutes.js');
console.log("ordSummaryPayDtlsRoutes route loaded---");

const app = express();
var port = process.env.PORT || 3111;

//var Product = require('./api/models/productModel');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mysqlDb.connectToDb(); 
console.log("db connected");
 
product.registerRoutes(app);
console.log("product register");
customer.registerRoutes(app);
console.log("customer register");
dealer.registerRoutes(app);
console.log("dealer register");
orderDetails.registerRoutes(app);
console.log("orderDetails register");
orderSummary.registerRoutes(app);
console.log("orderSummary register");
ordSummaryDisDtls.registerRoutes(app);
console.log("ordSummaryDisDtls register");
ordSummaryPayDtls.registerRoutes(app);
console.log("ordSummaryPayDtls register");




app.listen(port, () => {
    console.log('Product RESTful API server started on: ' + port);
}); 