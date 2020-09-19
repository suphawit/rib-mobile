angular.module('ctrl.fundConfirm', []).controller('FundTransferConfirmCtrl',
	function($scope,$ionicModal,$state,$translate,$ionicScrollDelegate,fundtransferService,BankCodesImgService,ValidationService,mainSession,invokeService,popupService,otpService,dateService,scheduleFundtransferService,displayUIService, generalValueDateService,generalService, kkconst,anyIDService,$timeout,deviceService,subscriptionService)// NOSONAR
	{
	
	var CONST_CASA 	= 'CASA';
	var CONT_TD 	= 'TD';
	var CONT_NEW 	= 'NEW';

	var CONST_CONFIRM_PIN_MODAL		= 'templates/Fundtransfer/confirm-pin.html';

	$scope.selectedFromName = fundtransferService.objCreate.selectedFromName;
	$scope.selectedFromTotalActBalance = fundtransferService.objCreate.selectedFromTotalActBalance;
	$scope.toAccountName = fundtransferService.obj.toAccountName;
	$scope.fundTransferTDShow = fundtransferService.objCreate.fundTransferTDShow;
	$scope.getBankCodeImg =  BankCodesImgService.getBankCodeImg; 
	$scope.ownerAccount = fundtransferService.obj.ownerAccount;
	$scope.recurring = '';
	$scope.isCasa = false;
	$scope.transferType = fundtransferService.objCreate.transferType;
	$scope.toBankName = fundtransferService.obj.toBankName;
	$scope.isRequireOtp = fundtransferService.objCreate.isRequireOtp;
	$scope.showSmartColor = false;
	$scope.isDisableConfirmBtn = false;
	$scope.suptitlePin = 'label.enterPIN';
	// $scope.isReqOTP = false;

	$scope.reference = {};
	
	// if($scope.isRequireOtp == false){
	// 	$scope.isReqOTP = true;
	// }else{
	// 	$scope.isReqOTP = false;
	// }

		// $scope.isReqOTP = true;
	
	if($scope.transferType === CONST_CASA){
		$scope.isCasa = true;
	}
	
	if($scope.transferType === CONST_CASA || $scope.transferType === CONT_NEW) {
		$scope.isAnyID = anyIDService.isAnyID(fundtransferService.obj.fundTransferRequest.anyIDType);
		$scope.anyIDIcon	= anyIDService.getAnyIDinfo(fundtransferService.obj.fundTransferRequest.anyIDType).icon;
		$scope.anyIDIconColor	= anyIDService.getAnyIDinfo(fundtransferService.obj.fundTransferRequest.anyIDType).iconColor;
		$scope.rtpReferenceNo = fundtransferService.obj.fundTransferRequest.rtpReferenceNo || '';
		
		// For RTP incoming
		$scope.reference.note = fundtransferService.obj.additionalNote;
	}

	if($scope.transferType !== CONT_TD){
		if(fundtransferService.obj.transactionDate !== undefined){
			$scope.txnDate = displayUIService.convertDateNoTimeForUI(fundtransferService.obj.transactionDate);
		}

		$scope.fundTransferRequest = fundtransferService.obj.fundTransferRequest;
		$scope.clientImgUrl =  $scope.getBankCodeImg($scope.fundTransferRequest.toBankCode, 'image');

		var recurringTypesLangs;
		var timeOfRecurringTypesLangs;
		if(mainSession.lang === kkconst.LANGUAGE_th){
			recurringTypesLangs = dateService.recurringTypesLangs.th;
			timeOfRecurringTypesLangs = dateService.timeOfRecurringTypesLangs.th;
		}else{
			recurringTypesLangs = dateService.recurringTypesLangs.en;
			timeOfRecurringTypesLangs = dateService.timeOfRecurringTypesLangs.en;
		}
		$scope.recurring = fundtransferService.getRecurring(fundtransferService.obj.fundTransferRequest.scheduleType,recurringTypesLangs,fundtransferService.obj.fundTransferRequest.recurringTime,timeOfRecurringTypesLangs);
		$scope.recurringType = fundtransferService.obj.fundTransferRequest.recurringType;

		var dt = $scope.fundTransferRequest.transferDate || '';
		$scope.transferDate = ValidationService.covertStringIntoDate(dt);

		$scope.recDate = '';
		$scope.deducedDate = '';
		$scope.atsTransferDetails = fundtransferService.obj.atsTransferDetails;

		for (var i = 0; i < $scope.atsTransferDetails.length; i++) {
			var item = $scope.atsTransferDetails[i];
			item.atsSummaryFee.receiveDateDisplay = displayUIService.convertDateNoTimeForUI(item.atsSummaryFee.receiveDate);
			item.atsSummaryFee.transferDateDisplay = displayUIService.convertDateNoTimeForUI(item.atsSummaryFee.transferDate);
            item.atsSummaryFee.displayMoment = getDisplayReceiveMoment(item.atsSummaryFee.creditTime);
		}
		$scope.optChargesArray = $scope.atsTransferDetails;
		$scope.selectedOTPChargeDetail = $scope.atsTransferDetails[0];
        isShowSmartColor($scope.selectedOTPChargeDetail.atsSummaryFee.creditTime);
		fundtransferService.obj.feeDetail = $scope.atsTransferDetails[0];
	}else{

		//Get data from service
		$scope.fundTransferRequest = {};
		$scope.fundTransferRequest.amount = parseFloat(generalService.parseNumber(fundtransferService.objConfirm.amount) || '0.00');
		$scope.selectedFromName = fundtransferService.objConfirm.selectedFromName;
		$scope.selectedFromTotalActBalance = fundtransferService.objConfirm.selectedFromTotalActBalance;
		$scope.fundTransferRequest.fromAccount = fundtransferService.objTD.fromAccount;
		$scope.accountDetails = {};
		$scope.fundTransferRequest.toBankCode = fundtransferService.objConfirm.toBankCode;
		$scope.clientImgUrl =  $scope.getBankCodeImg(fundtransferService.objConfirm.toBankCode, 'image');
		$scope.fundTransferRequest.toAccount = fundtransferService.objConfirm.accountNumber;
		$scope.fundTransferRequest.alertSMS = fundtransferService.objTD.alertSMS;
		$scope.fundTransferRequest.alertEmail = fundtransferService.objTD.alertEmail;
		$scope.objTD = fundtransferService.objTD;
		$scope.receiveDateTD = displayUIService.convertDateNoTimeForUI($scope.objTD.receiveDate);
		$scope.deducedDateTD = displayUIService.convertDateNoTimeForUI($scope.objTD.deducedDate);
		$scope.txnDate = displayUIService.convertDateNoTimeForUI($scope.objTD.txnDate);
		// $scope.isReqOTP = true;
	}

	if($scope.transferType === CONT_NEW||$scope.transferType === CONST_CASA){
		$scope.isOtherAcc = true;
	}

	$scope.showOTPChargesModal = function(){
		$scope.OTPChargesModal.show();
	}; 
	
	//------------------ OTP Charges Modal --------------------------------------------

	$scope.isShowOtpChangeModal = false;
	$ionicModal.fromTemplateUrl('templates/Fundtransfer/otp-charges-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {

		$scope.OTPChargesModal = modal;
	});


	$scope.closeOTPChargesModal = function() {
		$scope.isShowOtpChangeModal = false;
		$scope.OTPChargesModal.hide();
	};

	$scope.showOTPChargesModal = function(){
		$scope.isShowOtpChangeModal = true;
		$scope.OTPChargesModal.show();
	}; 
	
	//OTP Charges selection related fields and function
	$scope.selectedOTPChargesIndex = null;     

	$scope.selectedOTPChargesRow = function(index, data){
		
		$scope.selectedOTPChargeDetail = data;
		$scope.selectedOTPChargesIndex = index;
		$scope.selectedOTPChargeDetail.atsSummaryFee.receiveDateDisplay = displayUIService.convertDateNoTimeForUI(data.atsSummaryFee.receiveDate);
		$scope.selectedOTPChargeDetail.atsSummaryFee.transferDateDisplay = displayUIService.convertDateNoTimeForUI(data.atsSummaryFee.transferDate);
		fundtransferService.obj.feeDetail = $scope.selectedOTPChargeDetail;
        isShowSmartColor(data.atsSummaryFee.creditTime);
	};

	$scope.confirmPin = function() {
		$scope.isDisableConfirmBtn = true;
		if($scope.isRequireOtp ==  true){
			$scope.confirmPinModal.show();
		}else {
			$scope.fundtransferConfirm('');
		}
	};
	
	$scope.fundtransferConfirm = function(pin){
		//verifytxid + accountfrom + accountto + amount + verifytxid
		console.log('fundtransferService.obj', fundtransferService.obj)
		var msg = fundtransferService.obj.verifyTransactionId +
			fundtransferService.obj.fundTransferRequest.fromAccount +
			fundtransferService.obj.fundTransferRequest.toAccount +
			fundtransferService.obj.fundTransferRequest.amount +
			fundtransferService.obj.verifyTransactionId;
		deviceService.sign(msg).then(function (digitalSign) {
			// console.log("digitalSign", digitalSign)
			// $scope.fundtransferConfirm(pin, digitalSign.signature);
			var platform = {};
			platform.deviceType = mainSession.deviceType;
			platform.deviceToken = mainSession.deviceToken;
			platform.deviceName = mainSession.devicName;
			platform.deviceModel = mainSession.devicModel;
			platform.deviceUUID = mainSession.deviceUUID;
			platform.osName = mainSession.deviceOS;
			platform.osVersion = mainSession.deviceOsVersion;

			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.pin = pin;
			obj.params.platform = platform;
			obj.params.digitalSign = digitalSign.signature;
			if($scope.transferType !== CONT_TD){

				obj.params.referenceNo = '';
				obj.params.tokenOTPForCAA = '';
				obj.params.otp = '';

				if ($scope.selectedOTPChargeDetail.atsSummaryFee.creditTime != kkconst.TRANSFER_TIME.IMMEDIATE) {
					var label = window.translationsLabel[$translate.use()]['label.fund.confirm.warn.description'];
					var currentDate = moment($scope.selectedOTPChargeDetail.atsSummaryFee.receiveDate, 'DD/MM/YYYY HH:mm:ss')
						.locale($translate.use()).format('DD MMM YYYY');
					var displayMoment = $scope.selectedOTPChargeDetail.atsSummaryFee.displayMoment;
					label = label + currentDate + displayMoment;
					popupService.showConfirmPopupDynamicMessageCallback('label.warning',label,function(ok){
						if(ok) {
							actionFundTransfer(obj);
						}
					});
				}else {
					actionFundTransfer(obj);
				}
			}else{
				obj.params = {};
				obj.params.language = $translate.use();
				obj.params.verifyTransactionId = fundtransferService.objTD.verifyTransactionId;
				obj.params.referenceDetail = $scope.reference.note;

				fundtransferService.funtransferTD(obj,function(responseCode,resultObj){
					if(responseCode === kkconst.success){
						fundtransferService.objConfirm = resultObj;
						fundtransferService.objConfirm.note = $scope.reference.note||'';
						fundtransferService.objConfirm.toBankCode = kkconst.bankcode.kkbank;
						fundtransferService.objConfirm.fromBankcode = fundtransferService.obj.fromBankcode;
						fundtransferService.objConfirm.toBankName = $scope.toBankName;
						fundtransferService.obj.selectedFromName = $scope.selectedFromName;

						// fix to new structure and account for interest
						fundtransferService.objConfirm.benefitAcc = fundtransferService.objConfirm.fundTransferTDRequest.fcconTdTermType.benefitAcc;
						fundtransferService.objConfirm.creditDate = fundtransferService.objConfirm.receiveDate;
						fundtransferService.objConfirm.debitDate = fundtransferService.objConfirm.deducedDate;
						$state.go(kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE);
					}else{
						popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode);
					}
				});
			}
		});
	};

	function actionFundTransfer(obj) {

		//add verifytransactionID
		obj.params.verifyTransactionId  = fundtransferService.obj.verifyTransactionId;
		obj.params.transferTypeCode		= $scope.selectedOTPChargeDetail.transferTypeCode;

		if(fundtransferService.obj.fundTransferRequest.editType === '0' ||  fundtransferService.obj.fundTransferRequest.editType === '1'){
			obj.params.editType = fundtransferService.obj.fundTransferRequest.editType;
			fundtransferService.editScheduleSubmit(obj,function(responseStatus,resultObj){
				if(responseStatus.responseCode === kkconst.success){
					$scope.closeConfirmPinModal();

					fundtransferService.objConfirm = resultObj;
					fundtransferService.objConfirm.note = $scope.reference.note||'';
					fundtransferService.objConfirm.toBankName = resultObj.toAccountInformation.toBankName;
					fundtransferService.objConfirm.fromBankcode = scheduleFundtransferService.scheduleDataDetail.fromBankCode;

					$state.go(kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE);
				}else if(responseStatus.responseCode === 'RIB-E-OTP003'){
					$scope.otpData.pin = '';
					// $scope.isReqOTP = false;
					// $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
					// $scope.isDisableBtn = false;

					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseStatus.errorMessage);//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
				} else if(responseStatus.responseCode === 'RIB-E-LOG010') {
					showErrorAndLogout(responseStatus.errorMessage);
				}else {
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseStatus.errorMessage);//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
				}
			});
		} else{
			// add field memo
			obj.params.memo =  $scope.reference.note || '';
			fundtransferService.fundtransfer(obj,function(responseStatus,resultObj){
				if(responseStatus.responseCode === kkconst.success){
					$scope.closeConfirmPinModal();
					
					fundtransferService.objConfirm = resultObj;
					fundtransferService.objConfirm.note = resultObj.memo;//$scope.reference.note||'';
					fundtransferService.objConfirm.toBankName = resultObj.toAccountInformation.bankName;//$scope.toBankName;
					fundtransferService.objConfirm.fromBankcode = resultObj.fromAccountInformation.bankCode;//fundtransferService.obj.fromBankcode;
					$state.go(kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE);
				}else if(responseStatus.responseCode === 'RIB-E-OTP003') {
					$scope.otpData.pin = '';
					// $scope.isReqOTP = false;
					// $scope.virtualKeyboardOTP.option.isKeyboardActive = false;
					// $scope.isDisableBtn = false;

					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseStatus.errorMessage);//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
				} else if(responseStatus.responseCode === 'RIB-E-LOG010') {
					showErrorAndLogout(responseStatus.errorMessage);
				}else {
					if (responseStatus.responseCode === 'RIB-E-CONN02') {
						//force to dashboard if timeout
						popupService.errorPopMsgCB('label.warning','RIB-E-UNK999',function(ok) {
							if (ok) {
								$state.go(kkconst.ROUNTING.MY_ACCOUNT.STATE);
							}
						});
					}else {
						popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseStatus.errorMessage);//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
					}
				}
			});
		}
	}
	
	/**
	 * Requesting OTP Generate
	 */ 
	// $scope.isOtpReadOnly = true;
	// $scope.requestForOTP = function() {
		// // reset otp counter
		// // disable after reached counter maximum request otp i.e 3 times only. set the style for color code
		// $scope.colorCode = 'blackTextColor';
		// var param = {};
		// 	param.actionOTP = 'fund_transfer';
		// 	param.verifyTransactionId = fundtransferService.obj.verifyTransactionId;
		// // 180223@Edit for fundtransferAdapter
		// otpService.requestOTPFundtransfer(param ,function(resultObj){
		// 	if(resultObj.responseStatus.responseCode === kkconst.success) {
		// 		$scope.isDisableBtn = true;
		// 		$scope.isOtpReadOnly = false;
		// 		$scope.isReqOTP = true;
		// 		$scope.otpData = {
		// 				referenceNo : resultObj.value.referenceNo,
		// 				tokenOTPForCAA :resultObj.value.tokenOTPForCAA,
		// 				mobileNumber :resultObj.value.mobileNo,
		// 				pin: ''
		// 		};
		//
		// 		// set 'isKeyboardActive' virtual keyboard option to true
		// 		// update to virtual keyboard service
		// 		$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
		// 		$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
		// 		$ionicScrollDelegate.scrollBottom(true);
		// 	}else{
		// 		$scope.isDisableBtn = false;
		// 		$scope.isReqOTP = false;
		// 		if(resultObj.responseStatus.responseCode === 'RIB-E-OTP006'){
		// 			$scope.isReqOTP = true;
		// 			$scope.isDisableBtn = true;
		// 		}
		//
		// 		popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,resultObj.responseStatus.responseCode);
		// 	}
		// 	$timeout.cancel(promise);
		// 	var promise = $timeout(function() {
		// 		$scope.isDisableBtn = false;
		// 	}, 15000);
		// });
	// };
	// if($scope.isRequireOtp){
    //     $scope.requestForOTP();
	// }

	// create virtual keyboard option
	// $scope.virtualKeyboardOTP = {
	// 	option: {
	// 		disableDotButton: true,
	// 		isKeyboardActive: false,
	// 		maxlength: 6,
	// 		IsEditModel: true
	// 	}
	// };
	function getDisplayReceiveMoment(creditTime){
        var text = "";
        switch(creditTime) {
            case kkconst.TRANSFER_TIME.IMMEDIATE:
                text = ', ' + window.translationsLabel[mainSession.lang]['label.fundTrfCnfm.immediate'];
                break;
            case kkconst.TRANSFER_TIME.MORNING:
                text = ', ' + window.translationsLabel[mainSession.lang]['label.fundTrfCnfm.morning'];
                break;
            case kkconst.TRANSFER_TIME.EVENING:
                text = ', ' + window.translationsLabel[mainSession.lang]['label.fundTrfCnfm.evening'];
                break;
            default:
                text = '';
        }
        return text;
	}

	function isShowSmartColor(creditTime){
        switch(creditTime) {
            case kkconst.TRANSFER_TIME.IMMEDIATE:
                $scope.showSmartColor = false;
                break;
            case kkconst.TRANSFER_TIME.MORNING:
                $scope.showSmartColor = true;
                break;
            case kkconst.TRANSFER_TIME.EVENING:
                $scope.showSmartColor = true;
                break;
            default:
                $scope.showSmartColor = true;
        }
	}

	// pin confirm
		$scope.dotpins = [];

		var maxPin = 6;


		$scope.$on('pin-code', function(event, args) {
			var pin = args.value;
			$scope.actionPin = '';
			console.log("$broadcast('pin-code') value", pin)
			// $scope.closeConfirmPinModal();
			$scope.fundtransferConfirm(pin);
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

		$ionicModal.fromTemplateUrl(CONST_CONFIRM_PIN_MODAL, {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function(modal) {
			$scope.confirmPinModal = modal;
		});

		$scope.closeConfirmPinModal = function() {
			for(var i=0;i< maxPin;i++){
    			$scope.dotpins[i] = 'circle-color-white';
    		}
       		$scope.passcode = "";
        	$scope.starcode = "";
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
