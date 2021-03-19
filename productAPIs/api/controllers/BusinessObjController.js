const BusinessObj = require('../models/BusinessObj');
const BusinessObjFactory = require('../models/BusinessObjFactory');
const Utils = require('../models/Utils');

var BusinessObjController = {};

BusinessObjController.getBusinessObjName = (req) => {
    var idx = req.originalUrl.indexOf("/",1);
    if (idx < 0) idx = req.originalUrl.length;
    return req.originalUrl.substring(1,idx);
}
// var time1 = Date.now();
// var time2 = Date.now();
// console.log("BusinessObj.search Time Taken : " + (time2-time1).toString() + ' milliseconds');

BusinessObjController.create = (req, res) => {
    if (!req.body) return res.status(400).send({ errors:["Request Object Content Cannot be Empty!"] });
    var time1 = Date.now();
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
    BusinessObj.create(busObjName, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            errors:["Error occurred while creating business obj",JSON.stringify(err)]
        });
        console.log("BusinessObjController.Create Time Taken to create " + 
        busObjName + " : " + (Date.now()-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
BusinessObjController.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ errors:["Request Object Content Cannot be Empty!"] });
    }
    var time1 = Date.now();
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
    BusinessObj.update(busObjName, null, attrMetaInfos, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            errors:["Error occurred while creating business obj",JSON.stringify(err)]
        });
        console.log("BusinessObjController.Update Time Taken to update " + 
        busObjName + " : " + (Date.now()-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
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
    var time1 = Date.now();
    if (!req.body) return res.status(400).send({errors:["Request Object Content Cannot be Empty!"]});
    var busObjName = BusinessObjController.getBusinessObjName(req);
    BusinessObj.getAll(busObjName, (err, data) => {
        if (err) return res.status(500).send({
            errors:["Error occurred while creating business obj",JSON.stringify(err)]
        });
        console.log("BusinessObjController.getAll - " + busObjName + " - Time Taken : " + 
        (Date.now()-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
BusinessObjController.search = (req, res) => {
    var time1 = Date.now();
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
    console.log(req.params.searchStr);
    paramValArry.push(req.params.searchStr);
    BusinessObj.search(busObjName,paramNmArry,paramValArry, (err, data) => {
        if (err) return res.status(500).send({
            errors:["Error occurred while searching "+busObjName,JSON.stringify(err)]
        });
        else {
            console.log("BusinessObjController.search - " + busObjName + " - Time Taken : " + 
            (Date.now()-time1).toString() + ' milliseconds');
            res.status(200).send(data);
        }
    });
};
BusinessObjController.totalCount = (req, res) => {
    var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    BusinessObj.totalCount(busObjName, null, null, (err, data) => {
    if (err) res.status(500).send({ 
        errors:["Error occurred in totalCount for "+busObjName,JSON.stringify(err)]
    });
    else {
        console.log("BusinessObjController.totalCount - " + busObjName + " - Time Taken : " + 
        (Date.now()-time1).toString() + ' milliseconds');
        res.status(200).send(data);
    }
  });
};
BusinessObjController.getPage = (req, res) => {
    var time1 = Date.now();
    if (!req.params || !req.params.start || !req.params.pageSize) {
        return res.status(400).send({ errors:["Request Object start and pageSize Required!"]});
    }
    var busObjName = BusinessObjController.getBusinessObjName(req);    
    
    BusinessObj.getPage(busObjName,req.params.start, req.params.pageSize,null,null,(err, data) => {
    if (err) return res.status(500).send({ 
        errors:["Error occurred in getPage for "+busObjName,JSON.stringify(err)]
    });
    else  {
        console.log("BusinessObjController.getPage - " + busObjName + " - Time Taken : " + 
        (Date.now()-time1).toString() + ' milliseconds');
        res.status(200).send(data);
    }
  });
};
BusinessObjController.delete = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ errors:["BusinessObjController.delete - Request Object Content Cannot be Empty!"] });
    }
    var time1 = Date.now();
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
    BusinessObj.delete(busObjName, attrMetaInfos, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            errors:["Error occurred while deleting "+busObjName,JSON.stringify(err)]
        });
        console.log("BusinessObjController.Delete Time Taken to delete " + 
        busObjName + " : " + (Date.now()-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
module.exports = BusinessObjController; 
