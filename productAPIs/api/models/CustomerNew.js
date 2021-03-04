const mysqlDb = require("./mysqldb.js");

// constructor
var Customer = {};
Customer.getAttrMetaInfos = () => {
    var attrMetaInfos = [];
    attrMetaInfos.push({name:'id',dataType:'Auto',required:true,validVal:'NA',srchBy:false,key:true});
    attrMetaInfos.push({name:'firstName',dataType:'String',required:true,validVal:'AB',srchBy:true,key:false});
    attrMetaInfos.push({name:'lastName',dataType:'String',required:true,validVal:'AB',srchBy:true,key:false});
    attrMetaInfos.push({name:'phone',dataType:'String',required:true,validVal:'PH',srchBy:true,key:false});    
    attrMetaInfos.push({name:'email',dataType:'String',required:false,validVal:'EM',srchBy:true,key:false});
    attrMetaInfos.push({name:'city',dataType:'String',required:false,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'state',dataType:'String',required:false,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'country',dataType:'String',required:false,validVal:'AB',srchBy:false,key:false});
    attrMetaInfos.push({name:'addressLine1',dataType:'String',required:false,validVal:'AN',srchBy:false,key:false});
    attrMetaInfos.push({name:'addressLine2',dataType:'String',required:false,validVal:'AN',srchBy:false,key:false});
    attrMetaInfos.push({name:'postalCode',dataType:'String',required:false,validVal:'AN',srchBy:false,key:false});
    return attrMetaInfos;
}

module.exports = Customer; 
