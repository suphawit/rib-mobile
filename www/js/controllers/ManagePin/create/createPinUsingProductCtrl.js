angular.module('ctrl.createPinUsingProductCtrl', [])
	.controller('createPinUsingProductStep1Ctrl', function ($scope, $state, popupService, mainSession, kkconst, subscriptionService, managePinService) {
		console.log('createPinUsingProductStep1Ctrl');
		var lang  =  mainSession.lang;

		var getIssueCountry = function(){
			subscriptionService.inquiryAllIssueCountry().then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.verifyProductForm.countryData = {
						options: result.value,
						selected: result.value[0]
					};
				} else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};
		var createProductType = function(){
			var productType = [{ name: window.translationsLabel[lang]['label.select'], value: '' }];
			var productTmp = managePinService.getProductType();
			for(var i=0; i<productTmp.length; i++){
				productType.push(productTmp[i]);
			}
			$scope.verifyProductForm.productData = {
				options: productType,
				selected: productType[0]
			};
		};
		var verifyProduct = function(value){
			value.actionType = 'create_pin';

			subscriptionService.verifySubscriptionProductId(value).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					subscriptionService.setCache(result.value);
					if (!result.value.pin) {
						$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.STATE);// NewCBS
					} else {
						if (result.value.limitDevice) {
							managePinService.showDeleteDeviceConfirm(result.value.oldDevice, 'create_pin').then(function(result){
								$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
								$state.go(kkconst.ROUNTING.MENU.STATE);
							});
						} else {
							$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
							$state.go(kkconst.ROUNTING.MENU.STATE);
						}
					}// end successIsPIN
					// $state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.STATE);
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
			},
			goNextPage: function(){
				// do something
			}
		};

		$scope.verifyProductForm = {
			onaction: function(value){
				console.log(value);
				verifyProduct(value);
			},
			isShowButton: false,
			productData: {
				options: [],
				selected: {}
			},
			countryData: {
				options: [],
				selected: {}
			}
		};
		// init dropdown list data
		createProductType();
		getIssueCountry();
		
	}).controller('createPinUsingProductStep2Ctrl', function ($scope, $state, popupService, mainSession, kkconst, subscriptionService,$timeout) {
		console.log('createPinUsingProductStep2Ctrl');
		var subscriptionCache = subscriptionService.getCache() || {};
		var requestOTP = function(){
			var obj = {
				idType: '',
				idNo: '',
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				actionOTP: 'create_pin',
				subscriptionChannel: 'PRODUCT'
			};
			subscriptionService.requestOTPWithOutLogin(obj).then(function(result){
				console.log(result);
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.verifyOTP.isDisabled = true;
					$scope.verifyOTP.enableKeyboard();
					var cacheParams = result.value || {};
					cacheParams.verifyTransactionId = subscriptionCache.verifyTransactionId;

					subscriptionService.setCache(cacheParams);
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
			console.log('$scope.verifyOTP.input',$scope.verifyOTP.input);
			var obj = {
				referenceNO: $scope.verifyOTP.input.referenceNo,
                otp: $scope.verifyOTP.input.otp,
                tokenOTPForCAA: $scope.verifyOTP.input.tokenOTPForCAA
			};
			subscriptionService.verifyOTP(obj).then(function(result){
				console.log(result);
				if(result.responseStatus.responseCode === kkconst.success) {
					$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.STATE);
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
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.STATE);
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
				console.log(value);
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
	.controller('createPinUsingProductStep3Ctrl', function ($scope, $state, popupService, mainSession, kkconst, manageAnyIDService, subscriptionService) {
		console.log('createPinUsingProductStep3Ctrl');
		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.STATE);
			},
			goNextPage: function(){
				// do something
			}
		};

		var updateTermAndCondition = function(){
			var obj = {
				deviceUUID: mainSession.deviceUUID
			};
			subscriptionService.updateTermAndCondition(obj).then(function(result){
				console.log(result);
				if(result.responseStatus.responseCode === kkconst.success) {
					$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.STATE);
				}else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.verifyTermAndCond = {
			onaction: function(value){
				console.log(value);
				updateTermAndCondition();
				// $state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.STATE);
			},
			htmldata: ''
		};

		$scope.init = function(){
			var objLanguage = { language: mainSession.lang };
			manageAnyIDService.getRegisterAnyIDTermsAndConditions(function(result){
				if(result.responseStatus.responseCode === kkconst.success){
					$scope.verifyTermAndCond.htmldata = result.value.data;
				} else {
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.errorMessage);
				}
			}, objLanguage);
		};
		
	})
	.controller('createPinUsingProductStep4Ctrl', function ($scope, $state, popupService, kkconst, managePinService, subscriptionService) {
		console.log('createPinUsingProductStep4Ctrl');
		var createPin = function(pin){
			var subscriptionCache = subscriptionService.getCache();
			var obj = {
				pin: pin,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'PRODUCT'
			};
			console.log(obj, subscriptionCache);
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
				$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP3.STATE);
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
				console.log(value);
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



