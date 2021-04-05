var OrderPaymentDetails = {};

OrderPaymentDetails.getAttrMetaInfos = () => {
  var attrMetaInfos = [];
  attrMetaInfos.push({name:'orderId',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:true,key:true});
  attrMetaInfos.push({name:'id',dataType:'Number',required:true,validVal:'INTGTZ',srchBy:false,key:true});
  attrMetaInfos.push({name:'mode',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});
  attrMetaInfos.push({name:'modeType',dataType:'String',required:true,validVal:'AB',srchBy:false,key:false});    
  attrMetaInfos.push({name:'modeTypeId',dataType:'String',required:true,validVal:'AN',srchBy:false,key:false});
  attrMetaInfos.push({name:'txnRefNo',dataType:'String',required:true,validVal:'AN',srchBy:false,key:false});
  attrMetaInfos.push({name:'amount',dataType:'Number',required:true,validVal:'NUGTZ',srchBy:false,key:false});
  return attrMetaInfos;
}

module.exports = OrderPaymentDetails; 
