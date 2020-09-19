var exec = require('cordova/exec');

exports.openCamera = function (success, error, lang) {
    console.log('Cordova -> openCamera');
    exec(success, error, 'RibFaceRecog', 'openCamera', [lang]);
};

