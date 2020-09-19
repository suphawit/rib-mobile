angular.module('ctrl.resetPinUsingUsernameCtrl', [])
	.controller('resetPinUsingUsernameStep1Ctrl', function ($scope, $state, popupService, mainSession, kkconst, subscriptionService, managePinService) {
		console.log('resetPinUsingUsernameStep1Ctrl');

		var verifyUser = function(value){
			value.actionType = kkconst.RESET_PIN;
			subscriptionService.verifySubscriptionUser(value).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					result.value.actionType = kkconst.RESET_PIN;
					subscriptionService.setCache(result.value);
					$state.go(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.STATE);
					// if (!result.value.pin) {
					// 	$state.go(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.STATE);// NewCBS
					// } else {
					// 	if (result.value.limitDevice) {
					// 		managePinService.showDeleteDeviceConfirm(result.value.oldDevice, 'reset_pin').then(function(result){
					// 			$state.go(kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.STATE);
					// 		});
					// 	} else {
					// 		$state.go(kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.STATE);
					// 	}
					// }// end successIsPIN
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

		$scope.verifyUsernameForm = {
			onaction: function(value){
				console.log(value);
				verifyUser(value);
			},
			isShowButton: false
		};
	})
	.controller('resetPinUsingUsernameStep2Ctrl', function ($scope, $state, popupService, mainSession, kkconst, managePinService, deviceService, subscriptionService, webStorage) {
		console.log('resetPinUsingUsernameStep2Ctrl');
		var resetPin = function(pin){
			var subscriptionCache = subscriptionService.getCache();
			var obj = {
				pin: pin,
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'USER'
			};
			managePinService.resetPin(obj).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					deviceService.deactivate(function(result){
                        console.log("deactivate success"+result);
                    });
					webStorage.setLocalStorage("isBiometric", false);
					console.log("isBiometric: "+ webStorage.getLocalStorage("isBiometric"));
					$scope.checkBioState();
					// Hide bio button in mainCtrl
					$scope.setIsShowBioBtn(false);
					// loginChallengeHandler.logout(false);
					subscriptionService.logout();
					// window.location = window.location.href.replace(/#.*/, '');
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
				$state.go(kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.STATE);
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



