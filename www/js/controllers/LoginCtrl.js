angular.module('ctrl.login', []).controller('LoginCtrl',
		function($scope,mainSession,invokeService,$ionicPopup,loginService,$state,$rootScope,$q,$ionicLoading,deviceService,resetPinVerifyUsersession,popupService,kkconst,cordovadevice, cordovaNetworkInfo, pinService) {// NOSONAR
	'use strict';// NOSONAR		
			var loginState = $scope.templates[0].state;
			
			$scope.loginData = {'username': "",'password': ""};
			
			function deleteDeviceLimit(resultdeleteLimit){
				if (resultdeleteLimit.result.responseStatus.responseCode === kkconst.success) {
					$scope.stateGo(kkconst.page.pin,kkconst.pin.reset);
				}else {
					popupService.showErrorPopupMessage('alert.title','alert.terminate.unsuccess');
			
				}
			}
			function popupLimit(results){
				
				// WL.SimpleDialog.show(popupService.convertTranslate('alert.title'), popupService.convertTranslate('label.terminateDevice') +" "+ results.value.oldDeviceCustomer.oldDeviceName,
				// 	[{
				// 		text : popupService.convertTranslate('button.ok'),
				// 		handler : function() {
				// 			//press ok
				// 			deviceService.deleteDeviceLimit('reset_pin',results.value.oldDeviceCustomer.oldDeviceID,
				// 				// Callback function
				// 				function(resultdeleteDeviceLimit) {
				// 					if (resultdeleteDeviceLimit.result.responseStatus.responseCode === kkconst.success) {
				// 						$scope.stateGo(kkconst.page.pin,kkconst.pin.reset);
				// 					}else {
				// 						popupService.showErrorPopupMessage('alert.title','alert.terminate.unsuccess');
				//
				// 					}
				// 				});
				// 			}
				// 	}, {
				// 		text : popupService.convertTranslate('label.cancel'),
				// 		handler : function(){
				// 			//press cancel
				// 			}
				// 	}
				// ]);
				navigator.notification.confirm(
					popupService.convertTranslate('label.terminateDevice') +" "+ results.value.oldDeviceCustomer.oldDeviceName,
					function (resultClick) {
						if(resultClick == 1) {
							deviceService.deleteDeviceLimit('reset_pin',results.value.oldDeviceCustomer.oldDeviceID,
								// Callback function
								function(resultdeleteDeviceLimit) {
									if (resultdeleteDeviceLimit.result.responseStatus.responseCode === kkconst.success) {
										$scope.stateGo(kkconst.page.pin,kkconst.pin.reset);
									}else {
										popupService.showErrorPopupMessage('alert.title','alert.terminate.unsuccess');

									}
								});
						}
					},
					popupService.convertTranslate('alert.title'),
					[
						popupService.convertTranslate('button.ok'),
						popupService.convertTranslate('label.cancel')
					]
				);
			}
			function limitAndNotOwner(results){
				var islimit	= results.value.deviceLimited;
				var isOwner	= results.value.ownerDevice;
				
				var resultsVerifyReset = {};
					resultsVerifyReset.sessionToken = results.value.authenticationDetail.sessionToken;
					resultsVerifyReset.userID = results.value.authenticationDetail.userID;

					mainSession.createSession(resultsVerifyReset);
			
				if (islimit && !isOwner) {
					if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
						popupLimit(results);

					} else {
						window.swal({
							title: popupService.convertTranslate('alert.title'),
							text: popupService.convertTranslate('label.terminateDevice') +" "+ results.value.oldDeviceCustomer.oldDeviceName,
							type: "warning",
							showCancelButton: true,
							confirmButtonText:  popupService.convertTranslate('button.ok'),
							cancelButtonText: popupService.convertTranslate('label.cancel'),
							closeOnConfirm: true,
							closeOnCancel: true
						},
						function(isConfirm){
							if (isConfirm) {
								//press ok
								deviceService.deleteDeviceLimit('reset_pin',results.value.oldDeviceCustomer.oldDeviceID,
								// Callback function
								deleteDeviceLimit
								);
							}
						});
					}
					
				} else {
					 
					$scope.stateGo(kkconst.page.pin,kkconst.pin.reset);
				}// end successIsPIN
			}
			var resetPin = function(loginData){
			
				checkOnline().then(function (onl){
					if (onl){ //online

						// loginChallengeHandler.verifyResetPINHandler(loginData).then(function(ok){// NOSONAR
						//
						// });
						console.log('loginData', loginData)
						// pinService.resetPin()
					} else { //offline
						$ionicLoading.hide();
						popupService.showErrorPopupMessage('lable.error', 'RIB-E-AD0003' );
					}
				});
				
				
				$scope.$on(kkconst.broadcast.RESET_PIN_VERIFY_USER, function(event, response) {
					console.log('fsdfsdafasdfsdfs');
				
					var responseCode = response.value.responseStatus.responseCode;
					if (responseCode === kkconst.success) {
						limitAndNotOwner(response.value);
					}
				});
			};
			//check if user is online
			function checkOnline() {
				var def = $q.defer();
		
						if (cordovadevice.properties('platform') !== 'preview' && cordovaNetworkInfo.getNetworkType() === 'none') {
							$ionicLoading.hide();
							popupService.showErrorPopupMessage('lable.error','RIB-E-CONN01');
									def.resolve(false);
							return;
						}else{
							def.resolve(true);
						}
		
				return def.promise;
			}
			
			var loginNormal = function(loginData){
				var request = {};
				request.username = loginData.username;
				request.password = loginData.password;
				loginService.login(request,function(result) {
					
					var respStatus = result.responseJSON.result.responseStatus;
					var respCode 		= respStatus.responseCode;
					if (respCode === kkconst.success) {
						var value	= result.responseJSON.result.value;
						var isLimit 		= value.limitDevice;
						var isPin 			= value.pin;
						
						if (!isPin) {
							// $scope.stateGo(kkconst.page.pin,kkconst.pin.create);
							$state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);// NewCBS
						} else {
							if (isLimit) {
								$scope.showConfirm(value);
							} else {
								$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
							}
						}// end successIsPIN
					} else {
						popupService.showErrorPopupMessage('alert.title',respCode);
						
					}
				});
			};

		// event click login
		$scope.doLogin = function(loginData) {
			if(loginData.username ==='' && loginData.password ===''){
					popupService.showErrorPopupMessage('alert.title','input.login');
					return false;
			} else if(loginData.username === '' ){
				popupService.showErrorPopupMessage('alert.title','lable.userNameValidation');
				return false;
			} else if(loginData.password === ''){
				popupService.showErrorPopupMessage('alert.title','lable.passWordValidation');
				return false;
			} else {
				if(loginState === 'normal'){
					loginNormal(loginData);
				}else if(loginState === 'reset-pin'){
					resetPin(loginData);
				}else{
					//do something
				}
			}
		};
		$scope.showConfirm = function(params) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				// WL.SimpleDialog.show(popupService.convertTranslate('alert.title'), popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDevice.oldDeviceName,
				// 	[{
				// 		text : popupService.convertTranslate('button.ok'),
				// 		handler : function() {
				// 			//press ok
				// 			deviceService.deleteDeviceLimit('login', params.oldDevice.oldDeviceID,
				// 				// Callback function
				// 				function(resultdeleteDeviceLimit) {
				// 					checkDeleteDeviceLimit(resultdeleteDeviceLimit);
				// 				});
				// 			}
				// 	}, {
				// 		text : popupService.convertTranslate('label.cancel'),
				// 		handler : function(){
				// 			//press cancel
				// 			}
				// 	}
				// ]);
				navigator.notification.confirm(
					popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDevice.oldDeviceName,
					function (resultClick) {
						if(resultClick == 1) {
							deviceService.deleteDeviceLimit('login', params.oldDevice.oldDeviceID,
								// Callback function
								function(resultdeleteDeviceLimit) {
									checkDeleteDeviceLimit(resultdeleteDeviceLimit);
								});
						}
					},
					popupService.convertTranslate('alert.title'),
					[
						popupService.convertTranslate('button.ok'),
						popupService.convertTranslate('label.cancel')
					]
				);
			} else {
				window.swal({
					title: popupService.convertTranslate('alert.title'),
					text: popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDevice.oldDeviceName,
					type: "warning",
					showCancelButton: true,
					confirmButtonText:  popupService.convertTranslate('button.ok'),
					cancelButtonText: popupService.convertTranslate('label.cancel'),
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm){
					if (isConfirm) {
						//press ok
						deviceService.deleteDeviceLimit('login', params.oldDevice.oldDeviceID,
							// Callback function
							function(resultdeleteDeviceLimit) {
								checkDeleteDeviceLimit(resultdeleteDeviceLimit);
						});
					}
				});
			}
			
		};
		function checkDeleteDeviceLimit(resultdeleteDeviceLimit){
			if (resultdeleteDeviceLimit.result.responseStatus.responseCode === kkconst.success) {
				$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
			} else {
				popupService.showErrorPopupMessage('alert.title','alert.terminate.unsuccess');
		
			}
		}
})

