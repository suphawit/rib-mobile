angular.module('service.fundstransfer', [])
.service('fundtransferService', function(invokeService,mainSession,$ionicPopup,$translate,popupService,kkconst,$q,downloadAndStoreFile) {
	
	this.obj 								= {};
	this.objCreate 							= {};
	this.bankList 							= undefined;
	this.constants 							= {};
	this.CONSTANT_ACTION_FROM_ACCOUNT_DATA 	= 'DATA';
	this.CONSTANT_ACCOUNT_TYPE_TD 			= 'TD';
	this.CONSTANT_SELECTED_FROM_LIST 		= 'FROM_LIST';
	this.CONSTANT_TRANSFER_TYPE_CASA		= 'CASA';
	this.CONSTANT_TRANSFER_TYPE_NEW			= 'NEW';
	this.anyIdTypeList				= undefined;
	var _invokeAdapter = { adapter: 'FundTransferAdapter' };

	var sortToAccountsList = function(toAccountsListParam){
		var _accountCategoryList = [];
		var _ftToAllaccounts = [];
		var ycount = 0;
		for (var otheraccountsIndex = 0; otheraccountsIndex < toAccountsListParam.length; otheraccountsIndex++) {
			var catName = toAccountsListParam[otheraccountsIndex].categoryName;
			var isavailable = false;
			for (var allAccountsIndex = 0; allAccountsIndex < _ftToAllaccounts.length; allAccountsIndex++) {
				var allaccount_item_catname = _ftToAllaccounts[allAccountsIndex].categoryName;
				if (allaccount_item_catname === catName) {
					isavailable = true;
					_ftToAllaccounts[allAccountsIndex].items.push(toAccountsListParam[otheraccountsIndex]);
				}						
			}					
			if (!isavailable) {						
				_ftToAllaccounts[ycount] = {
						categoryName: catName,
						accordionId: ycount,
						items: []
				};						
				var catItems = {
						catId: ycount,
						catName: catName
				};
				_accountCategoryList.push(catItems);
				
				_ftToAllaccounts[ycount].items.push(toAccountsListParam[otheraccountsIndex]); 
				ycount++;
			}
		}

		return {
			accountCategoryList: _accountCategoryList,
			ftToAllaccounts: _ftToAllaccounts
		}
	};

	this.inquiryToAccount = function(lang, callback){
		var obj = {};
    	obj.params = {};
    	obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_RBAC_INQUIRY_TRANSFER_TO_ACCOUNT';
		obj.procedure = 'inquiryTransferToAccountProcedure';
		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				var toAccountsList = result.responseJSON.result.value;		
				var ftToSelectedActsGroup;
				var ftDefaultCategory = [];
				var tmpdatasort = sortToAccountsList(toAccountsList);
				var accountCategoryList = tmpdatasort.accountCategoryList;
				var ftToAllaccounts = tmpdatasort.ftToAllaccounts;

				if(ftDefaultCategory.length === 0){
					ftDefaultCategory.push(accountCategoryList[0]);
				}
				
				ftToSelectedActsGroup =  ftToAllaccounts[0] || [];	
				
				var objResult = {};
				objResult.accountCategoryList = accountCategoryList;
				objResult.ftToSelectedActsGroup = ftToSelectedActsGroup;
				objResult.ftToAllaccounts = ftToAllaccounts;
				objResult.ftDefaultCategory = ftDefaultCategory;
				callback(result.responseJSON.result.responseStatus.responseCode,objResult);
			} else {
				callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
			}
		};
		// Execute
		invokeService.executeInvokePublicService(obj);
	};
	
