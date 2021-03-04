import { Constants } from "./Constants";

export class DateUtils {
    public static toDispDate(dateIn) {
        var dispDate;
        var year = dateIn.substring(0,dateIn.indexOf("-"));
        var mon = dateIn.substring(dateIn.indexOf("-") + 1, dateIn.lastIndexOf("-"));
        var day = dateIn.substring(dateIn.lastIndexOf("-")+1);
        dispDate = day + "-" + Constants.monthNumToTxts[mon] + "-" + year;
        return dispDate;
    }
    public static getDispDate() {
        var currDate = new Date();
        var year = currDate.getFullYear().toString();
        var temp = (currDate.getMonth()+1).toString();
        var month = temp.length==1?'0'+temp:temp;
        var monthStr = Constants.monthNumToTxts[month];
        temp = currDate.getDate().toString();
        var day = temp.length==1?'0'+temp:temp;
        return day + "-" + monthStr + "-" + year;
    }
    public static toDbDate(dateIn) {
        var dbDate;
        var year = dateIn.substring(0,dateIn.indexOf("-"));
        var mon = dateIn.substring(dateIn.indexOf("-") + 1, dateIn.lastIndexOf("-"));
        var day = dateIn.substring(dateIn.lastIndexOf("-")+1);
        dbDate = day + "-" + Constants.monthTxtToNums[mon] + "-" + year;
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
}