.controller('PinCtrl', function($scope,$timeout,$q,pinService,$state,mainSession,$ionicPopup,deviceService,$rootScope,$ionicLoading, $translate, popupService, kkconst, cordovadevice, cordovaNetworkInfo, subscriptionService, notificationService, manageAnyIDService, $ionicModal, webStorage, challengeService, biometricService) {// NOSONAR
	var count = 0;
	// For Pin Engine
	var firstPin 	= '';
	var secondPin 	= '';
	var isRegisterdDevice = false;
	//check if user is online
	function checkOnline() {
		var def = $q.defer();
				if (cordovadevice.properties('platform') !== 'preview' && cordovaNetworkInfo.getNetworkType() === 'none') {
					$ionicLoading.hide();
					popupService.showErrorPopupMessage('lable.error','RIB-E-CONN01');
					def.resolve(false);
					return;
				}else{
						def.resolve(true);
				}
		return def.promise;
	}
	
	countBioAction();

	function countBioAction() {
		console.log("mainSession.countBioAction (BEFORE): " + mainSession.countBioAction);
		mainSession.countBioAction += 1;
		console.log("mainSession.countBioAction (AFTER): " + mainSession.countBioAction);
		if(mainSession.countBioAction == 1) {
			$scope.showBiometricAuthen();
		}
	}

	$scope.$on('biometric-action', function (event) {
		deviceService.checkLoginSetting().then(function(isBiometric) {
			console.log("isBiometric: " + isBiometric);
			if(isBiometric) {	
				checkBiometricAuthen();
			} else {
				// Hide bio button when bio not available
				$scope.setIsShowBioBtn(false);
				console.log("isShowBioBtn: " + $scope.isShowBioBtn);
			}
		});
	});

	function checkBiometricAuthen() {
		deviceService.isBioStateChanged().then(function(isStateChanged) {
			// console.log("isStateChanged: " + isStateChanged);
			if(isStateChanged) {
				// Update state and label
				$scope.setIsBioStateChanged(true);
				console.log("isBioStateChanged: " + $scope.isBioStateChanged);
				// Hide bio button
				$scope.setIsShowBioBtn(false);
				console.log("isShowBioBtn: " + $scope.isShowBioBtn);
			} else {
				checkOnline().then(function(onl) {
					if(onl) {
						challengeService.request(function(response) {
							if(response.result.responseStatus.responseCode === kkconst.success) {
								console.log("CHALLENGE: " + response.result.value.challenge);
		
								deviceService.authenticate(response.result.value.challenge, function(success) {
									
									biometricService.login(success.signature, function(response) {
										console.log("biometricService: " + JSON.stringify(response));
		
										if(response.result.responseStatus.responseCode === kkconst.success){
											var value = response.result.value;
											mainSession.accessToken = value.accessToken;
											mainSession.sessionToken = value.sessionToken;
											
											getCustInfo();
										} else {
											// Device already removed
											if(response.result.responseStatus.responseCode === 'RIB-E-CAAAPI1012') {
												checkDeviceUUID();
											} else {
												popupService.showErrorPopupMessage('lable.error', response.result.responseStatus.errorMessage);
											}
										}
									});
				
								}, function(error) {
									console.log("authenticate() error: " + JSON.stringify(error));
		
									// Private key not found
									if(error.isValidKey === false) {
										popupService.showErrorPopupMessage('lable.error', 'RIB-E-UNK999');
									}
		
									if(mainSession.deviceOS === 'iOS') {
										if(error.isFaceIDPermitted === false || error.isLocked === true) {
											$scope.setIsShowBioBtn(false);
											$scope.$apply();
										}
									}
								});
							} else {
								// Device already removed
								if(response.result.responseStatus.responseCode === 'RIB-E-LOG003') {
									checkDeviceUUID();
								}
							}
						});
					} else {
						$ionicLoading.hide();
						popupService.showErrorPopupMessage('lable.error', 'RIB-E-AD0003' );
					}
				});
			}
		});
	}

	$scope.$on('pin-action', function(event, args) {
		var val = args.value;
		if(val){
			$scope.errorPinMessageEnable = false;
			$scope.errorPinMessage = '';
		}
	});

	function checkOnlineFunc(v) {
		checkOnline().then(
			function (onl) {
				if (onl) { //online
				
					pinService.loginPin(v, function (response) {
						if(response.result.responseStatus.responseCode === kkconst.success) {
							var value = response.result.value;
							mainSession.accessToken = value.accessToken;
							mainSession.sessionToken = value.sessionToken;
							
							checkBioState().then(function() {
								deviceService.activate(function(result) {
									console.log("Result",result);
									var publicKey = result.publicKey;
									if(publicKey == null){
										publicKey = "";	
									}
									console.log("Activate :" + publicKey);
									getCustInfo(publicKey);
								});
							});

						} else {
							// Device already removed
							if(response.result.responseStatus.responseCode === 'RIB-E-CAAAPI1012') {
								checkDeviceUUID();
							} else {
								popupService.showErrorPopupMessage('lable.error', response.result.responseStatus.errorMessage);
							}
						}
					});

				} else { //offline
					$ionicLoading.hide();
					popupService.showErrorPopupMessage('lable.error', 'RIB-E-AD0003' );
				}
			}
		);
	}

	function checkBioState() {
		var deferred = $q.defer();

		// Remove key and Update state if bio state changed
		if($scope.isBioStateChanged === true) {
			deviceService.deactivate(function(result) {
				console.log("deactivate result: " + result.success);
			});

			deviceService.setBioState();
			
			$scope.setIsBioStateChanged(false);
			console.log("isBioStateChanged: " + $scope.isBioStateChanged);
			// $scope.checkLoginLabel();

			$scope.setIsShowBioBtn(true);
			console.log("isShowBioBtn: " + $scope.isShowBioBtn);
			deferred.resolve();
		} else {
			deferred.resolve();
		}

		return deferred.promise;
	}

	function getCustInfo(publicKey) {
		subscriptionService.getCustomerInfo(publicKey).then(function(response){
			if(response.responseStatus.responseCode === kkconst.success) {
				var results = {};

				var value = response.value;
				var isTermAndCondition = value.termAndCondition;
				if (isTermAndCondition) {
					results.sessionToken = mainSession.sessionToken;

					results.lastLogin = value.lastSuccessFullLogon;
					results.firstNameTH = value.fullNameTH;
					results.lastNameTH = value.fullSurNameTH;
					results.firstNameEN = value.fullNameEN;
					results.lastNameEN = value.fullSurNameEN;
					mainSession.createSession(results);
					_RegisterDeviceNotification();
					$state.go('app.myAccount');
				} else {
					getTermAndConditionForLogin(value);
				}
			}else if(response.responseStatus.responseCode ==="RIB-E-CAAAPI3001"){
				deviceService.deactivate(function(result) {
					console.log("deactivate result: " + result.success);
				});
				console.log("GETCUST(registerkey) FAIL");
				// popupService.showErrorPopupMessage('lable.error', 'RIB-E-CONN02');
			}
		});
	}

	$scope.$on('pin-code', function(event, args) {
		var value = args.value;
		$scope.actionPin = '';
		if($scope.pinState === kkconst.pin.login){
			
			$scope.checkLoginLabel();
			
			$ionicLoading.show({
				template: kkconst.SPINNER,
				noBackdrop: true
			});
			
			checkOnlineFunc(value);
			
		}else if($scope.pinState === kkconst.pin.create){
			count++;
			if(count === 1){
				firstPin = value;
				
				$scope.setStepPintitle('label.verifyPIN');
			}
			if(count === 2){
				sentCreatePin(value);
			}
		} else if($scope.pinState === kkconst.pin.reset){
			count++;
			if(count === 1){
				firstPin = value;
				
				$scope.setStepPintitle('input.confirmNewPIN');
			}
			if(count === 2){
				sentResetPin(value);
			}
		}else{
			//do something
		}
	});

	function sentCreatePin(value) {
		count = 0;
		secondPin = value;
		if(firstPin === secondPin){
			firstPin = '';
			secondPin = '';
			pinService.createPin(mainSession.deviceUUID ,value,
			function(resultCreatePin){
				if(resultCreatePin.result.responseStatus.responseCode === kkconst.success){
					
					$scope.errorPinMessageEnable = false;
					$scope.errorPinMessage = '';
					
					$scope.setStepPintitle('label.createPIN');
					$scope.stateGo(kkconst.page.pin,kkconst.pin.login);

				}else{
					popupService.showErrorPopupMessage('alert.title',resultCreatePin.result.responseStatus.responseCode);
				}
			});
		}else{
			$scope.setStepPintitle('label.createPIN');
			popupService.showErrorPopupMessage('alert.title','msg.pin.notmatch');
		}
	}

	function sentResetPin(value) {
		count = 0;
		secondPin = value;
		console.log('sentResetPin');
		if(firstPin === secondPin){
			firstPin = '';
			secondPin = '';
			pinService.resetPin(value,
			function(results){
				if(results.result.responseStatus.responseCode === kkconst.success){
					// loginChallengeHandler.logout(false);
					subscriptionService.logout();
					checkDeviceUUID();
				}  else{
					$scope.setStepPintitle('input.setNewPIN');
					popupService.showErrorPopupMessage('alert.title',results.result.responseStatus.responseCode);
				}
			});
		} else {
			$scope.setStepPintitle('input.setNewPIN');
			popupService.showErrorPopupMessage('alert.title','msg.pin.notmatch');
		}
	}

	function checkDeviceUUID() {
		deviceService.checkDeviceUUID(mainSession.deviceUUID,	function(checkResults) {
			var resultsObj = checkResults.responseJSON.result;
			if(resultsObj.responseStatus.responseCode === kkconst.success){
				//deviceUUID found in database
				if (resultsObj.value.deviceStatus == true) {
					$scope.setStepPintitle('label.enterPIN');
					$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
				} else {
					//$scope.stateGo(kkconst.page.login,kkconst.login.normal);
					$state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);// NewCBS
				}// end else
			}else{
				popupService.showErrorPopupMessage('alert.title',resultsObj.responseStatus.responseCode);
			}
		});
	}

	$scope.verifyResetPin = function(){
		// $scope.stateGo(kkconst.page.login,kkconst.login.resetPin);
		$state.go(kkconst.ROUNTING.RESET_PIN_PORTAL.STATE);// NEWCBS
	};

	function alertConfirmPopup(resultdeleteDeviceLimit){
		if (resultdeleteDeviceLimit.responseJSON.result.responseStatus.responsCode === kkconst.success) {
			$scope.modal.hide();
			$scope.closeLogin();
			window.location.href = '#/app/resetPin';
		} else {
			$ionicPopup
			.alert({
				title : 'Device',
				template : 'Unsuccess Terminate DeviceID'
			});
		}
	}


	var _RegisterDeviceNotification = function(){

		if(!isRegisterdDevice){
			isRegisterdDevice = true;
			notificationService.registerDeviceNotification().then(function (resp) {
				if (resp.length > 0 && resp != null) {
				
				}
	
			}, function (error) {

				// popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
			//call notificationSendLogOut for kick website longpolling
			notificationService.notificationSendLogOut();
			notificationService.getBadgeNumber();
		}
	}

	$scope.acceptTermAndCond = {
		modal: null,
		isAccept: false,
		doSubmit: function(agree){
			if(agree == 'agree') {
				if($scope.acceptTermAndCond.isAccept){
					updateTermAndCondition();
				} else {
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.promptpayRegisterAgreeConditions');
				}
			} else {
				$scope.acceptTermAndCond.closeModal();
			}
			
			return false;
		},
		html: '',
		session: {},
		closeModal: function(){
			$scope.acceptTermAndCond.isAccept = false;
			$scope.acceptTermAndCond.html = '';
			// $scope.acceptTermAndCond.session = {};
			$scope.acceptTermAndCond.modal.hide();
		}
	};

	$ionicModal.fromTemplateUrl('templates/ManagePin/accept-term-and-cond-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {
		$scope.acceptTermAndCond.modal = modal;
	});

	var getTermAndConditionForLogin = function(session){
		$scope.acceptTermAndCond.session = session;
		$scope.acceptTermAndCond.modal.show();

		var objLanguage = { language: mainSession.lang };
		manageAnyIDService.getTermsAndConditions(function(result){
			if(result.responseStatus.responseCode === kkconst.success){
				$scope.acceptTermAndCond.html = result.value.data;
			} else {
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.errorMessage);
			}
		}, objLanguage);
	};
	
	var updateTermAndCondition = function(){
		subscriptionService.updateTermAndCondition().then(function(result){
			if(result.responseStatus.responseCode === kkconst.success) {
				$scope.acceptTermAndCond.closeModal();
				var tmp = $scope.acceptTermAndCond.session;
				
				var session = {};
				session.sessionToken = mainSession.sessionToken;
				
				session.lastLogin = tmp.lastSuccessFullLogon;
				session.firstNameTH = tmp.fullNameTH;
				session.lastNameTH = tmp.fullSurNameTH;
				session.firstNameEN = tmp.fullNameEN;
				session.lastNameEN = tmp.fullSurNameEN;
				mainSession.createSession(session);
				_RegisterDeviceNotification();
				$state.go('app.myAccount');
			}else {
				popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
			}
		});
	};
})

