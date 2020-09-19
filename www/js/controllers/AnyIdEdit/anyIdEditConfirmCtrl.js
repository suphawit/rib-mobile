angular.module('ctrl.anyIdEditConfirmCtrl', [])
    .controller('anyIdEditConfirmCtrl', function ($scope, anyIDService, $ionicModal, mainSession, manageAnyIDService, popupService, kkconst, $state, amendAnyIDService,otpService,$timeout) {

        viewInit();
        createVirtualKeyboard();

        function viewInit() {
            $scope.requestOTPResponse = {};

            $scope.amendAnyIDResposne = amendAnyIDService.getVerifyAmendAnyIDResponse();
            var anyIDType = $scope.amendAnyIDResposne.anyIDType;
            var anyIDInfo = anyIDService.getAnyIDinfo(anyIDType);
            $scope.anyIDIcon = anyIDInfo.icon;
            $scope.anyIDIconColor = anyIDInfo.iconColor;
            $scope.anyIDName = anyIDInfo.DescriptionName;
            $scope.anyIDValue = $scope.amendAnyIDResposne.anyIDValue ;
            $scope.fromAccountAliasName = $scope.amendAnyIDResposne.fromAccountAliasName;
            $scope.fromAccountNo = $scope.amendAnyIDResposne.fromAccountNo;
            $scope.toAccountName = $scope.amendAnyIDResposne.toAccountName;
            $scope.toAccountNo = $scope.amendAnyIDResposne.toAccountNo;
            $scope.toAccountAliasName = $scope.amendAnyIDResposne.toAccountAliasName;
            $scope.isShowNext = false;

            $scope.isAccountSelected = false;
            $scope.isTermAndCondAccept = false;
        }

        function createVirtualKeyboard() {
            $scope.virtualKeyboardOTP = {
                option: {
                    disableDotButton: true,
                    isKeyboardActive: false,
                    maxlength: 6,
                    IsEditModel: true
                }
            };
            $scope.otpModel = {
                otp: ''	
            };
        }

        $scope.isDisableBtn = false;
        $scope.requestOTP = function() {
            var param = {};
            param.verifyTransactionId = $scope.amendAnyIDResposne.verifyTransactionId;
            amendAnyIDService.requestOTP(param,function(responseStatus, resultObj){
                if (responseStatus.responseCode === kkconst.success) {
					var value = resultObj.value;
					$scope.requestOTPResponse =  {
						mobileNo: value.mobileNo,
						otptimeout: value.otptimeout,
						referenceNo: value.referenceNo,
						tokenOTPForCAA: value.tokenOTPForCAA,
                    }
                    $scope.isShowNext = true;
                    $scope.isDisableBtn = true;
					enableVirtualKeyboardOTP();
				} else {
					//Over limit req otp
					if (responseStatus.responseCode === 'RIB-E-OTP006') {
                        $scope.isShowNext = true;
                        $scope.isDisableBtn = true;
						enableVirtualKeyboardOTP();
					}else{
                        $scope.isShowNext = false;
                        $scope.isDisableBtn = false;
                    }
                    $scope.otpModel.otp = '';
					popupService.showErrorPopupMessage('label.warning', responseStatus.errorMessage);
				}
                $timeout.cancel(promise);
                var promise = $timeout(function() {
					$scope.isDisableBtn = false;
				}, 15000);
            });
        };

        $scope.requestOTP();

        function enableVirtualKeyboardOTP(){
			$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
			$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
        }

        function validateOTP(){
			return !(!$scope.otpModel.otp || $scope.otpModel.otp.length === 0);
		}

        $scope.submit = function(){
            if (!validateOTP()) {
				popupService.showErrorPopupMessage('label.warning', 'validate.input.enterOTP');
				return;
            }
            
            confirmAmendAny();
        };

        function confirmAmendAny() {
            var request = {
                referenceNO: $scope.requestOTPResponse.referenceNo,
                otp: $scope.otpModel.otp,
                tokenOTPForCAA: $scope.requestOTPResponse.tokenOTPForCAA,
                verifyTransactionId:  $scope.amendAnyIDResposne.verifyTransactionId
            }
            amendAnyIDService.confirmAmendAnyIDProcedure(
                request,
                function (responseStatus, resultObj) {
					if (responseStatus.responseCode === kkconst.success) {
                        var data = resultObj.value;
                        amendAnyIDService.setConfirmAmendAnyIDResponse(data);
                        $state.go(kkconst.ROUNTING.ANY_ID_EDIT_COMPLETE.STATE);
					} else if (responseStatus.responseCode === 'RIB-E-OTP003') {
                        $scope.otpModel.otp = '';
                        $scope.isDisableBtn = false;
                        $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
                        popupService.showErrorPopupMessage('label.warning', resultCode);
				    } else {
						popupService.showErrorPopupMessage('label.warning',  responseStatus.errorMessage);
					}
				}
            )
        }
    });