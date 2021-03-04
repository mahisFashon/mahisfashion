import { Constants } from './Constants';
import { DateUtils } from './DateUtils';
import { LookUpValues } from './LookupValues';
export class BusinessObj {
  public className : string;
  public classDispNm : string;
  public indexInArray : number;
  public displayColumnNames = [];
  public attrMetaInfos = [];
  //public attributes = {};
  //Common parent class
  constructor() {
      this.className = 'BusinessObj';
      this.classDispNm = 'Business Object';
      this.init();
  }
  getNewInstance() {
      return new BusinessObj();
  }
  setValues(businessObj, dbObj) {
      if (businessObj == null) return;
      this.init();
      businessObj.indexInArry!=undefined?this.indexInArray=businessObj.indexInArray:-1;
      if (dbObj) BusinessObj.setAttributesFromDbObj(this,businessObj);
      else BusinessObj.setAttributes(this,businessObj);
  }
  getListDisplayColumns() {
      return this.displayColumnNames;
  }
  getCount(result) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var retObj = JSON.parse(this.responseText);
          result(null, retObj);
        }
        else {
          console.log("Error Occured" + this.responseText) ;
          result({'message':this.responseText}, null);
        }
      }
    }
    var pageUrl = Constants.apiBaseURL + this.className.toLowerCase() + "/count";
    xhttp.open("GET", pageUrl, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }
  getPageList(pageId, pageSize, result) {
    var xhttp = new XMLHttpRequest();
    var businessObjs = [];
    var startRec = 1;
    var getNewInstance = this.getNewInstance;
    if (pageId > 0) startRec = (pageId - 1) * pageSize;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var retObjs = JSON.parse(this.responseText);
          for ( var idx in retObjs) {
            var businessObj = getNewInstance();
            BusinessObj.setAttributesFromDbObj(businessObj,retObjs[idx]);
            businessObj.indexInArray = businessObjs.length;
            businessObjs.push(businessObj);
          }
          result(null, businessObjs);
        }
        else {
          var errorObj = JSON.parse(this.responseText);
          if (errorObj.message && errorObj.message.error && 
            errorObj.message.error.kind && errorObj.message.error.kind == "not_found") {
            return result(errorObj.message.error,null);
          }
          console.log("Error Occured" + this.responseText) ;
          return result({'message':this.responseText}, null);
        }
      }
    }
    var pageUrl = Constants.apiBaseURL + this.className.toLowerCase() + 
    "/" + startRec + "/" + pageSize;
    xhttp.open("GET", pageUrl, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(); 
  }
  getDialogActions() {
    return LookUpValues.getDialogActions(this.className);
  }
  resetSortedArray(businessObjs) {
      businessObjs.sort((a,b)=>{ 
        if (a['indexInArray'] > b['indexInArray']) return 1;
        else if (a['indexInArray'] < b['indexInArray']) return -1;
        else return 0;
      });
  }
  sortArray(businessObjs, sortColumn, order) {
      businessObjs.sort((a,b)=>{
        if ((order == 'A' && a[sortColumn] > b[sortColumn]) ||
            (order == 'D' && a[sortColumn] < b[sortColumn]))
          return 1;
        else if ((order == 'A' && a[sortColumn] < b[sortColumn]) ||
        (order == 'D' && a[sortColumn] > b[sortColumn]))
          return -1;
        else return 0;
      });
  }    
  setListDisplayColumns() {
    for (var i in this.attrMetaInfos) {
      if (this.attrMetaInfos[i].listDisp) {
        this.displayColumnNames.push({ colNm:this.attrMetaInfos[i].name,
            dispNm : this.attrMetaInfos[i].dispNm});
      }
      this[this.attrMetaInfos[i].name] = '';
    }
  }
  getIdColumnValue() {
    for (var i in this.attrMetaInfos) {
      if (this.attrMetaInfos[i].key) 
      return this[this.attrMetaInfos[i].name];
    }
    return null;
  }
  setIdColumnValue(val) {
    if(!val || val == null) return;
    for (var i in this.attrMetaInfos) {
      if (this.attrMetaInfos[i].key) 
      return this[this.attrMetaInfos[i].name] = val;
    }
  }
  getAttrMetaInfo(attrNm) {
    for (var i = 0; i < this.attrMetaInfos.length; i++) {
      if (this.attrMetaInfos[i].name == attrNm) return this.attrMetaInfos[i];      
    }
    return null;
  }
  init() {
    for (var i in this.attrMetaInfos) {
      var initVal = this.attrMetaInfos[i].initVal;
      this[this.attrMetaInfos[i].name] = initVal!=undefined?initVal:null;
    }
  }
  static buildBusObjsFromPageObjs(busObj, busObjs, pageObjs) {
    if (!pageObjs || !busObjs || !busObj) return;
    for (var i in pageObjs) {
      var busObjTemp = busObj.getNewInstance();
      if (!busObjTemp) return;
      if (BusinessObj.setAttributesFromDbObj(busObjTemp,pageObjs[i])) 
        busObjs.push(busObjTemp);
    }
  }
  static setAttributesFromDbObj(tgtBusObj, srcDbObj) {
    if (!tgtBusObj || !srcDbObj) return false;
    for (var i in tgtBusObj.attrMetaInfos) {
      var attrMetaInfo = tgtBusObj.attrMetaInfos[i];
      if (srcDbObj[attrMetaInfo.name]) {
        tgtBusObj[attrMetaInfo.name] = srcDbObj[attrMetaInfo.name];
        if (attrMetaInfo.validVal == 'DT') {
          tgtBusObj[attrMetaInfo.name] = DateUtils.toDispDate(tgtBusObj[attrMetaInfo.name]);
        }
        else if (attrMetaInfo.validVal == 'DTM') {
          tgtBusObj[attrMetaInfo.name] = DateUtils.toDispDateTime(tgtBusObj[attrMetaInfo.name]);
        }
      }
    }
    return true;
  }
  static setAttributes(tgtBusObj, srcBusObj) {
    if (!tgtBusObj || !srcBusObj) return false;
    if (srcBusObj) {
      for (var i in srcBusObj.attrMetaInfos) {
        var attrMetaInfo = srcBusObj.attrMetaInfos[i];
        tgtBusObj[attrMetaInfo.name] = srcBusObj[attrMetaInfo.name]!=undefined?srcBusObj[attrMetaInfo.name]:null;
      }
    }
  }
  static getAttributes(srcBusObj) {
    var busObj = {};
    for (var i in srcBusObj.attrMetaInfos) {
      var attrMetaInfo = srcBusObj.attrMetaInfos[i];
      busObj[attrMetaInfo.name] = srcBusObj[attrMetaInfo.name]!=undefined?srcBusObj[attrMetaInfo.name]:null;
    }
    return busObj;
  }
}