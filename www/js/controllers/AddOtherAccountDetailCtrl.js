angular.module('ctrl.addOtherAccountDetail', [])
.controller('AddOtherAccountDetailCtrl', function($scope, $ionicHistory, otherAccountService, BankCodesImgService, mainSession, otpService, kkconst, popupService,anyIDService,$timeout) {// NOSONAR
	
	$scope.confirmInfo = otherAccountService.confirmOtherAccountDetail;
	$scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;
	$scope.isShowSwiper = otherAccountService.isShowSwiper;
	$scope.otpData = {};

	$scope.isRequireOtp = otherAccountService.isRequireOtp;

	var anyIDType  = otherAccountService.addOtherAccountSelected;
	$scope.anyIDIcon = anyIDService.getAnyIDinfo(anyIDType).icon;
	
	if(anyIDType === 'ACCTNO'){
		$scope.chageAnyIDType = true;
	}else{
		$scope.chageAnyIDType = false;
	}
	
	function isEmpty(str) {
		return (!str || 0 === str.length);
	}
	
	if(!$scope.isShowSwiper){
		
		$scope.isReqOTP = true;
	}else{
		$scope.isReqOTP = false;
	}
	
	$scope.submitOTP = function(otpData){
		if($scope.isRequireOtp == false){
			otherAccountService.submitAddOtherAccountWithOutOTP($scope.confirmInfo, function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success) {
					popupService.showErrorPopupMessage('label.success','AddOtherAccount.successMsg');
					otherAccountService.isRequireOtp = undefined;
					$scope.gotoOtherAccount();
				} else {
		        	popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		} else {
			
			if(isEmpty($scope.otpData.pin)){
				 popupService.showErrorPopupMessage('label.warning','validate.input.enterOTP');
			}else{
				otherAccountService.submitAddOtherAccount($scope.confirmInfo, otpData, function(resultObj){
					if(resultObj.responseStatus.responseCode === kkconst.success) {
						otherAccountService.isRequireOtp = undefined;
						popupService.showErrorPopupMessage('label.success','AddOtherAccount.successMsg');
						$scope.gotoOtherAccount();
					} else if(resultObj.responseStatus.responseCode === 'RIB-E-OTP003') {
						$scope.colorCode = 'greyTextColor';
						$scope.otpData.pin = '';
						$scope.isReqOTP = false;
						$scope.isDisableBtn = false;
						$scope.virtualKeyboardOTP.option.isKeyboardActive = false;
			        	popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
					} else {
						//validate case
						popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
					}
				});
			}
			
			
		}
	};

	$scope.requestOTP = function() {
		var param = {};
			param.actionOTP = 'add_ext_account';
		
		$scope.colorCode = 'blackTextColor';
		
		otpService.requestOTP(param,function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				$scope.isDisableBtn = true;
				$scope.isReqOTP = true;
				$scope.otpData = {
					referenceNo : resultObj.value.referenceNo,
					tokenOTPForCAA : resultObj.value.tokenOTPForCAA,
					mobileNumber : resultObj.value.mobileNo,
					pin: ''
				};
				$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
				$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
			} else {
				$scope.isDisableBtn = false;
				$scope.isReqOTP = false;
				if(resultObj.responseStatus.responseCode === 'RIB-E-OTP006'){
					$scope.isReqOTP = true;
					$scope.isDisableBtn = true;
				}
	        	popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
			$timeout.cancel(promise);
			var promise = $timeout(function() {
				$scope.isDisableBtn = false;
			}, 15000);
		});
	};
	
	if($scope.isRequireOtp){
		$scope.requestOTP();
	}
	
	
	// create virtual keyboard option
	$scope.virtualKeyboardOTP = {
		option: {
			disableDotButton: true,
			isKeyboardActive: false,
			maxlength: 6,
			IsEditModel: true
		}
	};

});