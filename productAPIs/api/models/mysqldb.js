var mySqldb = require('mySql');
var process = require('process');
//const dbConfig = require("../config/db.config.js");

// Create a connection to the database
var mySqlConnection = null;
// Implemented connection pool
var mySqlConnPool = null;
var mySqlConnConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mahisfashionnewdb',
  dateStrings: true      
}
function createConnPool() {
  if (mySqlConnPool == null) {
    mySqlConnPool = mySqldb.createPool(mySqlConnConfig);
    console.log(process.pid);
    console.log(process.ppid);
    if (mySqlConnPool == null) throw {'CreatePoolError':'Error Creating Connection Pool'};
  }
}
// open the MySQL connection
function connectToDbInternal() {
  if (mySqlConnection == null) {
    mySqlConnection = mySqldb.createConnection(mySqlConnConfig);
  }
  mySqlConnection.connect(error => {
    if (error) {
      console.log(error);
      throw error;
    }
    console.log("Successfully connected to the database.");
  });
  return;
}
function getConnectionInternal() {
  if (mySqlConnection != null) {
    return mySqlConnection;
  }
  else {
    connectToDbInternal();
    if (mySqlConnection == null) {
      return null;
    }
  }
  return mySqlConnection;
}
function getConnFromPool(callBackFn) {
  if (mySqlConnPool != null) {
    mySqlConnPool.getConnection((err,connection) => {
      if(err) {
        console.log(err);
        throw err;
      }
      return callBackFn(null,connection);
    });
  }
  else throw {'Error':'Using Pool but connection pool is null'};
}
module.exports = {
  connectToDb: () => { connectToDbInternal(); },
  getConnection: () => { return getConnectionInternal(); },
  createConnPool: () => { return createConnPool(); },
  getConnFromPool: (callBackFn) => { return getConnFromPool(callBackFn); }
};
