angular.module('ctrl.fundComplete', ['monospaced.qrcode']).controller('FundTransferCompleteCtrl',
	function($scope,$state,$ionicListDelegate,$ionicModal,$interval,fundtransferService,BankCodesImgService ,mainSession,fundTransferService,dateService,$timeout,displayUIService,popupService,otherAccountService, kkconst, anyIDService,$ionicHistory, cordovadevice, notificationService, $ionicPlatform) {
	
	var anyIDTypeSelected = fundtransferService.objCreate.transferType === 'TD' ? kkconst.ANY_ID_TYPE.ACCOUNT : fundtransferService.objConfirm.toAccountInformation.anyIdType;//fundtransferService.objConfirm.anyIDType;

	$scope.accountNumMark = {};
	$scope.selectedFromName = fundtransferService.obj.selectedFromName;
	$scope.fromAccountBalance = fundtransferService.objConfirm.fromAccountBalance;
	
	$scope.fundTransferTDShow = fundtransferService.objCreate.fundTransferTDShow;
	$scope.getBankCodeImg =  BankCodesImgService.getBankCodeImg; 
	
	$scope.refNo = fundtransferService.objConfirm.transactionRef || fundtransferService.objConfirm.refNo;
	$scope.tnxDateCASA = displayUIService.convertDateTimeForTxnDateNoSecUI(fundtransferService.objConfirm.txnDate);
	$scope.tnxDateCASAReceipt = displayUIService.convertDateTimeForTxnDateNoSecUI(fundtransferService.objConfirm.txnDate);
	$scope.receiveDate = displayUIService.convertDateNoTimeForUI(fundtransferService.objConfirm.creditDate);//displayUIService.convertDateNoTimeForUI(fundtransferService.objConfirm.receiveDate);
	$scope.deductedDate = displayUIService.convertDateNoTimeForUI(fundtransferService.objConfirm.debitDate);//displayUIService.convertDateNoTimeForUI(fundtransferService.objConfirm.deducedDate);
	$scope.toBankName = fundtransferService.objConfirm.toBankName;
	$scope.fromActbankCode = fundtransferService.objConfirm.fromBankcode;
	$scope.fromImgUrl = $scope.getBankCodeImg($scope.fromActbankCode, 'image');
	$scope.note = fundtransferService.objConfirm.note;
	$scope.transactionStatusCode = fundtransferService.objConfirm.transactionStatusCode;
	$scope.transactionStatusDesc = fundtransferService.objConfirm.transactionStatusDesc;
	$scope.existingTransferAccountNo = fundtransferService.objConfirm.existingTransferAccountNo;
	
	$scope.isAnyID = anyIDService.isAnyID(anyIDTypeSelected);
	$scope.anyIDIcon	= anyIDService.getAnyIDinfo(anyIDTypeSelected).icon;
	$scope.anyIDIconColor	= anyIDService.getAnyIDinfo(anyIDTypeSelected).iconColor;
	$scope.refTxnId = fundtransferService.objConfirm.refTxnId;
	$scope.txnId =  fundtransferService.objConfirm.txnId;
	$scope.canPrintSlip =  fundtransferService.objConfirm.canPrintSlip;

	$scope.recieptCanvas = null;
	$scope.recieptImgUrl;
	$scope.isWaitToSaveSlip = true;

	var isStatus = fundtransferService.chkFundTransferStatusCode(fundtransferService.objConfirm.fundTransferStatusCode);
	var statusDesc = {true : window.translationsLabel[mainSession.lang]['label.fundTransferFailStatus'] +' - '+ fundtransferService.objConfirm.fundTransferStatusDesc,
						false:fundtransferService.objConfirm.fundTransferStatusDesc}; 
						
	$scope.fundTransferStatusDesc = statusDesc[isStatus];
	// 	$scope.fundTransferStatusDesc = fundtransferService.objConfirm.fundTransferStatusDesc;
    // if (isStatus) {
    // 	$scope.fundTransferStatusDesc = translationsLabel[mainSession.lang]['label.fundTransferFailStatus'] +' - '+ window.translationsError[mainSession.lang][fundtransferService.objConfirm.fundTransferStatusCode];
    // }
	

	function SubstringMark(text,type,anyIdType) {
		var char = text;
		this.trail='xxx';
		this.anyIdType = anyIdType;
		this.trailX  = '';

		if( type === 'to' && anyIdType !== "ACCTNO"){
			var length = char.length - 6;
			for( var i = 0;i< length;i++){
				this.trailX = this.trailX + 'x';
			}
			char = char.slice(0, 3) + this.trailX + char.slice(-3);
			return char;
		}else{
			char = this.trail + char.slice(-6);
			return char;
		}
	}

	if(fundtransferService.objCreate.transferType === 'TD'){
		
		$scope.clientImgUrl =  $scope.getBankCodeImg(fundtransferService.objConfirm.toBankCode, 'image');
		$scope.transferAmount = fundtransferService.objConfirm.fundTransferTDRequest.amount;
		$scope.tdObj = fundtransferService.objConfirm;
		$scope.txnDateDisplay = displayUIService.convertDateTimeForTxnDateNoSecUI($scope.tdObj.txnDate);
		$scope.txnDateDisplayReceipt = displayUIService.convertDateTimeForTxnDateNoSecUI($scope.tdObj.txnDate);
		$scope.maturityDateDisplay = displayUIService.convertDateNoTimeForUI($scope.tdObj.maturityDate);
		$scope.valueDate = displayUIService.convertDateNoTimeForUI($scope.tdObj.valueDate);
		$scope.fundTransferRequest = {};
		$scope.fundTransferRequest.toBankCode = fundtransferService.obj.bankCode;//from local cache
		$scope.fundTransferRequest.fromAccountAliasName = fundtransferService.objConfirm.fromAccountAliasName;
		$scope.fromAccountName = fundtransferService.objConfirm.fromAccountName;
		$scope.fundTransferRequest.fromAccount = fundtransferService.objConfirm.fundTransferTDRequest.fromAccount;
		$scope.accountNumMark.fromAccount  =  SubstringMark($scope.fundTransferRequest.fromAccount,'from',$scope.fundTransferRequest.anyIDType);
		$scope.fundTransferRequest.toAccountName = fundtransferService.objConfirm.toAccountName;
		$scope.fundTransferRequest.toAccount = fundtransferService.objConfirm.fundTransferTDRequest.toAccount;
		$scope.accountNumMark.toAccount  =   SubstringMark($scope.fundTransferRequest.toAccount,'to',$scope.fundTransferRequest.anyIDType);
		$scope.fundTransferRequest.alertSMS = fundtransferService.objConfirm.fundTransferTDRequest.alertSMS;
		$scope.fundTransferRequest.alertEmail = fundtransferService.objConfirm.fundTransferTDRequest.alertEmail;
		
	}else{
		$scope.recurringType = fundtransferService.objConfirm.recurringType;//fundtransferService.obj.fundTransferRequest.recurringType;
		$scope.clientImgUrl =  $scope.getBankCodeImg(fundtransferService.objConfirm.toAccountInformation.bankCode, 'image');//$scope.getBankCodeImg(fundtransferService.objConfirm.fundTransferRequest.toBankCode, 'image');
		$scope.transferAmount = fundtransferService.objConfirm.transferAmount;//fundtransferService.objConfirm.fundTransferRequest.amount;
		//$scope.fundTransferRequest = fundtransferService.objConfirm.fundTransferRequest;
		$scope.fundTransferRequest = {
			fromAccountAliasName: fundtransferService.objConfirm.fromAccountInformation.aliasName,
			fromAccountName: fundtransferService.objConfirm.fromAccountInformation.accountName,
			fromBankCode: fundtransferService.objConfirm.fromAccountInformation.bankCode,
			fromAccount: fundtransferService.objConfirm.fromAccountInformation.accountNo,
			anyIDType: fundtransferService.objConfirm.toAccountInformation.anyIdType,
			toBankCode: fundtransferService.objConfirm.toAccountInformation.bankCode,
			toAccountName: fundtransferService.objConfirm.toAccountInformation.accountName,
			toAccount: fundtransferService.objConfirm.toAccountInformation.accountNo,
			alertSMS: fundtransferService.objConfirm.alertSMS,
			alertEmail: fundtransferService.objConfirm.alertEmail
		};
		$scope.accountNumMark.fromAccount = fundtransferService.objConfirm.fromAccountInformation.markingAccountNo;//SubstringMark($scope.fundTransferRequest.fromAccount,'from',$scope.fundTransferRequest.anyIDType);
		$scope.accountNumMark.toAccount  =  fundtransferService.objConfirm.toAccountInformation.markingAccountNo;//SubstringMark($scope.fundTransferRequest.toAccount,'to',$scope.fundTransferRequest.anyIDType);
		$scope.feeAmount = fundtransferService.objConfirm.feeAmount;
		var recurringTypesLangs = dateService.recurringTypesLangs[mainSession.lang.toLowerCase()];
		var timeOfRecurringTypesLangs = dateService.timeOfRecurringTypesLangs[mainSession.lang.toLowerCase()];
		$scope.recurring = fundtransferService.getRecurring(fundtransferService.objConfirm.scheduleType,recurringTypesLangs,fundtransferService.objConfirm.recurringTime,timeOfRecurringTypesLangs);//fundtransferService.getRecurring(fundtransferService.obj.fundTransferRequest.scheduleType,recurringTypesLangs,fundtransferService.objConfirm.fundTransferRequest.recurringTime,timeOfRecurringTypesLangs);
		$scope.rtpReferenceNo = fundtransferService.objConfirm.rtpReferenceNo || '';
		// if($scope.rtpReferenceNo){
		// 	notificationService.badgeMenuCountProcedure(function ( resultCode, resultObj ) {
		// 		if (resultCode === kkconst.success) {
		// 			notificationService.setBadgeMenuList(resultObj.value);
		// 		}
		// 	})
		// }

		$scope.qrData =  fundtransferService.objConfirm.qrData;

		$scope.banksList = fundtransferService.bankList;

		$scope.fromBankName = getBankName($scope.fundTransferRequest.fromBankCode);
	}

	var gotoAddAccount = function(){
			var new_acc = {};
				new_acc.acc_no = $scope.fundTransferRequest.toAccount;
				new_acc.alias_name = '';
				new_acc.alias_bank = $scope.toBankName;
				new_acc.acc_mobile = $scope.fundTransferRequest.alertSMS;
				new_acc.acc_email = $scope.fundTransferRequest.alertEmail;
				new_acc.bank_id = $scope.fundTransferRequest.toBankCode;
				new_acc.TOimgUrl = $scope.clientImgUrl;
				new_acc.refTxnId = $scope.refTxnId;
				new_acc.txnId = $scope.txnId;

			var stateName = 'app.addOtherAccount';
			var acc_type = fundtransferService.objConfirm.addAccountType;
			new_acc.acc_Name = fundtransferService.emptyVal(fundtransferService.obj.toAccountName);
			new_acc.anyIDType = $scope.fundTransferRequest.anyIDType;
			if(acc_type !== 'OTHER_ACCOUNT'){
				stateName = 'app.addMyAccounts';
			} 

			fundTransferService.setaddAccountFundTransfer(new_acc);

			$ionicHistory.clearCache().then(function () {
				$state.go(stateName);
			});
		
	}

	var addNewAccountScreenCallback = function(ok){
		if(ok){
			gotoAddAccount();
		} else {
			$ionicListDelegate.closeOptionButtons();
		}
	}
	$scope.addNewAccountScreen = function(){	
		popupService.showConfirmPopupMessageCallback('label.addAcc','label.addaccountpopupmsg',function(ok){
			addNewAccountScreenCallback(ok);
		});	
	};

	$ionicModal.fromTemplateUrl('templates/Fundtransfer/fundtransfer-reciept.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.recieptModal = modal;
	});
		var history = $ionicHistory.viewHistory();
		if ($scope.canPrintSlip && !history.forwardView) {
			angular.element(document).ready(function () {
				setTimeout(function () {
					//TODO fix save without show modal in another release
					// var node = document.getElementById('slip');
					// domtoimage.toCanvas(node).then(function (canvas) {
					//     canvas.id = "recieptCanvas";
					//     canvas.style.width = "100%";
					//     $scope.recieptCanvas = canvas;
					//     $scope.recieptImgUrl = canvas.toDataURL();
					//     console.log($scope.recieptCanvas)
					//     saveImage();
					// }).catch(function (error) {
					//     //use save screen
					//     console.log(error)
					//     $scope.showReceiptPage();
					// });
					$scope.showReceiptPage();
				}, 1000);
			});
		}else {
		    $scope.isWaitToSaveSlip = false;
        }

	$scope.closeReceiptModal = function() {
		$scope.recieptModal.hide();
	};
	$scope.showReceiptPage = function(){
		$scope.recieptModal.show();
	};
	$scope.$on('modal.shown', function() {
		saveImage();
	});
	
	function getReceiptGenerateFile(dateFormat) {
		var yyyy = dateFormat.getFullYear();
		var mm = dateFormat.getMonth()+1;
		var dd  = dateFormat.getDate();
        return 'KK_TXT_' + String(10000 * yyyy + 100 * mm + dd) + '_' + Math.floor((Math.random() * 100000) + 1);
	}
	
	var stop;

		function saveImage() {
            $ionicPlatform.ready(function () {
                var permissions = window.cordova.plugins.permissions;
                permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                	console.log(JSON.stringify(status))
                    if (status.hasPermission) {
						callSaveImgPlugin();
                    }
                    else {
                        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                            if (status.hasPermission) {
								callSaveImgPlugin();
                            } else {
                                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail');
								$scope.closeReceiptModal();
                            }
                        }, null);
                    }
                });

            });
        };

		function callSaveImgPlugin() {
            if ($scope.recieptCanvas) {
                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function (msg) {
                        popupService.showErrorPopupMessage('label.success', 'label.saveImgSuccess');
                    },
                    function (err) {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail');
                    },
                    $scope.recieptCanvas
                );
				$scope.isWaitToSaveSlip = false;
            } else {
                //save screen
                $scope.getReceipt(function (data) {
                    // if (data.img) {
                    //     $scope.recieptImgUrl = data.img;
                    // }
					console.log(data)
					var fileName = getReceiptGenerateFile(new Date());
					var params = {data: data, prefix: fileName, format: 'JPG', quality: 80};
					if (cordovadevice.properties('platform') !== 'preview') {
						window.imageSaver.saveBase64Image(params, function (filePath) {
							// $scope.recieptImgUrl = filePath;
								$scope.recieptImgUrl = data;

							screenShotSaveCallback(null);
						},
							function (msg) {
								screenShotSaveCallback(msg);
							});
					}
                });
            }
        };

		function screenShotSaveCallback(error) {
            if (!error) {
                popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (resultObj) {
                    if (resultObj) {
                        $scope.closeReceiptModal();
                    }
                });
            }else {
				$scope.closeReceiptModal();
			}
			$scope.isWaitToSaveSlip = false;
        };

        $scope.getReceipt = function (callback) {
            if (cordovadevice.properties('platform') !== 'preview') {
                stop = $interval(function () {
				navigator.screenshot.URI(function (error, res) {
                        callback(res.URI);
                        $interval.cancel(stop);
                        stop = undefined;
                    }, 'jpg', 50);
                }, 1200);
            }
        };

        $scope.shareReceipt = function () {
            var shareImg = $scope.recieptImgUrl;
            window.plugins.socialsharing.share(null, null, shareImg, null);
        };

		function getBankName(bankCode) {
			if (!angular.isUndefined($scope.banksList)) {
				for (var i = 0; i < $scope.banksList.length; i++) {
					if (bankCode === $scope.banksList[i].bankCode) {
						return $scope.banksList[i].bankName;
					}
				}
			}
		}
	
});
