angular.module('ctrl.ndidAuthenConfirm', [])
.controller('NDIDAuthenConfirmCtrl', function($scope, ndidAuthenService, popupService, kkconst, $state, $timeout, subscriptionService) {
    
    // $scope.otp = {
    //     data: {},
    //     isDisabled: false,
    //     timer: null
    // };
    $scope.pin = '';
    $scope.suptitlePin = 'label.enterPIN';
    $scope.init = function(){
        // $scope.requestOTP();
    };

    // create virtual keyboard option
    // $scope.virtualKeyboardOTP = {
    //     option: {
    //         disableDotButton: true,
    //         isKeyboardActive: false,
    //         maxlength: 6,
    //         IsEditModel: true
    //     }
    // };

    // $scope.requestOTP = function(){
    //     var obj = {
    //         params: {
    //             prepareSubmitTransactionId: _tmpCache.prepareSubmitTransactionId
    //         },
    //         actionCode: 'REQUEST_OTP'
    //     };
    //
    //     ndidAuthenService.invokeService(obj).then(function(result){
    //         var reEnableOtp = true;
    //         $scope.otp.isDisabled = true;
    //         $scope.virtualKeyboardOTP.option.isKeyboardActive = true;
    //
    //         if(result.responseStatus.responseCode === kkconst.success) {
    //             $scope.otp.data = {
    //                 referenceNo: result.value.referenceNo,
    //                 mobileNumber: result.value.mobileNo,
    //                 otpTimeout: result.value.otpTimeout,
    //                 otp: ''
    //             };
    //
    //         }  else {
    //             if (result.responseStatus.responseCode === 'RIB-E-OTP006') {
    //                 reEnableOtp = false;
    //                 $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
    //             } else {
    //                 $scope.otp.isDisabled = false;
    //             }
    //
    //             popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
    //         }
    //
    //         if ($scope.otp.timer) {
    //             $timeout.cancel($scope.otp.timer);
    //             $scope.otp.timer = null;
    //         }
    //         if(reEnableOtp) {
    //             $scope.otp.timer = $timeout(function() {
    //                 $scope.otp.isDisabled = false;
    //             }, 15000);
    //         }
    //
    //     });
    // };

    // $scope.verifyOTP = function(){
    $scope.verifyPin = function(){
        // if(!$scope.otp.data.otp){
        //     popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.input.otp');
        // } else {
        ndidAuthenService.verifyPIN($scope.pin).then(function (result) {
            if (result.responseStatus.responseCode === kkconst.success) {
                var value = result.value;
                if (value.prepareSubmitTransactionType == kkconst.NDID_TRANSACTION_TYPE.RIBMOBILE_LOGINPIN_PIN) {
                    submitRequest(value.prepareSubmitTransactionId);
                } else {
                    $state.go(kkconst.ROUNTING.VERIFY_FACE_AUTHEN_NDID.STATE);
                }
            } else if (result.responseStatus.responseCode === 'RIB-E-OTP003') {
                // $scope.otp.data.otp = '';
                // $scope.otp.isDisabled = false;
                $scope.pin = '';
                popupService.showErrorPopupMessage('label.warning', result.responseStatus.responseCode);
            } else if(result.responseStatus.responseCode === 'RIB-E-LOG010') {
                showErrorAndLogout(result.responseStatus.errorMessage);
            } else {
                $scope.pin = '';
                popupService.showErrorPopupMessage('alert.title', result.responseStatus.errorMessage);
            }
        });
        // }
        
    };
    
    $scope.onClickBack = function(){
        $state.go(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE);
    };

    var submitRequest = function(prepareSubmitTransactionId){
        ndidAuthenService.submitRequest(prepareSubmitTransactionId).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                popupService.showErrorPopupMessage('label.sent','label.authenHasSent');
            }else {
                popupService.showErrorPopupMessage('title.fail',result.responseStatus.errorMessage);
            }

            $scope.gotoNDIDAuthenPage();
        });
    };

    $scope.dotpins = [];

    var maxPin = 6;

    $scope.$on('pin-code', function(event, args) {
        var pin = args.value;
        console.log("$broadcast('pin-code') value", pin);
        $scope.pin = pin;
        $scope.verifyPin();
        // $scope.closeConfirmPinModal();
    });

    $scope.initPin = function() {
        $scope.passcode = "";
        $scope.starcode = "";

        for(var i=0;i< maxPin;i++){
            $scope.dotpins[i] = 'circle-color-white';
        }
    };

    var _paintPin = function(cssColor){
        for(var i=0;i< maxPin;i++){
            if($scope.passcode.length === i){
                $scope.dotpins[i] = cssColor;
            }
        }
    };

    $scope.add = function(value) {
        _paintPin('circle-color-black');

        $scope.errorPinMessageEnable = false;
        $scope.errorPinMessage = '';
        if($scope.passcode.length < maxPin) {

            $scope.passcode = $scope.passcode + value;
            $scope.starcode = $scope.starcode + "*";
            if($scope.passcode.length === maxPin) {
                $scope.$broadcast('pin-code', { value: $scope.passcode });
                $timeout(function() {
                    $scope.initPin();
                }, 800);
            }
        }else{
            $timeout(function() {
                //do something
            }, 500);
        }
    };

    $scope.del = function() {
        $scope.dotpins[$scope.passcode.length-1] = 'circle-color-white';
        if($scope.passcode.length > 0) {
            $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
            $scope.starcode = $scope.starcode.substring(0, $scope.starcode.length - 1);
        }
    };

    function showErrorAndLogout(msg) {
        popupService.errorPopMsgCB(kkconst.ALERT_WARNING_TITLE, msg, function() {
            // pin lock and reset pin
            subscriptionService.logout();
                    
            window.location = window.location.href.replace(/#.*/, '');
        });
    }
    // $scope.closeConfirmPinModal = function() {
    //     $scope.confirmPinModal.hide();
    // };
    // end pin confirm
});