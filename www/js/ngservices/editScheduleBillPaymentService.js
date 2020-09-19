angular.module('service.editScheduleBillPaymentService',[])
.service('editScheduleBillPaymentService', function($translate, $filter, invokeService, generalService, 
		dateService, generalValueDateService, displayUIService, popupService, mainSession, kkconst) {

	var verifyEditScheduleBillPaymentRequest   = {};
	var verifyEditScheduleBillPaymentResponse  = {};
	var confirmEditScheduleBillPaymentRequest  = {};
	var confirmEditScheduleBillPaymentResponse = {};
	
	var performVerifyEditScheduleBillPayment = function(inputDataEditScheduleBill) {
		var obj = new Object();
		obj.params = {};
		obj.params.billPayment = {};
		obj.params.billPayment.fromAccountNumber = inputDataEditScheduleBill.fromAccountNumber;
		obj.params.billPayment.billerID = inputDataEditScheduleBill.billerID;
		obj.params.billPayment.payAmount = inputDataEditScheduleBill.payAmount;
		obj.params.billPayment.feeAmount = inputDataEditScheduleBill.feeAmount;
		obj.params.billPayment.effectiveDate = inputDataEditScheduleBill.effectiveDate;
		obj.params.billPayment.paymentDate = inputDataEditScheduleBill.paymentDate;
		obj.params.billPayment.msgLanguage = inputDataEditScheduleBill.msgLanguage;
		obj.params.billPayment.immediateType = inputDataEditScheduleBill.immediateType;
		obj.params.billPayment.recurringType = inputDataEditScheduleBill.recurringType;
        obj.params.billPayment.recurringTimes = inputDataEditScheduleBill.recurringTimes;
        obj.params.billPayment.scheduleType = inputDataEditScheduleBill.scheduleType;
        obj.params.billPayment.referenceNO = inputDataEditScheduleBill.referenceNO;
        obj.params.billPayment.transactionID = inputDataEditScheduleBill.transactionID;
        obj.params.billPayment.masterTransactionID = inputDataEditScheduleBill.masterTransactionID;
        obj.params.billPayment.effectiveDate = inputDataEditScheduleBill.effectiveDate;
        obj.params.billPayment.paymentDate = inputDataEditScheduleBill.paymentDate;
        obj.params.billPayment.editType = inputDataEditScheduleBill.editType;
        obj.actionCode = 'ACT_VERIFY_EDIT_BILL_PAYMENT';
        obj.procedure = 'editBillPaymentProcedure'; 
		invokeService.executeInvokePublicService(obj);
		return obj;
	};
	
	var performConfirmEditScheduleBillPayment = function(inputDataEditScheduleBill) {
		var obj = new Object();
		obj.params = {};
		obj.params.verifyTransactionID = inputDataEditScheduleBill.verifyTransactionID;
		obj.params.memo = inputDataEditScheduleBill.memoNote;  
        obj.params.otp = inputDataEditScheduleBill.otp;
        obj.params.referenceNO = inputDataEditScheduleBill.referenceNo;
        obj.params.tokenOTPForCAA = inputDataEditScheduleBill.tokenOTPForCAA;
        obj.actionCode = 'ACT_CONFIRM_EDIT_BILL_PAYMENT';
        obj.procedure = 'confirmEditBillPaymentProcedure'; 
		invokeService.executeInvokePublicService(obj);
		return obj;
	};
	
	this.setVerifyEditScheduleBillPaymentRequest = function(requestObject) {
		this.verifyEditScheduleBillPaymentRequest = requestObject;
	};
	
	this.setVerifyEditScheduleBillPaymentResponse = function(responseObject) {
		this.verifyEditScheduleBillPaymentResponse = responseObject;
	};
	
	this.setComfirmEditScheduleBillPaymentRequest = function(requestObject) {
		this.confirmEditScheduleBillPaymentRequest = requestObject;
	};
	
	this.setComfirmEditScheduleBillPaymentResponse = function(responseObject) {
		this.confirmEditScheduleBillPaymentResponse = responseObject;
	};
	
	this.verifyEditScheduleBillPayment = function(inputDataVarifyBill, callback){
        var obj = performVerifyEditScheduleBillPayment(inputDataVarifyBill);
        obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			if(kkconst.success == resultCode) {
				callback(resultCode, resultObj);
			} else {
				callback(resultCode||kkconst.unknown);
			}
		};
        obj.onFailure = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode||kkconst.unknown);
        };
	};
	
	this.requestOTPForEditScheduleBillPayment = function(callback){
		var obj = new Object();
		var invokeAdapter = { adapter: 'otpAdapter' };
		obj.params = {};
		obj.params.actionOTP = 'bill_payment';
		obj.params.language = mainSession.lang;
		obj.params.verifyTransactionId = this.verifyEditScheduleBillPaymentResponse.verifyTransactionID;
		obj.actionCode = 'ACT_REQUEST_OTP';
		obj.procedure = 'requestOTPWithLoginProcedure';
		
		
		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			if(kkconst.success == resultCode) {
				callback(resultCode, resultObj);
			} else {
				callback(resultCode||kkconst.unknown);
			}
        };        
        obj.onFailure = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode||kkconst.unknown);
        };
        invokeService.executeInvokePublicService(obj, invokeAdapter);
	};
	
	this.confirmEditScheduleBillPayment = function(inputDataConfirmBill, callback){
        var obj = performConfirmEditScheduleBillPayment(inputDataConfirmBill);
        obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			if(kkconst.success == resultCode) {
				callback(resultCode, resultObj);
			} else {
				callback(resultCode||kkconst.unknown);
			}
		};
        obj.onFailure = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			callback(resultCode||kkconst.unknown);
        };
	};
	
});
