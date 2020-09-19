//var exec = require('cordova/exec');

var RootDetection = function () {
    this.name = "RootDetection";
};

RootDetection.prototype.isDeviceRooted = function(success, error) {
	cordova.exec(success, error, "RootDetection", "isDeviceRooted", []);
};

var rootdetection = new RootDetection();
