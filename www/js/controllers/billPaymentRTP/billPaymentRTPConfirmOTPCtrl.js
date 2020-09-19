angular.module('ctrl.billPaymentRTPConfirmOTPCtrl', [])
.controller('billPaymentRTPConfirmOTPCtrl', function ($scope, $state,$ionicHistory, popupService, mainSession, dateService, displayUIService, kkconst, billPaymentRTPService,$timeout,$ionicModal,deviceService, subscriptionService) {
		$scope.billConfirm = {};
		// $scope.isEnableConfirm = false;
		$scope.dataVerifyOTP = {};
		$scope.otpModel = {
			otp: ''
		}
		$scope.isRequireOtp = true;
		$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
		$scope.isDisableConfirmBtn = false;

		$scope.suptitlePin = 'label.enterPIN';
		// createVirtualKeyboardOTP();
		viewInit();
		createModal();
		
		function viewInit(){
			var data_billConfirm = billPaymentRTPService.getDataBillpaymentConfirmOTP();
			var paymentdate = data_billConfirm.resultVerifyBill.paymentDate;
			var paymentdate_ui = displayUIService.convertDateNoTimeForUI(paymentdate);
			var transactiondate = data_billConfirm.resultVerifyBill.transactionDate;
			var transactiondate_ui = displayUIService.convertDateTimeForTxnDateUI(transactiondate);
			$scope.isRequireOtp = data_billConfirm.resultVerifyBill.requireOTP;
			$scope.billConfirm = data_billConfirm;
			$scope.billConfirm.ui = {
				paymentDate:paymentdate_ui,
				transactionDate: transactiondate_ui,
			}
			$scope.msg = $scope.billConfirm.resultVerifyBill.verifyTransactionID +
				$scope.billConfirm.resultVerifyBill.fromAccountNumber +
				$scope.billConfirm.resultVerifyBill.refInfos[0].value +
				$scope.billConfirm.resultVerifyBill.payAmount +
				$scope.billConfirm.resultVerifyBill.verifyTransactionID;
		}

		function createModal() {
			createPinConfirmModal();
		}

		function createPinConfirmModal() {
			var template = 'templates/BillPaymentRTP/confirm-pin.html';
			$ionicModal.fromTemplateUrl(template, {
				scope: $scope,
				animation: $scope.modalAnimate
			}).then(function(modal) {
				$scope.confirmPinModal = modal;
			});
		}

		$scope.closeConfirmPinModal = function() {
			$scope.confirmPinModal.hide();
		};

		
        $scope.onClickConfirm = function(){
			$scope.isDisableConfirmBtn = true;
			// if (!validateOTP()) {
			// 	popupService.showErrorPopupMessage('label.warning', 'validate.input.enterOTP');
			// 	return;
			// }


			if ($scope.isRequireOtp === true) {
				$scope.confirmPinModal.show();
			} else if ($scope.billConfirm.editScheduleBill) {
				confirmEditScheduleBillPay('');
			} else {
				confirmBillPay('');
			}
        };

		// $scope.isDisableBtn = false;
		// $scope.requestOTP = function(){
		// 	billPaymentRTPService.getRequestOTP(kkclabel.confirmPinonst.ACTION_CODE_BILL_PAYMENT, function(resultCode, resultObj){
		// 		if (resultCode === kkconst.success) {
		// 			$scope.isDisableBtn = true;
		// 			var value = resultObj.value;
		// 			$scope.dataVerifyOTP =  {
		// 				mobileNumber: value.mobileNo,
		// 				otptimeout: value.otptimeout,
		// 				referenceNo: value.referenceNo,
		// 				tokenOTPForCAA: value.tokenOTPForCAA,
		// 			}
		// 			$scope.isEnableConfirm = true;
		// 			enableVirtualKeyboardOTP();
		// 		} else {
		// 			//Over limit req otp
		// 			if (resultCode === 'RIB-E-OTP006') {
		// 				$scope.isDisableBtn = true;
		// 				$scope.isEnableConfirm = true;
		// 				enableVirtualKeyboardOTP();
		// 			}else{
		// 				$scope.isDisableBtn = false;
		// 				$scope.isEnableConfirm = false;
		// 			}
		// 			popupService.showErrorPopupMessage('label.warning', resultCode);
		// 		}
		// 		$timeout.cancel(promise);
		// 		var promise = $timeout(function() {
		// 			$scope.isDisableBtn = false;
		// 		}, 15000);
		// 	});
		// }

		// $scope.requestOTP();
		
		$scope.onClickBack = function(){
			$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
		}

		$scope.displayBillerName = function (biller) {
			var billername = (mainSession.lang === 'en') ? biller.billerNameEn : biller.billerNameTh;
			return billername;
		}

		$scope.displayRefName = function (ref) {
			var refname = (mainSession.lang === 'en') ? ref.textEn : ref.textTh;
			return refname;
		}

		$scope.displayRecurringTime = function (value){
			var lang = mainSession.lang.toLowerCase();
			var recurrings = dateService.timeOfRecurringTypesLangs[lang];
			for (var time = 0; time < recurrings.length; time++) {
				if(recurrings[time].value === value){
					return recurrings[time].name;
				}
			}
		} 
		$scope.displayScheduleType = function (value){
			var lang = mainSession.lang.toLowerCase();
			var scheduletype = dateService.recurringTypesLangs[lang];
			for (var time = 0; time < scheduletype.length; time++) {
				if(scheduletype[time].value === value){
					return scheduletype[time].name;
				}
			}
		}

		// function createVirtualKeyboardOTP() {
		// 	$scope.virtualKeyboardOTP = {
		// 		option: {
		// 			disableDotButton: false,
		// 			isKeyboardActive: false,
		// 			maxlength: 6,
		// 			IsEditModel: true
		// 		},
		// 	};
		// }
		//
		// function enableVirtualKeyboardOTP(){
		// 	$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
		// 	$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
		// }

		// function validateOTP(){
		// 	return !(!$scope.otpModel.otp || $scope.otpModel.otp.length === 0);
		// }

		function confirmBillPay(pin){
			deviceService.sign($scope.msg).then(function (digitalSign) {
				var dataConfirmBillpay = {
					memo: $scope.billConfirm.resultVerifyBill.memo,
					verifyTransactionID: $scope.billConfirm.resultVerifyBill.verifyTransactionID,
					referenceNO: $scope.dataVerifyOTP.referenceNo,
					otp: $scope.otpModel.otp,
					tokenOTPForCAA: $scope.dataVerifyOTP.tokenOTPForCAA,
					deviceUUID: mainSession.deviceUUID,
					pin: pin,
					digitalSign: digitalSign.signature,
				};
				billPaymentRTPService.confirmBillpay(dataConfirmBillpay, function (resultCode, resultObj) {
					if (resultCode === kkconst.success) {
						$scope.closeConfirmPinModal();

						var data = resultObj.value;
						billPaymentRTPService.setDataBillpaymentConfirmComplete(data);
						$ionicHistory.clearCache().then(function () {
							$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.STATE);
						});
					} else if (resultCode === 'RIB-E-OTP003') {
						$scope.otpModel.otp = '';
						// $scope.isEnableConfirm = false;
						// $scope.isDisableBtn = false;
						// $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
						popupService.showErrorPopupMessage('label.warning', resultCode);
					} else if(resultCode === 'RIB-E-LOG010') {
						showErrorAndLogout(resultCode);
					} else {
						popupService.showErrorPopupMessage('label.warning', resultCode);
					}
				});
			});
		}

		function confirmEditScheduleBillPay(pin){
			deviceService.sign($scope.msg).then(function (digitalSign) {
				var dataEditConfirmBill = {
					memo: $scope.billConfirm.resultVerifyBill.memo,
					verifyTransactionID: $scope.billConfirm.resultVerifyBill.verifyTransactionID,
					referenceNO: $scope.dataVerifyOTP.referenceNo,
					otp: $scope.otpModel.otp,
					tokenOTPForCAA: $scope.dataVerifyOTP.tokenOTPForCAA,
					deviceUUID: mainSession.deviceUUID,
					pin: pin,
					digitalSign: digitalSign.signature,
				};
				billPaymentRTPService.confirmEditScheduleBillPayment(
					dataEditConfirmBill,
					function (resultCode, resultObj) {
						if (resultCode === kkconst.success) {
							$scope.closeConfirmPinModal();
							
							var data = resultObj.value;
							billPaymentRTPService.setDataBillpaymentConfirmComplete(data);
							$ionicHistory.clearCache().then(function () {
								$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.STATE);
							});
						} else if (resultCode === 'RIB-E-OTP003') {
							$scope.otpModel.otp = '';
							// $scope.isEnableConfirm = false;
							// $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
							popupService.showErrorPopupMessage('label.warning', resultCode);
						} else if(resultCode === 'RIB-E-LOG010') {
							showErrorAndLogout(resultCode);
						} else {
							popupService.showErrorPopupMessage('label.warning', resultCode);
						}
					}
				);
			});
		}
		// pin confirm
		$scope.dotpins = [];

		var maxPin = 6;


		$scope.$on('pin-code', function(event, args) {
			var pin = args.value;
			$scope.actionPin = '';
			console.log("$broadcast('pin-code') value", pin)
			// $scope.closeConfirmPinModal();
			//verifytxid + accountfrom + ref1 + amount + verifytxid
			if ($scope.billConfirm.editScheduleBill) {
				confirmEditScheduleBillPay(pin);
			} else {
				confirmBillPay(pin);
			}
		});

		$scope.init = function() {
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
						$scope.init();
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

		$scope.closeConfirmPinModal = function() {
			$scope.isDisableConfirmBtn = false;
			$scope.confirmPinModal.hide();
		};
		// end pin confirm

		function showErrorAndLogout(msg) {
			popupService.errorPopMsgCB(kkconst.ALERT_WARNING_TITLE, msg, function() {
				// pin lock and reset pin
				subscriptionService.logout();
						
				window.location = window.location.href.replace(/#.*/, '');
			});
		}
	});



