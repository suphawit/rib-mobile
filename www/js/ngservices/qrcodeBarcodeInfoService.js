angular.module('service.qrcodeBarcodeInfoService', [])
    .service('qrcodeBarcodeInfoService', function (invokeService, $translate, kkconst, $q, $ionicPlatform, popupService) {

        this.inquiryQrcodeBarCodeInfoForAdd = function (data, callback) {
            var request = {
                params: {
                    language: $translate.use(),
                    barcodeType: data.barcodeType,
                    barcodeInfo: data.barcodeInfo
                },
                actionCode: 'ACT_BPS_INQUIRY_BILL_PAYMENT_BARCODE_QRCODE_INFO_FOR_ADD',
                procedure: 'inquiryBpsBillPaymentBarcodeQrCodeInfoForAddProcedure',
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultObj.responseStatus, resultObj);
				} else {
					callback(resultObj.responseStatus || kkconst.unknown);
				}
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
				callback(resultObj.responseStatus || kkconst.unknown);
            };
            invokeService.executeInvokePublicService(request);

        };


        var isScanning = false;
		this.scanBill = function(formats){
			var deferred = $q.defer();
			if(!isScanning){
				isScanning = true;
				$ionicPlatform.ready(function() {
					cordova.plugins.barcodeScanner.scan(
						function (result) {
							if(result.cancelled === 0 || result.cancelled === false){ //scan success
								deferred.resolve(result);
							}
							
							isScanning = false;	
						},
						function (error) {
							popupService.showErrorPopupMessage('alert.title', 'Scanning failed: '+ error);
							isScanning = false;
						},
						{
							preferFrontCamera : false, // iOS and Android
							showFlipCameraButton : false, // iOS and Android
							showTorchButton : false, // iOS and Android
							torchOn: false, // Android, launch with the torch switched on (if available)
							saveHistory: true, // Android, save scan history (default false)
							prompt : "Place a barcode inside the scan area", // Android
							resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
							formats : formats, // default: all but PDF_417 and RSS_EXPANDED
							orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
							disableAnimations : true, // iOS
							disableSuccessBeep: true // iOS and Android
						}
					);

				});
			}

			return deferred.promise;
		};

		this.inquiryQrcodeBarCodeInfo = function (data, callback) {
            var request = {
                params: {
                    language: $translate.use(),
                    barcodeType: data.barcodeType,
                    barcodeInfo: data.barcodeInfo
                },
                actionCode: 'ACT_BPS_INQUIRY_BILL_PAYMENT_BARCODE_QRCODE_INFO',
                procedure: 'inquiryBpsBillPaymentBarcodeQrCodeInfoProcedure',
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultObj.responseStatus, resultObj);
				} else {
					callback(resultObj.responseStatus || kkconst.unknown);
				}
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
				callback(resultObj.responseStatus || kkconst.unknown);
            };
            invokeService.executeInvokePublicService(request);

        };

		this.inquiryDataQrcodeBarCode = function (data, callback) {
            var request = {
                params: {
                    actionCode: data.actionCode,
                    barcodeType: data.barcodeType,
                    barcodeInfo: data.barcodeInfo
                },
                actionCode: 'ACT_INQUIRY_DATA_QR_CODE_BAR_CODE',
                procedure: 'inquiryDataByQRCodeAndBarCodeProcedure',
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultObj.responseStatus, resultObj);
				} else {
					callback(resultObj.responseStatus || kkconst.unknown);
				}
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
				callback(resultObj.responseStatus || kkconst.unknown);
            };
            invokeService.executeInvokePublicService(request);

        };

    });