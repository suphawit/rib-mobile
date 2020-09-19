angular.module('service.otpService', [])
.service('otpService', function(invokeService, mainSession, kkconst) {

	//Action
	//"fund_transfer"
	//"add_ext_account"
	
	this.requestOTP = function(param, callback) {
		var invokeAdapter = { adapter: 'otpAdapter' };
		var obj = {};
		obj.params = {};
		obj.params.actionOTP = param.actionOTP;
		if(param.verifyTransactionId !== null &&  param.verifyTransactionId !=="" && (param.verifyTransactionId  !== 'undefined' || param.verifyTransactionId  !== undefined)){
			obj.params.verifyTransactionId = param.verifyTransactionId;
		}
		
		if(param.anyIDType !== null &&  param.anyIDType !=="" && (param.anyIDType  !== 'undefined' || param.anyIDType  !== undefined)){
			obj.params.anyIDType = param.anyIDType;
		}
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_REQUEST_OTP';
		obj.procedure = 'requestOTPWithLoginProcedure';
		obj.onSuccess = function(result) {
   			var resultObj = result.responseJSON.result;
			callback(resultObj);
   		};
   		invokeService.executeInvokePublicService(obj, invokeAdapter);
	};

	this.requestOTPFundtransfer = function(param, callback) {
		var invokeAdapter = { adapter: 'FundTransferAdapter' };
		var obj = {};
		obj.params = {};
		obj.params.actionOTP = param.actionOTP;
		if(param.verifyTransactionId !== null &&  param.verifyTransactionId !=="" && (param.verifyTransactionId  !== 'undefined' || param.verifyTransactionId  !== undefined)){
			obj.params.verifyTransactionId = param.verifyTransactionId;
		}
		
		if(param.anyIDType !== null &&  param.anyIDType !=="" && (param.anyIDType  !== 'undefined' || param.anyIDType  !== undefined)){
			obj.params.anyIDType = param.anyIDType;
		}
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_REQUEST_OTP';
		obj.procedure = 'requestOTPProcedure';
		obj.onSuccess = function(result) {
   			var resultObj = result.responseJSON.result;
			callback(resultObj);
   		};
   		invokeService.executeInvokePublicService(obj, invokeAdapter);
	};
});
