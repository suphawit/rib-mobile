angular.module('ctrl.resetPinUsingProductCtrl', [])
	.controller('resetPinUsingProductStep1Ctrl', function ($scope, $state, popupService, mainSession, kkconst, subscriptionService, managePinService) {
		console.log('resetPinUsingProductStep1Ctrl');
		
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
			value.actionType = 'reset_pin';

			subscriptionService.verifySubscriptionProductId(value).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					subscriptionService.setCache(result.value);
					if (!result.value.pin) {
						$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.STATE);// NewCBS
					} else {
						if (result.value.limitDevice) {
							managePinService.showDeleteDeviceConfirm(result.value.oldDevice, 'reset_pin').then(function(result){
								$state.go(kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.STATE);
							});
						} else {
							$state.go(kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.STATE);
						}
					}// end successIsPIN
				} else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};
		
		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.RESET_PIN_PORTAL.STATE);
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
		// init dropdown type list
		createProductType();
		getIssueCountry();

	}).controller('resetPinUsingProductStep2Ctrl', function ($scope, $state, popupService, mainSession, kkconst, managePinService, deviceService, subscriptionService) {
		console.log('resetPinUsingProductStep2Ctrl');
		var resetPin = function(pin){
			var subscriptionCache = subscriptionService.getCache();
			var obj = {
				pin: pin,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'PRODUCT'
			};
			managePinService.resetPin(obj).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					// loginChallengeHandler.logout(false);
					subscriptionService.logout();
					checkDeviceUUID();
				} else {
					$scope.verifyPin.resetPin();
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};
		var checkDeviceUUID = function() {
			deviceService.checkDeviceUUID(mainSession.deviceUUID,	function(checkResults) {
				var resultsObj = checkResults.responseJSON.result;
				console.log(resultsObj)
				if(resultsObj.responseStatus.responseCode === kkconst.success){
					//deviceUUID found in database
					if (resultsObj.value.deviceStatus == true) {
						$scope.setStepPintitle('label.enterPIN');
						$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
						$state.go(kkconst.ROUNTING.MENU.STATE);
					} else {
						$state.go(kkconst.ROUNTING.RESET_PIN_PORTAL.STATE);
					}// end else

				}else{
					popupService.showErrorPopupMessage('alert.title',resultsObj.responseStatus.errorMessage);
				}
			});
		};

		$scope.event = {
			isShowBack: true,
			isShowNext: false,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.STATE);
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
						$scope.verifyPin.title = 'input.confirmNewPIN';
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
			title: 'input.setNewPIN',
			validPin: function(){
				if($scope.verifyPin.input.pin === $scope.verifyPin.input.confirmPin){
					resetPin($scope.verifyPin.input.pin);
				} else {
					$scope.verifyPin.resetPin();
					popupService.showErrorPopupMessage('alert.title','RIB-E-CHG004');
				}
			},
			resetPin: function(){
				$scope.verifyPin.stepCount = 0;
				$scope.verifyPin.input.confirmPin = '';
				$scope.verifyPin.input.pin = '';
				$scope.verifyPin.title = 'input.setNewPIN';
				$scope.verifyPin.clearPin();
			}
		};
		
	});



