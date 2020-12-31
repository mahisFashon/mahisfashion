const mysqlDb = require("./mysqldb.js");

// constructor
const Customer = function (customer) {
  this.firstName = customer.firstName;
  this.lastName = customer.lastName;
  this.email = customer.email;
  this.phone = customer.phone;
  this.city = customer.city;
  this.state = customer.state;
  this.country = customer.country;
  this.addressLine1 = customer.addressLine1;
  this.addressLine2 = customer.addressLine2;
  this.postalCode = customer.postalCode;
};

Customer.create = (newCustomer, result) => {
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO customer SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

Customer.findById = (id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM customer WHERE id = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};
//Find by anything
Customer.search = (searchStr, result) => {
  var time1 = Date.now();
  if (isNan(searchStr) == false) {
    // Do a phone number lookup
    mysqlDb.getConnection().query('SELECT * FROM customer WHERE UPPER(phone) LIKE ?', ["%"+searchStr.toUpperCase()+"%"], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        var time2 = Date.now();
        console.log("Found customer Time Taken : ", (time2-time1).toString() + " milliseconds");
        result(null, res[0]);
        return;
      }      
    });
  }
  else {
    // Do a all inclusive search
    var queryString = 'SELECT * FROM CUSTOMER WHERE UPPER(first_Name) LIKE ? OR UPPER(lastName) LIKE ?';
    var searchStrUpper = "%"+searchStr.toUpperCase()+"%";
    mysqlDb.getConnection().query(queryString, [searchStrUpper, searchStrUpper], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        var time2 = Date.now();
        console.log("Found customer Time Taken : ", (time2-time1).toString() + " milliseconds");
        result(null, res[0]);
        return;
      }      
    });
  }
}
//find by phone no

Customer.findByPhoneNo = (phoneNo, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM customer WHERE UPPER(phone) = ?`, [phoneNo.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

//fine by email

Customer.findByEmail = (email, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM customer WHERE UPPER(email) = ?`, [email.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};
Customer.findByName = (fname, lname, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM customer WHERE UPPER(firstName) = ? and UPPER(lastName)= ?`, [fname.toUpperCase(), lname.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};
Customer.getAll = result => {
  var time1 = Date.now();
  mysqlDb.getConnection().query("SELECT * FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    var time2 = Date.now();
    console.log("Time Taken in Get All customer: " + (time2-time1).toString() + "milliseconds");
    result(null, res);
  });
};

Customer.updateById = (id, customer, result) => {
  mysqlDb.getConnection().query(
    "UPDATE customer SET firstName = ?, lastName = ?, middleName = ?, email = ?, city = ?, state = ?, " +
    "country = ?, addressLine1 = ?, addressLine2 = ?, postalCode = ?" +
    "WHERE id = ?",
    [customer.firstName, customer.lastName, customer.middleName, customer.email, customer.phone, customer.city, customer.state,
    customer.country, customer.addressLine1, customer.addressLine2, customer.postalCode, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { id: id, ...customer });
      result(null, { id: id, ...customer });
    }
  );
};

Customer.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM customer WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Customer.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} customer`);
    result(null, res);
  });
};

module.exports = Customer; 
