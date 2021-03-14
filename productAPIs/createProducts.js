var fs = require('fs');
var csvToJSON = require('./csvToJSON');

var args = process.argv.slice(2);
function getEmptyProdObj() {
  var prodObj = {
    sku:{value:null,type:'Str'}, title:{value:null,type:'Str'},description:{value:null,type:'Str'},
    size:{value:null,type:'Str'}, dimensions:{value:null,type:'Str'},salePrice:{value:null,type:'Num'},
    regularPrice:{value:null,type:'Num'},costPrice:{value:null,type:'Num'},category:{value:null,type:'Str'},
    stockQty:{value:null,type:'Num'},dealerBillId:{value:null,type:'Num'},tags:{value:null,type:'Str'},
    imageCount:{value:1,type:'Num'},onSale:{value:'FALSE',type:'Str'},manageStock:{value:'TRUE',type:'Str'},
    allowRefund:{value:'TRUE',type:'Str'},
  }
  return prodObj;
}
function generateProductData() {
  if(args.length != 1) {
    console.log("Error - Arguments needed!!");
    console.log("Usage : node createProducts.js productJsonFile");
    console.log("Terminating Execution!!");
    return;
  }
  csvToJSON(args[0],(err,data)=>{
    if(err) {
      console.log("Error Reading File " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    // Data Received
    var prodDataArry = data;
    if(!prodDataArry) {
      console.log("Error Parsing JSON from file " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    // Now loop through the customer metadata and generate insert statements
    var prodId = -1;
    var insertStrCmd = 'INSERT IGNORE INTO PRODUCT (';    
    var prodObj = null;
    for (var i in prodDataArry) {
      if (prodId != prodDataArry[i].ID) {
        // New User Id
        if (prodId != -1) {
          // Write to file
          var colStr = '';
          var valStr = '';
          for (var j in prodObj) {
            colStr = colStr + j + ',';
            if (prodObj[j].value && prodObj[j].type == 'Str')
                valStr = valStr + "'" + prodObj[j].value + "'" + ',';
            else valStr = valStr + prodObj[j].value + ',';
          }
          colStr = colStr.substring(0,colStr.length -1);
          valStr = valStr.substring(0,valStr.length -1);
          var dataStr = insertStrCmd + colStr + ") VALUES (" + valStr + ");\n";
          console.log(dataStr);
          fs.appendFile('productfile.sql',dataStr,(err) => {
            if(err) console.log(err);
          });
        }
        prodId = prodDataArry[i].ID;
        prodObj = getEmptyProdObj();
        //prodObj.id = prodId;
      }
      prodObj.sku.value = prodDataArry[i].SKU?prodDataArry[i].SKU:null;
      prodObj.title.value = prodDataArry[i].Name?prodDataArry[i].Name:null;
      prodObj.description.value = prodDataArry[i].Description?prodDataArry[i].Description:null;
      prodObj.salePrice.value = prodDataArry[i]['Sale price']?prodDataArry[i]['Sale price']:null;
      prodObj.regularPrice.value = prodDataArry[i]['Regular price']?prodDataArry[i]['Regular price']:null; 
      prodObj.category.value = prodDataArry[i]['Categories']?prodDataArry[i]['Categories']:null;
      prodObj.tags.value = prodDataArry[i]['Tags']?prodDataArry[i]['Tags']:null;
      prodObj.stockQty.value = prodDataArry[i]['Stock']?prodDataArry[i]['Stock']:null;
    }
  });
}
generateProductData();