this.isNewAccount = function(newAccount, callback){
		var isNewAccount = true;
		var obj = {};
		var checkNewAccount = function(selectAccount, accountLists){
			var returnValue = true;
			for(var i = 0; i < accountLists.length; i++){
				if(selectAccount === accountLists[i].accountNumber){
					returnValue = false;
				}
			}
			return returnValue;
		};
    	obj.params = {};
    	obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_RBAC_INQUIRY_TRANSFER_TO_ACCOUNT';
		obj.procedure = 'inquiryTransferToAccountProcedure';
		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				if(result.responseJSON.result.value !== undefined){
					isNewAccount = checkNewAccount(newAccount, result.responseJSON.result.value);
				}
				callback(result.responseJSON.result.responseStatus.responseCode,isNewAccount);
			} else {
				isNewAccount = true;
				callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
			}
		};
	
		// Execute
		invokeService.executeInvokePublicService(obj);
	};
	
	this.prepareFundtransfer = function(obj,callback){
		  // 180223@Edit for fundtransferAdapter	
		  //Otherwise It will be CASA to CASA Transfer					
		  obj.params.language = mainSession.lang;
		  obj.actionCode = 'ACT_VERIFY_FUND_TRANSFER';//'ACT_PREPARE_FUND_TRANSFER';
		  obj.procedure = 'verifyFundTransferProcedure';//'prepareFundTransferProcedure';
		  
		  obj.onSuccess = function(result) {
		   if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
			   callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
		   } else {
			//    if(result.responseJSON.result.errorValue != undefined) {
			// 		callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, result.responseJSON.result.errorValue.limitTransfer);
			// 	} else {
			// 		callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, '');
			// 	}
				callback(result.responseJSON.result.responseStatus);
		   }
		  };
		  invokeService.executeInvokePublicService(obj, _invokeAdapter);
	};
	
	this.fundtransfer = function(obj,callback){
		// 180223@Edit for fundtransferAdapter	
		obj.actionCode = 'ACT_CONFIRM_FUND_TRANSFER';//'ACT_FUND_TRANSFER';
		obj.procedure = 'confirmFundTransferProcedure';//'fundTransferProcedure';
		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
			} else {
				// if(result.responseJSON.result.errorValue != undefined) {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, result.responseJSON.result.errorValue.limitTransfer);
				// } else {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, '');
				// }
				callback(result.responseJSON.result.responseStatus);
			}
		};
		 
		invokeService.executeInvokePublicService(obj, _invokeAdapter);
	};
	
	this.inquiryBankInfo = function(callback){
		var bank_list_reqest = {};
		bank_list_reqest.params = {};
		//setting up the input parameters for calling the web-service. 
		bank_list_reqest.params.language = $translate.use();
		
		bank_list_reqest.actionCode = 'ACT_INQUIRY_BANK_INFO';
		bank_list_reqest.procedure = 'inquiryBankInfoProcedure';
		
		bank_list_reqest.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && 
					result.responseJSON.result.responseStatus.responseCode === kkconst.success) {

				// store bankinfo data
				downloadAndStoreFile.setStoreData('bankinfo_'+mainSession.lang, result.responseJSON.result.value);
				
				callback(result.responseJSON.result.responseStatus.responseCode,result.responseJSON.result.value);
			} else {
				callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
			}
		};
		
		// check invalid store data
		var bankInfoData = downloadAndStoreFile.getStoreData('bankinfo_'+mainSession.lang);
		if(angular.equals(bankInfoData, {}) || !downloadAndStoreFile.validDataVersion('bankinfo_'+mainSession.lang)){
			invokeService.executeInvokePublicService(bank_list_reqest);
		} else {
			callback(kkconst.success, bankInfoData.data);
		}
	 
	};
	
	this.getTDTermsNConds = function(obj,callback) {
		
		obj.actionCode = 'ACT_PREPARE_FUND_TRANSFER_TD';
		obj.procedure = 'prepareFundTransferTDProcedure';

		//on success navigate to manage own screen with list of accounts.
		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				callback(result.responseJSON.result.responseStatus.responseCode,result.responseJSON.result.value);
			}else{
				callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
			}
		};
 
		invokeService.executeInvokePublicService(obj);
	};
	
	this.getRatesByCIFType = function(obj,callback){

		delete obj.params.fcconTdTermType.freq_display_label;
		obj.params.language = mainSession.lang;

		obj.actionCode = 'ACT_GET_RATES_BY_CIF_TYPE';
		obj.procedure = 'getRatesByCIFTypeProcedure';
		
		obj.onSuccess = function(result) {
			
		   if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
			   
			  callback(result.responseJSON.result.responseStatus.responseCode,result.responseJSON.result.value);
		    
		   } else {
			   callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
		   }
		  };
		  invokeService.executeInvokePublicService(obj);
	};
	
	this.funtransferTD = function(obj,callback){
		  obj.actionCode = 'ACT_FUND_TRANSFER_TD';
		  obj.procedure = 'fundTransferTDProcedure';
		  obj.onSuccess = function(result) {
		   if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
			   callback(result.responseJSON.result.responseStatus.responseCode, result.responseJSON.result.value);
		   } else{
			   callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow);
		   }
		  };
		   
		  invokeService.executeInvokePublicService(obj);
	};
	
	this.getRecurring = function(scheduleType,scheduleTypeLang,recurringTime,recurringTypeLang){
		
		var scheduleName = '';
		var recurringTimeName = '';
		
		if(scheduleType !== undefined && recurringTime !== undefined ){
			
			scheduleType = parseInt(scheduleType || 0);
			recurringTime = parseInt(recurringTime || 0);
		
			for(var i=0;i<scheduleTypeLang.length;i++){
				if(scheduleTypeLang[i].value === scheduleType){
					scheduleName = scheduleTypeLang[i].name;
				}
			}
			for(var k=0; k<(recurringTypeLang.length); k++){
				if(recurringTypeLang[k].value === recurringTime){
					recurringTimeName = recurringTypeLang[k].name;
				}
			}
		}
		
		return scheduleName+' '+recurringTimeName;
	};
	
	this.editSchedule = function(obj,callback){
		
		obj.actionCode = 'ACT_VERIFY_EDIT_FUND_TRANSFER';
		obj.procedure = 'verifyEditFundTransferProcedure';
		obj.params.language = mainSession.lang;

		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
			} else {
				// if(result.responseJSON.result.errorValue !== undefined) {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, result.responseJSON.result.errorValue.limitTransfer);
				// } else {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, '');
				// }
				callback(result.responseJSON.result.responseStatus);
			}
		};
		invokeService.executeInvokePublicService(obj, _invokeAdapter);
	};
	
	this.editScheduleSubmit = function(obj,callback){
		obj.actionCode = 'ACT_CONFIRM_EDIT_FUND_TRANSFER';
		obj.procedure = 'confirmEditFundTransferProcedure';
		obj.params.language = mainSession.lang;

		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
			} else {
				// if(result.responseJSON.result.errorValue !== undefined) {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, result.responseJSON.result.errorValue.limitTransfer);
				// } else {
				// 	callback(result.responseJSON.result.responseStatus.responseCode||kkconst.unknow, '');
				// }
				callback(result.responseJSON.result.responseStatus);
			}
		};
		invokeService.executeInvokePublicService(obj, _invokeAdapter);
	};
	
	this.getAMLOLimit = function() {	

		var def = $q.defer();	
    	var invocationData = {
				adapter: kkconst.mainAdapter,
				procedure: 'getAmloProcedure',
				parameters: ''
			};



			var request = new WLResourceRequest('/adapters/' + invocationData.adapter + '/' + invocationData.procedure, WLResourceRequest.POST, {'scope':'UserLoginCBS'});
				request.setTimeout(36000);
			var newParams = { 'params': '' };

			request.sendFormParameters(newParams).then(
				function (result) {
					def.resolve(result.responseJSON.result.value);	
				},
				function (error) {
					def.resolve(false);
				}
			);

			return def.promise;
    };

	this.chkFundTransferStatusCode = function(fundTransferStatusCode){
		var status = false;
		if(	fundTransferStatusCode !== 'SC' && 
    		fundTransferStatusCode !== 'PC' && 
    		fundTransferStatusCode !== 'PD'){
			status = true;
		}

		return status;
	}
	this.emptyVal = function(val){
			return val || '';
	}
});

