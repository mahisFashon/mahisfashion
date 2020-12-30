var mysqldb = require('mysql');
//const dbConfig = require("../config/db.config.js");

// Create a connection to the database
var mysqlConnection = null;

// open the MySQL connection
function connectToDbInternal() {
  if (mysqlConnection == null) {
    mysqlConnection = mysqldb.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mahisfashionnewdb'
    });
  }
  mysqlConnection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });
  return;
}
function getConnectionInternal() {
  if (mysqlConnection != null) {
    //console.log("Returning from Get Connection 1");
    return mysqlConnection;
  }
  else {
    connectToDbInternal();
    if (mysqlConnection == null) {
      //console.log("Returning from Get Connection 2");
      return null;
    }
  }
  //console.log("Returning from Get Connection 3");
  return mysqlConnection;
}
module.exports = {
  connectToDb: () => { connectToDbInternal(); },
  getConnection: () => { return getConnectionInternal(); }
};
