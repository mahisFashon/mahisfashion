const BusinessObj = require('../models/BusinessObj');
const BusinessObjFactory = require('../models/BusinessObjFactory');

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
    if (!req.body) {
        return res.status(400).send({ message: "Request Object Content Cannot be Empty!" });
    }
    var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag) return res.status(400).send({message: errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        if (attrMetaInfos[i].dataType == 'Auto') continue;
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    BusinessObj.create(busObjName, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            message: "Error occurred while creating business obj",
            error: err,
        });
        var time2 = Date.now();
        console.log("BusinessObjController.Create Time Taken to create " + busObjName + " : " + (time2-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
BusinessObjController.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Request Object Content Cannot be Empty!" });
    }
    var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag) return res.status(400).send({message: errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    BusinessObj.update(busObjName, null, attrMetaInfos, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            message: "Error occurred while creating business obj",
            error: err,
        });
        var time2 = Date.now();
        console.log("BusinessObjController.Update Time Taken to update " + busObjName + " : " + (time2-time1).toString() + ' milliseconds');
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
    console.log("entered get all");
    var time1 = Date.now();
    if (!req.body) {
        return res.status(400).send({ message: "Request Object Content Cannot be Empty!" });
    }
    var busObjName = BusinessObjController.getBusinessObjName(req);
    console.log("entered get all", busObjName);
    BusinessObj.getAll(busObjName, (err, data) => {
        if (err) return res.status(500).send({
            message: "Error occurred while getting all " + busObjName,
            error: err,
        });
        var time2 = Date.now();
        console.log("BusinessObjController.getAll - " + busObjName + " - Time Taken : " + 
        (time2-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
BusinessObjController.search = (req, res) => {
    var time1 = Date.now();
    if (!req.params || !req.params.searchStr) {
        return res.status(400).send({ message: "Request Object Content Cannot be Empty!" });
    }
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
            message: err.message || "Some error occurred while getting customer"
        });
        else {
            var time2 = Date.now();
            console.log("BusinessObjController.search - " + busObjName + " - Time Taken : " + 
            (time2-time1).toString() + ' milliseconds');
            res.status(200).send(data);
        }
    });
};
BusinessObjController.totalCount = (req, res) => {
    var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);        
    BusinessObj.totalCount(busObjName, (err, data) => {
    if (err) res.status(500).send({ message: {
            message: "From BusinessObjController.totalCount Some error occurred",
            error:err
        }
    });
    else {
        var time2 = Date.now();
        console.log("BusinessObjController.totalCount - " + busObjName + " - Time Taken : " + 
        (time2-time1).toString() + ' milliseconds');
        res.status(200).send(data);
    }
  });
};
BusinessObjController.getPage = (req, res) => {
    var time1 = Date.now();
    if (!req.params || !req.params.start || !req.params.pageSize) {
        return res.status(400).send({ message: "Request Object start and pageSize!" });
    }
    var busObjName = BusinessObjController.getBusinessObjName(req);    
    
    BusinessObj.getPage(busObjName,req.params.start, req.params.pageSize, (err, data) => {
    if (err) return res.status(500).send({ message: {
            message: "From BusinessObjController.getPage Some error occurred",
            error:err
        }
    });
    else  {
        var time2 = Date.now();
        console.log("BusinessObjController.getPage - " + busObjName + " - Time Taken : " + 
        (time2-time1).toString() + ' milliseconds');
        res.status(200).send(data);
    }
  });
};
BusinessObjController.delete = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Request Object Content Cannot be Empty!" });
    }
    var time1 = Date.now();
    var busObjName = BusinessObjController.getBusinessObjName(req);
    var attrMetaInfos = BusinessObjFactory.getAttrMetaInfos(busObjName);
    var errorMessages = [];
    var errorFlag = BusinessObjController.validate(req, attrMetaInfos, errorMessages);
    if (errorFlag) return res.status(400).send({message: errorMessages});
  
    // Create the business object as per meta data
    var businessObj = {};
    for (var i in attrMetaInfos) {
        businessObj[attrMetaInfos[i].name] = 
        req.body[attrMetaInfos[i].name]?req.body[attrMetaInfos[i].name]:null;
    }
    BusinessObj.delete(busObjName, attrMetaInfos, businessObj, (err, data) => {
        if (err) return res.status(500).send({
            message: "Error occurred while creating business obj",
            error: err,
        });
        var time2 = Date.now();
        console.log("BusinessObjController.Delete Time Taken to delete " + busObjName + " : " + (time2-time1).toString() + ' milliseconds');
        return res.status(200).send(data);
    });
};
module.exports = BusinessObjController; 
