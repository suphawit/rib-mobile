angular.module('ctrl.manageAccountConfirmCtrl', []).controller('manageAccountConfirmCtrl',function($scope, invokeService, $state, $translate, fundTransferFROMService, popupService, myAccountService, mainSession, kkconst,$timeout) {
	$scope.accountInfo = myAccountService.accountDetail;
	$scope.selectedAccountDataInfo = myAccountService.accountDetail;
	$scope.isAddBeforeFund = myAccountService.isAddBeforeFund;
	//$scope.isReqOTP = false;

	$scope.isRequireOtp = myAccountService.isRequireOtp;
	if($scope.isRequireOtp == true){
		$scope.isReqOTP = false;
	}else{
		$scope.isReqOTP = true;
	}
	
	$scope.backToEditMyAccounts = function() {
		$state.go('app.editMyAccounts');
	};

	
	function isEmpty(str) {
		return (!str || 0 === str.length);
	}
	/**
	 * Edit My Account
	 */
	$scope.isSucc = true;

	$scope.editMyOwnAccount = function() {
		var obj = {};
		obj.params = {};
		 $scope.addMyAccountData = {};
		obj.params.myAccountID = myAccountService.accountDetail.myAccountID;
		obj.params.myAccountAliasName = myAccountService.accountDetail.myAccountAliasName;
		obj.actionCode = 'ACT_MY_ACCOUNT_CHANGE_ALIAS_NAME';
		obj.procedure = 'changeAilasNameMyAccountProcedure';

		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				$scope.isErr = false;
				$scope.isSucc = true;
				popupService.showErrorPopupMessage('label.success','ChangeAccount.successMsg');

				myAccountService.isRequireOtp = undefined; // reset data
				$state.go(kkconst.ROUNTING.MY_ACCOUNT.STATE);
			} else {
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);

			}
		};
		invokeService.executeInvokePublicService(obj); 
	};

	/**
	 * requesting OTP Generate
	 */
	$scope.isAddErr = false;
	$scope.isOtpReadOnly = true;
	$scope.requestOTP = function() {
		var invokeAdapter = { adapter: 'otpAdapter' };
		$scope.colorCode = "blackTextColor";
		var obj = {};
			obj.params = {};
	
			obj.params.actionOTP = 'add_my_account';
			obj.params.language = mainSession.lang;
			obj.actionCode = 'ACT_REQUEST_OTP';
			obj.procedure = 'requestOTPWithLoginProcedure';
			obj.onSuccess = function(result) {
				if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
					$scope.isDisableBtn = true;
					$scope.isAddErr = false;
					$scope.isOtpReadOnly = false;
					$scope.isReqOTP = true;
					
					$scope.otpData={
							referenceNo : result.responseJSON.result.value.referenceNo,
							tokenOTPForCAA : result.responseJSON.result.value.tokenOTPForCAA,
							mobileNumber : result.responseJSON.result.value.mobileNo,
							pin: ''
					};
					
					$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
					$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
				} else {
					$scope.isDisableBtn = false;
					$scope.isReqOTP = false;
					if(result.responseJSON.result.responseStatus.responseCode === "RIB-E-OTP006"){
						$scope.isReqOTP = true;
						$scope.isDisableBtn = true;
					}
					
					popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
				}
				$timeout.cancel(promise);
				var promise = $timeout(function() {
					$scope.isDisableBtn = false;
				}, 15000);
			};
		invokeService.executeInvokePublicService(obj, invokeAdapter);
	};

	if($scope.isRequireOtp) {
		$scope.requestOTP();
	}

	/**
	 * add my account confirm
	 * @procedure : addMyAccountSubmitProcedure
	 * @parameter : actionCode : ACT_MY_ACCOUNT_ADD_SUBMIT
	 */

	$scope.addMyAccount = function(otpData) {
		if($scope.isAddBeforeFund){
			//add after fund
			myAccountService.addMyAccountWithOutOTP(myAccountService.accountDetail, function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success) {
					myAccountService.accountDetail = {};

					myAccountService.isRequireOtp = undefined; // reset data
					$state.go('app.myAccount');
				} else {
					popupService.showErrorPopupMessage('lable.error',resultObj.responseStatus.responseCode);
				}
			});
		} else {
			//add myaccount
			if(isEmpty(otpData.pin)){
				 popupService.showErrorPopupMessage('label.warning','validate.input.enterOTP');
			}else{
				addMyAccountSubmit(otpData);
			}
		}
	};
	
	function addMyAccountSubmit(otpData) {
		var obj = {};
		obj.params = {};
		obj.params.myCustomerAccount = {};
	
		obj.params.referenceNO = otpData.referenceNo || "";
		obj.params.otp = otpData.pin;
		obj.params.tokenOTPForCAA = otpData.tokenOTPForCAA;
	
		obj.params.myCustomerAccount.myAccountID = myAccountService.accountDetail.myAccountID;
		obj.params.myCustomerAccount.myAccountAliasName = myAccountService.accountDetail.myAccountAliasName;
		obj.params.myCustomerAccount.myAccountNumber = myAccountService.accountDetail.myAccountNumber;
		obj.params.myCustomerAccount.myAccountstatus =myAccountService.accountDetail.myAccountstatus;
		obj.params.myCustomerAccount.accountType =myAccountService.accountDetail.accountType;
		obj.params.myCustomerAccount.accountStatus =myAccountService.accountDetail.accountStatus;
		obj.params.myCustomerAccount.productID =myAccountService.accountDetail.productID;

		obj.actionCode = 'ACT_MY_ACCOUNT_ADD_SUBMIT';
		obj.procedure = 'addMyAccountSubmitProcedure';

		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				popupService.showErrorPopupMessage('label.success','AddAccount.successMsg');
				myAccountService.accountDetail = {};

				myAccountService.isRequireOtp = undefined; // reset data
				$state.go('app.myAccount');
			} else {
				
				var statuscode = result.responseJSON.result.responseStatus.responseCode;
				
				if(statuscode === "RIB-E-OTP003") {
					$scope.isReqOTP = false;
					$scope.virtualKeyboardOTP.option.isKeyboardActive = false;
					$scope.colorCode = "greyTextColor";
					$scope.otpData.pin = "";
					$scope.isDisableBtn = false;
				}
				
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			
			}
		};
		invokeService.executeInvokePublicService(obj);
	}

	$scope.backAddMyAccount = function() {
		$state.go('app.addMyAccounts');
		myAccountService.factAddAccountOTP = true;
	};
	
	// create virtual keyboard option
	$scope.virtualKeyboardOTP = {
		option: {
			disableDotButton: true,
			isKeyboardActive: false,
			maxlength: 6,
			IsEditModel: true
		}
	};
})
