const mysqlDb = require("./mysqldb.js");

// constructor
const Dealer = function (dealer) {
  this.id = dealer.id;
  this.name = dealer.name?dealer.name:null;
  this.city = dealer.city?dealer.city:null;
  this.state = dealer.state?dealer.state:null;
  this.country = dealer.country?dealer.country:null;
  this.addressLine1 = dealer.addressLine1?dealer.addressLine1:null;
  this.addressLine2 = dealer.addressLine2?dealer.addressLine2:null;
  this.postalCode = dealer.postalCode?dealer.postalCode:null;
};

Dealer.create = (newDealer, result) => {
  var dbConn = mysqlDb.getConnection();

  dbConn.query("INSERT INTO dealer SET ?", newDealer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created dealer: ", { id: res.insertId, ...newDealer });
    result(null, { id: res.insertId, ...newDealer });
  });
};

Dealer.findById = (id, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM dealer WHERE id = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found dealer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Dealer with the id
    result({ kind: "notFound" }, null);
  });
};

//find by phone no

Dealer.findByPhoneNo = (phoneNo, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM dealer WHERE UPPER(phone) = ?`, [phoneNo.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found dealer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Dealer with the id
    result({ kind: "notFound" }, null);
  });
};

//fine by email

Dealer.findByEmail = (email, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM dealer WHERE UPPER(email) = ?`, [email.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found dealer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Dealer with the id
    result({ kind: "notFound" }, null);
  });
};
Dealer.findByName = (name, result) => {
  mysqlDb.getConnection().query(`SELECT * FROM dealer WHERE UPPER(name) = ?`, [name.toUpperCase()], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found dealer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Dealer with the id
    result({ kind: "notFound" }, null);
  });
};
Dealer.getAll = result => {
  mysqlDb.getConnection().query("SELECT * FROM dealer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("dealer: ", res);
    result(null, res);
  });
};

Dealer.updateById = (id, dealer, result) => {
  mysqlDb.getConnection().query(
    "UPDATE dealer SET name = ?, city = ?, state = ?, " +
    "country = ?, addressLine1 = ?, addressLine2 = ?, postalCode = ?" +
    "WHERE id = ?",
    [dealer.name, dealer.city, dealer.state,
    dealer.country, dealer.addressLine1, dealer.addressLine2, dealer.postalCode, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Dealer with the id
        result({ kind: "notFound" }, null);
        return;
      }

      console.log("updated dealer: ", { id: id, ...dealer });
      result(null, { id: id, ...dealer });
    }
  );
};

Dealer.remove = (id, result) => {
  mysqlDb.getConnection().query("DELETE FROM dealer WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Dealer with the id
      result({ kind: "notFound" }, null);
      return;
    }

    console.log("deleted dealer with id: ", id);
    result(null, res);
  });
};

Dealer.removeAll = result => {
  mysqlDb.getConnection().query("DELETE FROM dealer", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} dealer`);
    result(null, res);
  });
};

module.exports = Dealer; 
