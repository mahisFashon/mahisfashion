const mysqlDb = require("./mysqldb.js");

// constructor
const Customer = function (customer) {

  this.first_name = customer.first_name;
  this.last_name = customer.last_name;
  this.middle_name = customer.middle_name;
  this.email = customer.email;
  this.phone = customer.phone;
  this.city = customer.city;
  this.state = customer.state;
  this.country = customer.country;
  this.address_line1 = customer.address_line1;
  this.address_line2 = customer.address_line2;
  this.postal_code = customer.postal_code;

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
  mysqlDb.getConnection().query(`SELECT * FROM customer WHERE UPPER(first_name) = ? and UPPER(last_name)= ?`, [fname.toUpperCase(), lname.toUpperCase()], (err, res) => {
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
  mysqlDb.getConnection().query("SELECT * FROM customer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customer: ", res);
    result(null, res);
  });
};

Customer.updateById = (id, customer, result) => {
  mysqlDb.getConnection().query(
    "UPDATE customer SET first_name = ?, last_name = ?, middle_name = ?, email = ?, city = ?, state = ?, " +
    "country = ?, address_line1 = ?, address_line2 = ?, postal_code = ?" +
    "WHERE id = ?",
    [customer.first_name, customer.last_name, customer.middle_name, customer.email, customer.phone, customer.city, customer.state,
    customer.country, customer.address_line1, customer.address_line2, customer.postal_code, id],
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
