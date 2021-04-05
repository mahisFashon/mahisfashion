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
BusinessObj.validate = (busObjName, businessObj, withKey, callBackFn,dbConn=null) => {
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
BusinessObj.create = (busObjName, businessObj, callBackFn,dbConn=null) => {
  dbConn.query("INSERT INTO " + busObjName.toLowerCase() + " SET ?", 
  businessObj, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null, { id: data.insertId, obj : businessObj });
  });
};
BusinessObj.searchAdvanced = (busObjName, params, callBackFn,dbConn=null) => {
  if (!busObjName || !params || params.length == 0) 
    return callBackFn({errors:['Error : BusinessObj.search - invalid value for parameters']},null);
  var valuesArray = [];
  var queryStr = "SELECT * FROM " + busObjName.toLowerCase() + " WHERE ";
  for (var i in params) {
    // Loop through the params and build the query string and param array
    if (params[i].condition == 'LIKE') {
      queryStr += "UCASE(" + params[i].name + ") " + params[i].condition + " ?";
      valuesArray.push("%" + params[i].value.toUpperCase() + "%");
    }
    else if (params[i].condition == 'BETWEEN') {
      queryStr += params[i].name + " " + params[i].condition + " ?";
      valuesArray.push(params[i].value);
      valuesArray.push(params[i].toValue);
      queryStr += " AND ? "
    }
    else valuesArray.push(params[i].value);
    if (i < params.length - 1) queryStr +=  + " OR ";
  }
  var customCondition = BusinessObjFactory.getCustomSearchCondition(busObjName);
  if (customCondition.length > 0) queryStr += " AND " + customCondition;
  
  //console.log(queryStr);  
  //console.log(valuesArray);
  BusinessObj.searchInternal(queryStr,valuesArray, callBackFn,dbConn);
}
BusinessObj.search = (busObjName, paramNmArry, paramValArry, callBackFn,dbConn=null) => {
  if (!busObjName || !paramNmArry || !paramValArry) 
    return callBackFn({errors:['Error : BusinessObj.search - invalid value for parameters']},null);
  if (paramNmArry.length == 0 || paramValArry == 0 || 
      (paramNmArry.length != paramValArry.length && paramValArry.length != 1))
      return callBackFn({errors:['Error : BusinessObj.search - Param Name and Values length inconsistent']},null);
  var queryStr = "SELECT * FROM " + busObjName.toLowerCase() + " WHERE ";
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
  BusinessObj.searchInternal(queryStr,valuesArray, callBackFn,dbConn);
}
BusinessObj.findByAttribute = (busObjName, attrNm, attrVal, callBackFn,dbConn=null) => {
  var queryStr = `SELECT * FROM ` + busObjName.toLowerCase() + ` WHERE ` + attrNm + ` = ?`;
  dbConn.query(queryStr, [attrVal], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length == 1) return callBackFn(null, data[0]);
    return callBackFn({ kind: "not_found" }, null);
  });
}
BusinessObj.findAllByAttribute = (busObjName, attrNm, attrVal, callBackFn,dbConn=null) => {
  var queryStr = `SELECT * FROM ` + busObjName.toLowerCase() + ` WHERE ` + attrNm + ` = ?`;
  dbConn.query(queryStr, [attrVal], (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length > 0) return callBackFn(null, data);
    return callBackFn(null, []);
  });
}
BusinessObj.searchInternal = (searchQueryStr, paramValuesArray, callBackFn,dbConn=null) => {
  if(searchQueryStr == null || searchQueryStr == '') return;
  if(paramValuesArray == null || paramValuesArray.length == 0) return;
  dbConn.query(searchQueryStr, paramValuesArray, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    return callBackFn(null, data);
  });  
}
BusinessObj.totalCount = (busObjName, whereCondStr, whereParamArry, grpByAttr, callBackFn,dbConn=null) => {
  var whereStr = whereCondStr?' WHERE ' + whereCondStr:'';
  var queryStr = null;
  if (grpByAttr)
    queryStr = "SELECT " + grpByAttr + " as category, COUNT(" + grpByAttr + ") as count FROM " + 
    busObjName.toLowerCase() + whereStr + " GROUP BY " + grpByAttr;
  else
    queryStr = "SELECT 'All' as category, COUNT(*) as count FROM " + busObjName.toLowerCase() + whereStr;
  whereParamArry = whereParamArry?whereParamArry:[];
  dbConn.query(queryStr, whereParamArry, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.length > 0) return callBackFn(null, data);
    return callBackFn({ kind: "not_found" }, null);
  });
};
BusinessObj.getPage = (busObjName, startIndex, pageSize, whereCondStr, whereParamArry, callBackFn,dbConn=null) => {
  var whereStr = whereCondStr?' WHERE ' + whereCondStr:'';
  var queryStr = "SELECT * FROM " + busObjName.toLowerCase() + whereStr + " limit ? , ?";
  whereParamArry = whereParamArry?whereParamArry:[];
  whereParamArry.push(Number(startIndex));
  whereParamArry.push(Number(pageSize));
  dbConn.query(queryStr, whereParamArry, (err, data) => {
    if (err) {return callBackFn({errors:[JSON.stringify(err)]}, null);}
    if (data.length > 0) return callBackFn(null, data);
    return callBackFn({ kind: "not_found" }, null);
  });
};

