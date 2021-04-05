import { Constants } from './Constants';
import { Utils } from './Utils';
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
      var apiUrl = Constants.apiBaseURL + this.className.toLowerCase() + "/count";
      Utils.callAPI('GET',apiUrl,false,null,(err,data)=>{
        if(err) return result(JSON.parse(err),null);
        return result(null,JSON.parse(data));
      });
    }
    getIdColumnValue() {
      return null;
    }
    setIdColumnValue(val) {
      return null;
    }
    getPageList(pageId, pageSize, result) {
      var startRec = (pageId > 0)?(pageId - 1) * pageSize:1;
      var apiUrl = Constants.apiBaseURL + this.className.toLowerCase() + 
      "/" + startRec + "/" + pageSize;
      Utils.callAPI('GET',apiUrl,false,null,(err,data)=>{
        if(err) {
          console.log("Error Occured" + err) ;
          return result(JSON.parse(err), null);
        }
        var retObjs = JSON.parse(data);
        var businessObjs = [];
        for ( var idx in retObjs) {
          var businessObj = this.getNewInstance();
          businessObj.setValues(retObjs[idx]);
          businessObj.indexInArray = businessObjs.length;
          businessObjs.push(businessObj);
        }
        return result(null, businessObjs);        
      });
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