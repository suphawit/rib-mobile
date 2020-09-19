angular.module('service.myAccount',[])
.service('myAccountService', function($translate, $filter, invokeService, generalService, displayUIService, kkconst, $q) {

	 this.totalPage = {};
	 this.factAddAccountOTP = {};
	 
	 var setTotalPage = function(totalPage) {
		 this.totalPage = totalPage;
	 };
	 
	 var getTotalPage = function() {
		return this.totalPage;
	 };
	 var performDeleteMyAccountProcedure = function(myAccountID) {
			var obj = {};
			obj.params = {};
			obj.params.myAccountID = myAccountID;
			obj.actionCode = 'ACT_MY_ACCOUNT_DELETE';
			obj.procedure = 'deleteMyAccountProcedure';
			invokeService.executeInvokePublicService(obj);	
			return obj;
		};
	this.deleteMyAccount = function(myAccountID, callback) {
		var obj = performDeleteMyAccountProcedure(myAccountID);
		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			if(kkconst.success === resultCode) {
				callback(resultCode);
			} else {
				callback(resultCode||kkconst.unknown);
			}
		};
	};
	var performGetDashboardProcedure  = function() {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_DASHBOARD';
		obj.procedure = 'dashboardMobileProcedure';
		invokeService.executeInvokePublicService(obj);
		return obj;
	};
	var returnOwnAccountGroups = function(ownAccountsList, lang) {		
		var ownAccountGroups = [];
		var savingAccountData = [];
		var currentAccountData = [];
		var termAccountData = [];
		for (var index in ownAccountsList) {
			if (lang === kkconst.LANGUAGE_en) {
				ownAccountsList[index].lastUpdatedDate = $filter('kkdatetime')(ownAccountsList[index].lastUpdatedDate, kkconst.DATE_FORMAT_dMMMyyyyHHmm);
			} else {
				ownAccountsList[index].lastUpdatedDate = $filter('kkdatetime')(ownAccountsList[index].lastUpdatedDate, kkconst.DATE_FORMAT_ddMMyyyyHHmm);
				var convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(ownAccountsList[index].lastUpdatedDate);
				ownAccountsList[index].lastUpdatedDate = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year + ' ' + convertTxnDate.time;
			}			
			if (ownAccountsList[index].accountType === 'SA') {
				ownAccountGroups[0] = {
						myAccountType: ownAccountsList[index].myAccountType,
						labelType	: 'label.savingAccount',
						items: [],
						shown: true,
						typeCount: ownAccountsList.length
				};
				savingAccountData.push(ownAccountsList[index]);
			} else if (ownAccountsList[index].accountType === 'CA') {
				ownAccountGroups[1] = {
						myAccountType: ownAccountsList[index].myAccountType,
						labelType	: 'label.currentAccounts',
						items: [],
						shown: true,
						typeCount: ownAccountsList.length
				};
				currentAccountData.push(ownAccountsList[index]);
			} else if (ownAccountsList[index].accountType === 'TD') {
				ownAccountGroups[2] = {
						myAccountType: ownAccountsList[index].myAccountType,
						labelType	: 'label.tdAccounts',
						items: [],
						shown: true,
						typeCount: ownAccountsList.length
				};
				termAccountData.push(ownAccountsList[index]);
			} else {
				// do something
			}
		}
		if (ownAccountGroups[0]) {
			ownAccountGroups[0].items = savingAccountData.sort(function(a,b){return (a.myAccountAliasName > b.myAccountAliasName) - (a.myAccountAliasName < b.myAccountAliasName);});
		}
		if (ownAccountGroups[1]) {
			ownAccountGroups[1].items = currentAccountData.sort(function(a,b){return (a.myAccountAliasName > b.myAccountAliasName) - (a.myAccountAliasName < b.myAccountAliasName);});
		}
		if (ownAccountGroups[2]) {
			ownAccountGroups[2].items = termAccountData.sort(function(a,b){return (a.myAccountAliasName > b.myAccountAliasName) - (a.myAccountAliasName < b.myAccountAliasName);});
		}
		return ownAccountGroups;					
	};
	this.listMyAccount = function(lang, callback) {
		this.accountDetail = {};
		var obj = performGetDashboardProcedure();
		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			var ownAccountsList = resultObj.value;
			if(kkconst.success === resultCode) {
				callback(resultCode, returnOwnAccountGroups(ownAccountsList, lang));
			} else {
				callback(resultCode||kkconst.unknown);
			}
		};
	};
	var performInquiryTdStatementProcedure = function(myAccountID, lang) {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_MY_ACCOUNT_INQUIRY_TD_STATEMENT';
		obj.procedure = 'inquiryMyAccountTDStatementProcedure';
		obj.params.inquiryAccountStatement = {};
		obj.params.inquiryAccountStatement.myAcctId = myAccountID;
		obj.params.paging = {};
		obj.params.paging.page = 0;
		obj.params.paging.pageSize = '0';
		obj.params.language = lang;
		invokeService.executeInvokePublicService(obj);
		return obj;
	};
	var returnTdStatement = function(tdDepositList, lang) {
		var statementList = [];
     	if(tdDepositList.length > 0) {
		 	for(var i=0; i < tdDepositList.length; i++) {
				if (lang === kkconst.LANGUAGE_en) {
					tdDepositList[i].dateMaturity = $filter('kkdatetime')(tdDepositList[i].dateMaturity, kkconst.DATE_FORMAT_dMMMyyyy);
					tdDepositList[i].dateOpen = $filter('kkdatetime')(tdDepositList[i].dateOpen, kkconst.DATE_FORMAT_dMMMyyyy);
				} else {
					tdDepositList[i].dateMaturity = $filter('kkdatetime')(tdDepositList[i].dateMaturity, kkconst.DATE_FORMAT_ddMMyyyy);
					tdDepositList[i].dateOpen = $filter('kkdatetime')(tdDepositList[i].dateOpen, kkconst.DATE_FORMAT_ddMMyyyy);
					var convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(tdDepositList[i].dateMaturity);
					tdDepositList[i].dateMaturity  = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year;
					convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(tdDepositList[i].dateOpen);
					tdDepositList[i].dateOpen  = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year;
				}			
				statementList.push({
					'depNo': tdDepositList[i].depNo,
					'balAvailable': tdDepositList[i].balAvailable,
					'dateMaturity' : tdDepositList[i].dateMaturity,
					'termMonth': tdDepositList[i].termMonth,
					'termDay': tdDepositList[i].termDay,
					'interest' : tdDepositList[i].interest,
					'date' : tdDepositList[i].dateOpen,
					'interestCondition' : tdDepositList[i].freqIntPay,
					'benefitAcc': tdDepositList[i].benefitAcc
				});
		 	}
		}
		return statementList;
	};
	this.inquiryTdStatement = function(myAccountID, lang, callback) {
		var obj = performInquiryTdStatementProcedure(myAccountID, lang);
		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;	
			var resultCode = resultObj.responseStatus.responseCode;
			var tdStatement = resultObj.value;
			if(kkconst.success === resultCode) {
				var tdDepositList = tdStatement.depositsList;
				callback(resultCode, returnTdStatement(tdDepositList, lang));
			} else {
				callback(resultCode||kkconst.unknown);
			}		
		};
	};
	var selectedYear=(new Date()).getFullYear();

	var findLastDayOfMonth = function(s) {
		var day;
		var selectedMonth = parseInt(s);
		if (selectedMonth === 2) {
			if (selectedYear%4 === 0) {
				day = 29;
			} else {
				day = 28;
			}
		} else if (selectedMonth === 4 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 11) {
			day = 30;
		} else {
			day = 31;
		}
		return day;
	};
	var performInquiryCasaStatementProcedure = function(myAccountID, fromDate, toDate, currentPageNo, pageSize) {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_MY_ACCOUNT_INQUIRY_CASA_STATEMENT';
		obj.procedure = 'inquiryMyAccountCASAStatementProcedure';
		obj.params.inquiryAccountStatement = {};
		obj.params.inquiryAccountStatement.myAcctId = myAccountID;
		obj.params.inquiryAccountStatement.statementDateFrom = fromDate;
		obj.params.inquiryAccountStatement.statementDateTo = toDate;
		obj.params.paging = {};
		obj.params.paging.page = currentPageNo;
		obj.params.paging.pageSize = pageSize;
		invokeService.executeInvokePublicService(obj);
		return obj;
	};
	this.inquiryCasaStatement = function(myAccountID, selectedCriteria, currentPageNo, pageSize, callback) {
		selectedCriteria= selectedCriteria.split('-');
		var selectedCriteriaYear  = selectedCriteria[0];
		var day  = findLastDayOfMonth(selectedCriteria[1]);
		var month = selectedCriteria[1];
		var year  = selectedCriteriaYear;
		var fromDate = '01/'+month+'/'+year;
		var toDate = day+'/'+month+'/'+year;

		if (currentPageNo == 1) {
			setTotalPage(1);
		}
		
		if(currentPageNo > getTotalPage()) {
			callback('end');
		} else {
			var obj = performInquiryCasaStatementProcedure(myAccountID, fromDate, toDate, currentPageNo, pageSize);
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;	
				var resultCode = resultObj.responseStatus.responseCode;
				var casaStatement = resultObj.value;
				if(kkconst.success === resultCode) {
					var statement_details = casaStatement;
					var transactions = statement_details.statements.items;
					setTotalPage(Math.ceil(statement_details.statements.totalItem/pageSize));
					callback(resultCode, transactions);
				} else {
					callback(resultCode||kkconst.unknown);
				}	
			};
		}
	};
	var txn_type = '';
	var createStatementStructure = function(txn, lang, statementStructure) {

		if(txn.debitAmount > 0) { 
			txn_type = 'D'; 
		} else if(txn.creditAmount > 0) { 
			txn_type = 'C'; 
		} else if(txn.debitAmount < 0) { //case reverse 
			txn.creditAmount = Math.abs(txn.debitAmount);
			txn_type = 'C'; 
		} else { 
			txn_type='NA'; 
		}
		
		if (lang === kkconst.LANGUAGE_en) {
			txn.transactionDate = $filter('kkdatetime')(txn.transactionDate, kkconst.DATE_FORMAT_dMMMyyyyHHmm);
		} else {
			txn.transactionDate = $filter('kkdatetime')(txn.transactionDate, kkconst.DATE_FORMAT_ddMMyyyyHHmm);
			var convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(txn.transactionDate);
			txn.transactionDate = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year + ' ' + convertTxnDate.time;
		}
		
		statementStructure.transactions.alltransaction.push(txn);
		return statementStructure;
	};
	var appendStatementStructureInResultObject = function(txn, lang, resultObj) {
		
		if(txn.debitAmount > 0) { 
			txn_type = 'D'; 
		} else if(txn.creditAmount > 0) { 
			txn_type = 'C'; 
		} else if(txn.debitAmount < 0) { //case reverse 
			txn.creditAmount = Math.abs(txn.debitAmount);
			txn_type = 'C'; 
		} else { 
			txn_type='NA'; 
		}
		
		if (lang === kkconst.LANGUAGE_en) {
			txn.transactionDate = $filter('kkdatetime')(txn.transactionDate, kkconst.DATE_FORMAT_dMMMyyyyHHmm);
		} else {
			txn.transactionDate = $filter('kkdatetime')(txn.transactionDate, kkconst.DATE_FORMAT_ddMMyyyyHHmm);
			var convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(txn.transactionDate);
			txn.transactionDate = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year + ' ' + convertTxnDate.time;
		}
		
		if (txn_type === 'D' || txn_type === 'C') {
			resultObj[resultObj.length-1].transactions.alltransaction.push(txn);
		}
		
		return resultObj;
	};
	var setData = function(transactions, lang) {
		var resultObj = [];
		var prevTxnDate = '';
		var str_fordate;
		for (var index = 0; index < transactions.length; index++) {
			var txn = transactions[index];
			var str_date = txn.transactionDate.split(' ')[0].split('/');
			str_fordate = $filter('kkdatetime')(txn.transactionDate, kkconst.DATE_FORMAT_dMMMyyyy);
			if (lang !== kkconst.LANGUAGE_en) {
				var convertTxnDate = displayUIService.convertDateTimeForTxnDateUI(txn.transactionDate);
				str_fordate = convertTxnDate.date + ' ' + window.translationsLabel[lang][convertTxnDate.month] + ' ' + convertTxnDate.year;
			}
			var statementStructure = {};	
			if (str_date[0] !== prevTxnDate) {
				var dd = new Number(str_date[0]);
				statementStructure = {
					'date': dd ,
					'str_fordate':str_fordate,
					'transactions' : {
						/*"debits" : [],
						"credits" : [],*/
						'alltransaction' :[]
					}
				};	
				statementStructure = createStatementStructure(txn, lang, statementStructure);
				resultObj.push(statementStructure);
			} else {
				resultObj = appendStatementStructureInResultObject(txn, lang, resultObj);
			}
			prevTxnDate = str_date[0];
		}
		return resultObj;
	};

	var checkAccountType = function(type){
		return function filter(account){
			return account.accountType === type;
		};
	};

	this.formatDataStatment = function(transactions, lang, callback) {
		var stmt_json = setData(transactions, lang);
		var statementList = [];
		statementList.push(stmt_json);
		callback(statementList);
	};
	
	this.initCasaStatement = function(callback) {		
		var currDate  = new Date();
		var currMonth = currDate.getMonth() + 1;
		var currYear  = currDate.getFullYear();
		var criteriaMonthlyList = [];
		for(var i = 0; i < 6; i++) {
			currMonth--;
			if (currMonth < 0) { 
				currYear = currDate.getFullYear()-1;
				currMonth = 12+currMonth;
			}
			criteriaMonthlyList.push({monthYear: generalService.monthsFullNameArray[currMonth] + ' ' + currYear});
		}
		callback(criteriaMonthlyList);
	};

	this.inquiryMyAccountCASASummary = function(callback){
		var obj = {};
		obj.params = {};
		
		obj.actionCode = 'ACT_RBAC_MY_ACCOUNT_INQUIRY_CASA_SUMMARY';
		obj.procedure = 'inquiryMyAccountCASASummaryProcedure';
		
		obj.onSuccess = function(result) {
				var respStatus = result.responseJSON.result.responseStatus;
				var respCode = respStatus.responseCode;
				if (respCode === kkconst.success) {
					 var ownAccountsList = result.responseJSON.result.value;
					 var savingAccountData = ownAccountsList.filter(checkAccountType('SA'));
					 var currentAccountData = ownAccountsList.filter(checkAccountType('CA'));
					 var ownAccountGroups = [];
					 if(savingAccountData.length > 0){
						ownAccountGroups.push({
							myAccountType: savingAccountData[0].myAccountType,
							accountType: savingAccountData[0].accountType,
							items: savingAccountData,
							shown: true,
							typeCount: ownAccountsList.length
						});
					 }
					 if(currentAccountData.length > 0){
						ownAccountGroups.push({
							myAccountType: currentAccountData[0].myAccountType,
							accountType: currentAccountData[0].accountType,
							items: currentAccountData,
							shown: true,
							typeCount: ownAccountsList.length
						});
					 }
					 
					 callback(respCode,ownAccountGroups);
						 
				} else {
					 callback(respCode||kkconst.unknow);
				}
		};
	
		// Execute
		invokeService.executeInvokePublicService(obj);
	};
	
	this.inquiryMyAccountCASASummaryFilterRemoveAccount = function(callback,removeAccount){
		var obj = {};
		obj.params = {};
		
		obj.actionCode = 'ACT_RBAC_MY_ACCOUNT_INQUIRY_CASA_SUMMARY';
		obj.procedure = 'inquiryMyAccountCASASummaryProcedure';
		
		obj.onSuccess = function(result) {
				var respStatus = result.responseJSON.result.responseStatus;
				var respCode = respStatus.responseCode;
				if (respCode === kkconst.success) {
					 var ownAccountsList = result.responseJSON.result.value
					 .filter(function(account){
						return account.myAccountNumber !== removeAccount
					 });
					 var savingAccountData = ownAccountsList.filter(checkAccountType('SA'));
					 var currentAccountData = ownAccountsList.filter(checkAccountType('CA'));
					 var ownAccountGroups = [];
					 if(savingAccountData.length > 0){
						ownAccountGroups.push({
							myAccountType: savingAccountData[0].myAccountType,
							accountType: savingAccountData[0].accountType,
							items: savingAccountData,
							shown: true,
							typeCount: ownAccountsList.length
						});
					 }
					 if(currentAccountData.length > 0){
						ownAccountGroups.push({
							myAccountType: currentAccountData[0].myAccountType,
							accountType: currentAccountData[0].accountType,
							items: currentAccountData,
							shown: true,
							typeCount: ownAccountsList.length
						});
					 }
					 
					 callback(respCode,ownAccountGroups);
						 
				} else {
					 callback(respCode||kkconst.unknow);
				}
		};
	
		// Execute
		invokeService.executeInvokePublicService(obj);
	};

	this.inquiryMyAccountBalanceAvailable = function(accountNumber,
			callback) {
		var obj = {};
		obj.params = {};
		obj.params.accountNumber = accountNumber;
		obj.actionCode = 'ACT_INQUIRY_MY_ACCOUNT_BALANCE_AVAILABLE';
		obj.procedure = 'inquiryMyAccountBalanceAvailableProcedure';

		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			var resultCode = resultObj.responseStatus.responseCode;
			if(kkconst.success === resultCode) {
				callback(resultCode,resultObj);
			} else {
				callback(resultCode||kkconst.unknown);
			}
		};
		invokeService.executeInvokePublicService(obj);
	};
	
	this.addMyAccountWithOutOTP = function(param, callback){
		var obj = {};
		obj.params = {};
		obj.params.myCustomerAccount = {};
		obj.params.myCustomerAccount.myAccountID = param.myAccountID;
		obj.params.myCustomerAccount.myAccountAliasName = param.myAccountAliasName;
		obj.params.myCustomerAccount.myAccountNumber = param.myAccountNumber;
		obj.params.myCustomerAccount.myAccountstatus = param.myAccountstatus;
		obj.params.myCustomerAccount.accountType = param.accountType;
		obj.params.myCustomerAccount.accountStatus = param.accountStatus;
		obj.params.myCustomerAccount.productID = param.productID;
		obj.actionCode = 'ACT_MY_ACCOUNT_ADD_SUBMIT_WITHOUT_OTP';
		obj.procedure = 'addMyAccountSubmitWithOutOTPProcedure';		 

		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			callback(resultObj);
		};
		invokeService.executeInvokePublicService(obj);
		
	};
	
	var createAnyIdAccountGroup = function(anyIdAccount){
		var returnValue = [];
		var accountGroups = {
				myAccountType: 'Promptpay',
				labelType	: 'label.promptpayAccount',
				items: [],
				shown: true,
				typeCount: 0
		};
		accountGroups.items = anyIdAccount.sort(function(a,b){return (a.anyIDType > b.anyIDType) - (a.anyIDType < b.anyIDType);});
		returnValue.push(accountGroups);
		return returnValue;
	};
	this.inquiryMyAnyIdList = function() {
		this.anyIdAccountCache = {};

		var deferred = $q.defer();
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_RTP_INQUIRY_ANYID_MY';
		obj.procedure = 'inquiryRTPInquiryAnyidMyProcedure';
		obj.onSuccess = function(result) {
			var resultObj = result.responseJSON.result;
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				var accountGroup = createAnyIdAccountGroup(resultObj.value);
				deferred.resolve(accountGroup);
			} else {
				deferred.reject(resultObj.responseStatus);
			}
		};
		invokeService.executeInvokePublicService(obj);

		return deferred.promise;
	};
	

});
