const mysqlDb = require("./mysqldb.js");
const BusinessObjFactory = require("./BusinessObjFactory.js");

// constructor
var BusinessObj = {} // The empty object
BusinessObj = function (busObjName, busObj) { // Constructor to populate attribues
    var busObjTemp = {};
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    for(var i in attrMetaInfos) {
      var attrMetaInfo = attrMetaInfos[i];
      busObjTemp[attrMetaInfo.name] = busObj[attrMetaInfo.name]!=undefined?busObj[attrMetaInfo.name]:null;
      if (attrMetaInfo.dataType == 'Number') {
        busObjTemp[attrMetaInfo.name] = Number(busObjTemp[attrMetaInfo.name]);
      }
    }
    return busObjTemp;
};
BusinessObj.validate = (busObjName, businessObj, withKey, callBackFn) => {
  var isValid = true;
  var errorMessages = [];
  var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
  if (!attrMetaInfos) return true;
  for (var i in attrMetaInfos.length) {
    var attrMetaInfo = attrMetaInfos[i];
    if ( !withKey && attrMetaInfo.key ) continue;
    var attrVal = businessObj[attrMetaInfo.name];
    if (attrMetaInfo.required && (!attrVal || attrVal==null || attrVal=='')) {
      isValid = false;
      errorMessages.push(attrMetaInfo.name + " is required!");
    }
    else if (attrVal && attrVal!=null && attrVal!='') {
      if (!BusinessObjFactory.validateAttribute(attrMetaInfo.name,attrVal,attrMetaInfo)) {
        isValid = false;
        errorMessages.push(attrMetaInfo.name + " has invalid value!");      
      }
    }
  }
  // Perform additional validations for business object if any
  if (!isValid) return callBackFn(isValid, errorMessages);
  return BusinessObjFactory.customValidate(busObjName,businessObj,callBackFn);
}
BusinessObj.create = (busObjName, businessObj, callBackFn) => {
  var dbConn = mysqlDb.getConnection();
  dbConn.query("INSERT INTO " + busObjName + " SET ?", businessObj, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null, { id: data.insertId, obj : businessObj });
  });
};
BusinessObj.search = (busObjName, paramNmArry, paramValArry, callBackFn) => {
  if (!busObjName || !paramNmArry || !paramValArry) 
    return callBackFn({errors:['Error : BusinessObj.search - invalid value for parameters']},null);
  if (paramNmArry.length == 0 || paramValArry == 0 || 
      (paramNmArry.length != paramValArry.length && paramValArry.length != 1))
      return callBackFn({errors:['Error : BusinessObj.search - Param Name and Values length inconsistent']},null);
  var queryStr = "SELECT * FROM " + busObjName + " WHERE ";
  var valuesArray = [];
  var i;
  for (i = 0; i < paramNmArry.length-1; i++) {
      queryStr += "UPPER(" + paramNmArry[i] + ") LIKE ? OR ";
      if (paramValArry.length == 1) valuesArray.push("%" + paramValArry[0].toUpperCase() + "%");
      else valuesArray.push("%" + paramValArry[i].toUpperCase() + "%");
  }
  queryStr += "UPPER(" + paramNmArry[i] + ") LIKE ?"
  if (paramValArry.length == 1) valuesArray.push("%" + paramValArry[0].toUpperCase() + "%");
  else valuesArray.push("%" + paramValArry[i].toUpperCase() + "%");
  BusinessObj.searchInternal(queryStr,valuesArray, callBackFn);
}
BusinessObj.findByAttribute = (busObjName, attrNm, attrVal, callBackFn) => {
  var queryStr = `SELECT * FROM ` + busObjName + ` WHERE ` + attrNm + ` = ?`;
  mysqlDb.getConnection().query(queryStr, [attrVal], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length == 1) return callBackFn(null, data[0]);
    return callBackFn({ kind: "not_found" }, null);
  });
}
BusinessObj.searchInternal = (searchQueryStr, paramValuesArray, callBackFn) => {
  if(searchQueryStr == null || searchQueryStr == '') return;
  if(paramValuesArray == null || paramValuesArray.length == 0) return;
  mysqlDb.getConnection().query(searchQueryStr, paramValuesArray, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null, data);
  });  
}
BusinessObj.totalCount = (busObjName, callBackFn) => {
  mysqlDb.getConnection().query(`SELECT COUNT(*) as count FROM ` + busObjName, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length) return callBackFn(null, data[0]);
    return callBackFn({ kind: "not_found" }, null);
  });
};
BusinessObj.getPage = (busObjName, startIndex, pageSize, callBackFn) => {
  var queryStr = "SELECT * FROM " + busObjName + " limit " + startIndex + "," + pageSize;
  mysqlDb.getConnection().query(queryStr, (err, data) => {
    if (err) {console.log(err); return callBackFn({errors:[JSON.stringify(err)]}, null);}
    if (data.length > 0) return callBackFn(null, data);
    return callBackFn({ kind: "not_found" }, null);
  });
};

