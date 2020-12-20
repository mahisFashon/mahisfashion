const express = require('express');
const bodyParser = require('body-parser');
const mysqlDb = require('./api/models/mysqldb');
console.log("Here 1---");
const routes = require('./api/routes/productRoutes.js');
console.log("Here 2---");
const app = express();
var port = process.env.PORT || 3111;

//var Product = require('./api/models/productModel');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mysqlDb.connectToDb(); 
console.log("Here 3---");
 
routes.registerRoutes(app);
console.log("Here 4---");

app.listen(port, () => {
    console.log('Product RESTful API server started on: ' + port);
}); 