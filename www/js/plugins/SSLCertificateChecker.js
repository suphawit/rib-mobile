"use strict";

function SSLCertificateChecker() {
}

SSLCertificateChecker.prototype.check = function (successCallback, errorCallback, serverURL, allowedSHA1FingerprintOrArray, allowedSHA1FingerprintAlt) {
  if (typeof errorCallback != "function") {
    return
  }

  if (typeof successCallback != "function") {
    return
  }
  // if an array is not passed, transform the input into one
  var fpArr = [];
  if (allowedSHA1FingerprintOrArray !== undefined) {
      if (typeof allowedSHA1FingerprintOrArray == "string") {
          fpArr.push(allowedSHA1FingerprintOrArray);
      } else {
          fpArr = allowedSHA1FingerprintOrArray.slice(0);
      }
  }
  if (allowedSHA1FingerprintAlt !== undefined) {
      fpArr.push(allowedSHA1FingerprintAlt);
  }
  cordova.exec(successCallback, errorCallback, "SSLCertificateChecker", "check", [serverURL, false, fpArr]);
};

SSLCertificateChecker.prototype.checkInCertChain = function (successCallback, errorCallback, serverURL, allowedSHA1FingerprintOrArray, allowedSHA1FingerprintAlt) {
  if (typeof errorCallback != "function") {
    return;
  }
  errorCallback("This function has been removed in versions higher than 4.0.0 because it's considered too insecure.");
  /*
  if (typeof successCallback != "function") {
    return
  }
  // if an array is not passed, transform the input into one
  var fpArr = [];
  if (allowedSHA1FingerprintOrArray !== undefined) {
    if (typeof allowedSHA1FingerprintOrArray == "string") {
      fpArr.push(allowedSHA1FingerprintOrArray);
    } else {
      fpArr = allowedSHA1FingerprintOrArray.slice(0);
    }
  }
  if (allowedSHA1FingerprintAlt !== undefined) {
    fpArr.push(allowedSHA1FingerprintAlt);
  }
  cordova.exec(successCallback, errorCallback, "SSLCertificateChecker", "check", [serverURL, true, fpArr]);
  */
};


//module.exports = sslCertificateChecker;

