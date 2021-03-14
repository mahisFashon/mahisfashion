var fs = require('fs');
function stripQuotes(word) {
  var outWord = null;
  if (word!= null) {
    if(word.substring(0,1) == "\"") {
      outWord = word.substring(1);
      if(outWord.substring(outWord.length-1) == "\"") 
        outWord = outWord.substring(0,outWord.length-1);
      return outWord;
    }
  }
  return word;
}
function csvToJSON(csvFile, callBackFn) {
  if (!csvFile) return null;
  fs.readFile(csvFile,(err,data)=>{
    if(err) {
      console.log("Error Reading File " + csvFile);
      return callBackFn({error:"Error Reading File " + csvFile},null);
    }
    var lineCount = 0;
    var columns = [];
    var outData = [];
    var dataObj = {};
    var word = '';
    var currAttr = 0;
    for(var i = 0; i < data.length; i++) {
      if (data[i] == 13 || data[i] == 10 ) {
        // New line
        if(data[i] == 13 && data[i+1] == 10) ++i;
        if (lineCount == 0) columns.push(stripQuotes(word));
        else if (lineCount > 0) dataObj[columns[currAttr]] = stripQuotes(word);
        lineCount ++;
        currAttr = 0; word = '';
        if(lineCount > 1) outData.push(dataObj);
        dataObj = {};        
      }
      else {
        if (data[i] != 44) word = word + String.fromCharCode(data[i]);
        else {
          // Found word
          if (lineCount == 0) {
            columns.push(stripQuotes(word));
          }
          else {
            dataObj[columns[currAttr]] = stripQuotes(word);
            currAttr++;
          }
          word = '';
        }
      }
    }
    //console.log(outData);
    return callBackFn(null,outData);
  });
}
module.exports = csvToJSON;
//csvToJSON('product.csv');