BusinessObj.getAll = (busObjName, callBackFn,dbConn=null) => {
  dbConn.query("SELECT * FROM " + busObjName.toLowerCase(), (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null); 
    return callBackFn(null, data);
  });
};
BusinessObj.update = (busObjName, updateAttrs, attrMetaInfos, businessObj, callBackFn,dbConn=null) => {
  var queryStr = "UPDATE " + busObjName.toLowerCase() + " ";
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
  dbConn.query(queryStr, paramValues.concat(whereParamValues), (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    return callBackFn(null, businessObj);
  });
}
BusinessObj.delete = (busObjName, keyNameVals, callBackFn,dbConn=null) => {
  var queryStr = "DELETE FROM " + busObjName.toLowerCase() + " ";
  var paramValues = [];
  var whereClauseStr = "WHERE ";
  for (var i in keyNameVals) {
    if (whereClauseStr.lastIndexOf("? ") > 0) whereClauseStr += " AND ";
    whereClauseStr += keyNameVals[i].name + " = ? ";
    paramValues.push(keyNameVals[i].value);
  }
  queryStr += whereClauseStr;
  dbConn.query(queryStr, paramValues, (err, data) => {
    if (err) return callBackFn({errors:[JSON.stringify(err)]}, null);
    if (data.affectedRows == 0) return callBackFn({ kind: "not_found" }, null);
    return callBackFn(null, data);
  });
};
BusinessObj.nestedCreate = (busObjName, businessObjs, currItem, totalItems, errors, callBackFn,dbConn=null) => {
  if (BusinessObjFactory.hasOverrideNestedCreate(busObjName))
    return BusinessObjFactory.nestedCreate(busObjName, businessObjs, currItem, totalItems, errors, callBackFn);
  else
    return BusinessObj.nestedCreateDefault(busObjName, businessObjs, currItem, totalItems, errors, callBackFn);
}
BusinessObj.nestedCreateDefault = (busObjName, businessObjs, currItem, totalItems, errors, callBackFn,dbConn=null) => {
  if (currItem < totalItems && errors.length == 0) {
    dbConn.query("INSERT INTO " + busObjName.toLowerCase() + " SET ?", businessObjs[currItem], (err, data) => {
      if (err) return errors.push(JSON.stringify(err));
      BusinessObj.nestedCreateDefault(busObjName, businessObjs, ++currItem, totalItems, errors, callBackFn);
    });
  }
  else if (currItem == totalItems) {
    if (errors.length > 0) return callBackFn({errors:errors}, null);
    return callBackFn(null, {message:'Successfully Completed BusinessObj.nestedCreate for ' + busObjName});
  }
}
BusinessObj.nestedValidate = (busObjName, businessObjs, currItem, totalItems, withKey, errorMessages, callBackFn,dbConn=null) => {
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
BusinessObj.getObj = (busObjName, busObj) => {
  var busObjOut = {};
  var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
  for (var i in attrMetaInfos) {
    var attrNm = attrMetaInfos[i].name;
    busObjOut[attrNm] = busObj[attrNm]?busObj[attrNm]:null;
  }
  return busObjOut;
}
module.exports = BusinessObj;