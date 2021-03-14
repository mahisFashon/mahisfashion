import { Constants } from "./Constants";

export class DateUtils {
    public static toDispDate(dateIn) {
        var dateObj = new Date(dateIn);
        if (dateObj.toString() == 'Invalid Date') return null;
        var year = dateObj.getFullYear().toString();
        var mon = (dateObj.getMonth()+1).toString();
        mon = mon.length==1?"0"+mon:mon;
        var day = dateObj.getDate().toString();
        day = day.length==1?"0"+day:day;
        var dispDate = day + "-" + Constants.monthNumToTxts[mon] + "-" + year;
        return dispDate;
    }
    public static getDispDate(dateIn?) {
        var currDate = dateIn?dateIn:new Date();
        var year = currDate.getFullYear().toString();
        var temp = (currDate.getMonth()+1).toString();
        var month = temp.length==1?'0'+temp:temp;
        var monthStr = Constants.monthNumToTxts[month];
        temp = currDate.getDate().toString();
        var day = temp.length==1?'0'+temp:temp;
        return day + "-" + monthStr + "-" + year;
    }
    public static toDbDate(dateIn) {
        var dateObj = new Date(dateIn);
        if (dateObj.toString() == 'Invalid Date') return null;
        return this.dateToDbDate(dateObj);
    }
    public static dateToDbDate(dateObj:Date) {
        var year = dateObj.getFullYear().toString();
        var mon = (dateObj.getMonth()+1).toString();
        mon = mon.length==1?"0"+mon:mon;
        var day = dateObj.getDate().toString();
        day = day.length==1?"0"+day:day;        
        var dbDate = year + "-" + mon + "-" + day;
        return dbDate;
    }
    public static toDispDateTime(dateTimeIn) {
        var dateStr = dateTimeIn.substring(0,dateTimeIn.indexOf(" "));
        return DateUtils.toDispDate(dateStr) + " " + DateUtils.toDispTime(dateTimeIn.substring(dateTimeIn.indexOf(" ")));
    }
    public static toDispTime(timeIn) {
        var hr = timeIn.substring(0,timeIn.indexOf(":"));
        var min = timeIn.substring(timeIn.indexOf(":")+1,timeIn.lastIndexOf(":"));
        if (parseInt(hr) > 11) {
            hr = (parseInt(hr)-12).toString().padStart(2,'0');
            return hr + ":" + min + " PM";
        }
        return hr + ":" + min + " AM";
    }
    public static getMthLastDay(yearIn,monIn) {
        if(monIn < 1 || monIn > 12) return 0;
        if(monIn==1||monIn==3||monIn==5||monIn==7||monIn==8||monIn==10||monIn==12) return 31;
        if(monIn==2) return DateUtils.isLeapYear(yearIn)?29:28;
        return 30;
    }
    public static isLeapYear(yearIn) {
        return ((yearIn%400==0) || (yearIn%4==0 && yearIn%100!=0))?true:false;
    }
}