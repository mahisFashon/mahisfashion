export class Constants {
    public static apiBaseURL = "http://" + window.location.hostname + ":3111/";
    public static validPatterns = {
        'AB':"([A-Za-z]+([ '-][a-zA-Z]+)*)+",
        'AN':"([A-Za-z0-9]+[ ,.'-A-Za-z0-9]*)+",
        'NU':"[+-]{0,1}[0-9]*[.]{0,1}[0-9]+",
        'POSNU':"[0-9]*[.]{0,1}[0-9]+",
        'POSINT':"[0-9]+",
        'INT':"[+-]{0,1}[0-9]+",
        'PH':"([+][0-9]{1,3}){0,1}([0-9]+[ ]{0,1}[0-9]+){0,4}",
        'DT':"(((([0-1]?[0-9])|([2][0-9]))-(([F][E][B]))-[0-9]{4})|" +
            "((([0-2]?[0-9])|([3][0]))[-](([A][P][R])|([J][U][N])|([S][E][P])|([N][O][V]))[-][0-9]{4})|" +
            "((([0-2]?[0-9])|([3][0-1]))-(([A][U][G])|([D][E][C])|([J][A][N])|([J][U][L])|([M][A][RY])|([O][C][T]))-[0-9]{4}))"
    }
    public static monthTxtToNums = {'JAN':'01','FEB':'02','MAR':'03','APR':'04','MAY':'05','JUN':'06','JUL':'07','AUG':'08','SEP':'09','OCT':'10','NOV':'11','DEC':'12'};
    public static monthNumToTxts = {'01':'JAN','02':'FEB','03':'MAR','04':'APR','05':'MAY','06':'JUN','07':'JUL','08':'AUG','09':'SEP','10':'OCT','11':'NOV','12':'DEC'};
}