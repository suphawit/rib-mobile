
/* JavaScript content from js/plugins/ios/jailbreakdetection.js in folder common */

//var exec = require("cordova/exec");

var JailbreakDetection = function () {
    this.name = "JailbreakDetection";
};

JailbreakDetection.prototype.isJailbroken = function (successCallback, failureCallback) {
    cordova.exec(successCallback, failureCallback, "JailbreakDetection", "isJailbroken", []);
};
 var jailbreakdetection =  new JailbreakDetection();
//module.exports = new JailbreakDetection();
