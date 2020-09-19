angular.module('ctrl.newUserAuthenticationCtrl', [])
	.controller('newUserAuthenticationStep1Ctrl', function ($scope, $state, popupService, kkconst, subscriptionService, mainSession, $translate, cordovadevice) {
		console.log('newUserAuthenticationStep1Ctrl');

		$scope.input = {
			value: {
				idNo: '',
				pin: '',
				idIssueCountryCode: 'TH',
				idType: 'I'
			}
		};

		$scope.event = {
			isShowBack: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);
			},
			doSubmit: function(form){
				// console.log(form);
				if(form.value.idNo === ''){
					popupService.showErrorPopupMessage('alert.title','input.cardNoValidation');
				} else if(form.value.pin === ''){
					popupService.showErrorPopupMessage('alert.title','input.myPINValidation');
				} else {
					authenWithMyPIN(form);
				}
			},
			setCardType: function(cardType){
				$scope.input.value.idType = cardType.value;
				if(cardType.value === 'I'){
					$scope.input.value.idIssueCountryCode = 'TH';
				} else {
					$scope.input.value.idIssueCountryCode = $scope.country.selected.countryCode;
				}
			},
			setCountryCode: function(country){
				// console.log(country);
				$scope.input.value.idIssueCountryCode = country.countryCode;
			}
		};

		$scope.countryDescField = mainSession.lang === 'en' ? 'descEn' : 'descTh';

		$scope.cardList = [
			{ name: window.translationsLabel[$translate.use()]['input.cardType.id'], value: 'I', icon: 'icon-card-id' },
			{ name: window.translationsLabel[$translate.use()]['input.cardType.passport'], value: 'P', icon: 'icon-passbook' }
		];

		$scope.virtualKeyboardIdNo = {
			option: {
				disableDotButton: true,
				maxlength: 30
			}
		};

		$scope.virtualKeyboardMyPIN = {
			option: {
				disableDotButton: true,
				maxlength: 6
			}
		};
		
		$scope.chromeview = false;

		var authenWithMyPIN = function(data){
			subscriptionService.newUserAuthenticationWithMyPIN(data.value).then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					result.value.actionType = 'manage_device';
					subscriptionService.setCache(result.value);
					$state.go(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.STATE);// NewCBS
				} else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		var getIssueCountry = function(){
			subscriptionService.inquiryAllIssueCountry().then(function(result){
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.country = {
						options: result.value,
						selected: result.value[0]
					};
				} else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		var init = function(){
			// preview select for chrome browser
			if (cordovadevice.properties('platform') === 'preview') {
				$scope.chromeview = true;
			}
			
			getIssueCountry();
		};

		init();
		
	}).controller('newUserAuthenticationStep2Ctrl', function ($scope, $state, popupService, kkconst, subscriptionService,$timeout, managePinService) {
		console.log('newUserAuthenticationStep2Ctrl');
		var subscriptionCache = subscriptionService.getCache() || {};
		var requestOTP = function(){
			var obj = {
				idType: '',
				idNo: '',
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				actionOTP: 'create_pin',
				subscriptionChannel: 'MY_PIN'
			};
			subscriptionService.requestOTPWithOutLogin(obj).then(function(result){
				console.log(result);
				if(result.responseStatus.responseCode === kkconst.success) {
					$scope.verifyOTP.isDisabled = true;
					$scope.verifyOTP.enableKeyboard();
					
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
				tokenOTPForCAA: '',
				verifyTransactionId: subscriptionCache.verifyTransactionId,
				subscriptionChannel: 'MY_PIN'
			};
			subscriptionService.verifyOTP(obj).then(function(result){
				console.log(result);
				if(result.responseStatus.responseCode === kkconst.success) {
					// if (!subscriptionCache.pin) {
					// 	// $state.go(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP3.STATE);
					// 	gotoLoginPin();
					// } else {
						if (subscriptionCache.limitDevice) {
							managePinService.showDeleteDeviceConfirm(subscriptionCache.oldDevice, subscriptionCache, 'MY_PIN').then(function(result){
								gotoLoginPin();
							});
						} else {
							gotoLoginPin();
						}
					// }// end successIsPIN
				}else if (result.responseStatus.responseCode === 'RIB-E-OTP003') {
					$scope.verifyOTP.input.otp = '';
					$scope.verifyOTP.isDisabled = false;
					popupService.showErrorPopupMessage('label.warning', result.responseStatus.errorMessage);
				}else {
					popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
				}
			});
		};

		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.STATE);
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

		var gotoLoginPin = function(){
			$scope.setStepPintitle('label.enterPIN');
			$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
			$state.go(kkconst.ROUNTING.MENU.STATE);
		};

	})
	.controller('newUserAuthenticationStep3Ctrl', function ($scope, $state, popupService, mainSession, kkconst, manageAnyIDService, deviceService) {
		console.log('newUserAuthenticationStep3Ctrl');
		$scope.event = {
			isShowBack: true,
			isShowNext: true,
			goBackPage: function(){
				$state.go(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.STATE);
			},
			goNextPage: function(){
				// do something
			}
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
						// $state.go(kkconst.ROUNTING.RESET_PIN_PORTAL.STATE);
					}// end else

				}else{
					popupService.showErrorPopupMessage('alert.title',resultsObj.responseStatus.errorMessage);
				}
			});
		};

		$scope.verifyTermAndCond = {
			onaction: function(value){
				console.log(value);
				checkDeviceUUID();
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
		
	});
