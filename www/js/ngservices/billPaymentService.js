var billPayService = angular.module('service.billPayment',[])
.service('billPaymentService', function(invokeService,$ionicModal,$ionicPopup,mainSession,$translate,$q,kkconst) {
	this.obj = {};
	this.confirmSession = {};
	this.dataMyAccountList = {};
	this.currentSelectedFROMAccountData = {};
	this.dataBillpaymentConfirmOTP = {};
	this.todayDate = {};
	this.todayDateValue = {};
	this.dataBillpaymentConfirmComplete = {};
	this.setEditSchduleBillpayment = false;
	this.payAmountData = {};
	this.setFactRecurring = {};
	this.editbillerDetail = {}; //set fact fromEditBillerDEtailPage
	this.receiveDateBackBillpay = {};
	this.backToAddbillpay = {};
	this.InquiryBillCustomer = {};
	this.setbackEditBiller = {};
	this.clear = function() {
		 this.getEditBiller = '';
		
	}; 
	
	this.setFactFromMyAccount = function(fact) {
		 this.setFactMyAccount = fact;
	 };
	 
	 this.getFactFromMyAccount = function() {
		return this.setFactMyAccount ;
	 };
	
	
	this.variableSetRecuring = function(recuring) {
		 this.setRecuring = recuring;
	 };
	 
	 this.variableGetRecuring = function() {
		return this.setRecuring ;
	 };
	
	
	 this.setEditBillerDetailPage = function(factEditBiller) {
			 this.getEditBiller = factEditBiller;
	 };
		 
	this.getEditBillerDetailPage = function() {
			 return this.getEditBiller;
	};
		
	 this.setMyAccountBillPay = function(billpay) {
		 this.setmyAccount = billpay;
	 };
	 
	 this.getMyAccountBillPay = function() {
		return this.setmyAccount ;
	 };
	 
	 this.setMyAccountData = function(billpayData) {
			this.setmyAccountData = billpayData;
	};
		 
	this.getMyAccountData = function() {
		return this.setmyAccountData ;
	};
	 
	 this.setBillerData = function(biller) {
		 this.billerData = biller;
	 };
	 
	 this.getBillerData = function() {
		return this.billerData ;
	 };
	 
	 this.setSelectedFROMAccount = function(selAccount) {
		this.currentSelectedFROMAccountData = selAccount; 
	 };
		 
	 this.getSelectedFROMAccount = function() {
			return this.currentSelectedFROMAccountData;
	 };
	 
	 this.setBackButtonBillPay = function(fact) {
			this.Datafact = fact;
	};
		 
	this.getBackButtonBillPay = function() {
			return this.Datafact ;
	};
		 
	this.getBillersList = function(mycallback){
			var request = {};
	        request.params = {};
	        request.params.cisID = '';
	        request.params.language = $translate.use();
	        request.actionCode = 'ACT_INQUIRY_BILL';
	        request.procedure = 'inquiryBillCustomerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
	};

		this.nevigationAddbiller = function(mycallback){
		
			var request = {};
	        request.params = {};
	        request.params.language = $translate.use();
	        request.actionCode = 'ACT_INQUIRY_BILL_ACCOUNT';
	        request.procedure = 'inquiryBillAccountProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		
		
		this.nevigationConfirmAddBiller = function(inputData,mycallback){
			var request = {};
	        request.params = {};
	        request.params.billCustomer = {};
	        request.params.billCustomer.billerAliasName = inputData.billerAliasName;
	        request.params.billCustomer.ref1 = inputData.ref1;
	        request.params.billCustomer.ref2 = inputData.ref2;
	        request.actionCode = 'ACT_VERIFY_ADD_BILL';
	        request.procedure = 'verifyAddBillCustomerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		
		this.addBillerGetRequestOTP = function(mycallback){
			var invokeAdapter = { adapter: 'otpAdapter' };
			var request = {};
	        request.params = {};
	        request.params.actionOTP = 'add_biller';
	        request.params.language = $translate.use();
	        request.actionCode = 'ACT_REQUEST_OTP';
	        request.procedure = 'requestOTPWithLoginProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request, invokeAdapter);
			
		};
		
		
		this.submitConfirmAddBillerList = function(inputData,mycallback){
		
			var request = {};
	        request.params = {};
	        request.params.billCustomer = {};
	        request.params.billCustomer.billerAliasName = inputData.billerAliasName;
	        request.params.billCustomer.ref1 = inputData.ref1;
	        request.params.billCustomer.ref2 = inputData.ref2;
	        request.params.tokenOTPForCAA = inputData.tokenOTPForCAA;
	        request.params.referenceNO = inputData.referenceNo;
	        request.params.otp = inputData.otp;
	        request.actionCode = 'ACT_ADD_BILL';
	        request.procedure = 'addBillCustomerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		this.nevigationConfirmEditBiller = function(editData,mycallback){
			var request = {};
	        request.params = {};
	        request.params.billCustomer = {};
	        request.params.billCustomer.billerID = editData.billerID;
	        request.params.billCustomer.billerAliasName = editData.billerAliasName;
	        request.params.billCustomer.ref1 = editData.ref1;
	        request.params.billCustomer.ref2 = editData.ref2;
	        
	        request.actionCode = 'ACT_VERIFY_EDIT_BILL';
	        request.procedure = 'verifyEditBillCustomerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		
		this.editBillerGetRequestOTP = function(mycallback){
			var request = {};
			var invokeAdapter = { adapter: 'otpAdapter' };
	        request.params = {};
	        request.params.actionOTP = 'edit_biller';
	        request.params.language = $translate.use();
	        request.actionCode = 'ACT_REQUEST_OTP';
	        request.procedure = 'requestOTPWithLoginProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request, invokeAdapter);
			
		};
		
		this.submitConfirmEditBillerList = function(editData,mycallback){
			var request = {};
	        request.params = {};
	        request.params.billCustomer = {};
	        request.params.billCustomer.billerID = editData.billerID;
	        request.params.billCustomer.billerAliasName = editData.billerAliasName;
	        request.params.billCustomer.ref1 = editData.ref1;
	        request.params.billCustomer.ref2 = editData.ref2;
	        request.params.tokenOTPForCAA = editData.tokenOTPForCAA;
	        request.params.referenceNO = editData.referenceNo;
	        request.params.otp = editData.otp;
	        request.actionCode = 'ACT_EDIT_BILL';
	        request.procedure = 'editBillCustomerProcedure'; 
	        request.onSuccess = function(result){
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		this.deleteBillpayment = function(inputData,mycallback){
		
		
			var request = {};
	        request.params = {};
	        request.params.billerID = inputData.billerID;
	        request.actionCode = 'ACT_DELETE_BILL';
	        request.procedure = 'deleteBillCustomerProcedure'; 
	        request.onSuccess = function(result){
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		
		this.verifyBillPayment = function(inputDataVarifyBill,mycallback){
			var request = {};
	        request.params = {};
	        request.params.billPayment = {};
	        request.params.billPayment.fromAccountNumber = inputDataVarifyBill.fromAccountNumber;
	        request.params.billPayment.billerID = inputDataVarifyBill.billerID;
	        request.params.billPayment.payAmount = inputDataVarifyBill.payAmount;
	        request.params.billPayment.feeAmount = inputDataVarifyBill.feeAmount;
	        request.params.billPayment.effectiveDate = inputDataVarifyBill.effectiveDate;
	        request.params.billPayment.paymentDate = inputDataVarifyBill.paymentDate;
	        request.params.billPayment.msgLanguage = inputDataVarifyBill.msgLanguage;
	        request.params.billPayment.immediateType = inputDataVarifyBill.immediateType;
	        request.params.billPayment.recurringType = inputDataVarifyBill.recurringType;
	        request.params.billPayment.recurringTimes = inputDataVarifyBill.recurringTimes;
	        request.params.billPayment.scheduleType = inputDataVarifyBill.scheduleType;
	        request.actionCode = 'ACT_VERIFY_BILL_PAYMENT';
	        request.procedure = 'verifyBillPaymentProcedure'; 

	        request.onSuccess = function(result){
	        	
	        	mycallback(result.responseJSON);
	        	
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		
		this.getRequestOTP = function(mycallback){
			var request = {};
			var invokeAdapter = { adapter: 'otpAdapter' };
	        request.params = {};
	        request.params.actionOTP = 'bill_payment';
	        request.params.language = $translate.use();
	        request.params.verifyTransactionId = this.dataBillpaymentConfirmOTP.verifyTransactionID;
	        request.actionCode = 'ACT_REQUEST_OTP';
	        request.procedure = 'requestOTPWithLoginProcedure';
	        request.onSuccess = function(result) {
	        	
	        	mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request, invokeAdapter);
			
		};
		
		
		this.confirmBillpay = function(dataConfirmBillpay,mycallback){
			
			var request = {};
	        request.params = {};
	        request.params.memo 				= dataConfirmBillpay.memo;
	        request.params.verifyTransactionID 	= dataConfirmBillpay.verifyTransactionID;
	        request.params.referenceNO 						= dataConfirmBillpay.referenceNo;
	        request.params.otp 								= dataConfirmBillpay.otp;
	        request.params.tokenOTPForCAA 					= dataConfirmBillpay.tokenOTPForCAA;
	        request.actionCode = 'ACT_CONFIRM_BILL_PAYMENT';
	        request.procedure = 'confirmBillPaymentProcedure';
	        request.onSuccess = function(result) {
	        	mycallback(result.responseJSON);
	        
	        };
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
		
		var performConfirmEditScheduleBillPayment = function(inputDataEditScheduleBill) {
			var obj = {};
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
		
		var performVerifyEditScheduleBillPayment = function(inputDataEditScheduleBill) {
			var obj = {};
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
		
		/* add edit schedule bill payment */
		this.verifyEditScheduleBillPayment = function(inputDataVarifyBill, callback){
	        var obj = performVerifyEditScheduleBillPayment(inputDataVarifyBill);
	        obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if(kkconst.success === resultCode) {
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

		this.confirmEditScheduleBillPayment = function(inputDataConfirmBill, callback){
	        var obj = performConfirmEditScheduleBillPayment(inputDataConfirmBill);
	        obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if(kkconst.success === resultCode) {
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
		
		
});//End billPayment
