var billPayServicePromptPay = angular.module('service.manageBillerPromptPay',[])
.service('manageBillerPromptPayService', function(invokeService,$ionicModal,$ionicPopup,mainSession,$translate,$q,kkconst) {
	this.obj = {};
	this.inquiryTokenValue = {};
	this.billerListInfo = {};
	this.billerPayInfoConfirm = {};
	this.valueOTP = {};
	this.billerPayInfoConfirm = {};
	this.billerDetail = {};
	this.billerDetailEditConfirm = {};
	this.fovoriteFact = {};
	var count = 0;
	this.refInfo = {};
	this.setFactIsBack = {};
	this.setBillerDafault = {};
	
	this.updateFavoriteAccount = function (param, mycallback) {
			var request = {};
			request.params = {};
			request.params.billerId = param.billerId;
			request.params.isFavourite = param.isFavourite;
			request.actionCode = 'ACT_BPS_UPDATE_FAVOURITE_BILLER';
			request.procedure = 'updateBillerFavouriteProcedure';
			
		  	request.onSuccess = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	         request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
};

	 //inquiryToken
	this.getBillerProfile = function(mycallback){
			var request = {};
	        request.params = {};
			request.params.inquiryToken = this.inquiryTokenValue;
	        request.actionCode = 'ACT_BPS_INQUIRY_BILLER_INFO';
	        request.procedure = 'inquiryBillerInfoProcedure';
	        request.onSuccess = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	         request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
	};

	this.inquiryBillerByToken = function (token) {
		var deferred = $q.defer();
		var request = {
			params: {
				inquiryToken: token
			},
			actionCode:'ACT_BPS_INQUIRY_BILLER_INFO',
			procedure:'inquiryBillerInfoProcedure'
		};
		request.onSuccess = function(result) {
			deferred.resolve(result.responseJSON)
		};
		 request.onFailure = function(result) {
			deferred.resolve(result.responseJSON)
		};
		invokeService.executeInvokePublicService(request,{adapter:'billerSearchCBSAdapter',isHideLoader:true});
		return deferred.promise;
	}

	this.inquiryBillerByTokenAndCategories = function(token,categories){
		var deferred = $q.defer();
		var request = {
			params: {
				inquiryToken: token,
				categoryCodeList:categories
			},
			actionCode:'ACT_BPS_INQUIRY_BILLER_TOKEN_AND_CATEGORY_LIST',
			procedure:'inquiryBillerTokenAndCategoryListProcedure'
		};

		request.onSuccess = function(result) {
			deferred.resolve(result.responseJSON)
		};
		 request.onFailure = function(result) {
			deferred.resolve(result.responseJSON)
		};
		invokeService.executeInvokePublicService(request,{adapter:'billerSearchCBSAdapter'});
		return deferred.promise;
	};

	this.inquiryCategories = function(){
		var deferred = $q.defer();
		var request = {};
		request.params = {};
		request.actionCode = 'ACT_BPS_INQUIRY_ALL_CATEGORY';
		request.procedure = 'inquiryAllCategoryProcedure';

		request.onSuccess = function(result) {
			deferred.resolve(result.responseJSON)
		};
		 request.onFailure = function(result) {
			deferred.resolve(result.responseJSON)
		};
		invokeService.executeInvokePublicService(request,{adapter:'billerSearchCBSAdapter'});

		return deferred.promise;
	}

	this.getBillerPayInfoProfileDetail = function(mycallback){
		
		var request = {};
		request.params = {};
		request.params.billerProfileId =  this.billerListInfo.billerProfileId;
	
		request.actionCode = 'ACT_BPS_INQUIRY_PAY_INFO_PIBRIB';
		request.procedure = 'inquiryPayInfoPIBRIBProcedure';
		request.onSuccess = function(result) {
				mycallback(result.responseJSON);
		};
		request.onFailure = function(result) {
				mycallback(result.responseJSON);
		};
		invokeService.executeInvokePublicService(request);
			
	};

	this.verifyBillerPayInfo = function(mycallback){
			var request = {};
			var foRef = {};
			var dataRef = [];
			 request.params = {};
			request.params.billerInfo= {
					
							aliasName:           this.billerPayInfoConfirm.billerAliasName,
							billerProfileId:     this.billerPayInfoConfirm.billerProfileId,
							promptPayBillerId:   this.billerPayInfoConfirm.promptPayBillerId,
							profileCode:         this.billerPayInfoConfirm.profileCode,
							companyCode:         this.billerPayInfoConfirm.companyCode,
							categoryId:          this.billerPayInfoConfirm.categoryId,
							categoryTh:          this.billerPayInfoConfirm.categoryTh,
							categoryEn:          this.billerPayInfoConfirm.categoryEn,
							companyTh:           this.billerPayInfoConfirm.categoryTh,
							companyEn:           this.billerPayInfoConfirm.companyEn,
							logoCompany:         this.billerPayInfoConfirm.logoCompany,
							subServiceTh:        this.billerPayInfoConfirm.subServiceTh,
							subServiceEn:        this.billerPayInfoConfirm.subServiceEn,
				};
				for( var i = 0;i < this.billerPayInfoConfirm.refInfos.length; i++){
						var refInfo = this.billerPayInfoConfirm.refInfos[i];
						var refNumber = this.billerPayInfoConfirm.ref[i];
						foRef[i] = {"no": refInfo.no, "value": refNumber ,"textEn":refInfo.textEn,"textTh":refInfo.textTh};
						dataRef.push(foRef[i])
				}
	
			request.params.billerInfo.refInfos = dataRef ;
			request.actionCode = 'ACT_BPS_VERIFY_ADD_BILLER';
	        request.procedure = 'verifyAddBillerProcedure';
		
	        request.onSuccess = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
	};


		this.addBillerGetRequestOTP = function(mycallback){
			var request = {};
			var invokeAdapter = { adapter: 'otpAdapter' };
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
		

		this.confirmAddBillerProfileDetail = function(mycallback){
			 var request = {};
			 var foRef = {};
			 var dataRef = [];
			 request.params = {  
				 referenceNO:             this.valueOTP.referenceNo,
				tokenOTPForCAA:          this.valueOTP.tokenOTPForCAA,
				otp:                     this.valueOTP.otp
			 };
			 request.params.billerInfo = {
				aliasName:           this.billerPayInfoConfirm.aliasName,
				billerProfileId:     this.billerPayInfoConfirm.billerProfileId,
				promptPayBillerId:   this.billerPayInfoConfirm.promptPayBillerId,
				profileCode:         this.billerPayInfoConfirm.profileCode,
				companyCode:         this.billerPayInfoConfirm.companyCode,
				categoryId:          this.billerPayInfoConfirm.categoryId,
				categoryTh:          this.billerPayInfoConfirm.categoryTh,
				categoryEn:          this.billerPayInfoConfirm.categoryEn,
				companyTh:           this.billerPayInfoConfirm.categoryTh,
				companyEn:           this.billerPayInfoConfirm.companyEn,
				logoCompany:         this.billerPayInfoConfirm.logoCompany,
				subServiceTh:        this.billerPayInfoConfirm.subServiceTh,
				subServiceEn:        this.billerPayInfoConfirm.subServiceEn
			 };


			for( var i = 0;i < this.billerPayInfoConfirm.refInfos.length; i++){
						var refInfo = this.billerPayInfoConfirm.refInfos[i];
						var refNumber = this.billerPayInfoConfirm.ref[i];
						foRef[i] = {"no": refInfo.no, "value": refNumber ,"textEn":refInfo.textEn,"textTh":refInfo.textTh};
						dataRef.push(foRef[i])
				}
	
			request.params.billerInfo.refInfos = dataRef ;
			request.actionCode = 'ACT_BPS_ADD_BILLER';
	        request.procedure = 'addBillerProcedure';
			request.onSuccess = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
	};



		this.getBillerlistInfo = function(mycallback){
			var request = {};
	        request.params = {};
	        request.actionCode = 'ACT_BPS_INQUIRY_BILLER_CUSTOMER';
	        request.procedure = 'inquiryBillerCustomerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};



		this.verifyEditBillerProfileDetail = function(mycallback){
			var foRef = {};
			var dataRef = [];
			var request = {};
			 request.params = {};
			 request.params.billerInfo= {
	              
			    		aliasName:           this.billerDetail.aliasName,
						billerId:           this.billerDetail.billerId,
	                    promptPayBillerId:   this.billerDetail.promptPayBillerId,
                        profileCode:         this.billerDetail.profileCode,
                        companyCode:         this.billerDetail.companyCode,
                        categoryId:          this.billerDetail.categoryId,
                        categoryTh:          this.billerDetail.categoryTh,
                        categoryEn:          this.billerDetail.categoryEn,
                        companyTh:           this.billerDetail.categoryTh,
                        companyEn:           this.billerDetail.companyEn,
                        logoCompany:         this.billerDetail.logoCompany,
                        subServiceTh:        this.billerDetail.subServiceTh,
                        subServiceEn:        this.billerDetail.subServiceEn,
						
			};
				for( var i = 0;i < this.billerDetail.refInfos.length; i++){
						var refInfo = this.billerDetail.refInfos[i];
						//var refNumber = this.billerDetail.ref[i];
						foRef[i] = {"no": refInfo.no, "value": refInfo.value ,"textEn":refInfo.textEn,"textTh":refInfo.textTh};
						dataRef.push(foRef[i])
				}
	
			request.params.billerInfo.refInfos = dataRef ;
			request.actionCode = 'ACT_BPS_VERIFY_EDIT_BILLER';
	        request.procedure = 'verifyEditBillerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};


		
		this.confirmEditBillerProfile = function(mycallback){
	
			var foRef = {};
			var dataRef = [];
		    var request = {};
			 request.params = {};
			 request.params.billerInfo= {
	              		aliasName:           this.billerDetailEditConfirm.aliasName,
						billerId:           this.billerDetailEditConfirm.billerId,
	                    promptPayBillerId:   this.billerDetailEditConfirm.promptPayBillerId,
                        profileCode:         this.billerDetailEditConfirm.profileCode
                    //    companyCode:         this.billerDetailEditConfirm.companyCode,
                    //     categoryId:          this.billerDetailEditConfirm.categoryId,
                    //     categoryTh:          this.billerDetailEditConfirm.categoryTh,
                    //     categoryEn:          this.billerDetailEditConfirm.categoryEn,
                    //     companyTh:           this.billerDetailEditConfirm.categoryTh,
                    //     companyEn:           this.billerDetailEditConfirm.companyEn,
                    //     logoCompany:         this.billerDetailEditConfirm.logoCompany,
                    //     subServiceTh:        this.billerDetailEditConfirm.subServiceTh,
                    //     subServiceEn:        this.billerDetailEditConfirm.subServiceEn,
						
			};
				// for( var i = 0;i < this.billerDetailEditConfirm.refInfos.length; i++){
				// 		var refInfo = this.billerDetailEditConfirm.refInfos[i];
				// 		foRef[i] = {"no": refInfo.no, "value": refInfo.value ,"textEn":refInfo.textEn,"textTh":refInfo.textTh};
				// 		dataRef.push(foRef[i])
				// }
	
			//request.params.billerInfo.refInfos = dataRef ;
			request.actionCode = 'ACT_BPS_EDIT_BILLER';
	        request.procedure = 'editBillerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};


		this.deleteBillpayment = function(mycallback){
			var request = {};
	        request.params = {};
			request.params.billerId = this.billerDetailEditConfirm.billerId;
	        request.actionCode = 'ACT_BPS_DELETE_BILLER';
	        request.procedure = 'deleteBillerProcedure';
	        request.onSuccess = function(result) {
	        	
	        mycallback(result.responseJSON);
	        };
	        
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
		};
	
	this.confirmAddBillerProfileDetailWithOutOTP = function(mycallback){
			 var request = {};
			 var foRef = {};
			 var dataRef = [];
			 request.params = {};
			 request.params.billerInfo = {
				aliasName:           this.billerPayInfoConfirm.aliasName,
				billerProfileId:     this.billerPayInfoConfirm.billerProfileId,
				promptPayBillerId:   this.billerPayInfoConfirm.promptPayBillerId,
				profileCode:         this.billerPayInfoConfirm.profileCode,
				companyCode:         this.billerPayInfoConfirm.companyCode,
				categoryId:          this.billerPayInfoConfirm.categoryId,
				categoryTh:          this.billerPayInfoConfirm.categoryTh,
				categoryEn:          this.billerPayInfoConfirm.categoryEn,
				companyTh:           this.billerPayInfoConfirm.categoryTh,
				companyEn:           this.billerPayInfoConfirm.companyEn,
				logoCompany:         this.billerPayInfoConfirm.logoCompany,
				subServiceTh:        this.billerPayInfoConfirm.subServiceTh,
				subServiceEn:        this.billerPayInfoConfirm.subServiceEn
			 };


			for( var i = 0;i < this.billerPayInfoConfirm.refInfos.length; i++){
						var refInfo = this.billerPayInfoConfirm.refInfos[i];
						var refNumber = this.billerPayInfoConfirm.ref[i];
						foRef[i] = {"no": refInfo.no, "value": refNumber ,"textEn":refInfo.textEn,"textTh":refInfo.textTh};
						dataRef.push(foRef[i])
				}
	
			request.params.billerInfo.refInfos = dataRef ;
			request.actionCode = 'ACT_BPS_ADD_BILLER_WITHOUT_OTP';
	        request.procedure = 'addBillerWithOutOTPProcedure';
			request.onSuccess = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        request.onFailure = function(result) {
	        	 mycallback(result.responseJSON);
	        };
	        invokeService.executeInvokePublicService(request);
			
	};


	this.setInquiryToken = function(value) {
		 this.inquiryTokenValue = value;
	 };
	 

	 this.getInquiryToken = function() {
		return this.inquiryTokenValue ;
	 };
	

	this.setbillerListPayInfo = function(value) {
		this.billerListInfo = value;
	
	 };
	 
	 this.getbillerListPayInfo = function() {
		return this.billerListInfo ;
	 };
	
	
	this.setBillerPayInfoVerify = function(value) {
	
		 this.billerPayInfoConfirm = value;
	
		 	
	 };
	 
	 this.getBillerPayInfoVerify = function() {
		return this.billerPayInfoConfirm ;
	 };
		

			
	this.setAddBillerOTP = function(value) {
		 this.valueOTP = value;
	 };
	 
	 this.getAddBillerOTP = function() {
		return this.valueOTP ;
	 };

	 this.setBillerDetail = function(value) {
		 this.billerDetail = value;
		 
	 };
	 
	 this.getBillerDetail = function() {
		 
		return this.billerDetail ;
	
	 };

	 
	 this.setBillerEditConfirm = function(value) {
	
		
		 this.billerDetailEditConfirm = value;
		 
	 };
	 
	 this.getBillerEditConfirm = function() {
		 
		return this.billerDetailEditConfirm ;
	
	 };


	 this.setFactIsBack = function(value) {
	
	
		 this.billerDetailEditConfirm = value;
		 
	 };
	 
	 this.getFactIsBack = function() {
		 
		return this.billerDetailEditConfirm ;
	
	 };

	 
	 this.setfovoriteFact = function(value) {
	
		this.fovoriteFact = value;
		 
	 };
	 
	 this.getfovoriteFact= function() {
		 
		return this.fovoriteFact ;
	
	 };


	 this.setDataBillerDefault = function(value) {
		 console.log('setDataBillerDefault', value);
		 this.setBillerDafault = value;
	 };
	 
	 this.getDataBillerDefault = function() {
	  	console.log('getDataBillerDefault', this.setBillerDafault);
		return this.setBillerDafault ;
	 };
});//End billPayment
