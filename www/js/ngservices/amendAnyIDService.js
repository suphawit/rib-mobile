angular.module('service.amendAnyID', [])
.service('amendAnyIDService', function(invokeService,kkconst,mainSession,$translate) {
    this.verifyAmendAnyIDResponse = {};
    this.confirmAmendAnyIDResponse = {};

    this.setVerifyAmendAnyIDResponse = function (data) {
        this.dataVerifyAmendAnyIDResponse = data;
    }

    this.getVerifyAmendAnyIDResponse = function () {
        return JSON.parse(JSON.stringify(this.dataVerifyAmendAnyIDResponse));
    }

    this.setConfirmAmendAnyIDResponse = function (data){
        this.confirmAmendAnyIDResponse = data;
    }

    this.getConfirmAmendAnyIDResponse = function () {
        return JSON.parse(JSON.stringify(this.confirmAmendAnyIDResponse));
    }

    this.requestOTP = function (data,callback) {
        var request = {
            params: {
                actionOTP: 'amend_anyid',
                language: $translate.use(),
                verifyTransactionId: data.verifyTransactionId
            },
            actionCode: 'ACT_REQUEST_OTP',
            procedure: 'requestOTPWithLoginProcedure',
        }
        request.onSuccess = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            if (kkconst.success === resultCode) {
                callback(resultObj.responseStatus, resultObj);
            } else {
                callback(resultObj.responseStatus || kkconst.unknown);
            }
        };

        request.onFailure = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            callback(resultObj.responseStatus || kkconst.unknown);
        };

        invokeService.executeInvokePublicService(request, { adapter: 'otpAdapter' });

    };

    this.verifyTransactionAmendAnyID = function(dataVerify, callback){
        var request = {
            params: {
                anyIDType: dataVerify.anyIDType,
                anyIDValue: dataVerify.anyIDValue,
                fromAccountNo: dataVerify.fromAccountNo,
                toAccountName:dataVerify.toAccountName,
                toAccountNo: dataVerify.toAccountNo
            },
            actionCode: 'ACT_VERIFY_AMEND_ANYID',
            procedure: 'verifyTransactionAmendAnyIDProcedure'
        }

        request.onSuccess = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            if (kkconst.success === resultCode) {
                callback(resultObj.responseStatus, resultObj);
            } else {
                callback(resultObj.responseStatus || kkconst.unknown);
            }
        };
        request.onFailure = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            callback(resultObj.responseStatus || kkconst.unknown);
        };

        invokeService.executeInvokePublicService(request);
    }
    this.confirmAmendAnyIDProcedure = function(dataConfirm, callback){
        var request = {
            params: {
                referenceNO: dataConfirm.referenceNO,
                otp: dataConfirm.otp,
                tokenOTPForCAA: dataConfirm.tokenOTPForCAA,
                verifyTransactionId: dataConfirm.verifyTransactionId
            },
            actionCode: 'ACT_CONFIRM_AMEND_ANYID',
            procedure: 'confirmAmendAnyIDProcedure'
        }

        request.onSuccess = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            if (kkconst.success === resultCode) {
                callback(resultObj.responseStatus, resultObj);
            } else {
                callback(resultObj.responseStatus || kkconst.unknown);
            }
        };
        request.onFailure = function (result) {
            var resultObj = result.responseJSON.result;
            var resultCode = resultObj.responseStatus.responseCode;
            callback(resultObj.responseStatus || kkconst.unknown);
        };

        invokeService.executeInvokePublicService(request);
    }

});
