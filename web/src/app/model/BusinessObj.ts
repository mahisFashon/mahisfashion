import { BusinessObjFactory } from './BusinessObjFactory';
import { Constants } from './Constants';
export class BusinessObj {
    public className : string;
    public indexInArray : number;
    public displayColumnNames = [];
    public attrMetaDataArry = [];
    public attributes = {};
    //Common parent class
    constructor() {
        this.className = 'BusinessObj';
    }
    getNewInstance() {
        return new BusinessObj();
    }
    setValues(businessObj) {
        if (businessObj == null) return;
        businessObj.indexInArry?this.indexInArray=businessObj.indexInArray:-1;
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
    getIdColumnValue() {
      return null;
    }
    setIdColumnValue(val) {
      return null;
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
                businessObj.setValues(retObjs[idx]);
                businessObj.indexInArray = businessObjs.length;
                businessObjs.push(businessObj);
              }
              result(null, businessObjs);
            }
            else {
              console.log("Error Occured" + this.responseText) ;
              result({'message':this.responseText}, null);
            }
          }
        }
        var pageUrl = Constants.apiBaseURL + this.className.toLowerCase() + 
        "/" + startRec + "/" + pageSize;
        xhttp.open("GET", pageUrl, false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(); 
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
    static buildBusObjsFromPageObjs(busObj, busObjs, pageObjs) {
      if (!pageObjs || !busObjs || !busObj) return;
      for (var i in pageObjs) {
        busObj = busObj.getNewInstance();
        if (!busObj) return;
        if (BusinessObj.setAttributesFromDbObj(busObj,pageObjs[i])) busObjs.push(busObj);
      }
    }
    static setAttributesFromDbObj(tgtBusObj, srcDbObj) {
      if (!tgtBusObj || !srcDbObj) return false;
      for (var i in srcDbObj) {
        tgtBusObj.attributes[i] = srcDbObj[i];
      }
      return true;
    }
    static setAttributes(tgtBusObj, srcBusObj) {
      if (!tgtBusObj || !srcBusObj) return false;
      if (srcBusObj.attributes) {
        for (var i in srcBusObj.attributes) {
          tgtBusObj.attributes[i] = srcBusObj.attributes[i];
        }
      }
    }
}