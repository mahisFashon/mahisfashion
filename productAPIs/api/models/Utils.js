
var Utils = {};

Utils.formatMessage = (message,paramArray) => {
    var outMessage = message;
    for (var i in paramArray) {
        outMessage = outMessage.replace("%%" + (Number(i)+1), paramArray[i]);
    }
    return outMessage;
}

module.exports = Utils;