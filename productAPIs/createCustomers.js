var fs = require('fs');
var args = process.argv.slice(2);
function getEmptyCustObj() {
  var custObj = {
    id:null,firstName:null,lastName:null,phone:null,email:null,
    city:'Hyderabad',state:'Telangana',country:'India',addressLine1:null,addressLine2:null,
    postalCode:null
  }
  return custObj;
}
function generateCustomerData() {
  if(args.length != 1) {
    console.log("Error - Arguments needed!!");
    console.log("Usage : node createCustomers.js customerJsonFile");
    console.log("Terminating Execution!!");
    return;
  }
  fs.readFile(args[0],(err,data)=>{
    if(err) {
      console.log("Error Reading File " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    // Data Received
    var customerData = JSON.parse(data);
    if(!customerData) {
      console.log("Error Parsing JSON from file " + args[0]);
      console.log("Terminating Execution!!");
      return;
    }
    // Now loop through the customer metadata and generate insert statements
    var custId = -1;
    var insertStrCmd = 'INSERT INTO CUSTOMER (';
    var insertStrData = '';
    var custDataArry = customerData[2].data;
    var custObj = null;
    for (var i in custDataArry) {
      if (custId != custDataArry[i].user_id) {
        // New User Id
        if (custId != -1) {
          // Write to file
          var colStr = '';
          var valStr = '';
          for (var j in custObj) {
            colStr = colStr + j + ',';
            if (j != 'id' && custObj[j])
                valStr = valStr + "'" + custObj[j] + "'" + ',';
            else valStr = valStr + custObj[j] + ',';
          }
          colStr = colStr.substring(0,colStr.length -1);
          valStr = valStr.substring(0,valStr.length -1);
          var dataStr = insertStrCmd + colStr + ") VALUES (" + valStr + ");\n";
          console.log(dataStr);
          fs.appendFile('customerfile.sql',dataStr,(err) => {
            if(err) console.log(err);
          });
        }
        custId = custDataArry[i].user_id;
        custObj = getEmptyCustObj();
        custObj.id = custId;
      }
      else if (custDataArry[i].meta_key == 'first_name' || custDataArry[i].meta_key == 'billing_first_name') {
        custObj.firstName = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'last_name' || custDataArry[i].meta_key == 'billing_last_name') {
        custObj.lastName = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'billing_address_1') {
        custObj.addressLine1 = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'billing_address_2') {
        custObj.addressLine2 = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'billing_city') {
        custObj.city = custDataArry[i].meta_value?custDataArry[i].meta_value:'Hyderabad';
      }
      else if (custDataArry[i].meta_key == 'billing_state') {
        custObj.state = custDataArry[i].meta_value?custDataArry[i].meta_value:'TS';
      }
      else if (custDataArry[i].meta_key == 'billing_country') {
        custObj.country = custDataArry[i].meta_value?custDataArry[i].meta_value:'India';
      }
      else if (custDataArry[i].meta_key == 'billing_postcode') {
        custObj.postalCode = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'billing_email') {
        custObj.email = custDataArry[i].meta_value?custDataArry[i].meta_value:'';
      }
      else if (custDataArry[i].meta_key == 'billing_phone') {
        var phNo = custDataArry[i].meta_value;
        custObj.phone = phNo&&phNo.length>9?phNo:'9999999999';
      }                  
    }
  });
}
generateCustomerData();