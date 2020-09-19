angular.module('service.billPaymentRTP', [])
	.service('billPaymentRTPService', function (invokeService, $ionicModal, $ionicPopup, mainSession, $translate, $q, kkconst, $ionicPlatform) {
		this.dataBillpaymentConfirmOTP = {};
		this.dataBillpaymentConfirmComplete = {};

		this.setDataBillpaymentConfirmOTP = function (data) {
			this.dataBillpaymentConfirmOTP = data;
		}

		this.getDataBillpaymentConfirmOTP = function () {
			return JSON.parse(JSON.stringify(this.dataBillpaymentConfirmOTP));
		}

		this.setDataBillpaymentConfirmComplete = function (data) {
			this.dataBillpaymentConfirmComplete = data;
		}

		this.getDataBillpaymentConfirmComplete = function () {
			return JSON.parse(JSON.stringify(this.dataBillpaymentConfirmComplete));
		}

		this.getBillersList = function (callback) {
			var request = {
				params: {
					// cisID: '',
					language: $translate.use()
				},
				actionCode: 'ACT_BPS_INQUIRY_BILLER_CUSTOMER',
				procedure: 'inquiryBillCustomerProcedure',
			};
			request.onSuccess = function (result) {
				callback(result.responseJSON);
			};
			request.onFailure = function (result) {
				callback(result.responseJSON);
			};
			invokeService.executeInvokePublicService(request);
		};


		this.verifyBillPayment = function (data, mycallback) {
			var request = {
				params: {
					fromAccountNumber: data.fromAccountNumber,
					billerId: data.billerId,
					billerProfileId: data.billerProfileId,
					promptpayBillerId: data.promptpayBillerId,
					categoryId: data.categoryId || '',
					payAmount: data.payAmount,
					effectiveDate: data.effectiveDate,
					paymentDate: data.paymentDate,
					msgLanguage: data.msgLanguage,
					immediateType: data.immediateType,
					memo: data.memo,
					recurringType: data.recurringType,
					recurringTimes: typeof data.recurringTimes === "undefined" ? 0 : data.recurringTimes,
					scheduleType: typeof data.scheduleType === "undefined" ? 0 : data.scheduleType,
					rtpReferenceNo: data.rtpReferenceNo,
					reference1: data.reference1,
					reference2: data.reference2,
					reference3: data.reference3,
					profileCode: data.profileCode,
					custName: data.custName,
					barcodeType: data.barcodeType,
					companyCode: data.companyCode,
					serviceCode: data.serviceCode
				},
				actionCode: 'ACT_BPS_VERIFY_BILL_PAYMENT',
				procedure: 'verifyBPSBillpayProcedure'
			};
			request.onSuccess = function (result) {
				mycallback(result.responseJSON);
			};

			request.onFailure = function (result) {
				mycallback(result.responseJSON);
			};
			invokeService.executeInvokePublicService(request);
		}

		this.verifyEditScheduleBillPayment = function (data, callback) {
			var request = {
				params: {
					fromAccountNumber: data.fromAccountNumber,
					billerId: data.billerId,
					promptpayBillerId: data.promptpayBillerId,
					categoryId: data.categoryId || '',
					payAmount: data.payAmount,
					effectiveDate: data.effectiveDate,
					paymentDate: data.paymentDate,
					msgLanguage: data.msgLanguage,
					immediateType: data.immediateType,
					memo: data.memo,
					recurringType: data.recurringType,
					recurringTimes: typeof data.recurringTimes === "undefined" ? 0 : data.recurringTimes,
					scheduleType: typeof data.scheduleType === "undefined" ? 0 : data.scheduleType,
					rtpReferenceNo: data.rtpReferenceNo,
					reference1: data.reference1,
					reference2: data.reference2,
					reference3: data.reference3,
					profileCode: data.profileCode,
					custName: data.custName,
					transactionId: data.transactionId,
					masterTransactionId: data.masterTransactionId,
					editType: data.editType,
					barcodeType: data.barcodeType,
					companyCode: data.companyCode,
					serviceCode: data.serviceCode
				},
				actionCode: 'ACT_BPS_VERIFY_EDIT_BILL_PAYMENT',
				procedure: 'verifyBPSEditBillpayProcedure'
			}
			request.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultCode, resultObj);
				} else {
					callback(resultObj.responseStatus.errorMessage || kkconst.unknown);
				}
			};
			request.onFailure = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				callback(resultObj.responseStatus.errorMessage || kkconst.unknown);
			};

			invokeService.executeInvokePublicService(request);
		};

		this.getRequestOTP = function (actionCodeOTP, callback) {
			var verifyTransactionID = this.dataBillpaymentConfirmOTP.resultVerifyBill.verifyTransactionID;
			var request = {
				params: {
					actionOTP: actionCodeOTP, //bill_payment_edonation
					language: $translate.use(),
					verifyTransactionId: verifyTransactionID
				},
				actionCode: 'ACT_BPS_REQUEST_OTP',
				procedure: 'requestOTPWithLoginProcedure',
			}
			request.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultCode, resultObj);
				} else {
					callback(resultCode || kkconst.unknown);
				}
			};

			request.onFailure = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				callback(resultCode || kkconst.unknown);
			};

			invokeService.executeInvokePublicService(request);

		};

		this.confirmBillpay = function (dataConfirmBillpay, callback) {
console.log('confirmBillpay dataConfirmBillpay', dataConfirmBillpay)
			var deviceUUID 		= mainSession.deviceUUID;
			var deviceOS 		= mainSession.deviceOS;
			var deviceName 		= mainSession.devicName;
			var deviceModel 	= mainSession.devicModel;
			var deviceToken 	= mainSession.deviceToken;
			var deviceVersion 	= mainSession.deviceOsVersion;
			var deviceType		= mainSession.deviceType;

			var platform = {};
			platform.deviceType = deviceType;
			platform.deviceToken = deviceToken;
			platform.deviceName = deviceName;
			platform.deviceModel = deviceModel;
			platform.deviceUUID = deviceUUID;
			platform.osname = deviceOS;
			platform.osversion = deviceVersion;
			var request = {
				params: {
					memo: dataConfirmBillpay.memo,
					verifyTransactionID: dataConfirmBillpay.verifyTransactionID,
					referenceNO: dataConfirmBillpay.referenceNO,
					// otp: dataConfirmBillpay.otp,
					otp: '',
					tokenOTPForCAA: dataConfirmBillpay.tokenOTPForCAA,
					platform: platform,
					pin: dataConfirmBillpay.pin || '',
					digitalSign: dataConfirmBillpay.digitalSign || '',
				},
				actionCode: 'ACT_BPS_CONFIRM_BILL_PAYMENT',
				procedure: 'confirmBPSBillpayProcedure'
			};

			request.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultCode, resultObj);
				} else {
					callback(resultCode || kkconst.unknown);
				}
			};

			request.onFailure = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				callback(resultCode || kkconst.unknown);
			};

			invokeService.executeInvokePublicService(request);
		};


		this.confirmEditScheduleBillPayment = function (dataConfirmBill, callback) {
			var deviceUUID 		= mainSession.deviceUUID;
			var deviceOS 		= mainSession.deviceOS;
			var deviceName 		= mainSession.devicName;
			var deviceModel 	= mainSession.devicModel;
			var deviceToken 	= mainSession.deviceToken;
			var deviceVersion 	= mainSession.deviceOsVersion;
			var deviceType		= mainSession.deviceType;

			var platform = {};
			platform.deviceType = deviceType;
			platform.deviceToken = deviceToken;
			platform.deviceName = deviceName;
			platform.deviceModel = deviceModel;
			platform.deviceUUID = deviceUUID;
			platform.osname = deviceOS;
			platform.osversion = deviceVersion;
			var request = {
				params: {
					memo: dataConfirmBill.memo,
					verifyTransactionID: dataConfirmBill.verifyTransactionID,
					referenceNO: dataConfirmBill.referenceNO,
					otp: dataConfirmBill.otp,
					tokenOTPForCAA: dataConfirmBill.tokenOTPForCAA,
					platform: platform,
					pin: dataConfirmBill.pin || '',
					digitalSign: dataConfirmBill.digitalSign || '',
				},
				actionCode: 'ACT_BPS_CONFIRM_EDIT_BILL_PAYMENT',
				procedure: 'confirmBPSEditBillpayProcedure'
			};
			request.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultCode, resultObj);
				} else {
					callback(resultCode || kkconst.unknown);
				}
			};
			request.onFailure = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				callback(resultCode || kkconst.unknown);
			};

			invokeService.executeInvokePublicService(request);
		};

		this.inquiryPayInfoOnline = function(params){
			var defered = $q.defer();
			var obj = new Object();
			obj.params = {};
				
			obj.params.companyCode = params.companyCode || '';
			obj.params.serviceCode = params.serviceCode || '';
			obj.params.promptPayBillerId = params.promptPayBillerId;
			obj.params.ref1 = params.ref1;
			obj.params.ref2 = params.ref2;
			obj.params.ref3 = params.ref3 || '';
			obj.params.ref4 = params.ref4 || '';
			
			obj.actionCode = 'ACT_BPS_INQUIRY_PAY_INFO_ONLINE';
			obj.procedure = 'inquiryPayInfoOnlineProcedure';
			
			obj.onSuccess = function(result) {  
				var resultObj = result.responseJSON.result;
				defered.resolve(resultObj);
			};

			// Execute
			invokeService.executeInvokePublicService(obj);

			return defered.promise;
		};
	});//End billPayment
