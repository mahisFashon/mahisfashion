
var LookUps = {};

LookUps.modes = {'CS':'Cash','CC':'Credit Card','EP':'ePayments'};
LookUps.modeTypes = {'CS':{'CS':'Cash'},
    'CC':{'MC':'Master Card','VC':'VISA','AM':'AMEX'},
    'EP':{'GP':'Google Pay','AP':'Amazon Pay','PT':'PayTM','UP':'UPI'}};

module.exports = LookUps;