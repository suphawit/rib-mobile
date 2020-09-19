angular.module('service.QRScannerService', [])
.service('QRScannerService', function (invokeService, mainSession, popupService,kkconst) {
		
	var QRGeneratorObj = {};

	this.verifyQRData = {};

	this.verifyQRCodeData = function (qrCode,callback) {
		var obj = {};
		obj.params = {};
		obj.params.qrCode = qrCode.text;
		obj.params.codeType = qrCode.format;
		//00020101021129370016A000000677010111021331055380315265303764540810000.005802TH63040120
		//00020101021130670016A0000006770101120115010753600098600021181401001001030910011234553037645802TH63049D22
		//00020101021130670016A00000067701011201150107536000986000211814010010010309100112345530376454041.005802TH6304B871
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_QR_INQUIRY_DATA';
		obj.procedure = 'inquiryDataByQRCodeProcedure';
		
		obj.onSuccess = function (result) {
			var resultObj = result.responseJSON.result;
			callback(resultObj);
		};
		invokeService.executeInvokePublicService(obj);
	};

	this.setQRGeneratorObj = function(QRGeneratorObj) {
		this.QRGeneratorObj = QRGeneratorObj;
	};
	
	this.getQRGeneratorObj = function() {
		return this.QRGeneratorObj;
	};

	this.generateQRCodeData = function (Data,callback) {
		var obj = {};
		obj.params = {};
		obj.params.fromAnyIdType = Data.anyIDType;
		obj.params.fromAnyIdValue = Data.anyIDValue;
		obj.params.amount = Data.amount;
		obj.params.language = mainSession.lang;
		obj.params.format = 'EMV';
		obj.actionCode = 'ACT_QR_GERNERATE';
		obj.procedure = 'generateQRCodeProcedure';
		obj.onSuccess = function (result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode,resultObj);
		};
		invokeService.executeInvokePublicService(obj);
	};

	this.setVerifyQRData = function(value) {
		this.verifyQRData = value;
	};

	this.getVerifyQRData = function() {
		return this.verifyQRData ;
	};

	this.generateTransferQRVerifySlipProcedure = function (data,callback) {
		var _invokeAdapter = { adapter: 'FundTransferAdapter' };
		var obj = {};
		obj.params = {};
		obj.params.transactionRef = data.transactionRef;
		obj.actionCode = 'ACT_GENERATE_TRANSFER_QR_VERIFY_SLIP';
		obj.procedure = 'generateTransferQRVerifySlipProcedure';
		obj.onSuccess = function (result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode,resultObj);
		};
		invokeService.executeInvokePublicService(obj, _invokeAdapter);
	};

	this.generatePaymentQRVerifySlipProcedure = function (data,callback) {
		var obj = {};
		obj.params = {};
		obj.params.transactionRef = data.transactionRef;
		obj.actionCode = 'ACT_GENERATE_PAYMENT_QR_VERIFY_SLIP';
		obj.procedure = 'generatePaymentQRVerifySlipProcedure';
		obj.onSuccess = function (result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode,resultObj);
		};
		invokeService.executeInvokePublicService(obj);
	};

	this.inquiryQRVerifyTransaction = function (data,callback) {
		var obj = {};
		obj.params = {};
		obj.params.transRef = data.transRef;
		obj.params.sendingBank = data.sendingBank;
		obj.params.actionCode = data.actionCode;
		obj.actionCode = 'ACT_INQUIRY_QR_VERIFY_TRANSACTION';
		obj.procedure = 'inquiryQrVerifyTransactionProcedure';
		obj.onSuccess = function (result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode,resultObj);
		};
		invokeService.executeInvokePublicService(obj);
	};

});
