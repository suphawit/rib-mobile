angular.module('ctrl.createPinUsingDebitcardCtrl', [])
	.controller('createPinUsingDebitcardStep1Ctrl', function ($scope, $state, popupService, mainSession, kkconst, subscriptionService, managePinService) {
		console.log('createPinUsingDebitcardStep1Ctrl');

		var verifyDebitcard = function(value){
			value.actionType = kkconst.CREATE_PIN;

			subscriptionService.verifySubscriptionATMPin(value).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					result.value.actionType = kkconst.CREATE_PIN;
					subscriptionService.setCache(result.value);
					$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.STATE);// NewCBS
					// if (!result.value.pin) {
					// 	$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.STATE);// NewCBS
					// } else {
					// 	if (result.value.limitDevice) {
					// 		managePinService.showDeleteDeviceConfirm(result.value.oldDevice, 'create_pin').then(function(result){
					// 			$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
					// 			$state.go(kkconst.ROUNTING.MENU.STATE);
					// 		});
					// 	} else {
					// 		$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
					// 		$state.go(kkconst.ROUNTING.MENU.STATE);
					// 	}
					// }// end successIsPIN
					
					//$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.STATE);
				} else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				 $state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);
			}
		};

		$scope.verifyDebitcardForm = {
			onaction: function(value){
				verifyDebitcard(value);
			},
			isShowButton: false
		};

	})
	.controller('createPinUsingDebitcardStep2Ctrl', function ($scope, $state, popupService,  mainSession, kkconst, subscriptionService,$timeout,managePinService) {
		console.log('createPinUsingDebitcardStep2Ctrl');
		var subscriptionCache = subscriptionService.getCache() || {};
		var requestOTP = function(){
			var obj = {
				idType: '',
				idNo: '',
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				actionOTP: subscriptionCache.actionType,
				subscriptionChannel: 'ATM_PIN'
			};
			subscriptionService.requestOTPWithOutLogin(obj).then(function(result){				
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.verifyOTP.isDisabled = true;
					$scope.verifyOTP.enableKeyboard();
					var cacheParams = result.value || {};
					cacheParams.verifyTransactionId = subscriptionCache.verifyTransactionId;

					subscriptionService.setCache(cacheParams);
					// $state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.STATE);
					$scope.verifyOTP.input = {
						referenceNo: result.value.referenceNo,
						mobileNumber: result.value.mobileNo,
						tokenOTPForCAA: result.value.tokenOTPForCAA,
						otp: ''
					};
				}else {
					$scope.verifyOTP.isDisabled = false;
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
				$timeout.cancel(promise);
				var promise = $timeout(function() {
					$scope.verifyOTP.isDisabled = false;
				}, 15000);
			});
		};

		requestOTP();
		
		var verifyOTP = function(){
			var obj = {
				referenceNO: $scope.verifyOTP.input.referenceNo,
                otp: $scope.verifyOTP.input.otp,
                tokenOTPForCAA: $scope.verifyOTP.input.tokenOTPForCAA,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				actionOTP: (subscriptionCache.pin && subscriptionCache.actionType == kkconst.CREATE_PIN)? kkconst.VERIFY_SUBSCRIPTION : subscriptionCache.actionType,
				subscriptionChannel: 'ATM_PIN'
			};
			subscriptionService.verifyOTP(obj).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					// $state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.STATE);
					if (!subscriptionCache.pin) {
						$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.STATE);
					} else {
						if (subscriptionCache.limitDevice) {
							managePinService.showDeleteDeviceConfirm(subscriptionCache.oldDevice, subscriptionCache, 'ATM_PIN').then(function(result){
								if(subscriptionCache.actionType === kkconst.CREATE_PIN) {
									$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
									$state.go(kkconst.ROUNTING.MENU.STATE);
								}else {
									$state.go(kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.STATE);
								}
							});
						} else {
							if(subscriptionCache.actionType === kkconst.CREATE_PIN) {
								$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
								$state.go(kkconst.ROUNTING.MENU.STATE);
							}else {
								$state.go(kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.STATE);
							}
						}
					}// end successIsPIN
				}else if (result.responseStatus.responseCode === 'RIB-E-OTP003') {
					$scope.verifyOTP.input.otp = '';
					$scope.verifyOTP.isDisabled = false;
					popupService.showErrorPopupMessage('label.warning', result.responseStatus.responseCode);
				}else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.STATE);
			},
			goNextPage: function(){
				// do something
			}
		};

		$scope.confirmInput = {
			email: subscriptionCache.email || '',
			mobile: subscriptionCache.mobileNo || ''
		}

		$scope.verifyOTP = {
			input: {
				referenceNo: '',
				mobileNumber: '',
				otp: '',
				tokenOTPForCAA: ''
			},
			onaction: function(value){
				if(value === 'otp'){
					requestOTP();
				} else {
					verifyOTP();
				}
				
			},
			fontstyle: {
				body: $scope.fontDisplay,
				label: $scope.fontLabel
			}
		};

	})
	.controller('createPinUsingDebitcardStep3Ctrl', function ($scope, $state, popupService, mainSession, kkconst, manageAnyIDService, subscriptionService) {
		console.log('createPinUsingDebitcardStep3Ctrl');
		var subscriptionCache = subscriptionService.getCache() || {};

		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.STATE);
			},
			goNextPage: function(){
				// do something
			}
		};

		var updateTermAndCondition = function(){
			var obj = {
				deviceUUID: mainSession.deviceUUID,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'ATM_PIN'
			};
			subscriptionService.updateTermAndCondition(obj).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.STATE);
				}else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.verifyTermAndCond = {
			onaction: function(value){
				updateTermAndCondition();
				// $state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.STATE);
			},
			htmldata: ''
		};

		$scope.init = function(){
			var objLanguage = { language: mainSession.lang };
			manageAnyIDService.getTermsAndConditions(function(result){
				if(result.responseStatus.responseCode === kkconst.success){
					$scope.verifyTermAndCond.htmldata = result.value.data;
				} else {
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.errorMessage);
				}
			}, objLanguage);
		};
		
	})
	.controller('createPinUsingDebitcardStep4Ctrl', function ($scope, $state, popupService, kkconst, managePinService, subscriptionService) {
		console.log('createPinUsingDebitcardStep4Ctrl');
		var createPin = function(pin){
			var subscriptionCache = subscriptionService.getCache();
			var obj = {
				pin: pin,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'ATM_PIN'
			};
			managePinService.createPin(obj).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
					$state.go(kkconst.ROUNTING.MENU.STATE);
				} else {
					$scope.verifyPin.resetPin();
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.event = {
			isShowBack: true,
			isShowNext: false,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.STATE);
			},
			goNextPage: function(){
				// do something
			}
		};

		$scope.verifyPin = {
			input: {
				pin: '',
				confirmPin: ''
			},
			stepCount: 0,
			onaction: function(value){
				switch($scope.verifyPin.stepCount) {
					case 0:
						$scope.verifyPin.input.pin = value;
						$scope.verifyPin.title = 'label.verifyPIN';
						$scope.verifyPin.stepCount++;
						console.log('step1');
						break;
					case 1:
						$scope.verifyPin.input.confirmPin = value;
						$scope.verifyPin.validPin();
						console.log('step2');
						break;
				}
			},
			title: 'label.createPIN',
			validPin: function(){
				if($scope.verifyPin.input.pin === $scope.verifyPin.input.confirmPin){
					createPin($scope.verifyPin.input.pin);
				} else {
					$scope.verifyPin.resetPin();
					popupService.showErrorPopupMessage('alert.title','RIB-E-CHG004');
				}
			},
			resetPin: function(){
				$scope.verifyPin.stepCount = 0;
				$scope.verifyPin.input.confirmPin = '';
				$scope.verifyPin.input.pin = '';
				$scope.verifyPin.title = 'label.createPIN';
				$scope.verifyPin.clearPin();
			}
		};
		
	});
