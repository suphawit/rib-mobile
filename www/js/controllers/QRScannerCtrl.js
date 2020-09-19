angular.module('ctrl.qrscanner',[])
.controller('QRScannerCtrl', function($scope,QRScannerService,fundTransferTOService,kkconst,$ionicPlatform,popupService,manageBillerPromptPayService,mainSession, $translate, fundtransferService,qrcodeBarcodeInfoService) {

	$scope.isScanning = false;
	$scope.scanQRCode  = function(){
		if(!$scope.isScanning){
			$scope.isScanning = true;
			$ionicPlatform.ready(function() {
				window.cordova.plugins.barcodeScanner.scan(
					function (result) {
						if(result.cancelled === 0 || result.cancelled === false){ //scan success
							// var qrCode = result.text;
							var param = {};
							param.barcodeType = result.format;
							param.barcodeInfo = result.text;
							param.actionCode = 'QRCODE';
							$scope.verifyQRCode(param);
						}

						$scope.isScanning = false;
					},
					function (error) {
						popupService.showErrorPopupMessage('alert.title', 'Scanning failed: '+ error);
						$scope.isScanning = false;
					},
					{
						preferFrontCamera : false, // iOS and Android
						showFlipCameraButton : false, // iOS and Android
						showTorchButton : false, // iOS and Android
						torchOn: false, // Android, launch with the torch switched on (if available)
						saveHistory: true, // Android, save scan history (default false)
						prompt : "Place a QR Code inside the scan area", // Android
						resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
						formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
						orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
						disableAnimations : true, // iOS
						disableSuccessBeep: true // iOS and Android
					}
				);
					//$scope.isScanning = false;
			});
		}

	};

	$scope.verifyQRCode = function(param){
		qrcodeBarcodeInfoService.inquiryDataQrcodeBarCode(param,function(responseStatus,resultObj){
			if(responseStatus.responseCode === kkconst.success) {
				var QRCodeObj = resultObj.value;
				if(QRCodeObj.actionCode === 'FUND_TRANSFER'){
					var fundData = {
						accountAliasName: QRCodeObj.toAccountAliasName,
						accountNumber: QRCodeObj.toAnyIdValue,
						accountName : QRCodeObj.toAccountAcctName,
						anyIDType : QRCodeObj.toAnyIdType,
						amount: QRCodeObj.amount,
						scanFlag: 'Y',
						toBankCode: QRCodeObj.toBankCode || undefined
					}
					fundTransferTOService.setSelectedAccount(fundData);
					$scope.gotoFund();
				}else if(QRCodeObj.actionCode === 'BILL_PAYMENT'){
					var refInfos = QRCodeObj.refInfos;
					var billerData = {
						profileCode : QRCodeObj.profileCode,
						promptPayBillerId : QRCodeObj.promptPayBillerId,
						categoryId : QRCodeObj.categoryId,
						billerNameEn : QRCodeObj.billerNameEn,
						billerNameTh : QRCodeObj.billerNameTh,
						billerProfileId : QRCodeObj.billerProfileId,
						companyEn : QRCodeObj.companyName,
						companyTh : QRCodeObj.companyName,
						refInfos : refInfos,
						subServiceEn: QRCodeObj.serviceName,
						subServiceTh: QRCodeObj.serviceName,
						amount:  parseFloat(QRCodeObj.amount) || 0.00,
						barcodeType: QRCodeObj.dataFormatType,
						flagAmountFix: QRCodeObj.flagAmountFix,
						companyCode: QRCodeObj.companyCode,
						serviceCode: QRCodeObj.serviceCode
					};
					manageBillerPromptPayService.setDataBillerDefault(billerData);
					if (QRCodeObj.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                        $scope.gotoEDonation();
					}else {
                        $scope.gotoBillRTP();
					}

				}else if (QRCodeObj.actionCode === 'VER_SLIP') {
					QRScannerService.inquiryQRVerifyTransaction(QRCodeObj, function (status, data) {
						if(data.responseStatus.responseCode === kkconst.success) {
							var title;
							var slipData = data.value;
							if (QRCodeObj.refInfos) {
								slipData.refInfos = QRCodeObj.refInfos;
							}
							if (QRCodeObj.categoryId) {
								slipData.categoryId = QRCodeObj.categoryId;
							}
							console.log(slipData)
							slipData.transactionType = slipData.action;
							if (slipData.action === 'BILL') {
								title = window.translationsLabel[$translate.use()]['label.verifyQR.bill.title'];
								slipData.pageTitle = title;
								QRScannerService.setVerifyQRData(slipData);
								$scope.gotoVerifyQRBillPaymentDetailPage();
							}else if (slipData.action === 'FUND') {
								title = window.translationsLabel[$translate.use()]['label.verifyQR.fund.title'];
								slipData.pageTitle = title;
								QRScannerService.setVerifyQRData(slipData);
								$scope.gotoVerifyQRFundTransferDetailPage();
							}
						}else {
							popupService.showErrorPopupMessage('alert.title', data.responseStatus.errorMessage);
						}
					});
				}
				$scope.isScanning = false;
			} else {
				popupService.showErrorPopupMessage('alert.title', responseStatus.errorMessage);
				$scope.isScanning = false;
			}

		});
	}
    //wrong qr
    // $scope.verifyQRCode({format:'QR_CODE', text: '00020101021130530016A00000067701011201151265836747659960210NOTENTERED5802TH530376462240720Q076590000042300031363042985'});
	//bill
    //$scope.verifyQRCode({format: 'QR_CODE', text: '0038000600000101030690217RIB181217000000415102TH9104F23C'});
    // $scope.verifyQRCode({barcodeType: 'QR_CODE', barcodeInfo: '00020101021130510016A0000006770101120115099300015667690020300103010530376454031005802TH630497FF', 'actionCode' : 'QRCODE'});
    // $scope.verifyQRCode({barcodeType: 'QR_CODE', barcodeInfo: '00020101021130730016A0000006770101120115010554803832901021650000000000045440310093331998631790016A00000067701011301031100203CsB03410116500000000000454403031080410ทดสอบ test530376454040.005802TH5914MPAY_PROMPTPAY62070703108630469AB', 'actionCode' : 'QRCODE'});
    // $scope.verifyQRCode({barcodeType: 'QR_CODE', barcodeInfo: '0039000600000101030690218TR11902132000002195102TH91040C2C', 'actionCode' : 'QRCODE'});
    // $scope.verifyQRCode({barcodeType: 'QR_CODE', barcodeInfo: '0039000600000101030690218TR11902132000002125102TH9104D658', 'actionCode' : 'QRCODE'});
    // $scope.verifyQRCode({barcodeType: 'QR_CODE', barcodeInfo: '00020101021129370016A0000006770101110213413357280999353037645802TH6304AD61', 'actionCode' : 'QRCODE'});
})