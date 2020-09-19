angular.module('service.otherAccount', [])
.service('otherAccountService', function (invokeService, mainSession, popupService,ValidationService,kkconst) {
		var accountCatList = null;
		var accountSelected = {}

		this.setAccountSelected = function (data) {
			this.accountSelected = data;
		}

		this.getAccountSelected = function () {
			return JSON.parse(JSON.stringify(this.accountSelected));
		}
		
		this.inquiryExternalAccount = function (callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_INQUIRY';
			obj.procedure = 'inquiryExternalAccountProcedure';
			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};

		var sortBy = function (field, reverse, primer) {
			var isReverse = -1;
			var key = function (x) { return x[field]; };
			if(primer){
				key = function (x) { return primer(x[field]); };
			}
			if(!reverse) {
				isReverse = 1;
			}
			return function (a, b) {
				return a = key(a), b = key(b), isReverse * ((a > b) - (b > a));
			};
		};
		var sortList = function(list){
			list.sort(function (a, b) {
				var nameA = a.acctAliasName && a.acctAliasName.toLowerCase() || "";
				var nameB = b.acctAliasName && b.acctAliasName.toLowerCase() || "";
				//sort string ascending
				if (nameA < nameB) {
					return -1;
				}else if(nameA > nameB){
					return 1;
				}
				else{
					return 0; //default return value (no sorting)
				}
				
			});
		};
		var pushAllAccount = function(ftToAllaccounts,ftToFavAccounts,c){
			for (var xindex = 0; xindex < ftToFavAccounts.length; xindex++) {
				ftToAllaccounts[c].items.push(ftToFavAccounts[xindex]);
			}
		};
		var pushFavOther = function(toActsList,ftToFav,ftToOther){
			for (var i = 0; i < toActsList.length; i++) {
				if (toActsList[i].isFavourite === 'Y') {
					ftToFav.push(toActsList[i]);
				}
				ftToOther.push(toActsList[i]);
			}
		}
		var pushDefaultCat = function(defaultCat,d){
			if (defaultCat.length === 0) {
				defaultCat.push(d[0]);
			}
		};
		this.categorizeAccounts = function (result, callback) {
			var accountCategoryList = [];
			var ftToAllaccounts = [];
			var ftToFavAccounts = [];
			var ftToOtherAccounts = [];
			//var ftToSelectedActsGroup = [];
			var ftDefaultCategory = [];
			var toAccountsList = angular.copy(result);
			var orderCat = [];

			var catList = angular.copy(accountCatList);
			var ycount = 0;
			angular.forEach(catList, function (value, key) {
				orderCat[value.catName] = key;
			});

			sortList(toAccountsList);

			pushFavOther(toAccountsList,ftToFavAccounts,ftToOtherAccounts);
			
			if (ftToFavAccounts.length > 0) {
				ftToAllaccounts[ycount] = {
					categoryName: window.translationsLabel[mainSession.lang]['label.favourite'],
					accordionId: ycount,
					items: []
				};
				var catItems = {
					catId: ycount,
					catName: window.translationsLabel[mainSession.lang]['label.favourite']
				};
				accountCategoryList.push(catItems);
				ftDefaultCategory.push(catItems);

				pushAllAccount(ftToAllaccounts,ftToFavAccounts,ycount);
				ycount++;
			}
			var otherAccountItemCatName = [];
			var pushAccounts= function(ind){
				var a = false;
				for (var allAccountsIndex = 0; allAccountsIndex < ftToAllaccounts.length; allAccountsIndex++) {
					var allaccount_item_catname = ftToAllaccounts[allAccountsIndex].categoryName;
					if (allaccount_item_catname === otherAccountItemCatName) {
						a = true;
						ftToAllaccounts[allAccountsIndex].items.push(ftToOtherAccounts[ind]);
					}
				}
				return a;
			};
			if (ftToOtherAccounts.length > 0) {
				for (var otheraccountsIndex = 0; otheraccountsIndex < ftToOtherAccounts.length; otheraccountsIndex++) {
					otherAccountItemCatName = ftToOtherAccounts[otheraccountsIndex].categoryName;
					var isavailable = 	pushAccounts(otheraccountsIndex);

					if (!isavailable) {
						ftToAllaccounts[ycount] = {
							categoryName: otherAccountItemCatName,
							accordionId: orderCat[otherAccountItemCatName] + 1,
							items: []
						};
						var catItms = {
							catId: orderCat[otherAccountItemCatName] + 1,
							catName: otherAccountItemCatName
						};
						accountCategoryList.push(catItms);

						ftToAllaccounts[ycount].items.push(ftToOtherAccounts[otheraccountsIndex]);
						ycount++;
					}
				}

				accountCategoryList.sort(sortBy('catId', false, parseInt));
				// accountCategoryList = data;
				//fix for sonar use build-in sort with out return parameter
                //accountCategoryList.sort(sortBy('catId', false, parseInt));
				pushDefaultCat(ftDefaultCategory,accountCategoryList);
			}
			ftToAllaccounts.sort(sortBy('accordionId', false, parseInt));
			var allData = ftToAllaccounts;
			// ftToSelectedActsGroup = allData[0] || [];
            //fix for sonar use build-in sort with out return parameter
            //ftToSelectedActsGroup = ftToAllaccounts.sort(sortBy('accordionId', false, parseInt))[0] || [];

			angular.forEach(accountCategoryList, function (value, key) {
				value.catId = key;
			});

			var objResult = {};
				objResult.accountCategoryList = accountCategoryList;
				objResult.ftToSelectedActsGroup = allData[0] || [];
				objResult.ftToAllaccounts = allData;
				objResult.ftDefaultCategory = ftDefaultCategory;
			callback(objResult);
		};

		this.removeExternalAccount = function (accountDataToDel, callback) {
			var obj = {};
			obj.params = {};
			obj.params.exAcctId = accountDataToDel.exAcctId;
			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_DELETE';
			obj.procedure = 'deleteExternalAccountProcedure';
			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};

		this.updateFavoriteAccount = function (param, callback) {
			var obj = {};
			obj.params = {};
			obj.params.detail = {};
			obj.params.detail.exActID = param.exAcctId;
			obj.params.detail.enable = param.isFavourite;
			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_UPDATE_FAVORITE';
			obj.procedure = 'updateFavoriteProcedure';

			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};

		this.inquiryCategoryInfo = function (callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.actionCode = 'ACT_INQUIRY_CATEGORY_INFO';
			obj.procedure = 'inquiryCategoryInfoProcedure';

			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				accountCatList = resultObj.value;

				if(resultObj.responseStatus.responseCode === kkconst.success) {
					callback(resultObj);
				}else{
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			};
			invokeService.executeInvokePublicService(obj);
		};

		this.addOtherAccount = function (param, callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.accountNo = param.accountNo;
			obj.params.accountAliasname = param.accountAliasname;
			obj.params.bankCode = param.bankCode;
			obj.params.category = param.category;
			obj.params.email = param.email;
			obj.params.mobile = param.mobile;
			obj.params.anyIDType = param.anyIDType;
			obj.params.accountName = param.accountName;
			obj.params.refTxnId = param.refTxnId;
			obj.params.txnId = param.txnId;


			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_ADD';
			obj.procedure = 'addExternalAccountProcedure';

			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				if(resultObj.responseStatus.responseCode === kkconst.success) {
					callback(resultObj);
				}else{
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}

			};
			invokeService.executeInvokePublicService(obj);
		};

		this.confirmSaveEditedOtherAccount = function (params, callback) {
		
			var obj = {};
			obj.params = {};
			obj.params.externalAccount = {};
			obj.params.externalAccount.acctAliasName = params.acctAliasName;
			obj.params.externalAccount.acctName = params.acctName;
			obj.params.externalAccount.mobile = params.mobile;
			obj.params.externalAccount.email = params.email;
			obj.params.externalAccount.exAcctId = params.exAcctId;
			obj.params.externalAccount.acctNo = params.acctNo;
			obj.params.externalAccount.status = params.status;
			obj.params.externalAccount.bankName = params.bankName;
			obj.params.externalAccount.anyIDType = params.anyIDType;
			obj.params.externalAccount.ribId = params.ribId;
			obj.params.externalAccount.productId = params.productId;
			obj.params.externalAccount.bankCode = params.bankCode;
			obj.params.externalAccount.isFavourite = params.isFavourite;
			obj.params.externalAccount.msgLang = params.msgLang;
			obj.params.externalAccount.categoryName = params.catName;
			obj.params.externalAccount.catId = params.catId;

			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_EDIT';
			obj.procedure = 'editExternalAccountProcedure';


			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};

		this.submitAddOtherAccount = function (params, otp, callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;

			obj.params.externalAccount = {};
			obj.params.externalAccount.acctNo = params.acctNo;
			obj.params.externalAccount.acctAliasName = params.acctAliasName;
			obj.params.externalAccount.bankCode = params.bankCode;
			obj.params.externalAccount.bankName = params.bankName;
			obj.params.externalAccount.catId = params.catId;
			obj.params.externalAccount.email = params.email;
			obj.params.externalAccount.mobile = params.mobile;
			obj.params.externalAccount.anyIDType = params.anyIDType;
			obj.params.externalAccount.acctName = params.acctName;
			obj.params.externalAccount.msgLang = mainSession.lang;
			obj.params.verifyOTP = {};
			obj.params.verifyOTP.referenceNO = otp.referenceNo;
			obj.params.verifyOTP.otp = otp.pin;
			obj.params.verifyOTP.tokenUUID = otp.tokenOTPForCAA;

			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_ADD_SUBMIT';
			obj.procedure = 'addExternalAccountSubmitProcedure';

			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);

		};

		this.submitAddOtherAccountWithOutOTP = function (params, callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.verifyOTP = {};
			obj.params.externalAccount = {};
			obj.params.externalAccount.acctNo = params.acctNo;
			obj.params.externalAccount.acctAliasName = params.acctAliasName;
			obj.params.externalAccount.bankCode = params.bankCode;
			obj.params.externalAccount.bankName = params.bankName;
			obj.params.externalAccount.catId = params.catId;
			obj.params.externalAccount.email = params.email;
			obj.params.externalAccount.mobile = params.mobile;
			obj.params.externalAccount.msgLang = mainSession.lang;
			obj.params.externalAccount.anyIDType = params.anyIDType;
			obj.params.externalAccount.acctName = params.acctName;

			obj.actionCode = 'ACT_EXTERNAL_ACCOUNT_ADD_SUBMIT_WITHOUT_OTP';
			obj.procedure = 'addExternalAccountSubmitWithoutOTPProcedure';

			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};
		this.validateAcct = function(statusAccno,err,option){
			if(!statusAccno) {
				popupService.showErrorPopupMessage('label.warning',err,option);
				return;
			}
		};
		this.validateNotify = function(s,extAccDetails,errorMsg,validate){
			var otherAccountService = this;
			if(extAccDetails !== undefined && extAccDetails.length !== 0){
				s = validate;
				otherAccountService.validateAcct(s,errorMsg);
			}
		}
		this.validateAccDetails = function(extAccDetails,isShowAccountName){
			if((extAccDetails.acctName === undefined || extAccDetails.acctName.trim() === '') && isShowAccountName){
				popupService.showErrorPopupMessage('label.warning','RIB-E-ACC022');
				return true;
			}
		};
		this.isAccNoEmpty = function(accNo){
			var f = false;
			if(accNo === undefined || accNo.trim() === ''){
               f = true;
			}
			return f;
		};
		this.validateBeforeConfirm = function(extAccDetails,anyIDType,accCatgry,validateSplitMobile,validateSplitCard,status_accno,validateSplitEWallet){
			var otherAccountService = this;
			if (extAccDetails.accAliasName === undefined || (extAccDetails.accAliasName.trim()) === '') {
				popupService.showErrorPopupMessage('label.warning','RIB-E-ACC021');
				return true;
			} else {
				var result = ValidationService.verifyAliasName(extAccDetails.accAliasName);
				if(!result) {
					popupService.showErrorPopupMessage('label.warning','RIB-E-ACC002');
					return true;
				}
			}
			
			if( (extAccDetails.anyIDType === anyIDType.ACCOUNT) && otherAccountService.isAccNoEmpty(extAccDetails.accNo)){			 
				popupService.showErrorPopupMessage('label.warning','RIB-E-ADD001');
				return true;
			} else {
				status_accno = ValidationService.verifyAccountNo(extAccDetails.accNo);
				otherAccountService.validateAcct(status_accno,'RIB-E-ACC001');
			}
		
			if(validateSplitMobile){
				return true;
			}
			if(validateSplitCard){
				return true;
			}
			if(validateSplitEWallet){
				return true;
			}

			if(!accCatgry){			 
				popupService.showErrorPopupMessage('label.warning','RIB-E-EXT004');
				return true;
			}

			// validateNotify(status,$scope.extAccDetails.mobile,'RIB-E-ACC003',ValidationService.verifyPhoneFormat( $scope.extAccDetails.mobile));
			// validateNotify(status,$scope.extAccDetails.email,'RIB-E-ACC004',ValidationService.verifyEmailFormat( $scope.extAccDetails.email));
		};

	});
