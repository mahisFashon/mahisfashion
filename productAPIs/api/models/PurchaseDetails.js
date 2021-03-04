var PurchaseDetails = {};
PurchaseDetails.getAttrMetaInfos = () => {
    var attrMetaInfos = [];
    attrMetaInfos.push({name:'billId',dataType:'String',required:true,validVal:'AN',srchBy:false,key:true});
    attrMetaInfos.push({name:'dealerId',dataType:'Number',required:true,validVal:'NU',srchBy:true,key:true});
    attrMetaInfos.push({name:'purchaseDate',dataType:'String',required:true,validVal:'DT',srchBy:true,key:false});
    attrMetaInfos.push({name:'itemQty',dataType:'String',required:true,validVal:'NU',srchBy:false,key:false});    
    attrMetaInfos.push({name:'billAmt',dataType:'String',required:true,validVal:'NU',srchBy:false,key:false});
    attrMetaInfos.push({name:'shipAmt',dataType:'String',required:true,validVal:'NU',srchBy:false,key:false});
    attrMetaInfos.push({name:'taxAmt',dataType:'String',required:true,validVal:'NU',srchBy:false,key:false});
    attrMetaInfos.push({name:'trackingId',dataType:'String',required:false,validVal:'AN',srchBy:false,key:false});
    attrMetaInfos.push({name:'shipDate',dataType:'String',required:false,validVal:'DT',srchBy:false,key:false});
    attrMetaInfos.push({name:'receivedDate',dataType:'String',required:false,validVal:'DT',srchBy:false,key:false});
    return attrMetaInfos;
}
module.exports = PurchaseDetails;