BusinessObj.getAll = (busObjName, callBackFn) => {
  mysqlDb.getConnection().query("SELECT * FROM " + busObjName, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null); 
    return callBackFn(null, data);
  });
};
BusinessObj.update = (busObjName, updateAttrs, attrMetaInfos, businessObj, callBackFn) => {
  var queryStr = "UPDATE " + busObjName + " ";
  var paramValues = [];
  var whereParamValues = [];
  var whereClauseStr = "WHERE ";
  var setStr = 'SET '
  for (var i in attrMetaInfos) {
    if (attrMetaInfos[i].key) {
      if (whereClauseStr.lastIndexOf("? ") > 0) 
        whereClauseStr += " AND ";
      whereClauseStr += attrMetaInfos[i].name + " = ? ";
      whereParamValues.push(businessObj[attrMetaInfos[i].name]);
    }
    else if(!updateAttrs || updateAttrs.find(item=>item==attrMetaInfos[i].name?true:false)) {
      if (setStr.lastIndexOf("? ") > 0) setStr += " , ";
      setStr += attrMetaInfos[i].name + " = ? ";
      paramValues.push(businessObj[attrMetaInfos[i].name]);
    }
  }
  queryStr += setStr + whereClauseStr;
  mysqlDb.getConnection().query(queryStr, paramValues.concat(whereParamValues), (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    return callBackFn(null, businessObj);
  });
}
BusinessObj.delete = (busObjName, keyNameVals, callBackFn) => {
  var queryStr = "DELETE FROM " + busObjName + " ";
  var paramValues = [];
  var whereClauseStr = "WHERE ";
  for (var i in keyNameVals) {
    if (whereClauseStr.lastIndexOf("? ") > 0) whereClauseStr += " AND ";
    whereClauseStr += keyNameVals[i].name + " = ? ";
    paramValues.push(keyNameVals[i].value);
  }
  queryStr += whereClauseStr;
  mysqlDb.getConnection().query(queryStr, paramValues, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    return callBackFn(null, data);
  });
};
BusinessObj.nestedCreate = (busObjName, businessObjs, currItem, totalItems, errors, callBackFn) => {
  if (BusinessObjFactory.hasOverrideNestedCreate(busObjName))
    return BusinessObjFactory.nestedCreate(busObjName, businessObjs, currItem, totalItems, errors, callBackFn);
  else
    return BusinessObj.nestedCreateDefault(busObjName, businessObjs, currItem, totalItems, errors, callBackFn);
}
BusinessObj.nestedCreateDefault = (busObjName, businessObjs, currItem, totalItems, errors, callBackFn) => {
  console.log("Nested create log " + busObjName + " - Processing curr item no - " + currItem.toString() + " - of total items - " + totalItems.toString());
  if (currItem < totalItems && errors.length == 0) {
    mysqlDb.getConnection().query("INSERT INTO " + busObjName + " SET ?", businessObjs[currItem], (err, data) => {
      if (err) return errors.push(JSON.stringify(err));
      BusinessObj.nestedCreateDefault(busObjName, businessObjs, ++currItem, totalItems, errors, callBackFn);
    });
  }
  else if (currItem == totalItems) {
    if (errors.length > 0) return callBackFn({errors:errors}, null);
    return callBackFn(null, {message:'Successfully Completed BusinessObj.nestedCreate for ' + busObjName});
  }
}
BusinessObj.nestedValidate = (busObjName, businessObjs, currItem, totalItems, withKey, errorMessages, callBackFn) => {
  if (currItem < totalItems) {
    BusinessObj.validate(busObjName,businessObjs[currItem],withKey,(isValid, errorMessages) => {
      BusinessObj.nestedValidate(busObjName, businessObjs, ++currItem, totalItems, withKey, errorMessages, callBackFn);
    });
  }
  else if (currItem == totalItems) {
    if (errorMessages.length > 0) return callBackFn(false, errorMessages);
    return callBackFn(true, []);
  }
}
module.exports = BusinessObj;