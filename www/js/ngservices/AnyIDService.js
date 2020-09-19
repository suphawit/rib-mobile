angular.module('service.anyID', [])
.service('manageAnyIDService', function(invokeService,kkconst,mainSession) {


	var registerConfirmDataObj = {};
	var registerResultDataObj = {};

	this.setRegisterAnyIDConfirmData = function(data){
		 registerConfirmDataObj = data;
	};
	this.getRegisterAnyIDConfirmData = function(){
		 return registerConfirmDataObj;
	};
	
	this.setRegisterAnyIDResultData = function(data){
		registerResultDataObj = data;
	};
	this.getRegisterAnyIDResultData = function(){
		 return registerResultDataObj;
	};
	
	this.inquiryCustomerAnyIDInformation = function(callback) {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_INQUIRY_CUSTOMER_ANYID_INFORMATION';
		obj.procedure = 'inquiryCustomerAnyIDInformationProcedure';
		obj.onSuccess = function(result) {
			callback(result.responseJSON.result);
		};
		obj.onFailure = function(result) {
			callback(result.responseJSON.result);
        };
		invokeService.executeInvokePublicService(obj);
	};
	
	this.getRegisterAnyIDTermsAndConditions = function(callback,objRequest){
		var obj 			= {};
		obj.params 			= {};
		obj.params.language = objRequest.language;
		obj.params.actionCode = 'anyid_term_and_con';
		obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
		obj.procedure = 'getTermAndConditionProcedure';
		obj.onSuccess = function(result) {
			callback(result.responseJSON.result);
		};
		obj.onFailure = function(result) {
			callback(result.responseJSON.result);
        };
		//invokeService.executeInvokePublicService(obj);
		invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	};

	this.getTermsAndConditions = function(callback,objRequest){
		var obj 			= {};
		obj.params 			= {};
		obj.params.language = objRequest.language;
		obj.params.actionCode = 'rib_term_and_con';
		obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
		obj.procedure = 'getTermAndConditionProcedure';
		obj.onSuccess = function(result) {
			callback(result.responseJSON.result);
		};
		obj.onFailure = function(result) {
			callback(result.responseJSON.result);
        };
		//invokeService.executeInvokePublicService(obj);
		invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	};
	
	this.requestRegisterAnyID = function(params, mycallback){
		var request = {};
        request.params = {};
        request.params['language'] = mainSession.lang;
        request.params['verifyOTPRequest'] = params.verifyOTPRequest;
        request.params['verifyTransactionID'] = params.verifyTransactionID;
        
        request.actionCode = 'ACT_REGISTER_ANYID';
        request.procedure = 'registerAnyIDProcedure';
        request.onSuccess = function(result) {
        	mycallback(result.responseJSON.result);
        };
        
        request.onFailure = function(result) {
        	 mycallback(result.responseJSON.result);
        };
        invokeService.executeInvokePublicService(request);
		
	};
	
	this.requestVerifyRegisterAnyID = function(params, mycallback){
		var request = {};
        request.params = {};
        request.params['anyIDType'] = params.anyIDType;
        request.params['myAccountID'] = params.myAccountID;
        
        request.actionCode = 'ACT_VERIFY_ANYID_INFORMATION';
        request.procedure = 'verifyAnyIDInformationProcedure';
        request.onSuccess = function(result) {
        	mycallback(result.responseJSON.result);
        };
        
        request.onFailure = function(result) {
        	 mycallback(result.responseJSON.result);
        };
        invokeService.executeInvokePublicService(request);
	};
	
	this.requestAmendAnyID = function(params, mycallback){
		var request = {};
        request.params = {};
        request.params['language'] = mainSession.lang;
        request.params['verifyOTPRequest'] = params.verifyOTPRequest;
        request.params['verifyTransactionID'] = params.verifyTransactionID;
        
        request.actionCode = 'ACT_AMEND_ANYID';
        request.procedure = 'amendAnyIDProcedure';
        request.onSuccess = function(result) {
        	mycallback(result.responseJSON.result);
        };
        
        request.onFailure = function(result) {
        	 mycallback(result.responseJSON.result);
        };
        invokeService.executeInvokePublicService(request);
	};

	this.inquiryAnyIDType = function(mycallback){
		var request = {};
        request.params = {};
        request.params["actionType"] = "to_anyid_type";
        
        request.actionCode = 'ACT_INQUIRY_ANYID_TYPE';
        request.procedure = 'inquiryAnyIDTypeProcedure';
        request.onSuccess = function(result) {
        	mycallback(result.responseJSON.result);
        };
        
        request.onFailure = function(result) {
        	mycallback(result.responseJSON.result);
        };
        invokeService.executeInvokePublicService(request);
	};
	
});
