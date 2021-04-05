const BusinessObj = require('../models/BusinessObj');
const BusinessObjFactory = require('../models/BusinessObjFactory');
const mySqlDb = require("../models/mysqldb.js");

var BusinessObjController = {};

BusinessObjController.getBusinessObjName = (req) => {
    var idx = req.originalUrl.indexOf("/",1);
    if (idx < 0) idx = req.originalUrl.length;
    return req.originalUrl.substring(1,idx);
}
BusinessObjController.create = (req, res) => {
    if (!req.body) return res.status(400).send({ errors:["Request Object Content Cannot be Empty!"] });
    //var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req).toLowerCase();
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag) return res.status(400).send({errors: errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        if (attrMetaInfos[i].dataType == 'Auto') continue;
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }    
        BusinessObj.create(busObjName, businessObj, (err, data) => {
            dbConn.release();
            if (err){console.log(err); return res.status(500).send({
                errors:["Error occurred while creating business obj",JSON.stringify(err)]});
            }
            return res.status(200).send(data);
        },dbConn);
    });
};
BusinessObjController.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ errors:["Request Object Content Cannot be Empty!"] });
    }
    //var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag) return res.status(400).send({errors:errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }    
        BusinessObj.update(busObjName, null, attrMetaInfos, businessObj, (err, data) => {
            dbConn.release();
            if (err){console.log(err); return res.status(500).send({
                errors:["Error occurred while creating business obj",JSON.stringify(err)]});
            }
            return res.status(200).send(data);
        }, dbConn);
    });
};
BusinessObjController.validate = (req, attrMetaInfos, errorMessages) => {
      // Validate request
    var errorFlag = false;
    for (var i in attrMetaInfos) {
        var attrMetaData = attrMetaInfos[i];
        if (attrMetaData.required && !req.body[attrMetaData.name] && attrMetaData.dataType!='Auto') {
            errorFlag = true;
            errorMessages.push(attrMetaData.name + " is required!");        
        }
        else if (req.body[attrMetaData.name]) { 
            var attrVal = req.body[attrMetaData.name].toString();
            if (!BusinessObjFactory.validateAttribute(attrMetaData.name,attrVal,attrMetaData)){
                errorFlag = true;
                errorMessages.push(" Invalid Value for: " + attrMetaData.name);
            }
        }
    }
    return errorFlag;
};
BusinessObjController.getAll = (req, res) => {
    //var time1 = Date.now();
    if (!req.body) return res.status(400).send({errors:["Request Object Content Cannot be Empty!"]});
    var busObjName = BusinessObjController.getBusinessObjName(req);
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.getAll(busObjName, (err, data) => {
            dbConn.release();
            if (err) {console.log(err); return res.status(500).send({
                errors:["Error occurred while creating business obj",JSON.stringify(err)]});
            }
            return res.status(200).send(data);
        }, dbConn);        
    });
};
BusinessObjController.search = (req, res) => {
    //var time1 = Date.now();
    if (!req.params || !req.params.searchStr)
        return res.status(400).send({ errors:["Request Object Content Cannot be Empty!"] });
    var busObjName = BusinessObjController.getBusinessObjName(req);    
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var paramNmArry = [];
    for (var i in attrMetaInfos) {
        var attrMetaData = attrMetaInfos[i];
        if (attrMetaData.srchBy) 
            paramNmArry.push(attrMetaData.name);
    }
    var paramValArry = [];
    //console.log(req.params.searchStr);
    paramValArry.push(req.params.searchStr);
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.search(busObjName,paramNmArry,paramValArry, (err, data) => {
            dbConn.release();
            if (err) {console.log(err); return res.status(500).send({
                errors:["Error occurred while searching "+busObjName,JSON.stringify(err)]});
            }
            else res.status(200).send(data);
        },dbConn);        
    });
};
BusinessObjController.totalCount = (req, res) => {
    var busObjName = BusinessObjController.getBusinessObjName(req);
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.totalCount(busObjName, null, null, null, (err, data) => {
            dbConn.release();
            if (err){console.log(err); res.status(500).send({ 
                errors:["Error occurred in totalCount for "+busObjName,JSON.stringify(err)]});
            }
            else res.status(200).send(data);
        }, dbConn); 
    });
};
BusinessObjController.getPage = (req, res) => {
    //var time1 = Date.now();
    if (!req.params || !req.params.start || !req.params.pageSize) {
        return res.status(400).send({ errors:["Request Object start and pageSize Required!"]});
    }
    var busObjName = BusinessObjController.getBusinessObjName(req);    
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.getPage(busObjName,req.params.start, req.params.pageSize,null,null,(err, data) => {
            dbConn.release();
            if (err){console.log(err); return res.status(500).send({ 
                errors:["Error occurred in getPage for "+busObjName,JSON.stringify(err)]});
            }
            else  res.status(200).send(data);
        },dbConn); 
    });
};
BusinessObjController.searchBy = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ errors:["BusinessObjController.searchBy - Request Object Content Cannot be Empty!"] });
    }
    var busObjName = BusinessObjController.getBusinessObjName(req);
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.searchAdvanced(busObjName,req.body,(err,data) => {
            dbConn.release();
            if (err){console.log(err); return res.status(500).send({
                errors:["Error occurred while searching "+busObjName,JSON.stringify(err)]
            });}
            return res.status(200).send(data);
        },dbConn); 
    });    
}
BusinessObjController.delete = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ errors:["BusinessObjController.delete - Request Object Content Cannot be Empty!"] });
    }
    //var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag || errorMessages.length > 0)  
        return res.status(400).send({errors:errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    mySqlDb.getConnFromPool((err,dbConn) => {
        if(err) { console.log(err); return res.status(500).send({
            errors:["Error occurred while getting connection from pool",JSON.stringify(err)]});
        }
        BusinessObj.delete(busObjName, attrMetaInfos, businessObj, (err, data) => {
            dbConn.release();
            if (err){console.log(err); return res.status(500).send({
                errors:["Error occurred while deleting "+busObjName,JSON.stringify(err)]
            });}
            return res.status(200).send(data);
        },dbConn);
    });
};
module.exports = BusinessObjController; 
