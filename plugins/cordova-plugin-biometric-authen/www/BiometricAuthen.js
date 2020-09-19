var exec = require('cordova/exec');

exports.isAvailable = function (success, error) {
    exec(success, error, 'BiometricAuthen', 'isAvailable');
};

exports.isBioStateChanged = function (success, error) {
    exec(success, error, 'BiometricAuthen', 'isBioStateChanged');
};

exports.setBioState = function (success, error) {
    exec(success, error, 'BiometricAuthen', 'setBioState');
};

exports.activate = function (clientInfo, success, error) {
    exec(success, error, 'BiometricAuthen', 'activate', [clientInfo]);
};

exports.sign = function (clientInfo, success, error) {
    exec(success, error, 'BiometricAuthen', 'sign', [clientInfo]);
};

exports.authenticate = function (clientInfo, success, error) {
    exec(success, error, 'BiometricAuthen', 'authenticate', [clientInfo]);
};

exports.deactivate = function (clientInfo, success, error) {
    exec(success, error, 'BiometricAuthen', 'deactivate', [clientInfo]);
};