.controller('changePinCtrl',function($scope, $ionicModal, loginService, $state, pinService,$ionicPopup, mainSession, $translate,$timeout,$rootScope,deviceService,popupService,kkconst,subscriptionService) {//NOSONAR
	var maxPin = 6;
	$scope.dotchangepins = [];
	$scope.init = function() {
		$scope.changePincode = '';
		$scope.changePinStarcode = '';
		
		for(var i=0;i< maxPin;i++){
			$scope.dotchangepins[i] = 'circle-color-white';
		}
	};
	
	var _paintChangePin = function(cssColor){		
		for(var i=0;i< maxPin;i++){ 
			if($scope.changePincode.length === i){ 
				$scope.dotchangepins[i] = cssColor; 
			}
		}
	};
	
	$scope.title = 'header.changePIN';
		
	var count 	= 0;
	var pin1 	= '';
	var pin2 	= '';
	var pin3 	= '';
	
	$scope.setStepPintitle('input.currentPIN');
	$scope.errorPinMessageEnable = true;
	$scope.errorPinMessage = '';
	
	$scope.addPin = function(value) {
		_paintChangePin('circle-color-black');
		if($scope.changePincode.length === 0){
			$scope.errorPinMessageEnable = false;
			$scope.errorPinMessage = '';
		}
		
		if($scope.changePincode.length < maxPin) {
			$scope.changePincode = $scope.changePincode + value;
			$scope.changePinStarcode = $scope.changePinStarcode + '*';
			if($scope.changePincode.length === maxPin) {
				$timeout(function() {
					var pinValue = $scope.changePincode;
					count++;
					
					switch (count) {
						case 1:
							pin1 = pinValue;
							$scope.init();
							$scope.setStepPintitle('input.setNewPIN');
							break;
						case 2:
							pin2 = pinValue;
							$scope.init();
							$scope.setStepPintitle('input.confirmNewPIN');
							break;
						case 3:
							changePin(pinValue);
							break;
						default:

					}
				
					$scope.changePincode = '';
					$scope.changePinStarcode = '';
				}, 300);
			}
		}
	};
	
	function changePin(pinValue) {
		count = 0;
		pin3 = pinValue;
		$scope.init();
		if(pin2 === pin3){
			pinService.changePin(pin1,pin3, function(resultChangePin) { 
				if(resultChangePin.result.responseStatus.responseCode === kkconst.success) {
	
					$scope.errorPinMessageEnable = false;
					$scope.errorPinMessage = '';
					// loginChallengeHandler.logout(true);
					subscriptionService.logout();
					deviceService.checkDeviceUUID(mainSession.deviceUUID,	function(checkResults) {
						if (checkResults.responseJSON.result.status !== 'true') {
							$state.go("menu", { 'state': 'normal'});
						}
					});
					
				}else{
				
					popupService.showErrorPopupMessage('alert.title',resultChangePin.result.responseStatus.errorMessage);
				}
				
				$scope.setStepPintitle('label.enterPIN');
				
			}); 
			pin1 	= '';
			pin2 	= '';
			pin3 	= '';
			
		}else{
			$scope.setStepPintitle('input.currentPIN');
			
			popupService.showErrorPopupMessage('alert.title','RIB-E-CHG007');
		}
	}

	$scope.delPin = function() {
		$scope.dotchangepins[$scope.changePincode.length-1] = 'circle-color-white';
		if($scope.changePincode.length > 0) {
			$scope.changePincode = $scope.changePincode.substring(0, $scope.changePincode.length - 1);
			$scope.changePinStarcode = $scope.changePinStarcode.substring(0, $scope.changePinStarcode.length - 1);
		}
	};

});
