angular.module('ctrl.manageAccount', []).controller('ManageAccountDetailCtrl', 
		function($scope, $ionicHistory, invokeService, $state,$translate,ValidationService , popupService, myAccountService, mainSession, kkconst, fundTransferService, $filter) {

	$scope.isErr = false;
	$scope.isAddBeforeFund = false;
	$scope.backToMyAccounts = function() {
		myAccountService.accountDetail = {};
		$state.go('app.myAccount');
		 
	};

	$scope.navigateAddMyAccounts = function() {
		myAccountService.accountDetail = {};
		$state.go('app.addMyAccounts');
	};

	$scope.addMyAccountData = {};
	if((myAccountService.factAddAccountOTP === true) && (myAccountService.accountDetail.myAccountNumber !== undefined)){
		  $scope.addMyAccountData.addMyAccountAliasName = myAccountService.accountDetail.myAccountAliasName;
		  $scope.addMyAccountData.addMyAccountNumber = myAccountService.accountDetail.myAccountNumber;
		  myAccountService.factAddAccountOTP = false;
	}
	/**
	 * addMyAccount
	 * @procedure : addMyAccountProcedure
	 * @adapter : KKadapter
	 * @Parameter's : actionCode : ACT_MY_ACCOUNT_ADD, cisID : 154595, addMyAccountNumber ,addMyAccountAliasName
	 */

	String.prototype.trim = function() 
	{
		return this.replace(/^\s+|\s+$/g,"");
	};

	var isEmpty = function(value){
		if(value === null || value === undefined){
			return true;
		}
		return false;
	}

	$scope.navigateAddMyAccountsDetail = function() {
		
		$scope.isErr = false;

		if (isEmpty($scope.addMyAccountData.addMyAccountNumber) || $scope.addMyAccountData.addMyAccountNumber.trim() === '') {
			popupService.showErrorPopupMessage('label.acctNo','RIB-E-ADD001');
			return;
		}
		
		if (isEmpty($scope.addMyAccountData.addMyAccountAliasName) || $scope.addMyAccountData.addMyAccountAliasName.trim() === '') {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC021');
			return;
		}
		
		var status_accno = ValidationService.verifyAccountNo($scope.addMyAccountData.addMyAccountNumber || '');
		if(!status_accno) {
			popupService.showErrorPopupMessage('label.acctNo','RIB-E-ACC001');
			return;
		}
		
		var status_accname = ValidationService.verifyAliasName($scope.addMyAccountData.addMyAccountAliasName || "");
		if(!status_accname) {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC002');
			return;
		}

		var obj = {};
		obj.params = {};
		obj.params.tokenID = '';
		obj.params.myCustomerAccount = {};
		obj.params.myCustomerAccount.myAccountNumber = $scope.addMyAccountData.addMyAccountNumber;
		obj.params.myCustomerAccount.myAccountAliasName = $scope.addMyAccountData.addMyAccountAliasName;
		obj.params.myCustomerAccount.refTxnId = $scope.addMyAccountData.refTxnId;
		obj.params.myCustomerAccount.txnId = $scope.addMyAccountData.txnId;
		obj.actionCode = 'ACT_MY_ACCOUNT_ADD';
		obj.procedure = 'addMyAccountProcedure';
		obj.onSuccess = function(result) {
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				myAccountService.factAddAccountOTP = false;
				$scope.isErr = false;
				myAccountService.accountDetail =	{
						myAccountNumber : result.responseJSON.result.value.myAccountNumber,
						myAccountAliasName : result.responseJSON.result.value.myAccountAliasName,
						myAccountID : result.responseJSON.result.value.myAccountID,
						myAccountstatus: result.responseJSON.result.value.myAccountstatus,
						accountType: result.responseJSON.result.value.accountType,
						accountStatus : result.responseJSON.result.value.accountStatus,
						productID:result.responseJSON.result.value.productID,
						myAccountName : result.responseJSON.result.value.myAccountName
				};
				//$state.go('app.addMyAccountsDetail');
				myAccountService.isAddBeforeFund = $scope.isAddBeforeFund;
				myAccountService.isRequireOtp = result.responseJSON.result.value.requireOtp || false;
				showToAskNewAccountNumber(result.responseJSON.result.value);
			} else {
				popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.errorMessage);
			}
		};
		obj.onFailure = function() {//return result
			$scope.errorMsg = window.translationsError[$scope.errLang]["RIB-E-AD0001"];
		};
		invokeService.executeInvokePublicService(obj);
	};
	
	 

	$scope.validationAliasName = function(name) {
		
		if (name == null || name.trim() === "") {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC021');
			return;
		}
		
		var status = ValidationService.verifyAliasName(name);
		if (!status) {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC002');
			return;
		}
	};
	
	var prev_val_aliasname = "";
	$scope.validateOnChangeAliasName = function (){
		var curr_val_aliasname = $scope.addMyAccountData.addMyAccountAliasName;
		if(curr_val_aliasname !== undefined && curr_val_aliasname.length >= 20){
			$scope.addMyAccountData.addMyAccountAliasName = prev_val_aliasname;
			curr_val_aliasname = prev_val_aliasname;
		}
		prev_val_aliasname = curr_val_aliasname;
	};
	
	// create virtual keyboard option
	$scope.virtualKeyboardAccount = {
		option: {
			disableDotButton: true,
			isKeyboardActive: true,
			maxlength: 30
		}
	};
	
	if($ionicHistory.viewHistory().backView.stateName === kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE) {
		var data = fundTransferService.getaddAccountFundTransfer();
		$scope.addMyAccountData.addMyAccountAliasName = data.alias_name;
		$scope.addMyAccountData.addMyAccountNumber = data.acc_no;
		$scope.addMyAccountData.refTxnId = data.refTxnId;
		$scope.addMyAccountData.txnId = data.txnId;
		$scope.isAddBeforeFund = true;
	} else {
		$scope.isAddBeforeFund = false;
	}
	
	function showToAskNewAccountNumber(account) {
		if(!account.myAccountNumberOld){
            $state.go('app.addMyAccountsDetail');
        } else {
            popupService.showNormalPopupMessageCallback('alert.title', account.myAccountNumberOld + ' ' + $filter('translate')('lbl.askNewAccountNumber') + ' ' + account.myAccountNumber, function (ok) {
				if (ok) {
					$state.go('app.addMyAccountsDetail');
				}
			});
        }
	}
})

.controller('EditAccountCtrl', function($scope, $state, ValidationService, $translate, fundTransferFROMService, popupService, myAccountService, $ionicHistory, mainSession, kkconst) {//
	$scope.backToMyAccountsDetail = function() {
		if ($ionicHistory.viewHistory().backView.stateName === 'app.myAccountsTdDetails') {
			$state.go('app.myAccountsTdDetails');
		} else {
			$state.go('app.myAccountsCasaDetails');
		}
	};
	$scope.selectedAccountDataInfo = myAccountService.accountDetail;
	$scope.ownAccData = {};
	$scope.ownAccData.aliasNameTextField = myAccountService.accountDetail.myAccountAliasName;


	$scope.navigateToEditMyAccountsDetail = function() {
		$scope.isErr = false;
		
		if ($scope.ownAccData.aliasNameTextField == null || $scope.ownAccData.aliasNameTextField.trim() === "") {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC021');
			return;
		}
		
		var status = ValidationService.verifyAliasName($scope.ownAccData.aliasNameTextField || "");
		if(!status) {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC002');

			return;
		}
		myAccountService.accountDetail.myAccountAliasName = $scope.ownAccData.aliasNameTextField;
		$state.go('app.editMyAccountsDetail');
	};
	
	$scope.validationAliasName = function(name) {

		if (name == null || name.trim() === "") {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC021');
			return;
		}
		
		var status = ValidationService.verifyAliasName(name);
		if (!status) {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC002');
			return;
		}
	};
	
	String.prototype.trim = function() 
	{
		return this.replace(/^\s+|\s+$/g,"");
	};
	
	var prev_val_aliasname = "";
	$scope.validateOnChangeAliasName = function (){
		var curr_val_aliasname = $scope.ownAccData.aliasNameTextField;
		if(curr_val_aliasname !== undefined && curr_val_aliasname.length >= 20){
			$scope.ownAccData.aliasNameTextField = prev_val_aliasname;
			curr_val_aliasname = prev_val_aliasname;
		}
		prev_val_aliasname = curr_val_aliasname;
	};

})

.controller('ManageAccountCtrl', function($scope, invokeService, $state, $ionicModal,
		$ionicPopup, $ionicSideMenuDelegate, $ionicListDelegate, 
		$ionicScrollDelegate,myAccountTermDepositService,$translate , fundTransferFROMService , popupService, billPaymentService, myAccountService, mainSession, kkconst) {	

	$scope.addMyAccountData = {};
	$scope.User = {};
	$scope.errorMsgInfo = "";

	/*
	 * Manage Account screen for CASA
	 */

	$scope.ownAccountGroups = [];
	$scope.savingAccountData = [];
	$scope.currentAccountData = [];
	$scope.termAccountData = [];
 
	$scope.deleteAccount = function(accountDataToDel) {
		var template = window.translationsLabel[$translate.use()]["label.deleteConfirmation"];
		
		popupService.showConfirmPopupMessageCallback('label.RemoveAccount',template,function(ok){
			if(ok){
				removeOwnAccount(accountDataToDel);
			}
			else{$ionicListDelegate.closeOptionButtons();}
		});		
	};

	function removeOwnAccount(accountDataToDel) {
		var obj = {};
		obj.params = {};
		obj.params.myAccountID = accountDataToDel.myAccountID;
		obj.actionCode = 'ACT_MY_ACCOUNT_DELETE';
		obj.procedure = 'deleteMyAccountProcedure';

		obj.onSuccess = function(result) {

			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				popupService.showErrorPopupMessage('label.success','RemoveAccount.successMsg');
				$state.go($state.current.name, {}, {reload : true});
			} else {
				$ionicListDelegate.closeOptionButtons();
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			}
		};
		invokeService.executeInvokePublicService(obj);
	}


	$scope.manageAccCtrlWindow = function(){
		$ionicSideMenuDelegate.toggleLeft();
		$state.go('app.manageOwnAccount', {}, {reload: true});
		window.location.reload(true);
	};

	$scope.toggleGroupSavingAccount = function(savingaccountsgroups) {
		savingaccountsgroups.shown = !savingaccountsgroups.shown;
		$ionicScrollDelegate.resize();
	};

	$scope.isGroupShownSavingAccount = function(savingaccountsgroups) {
		if (typeof(savingaccountsgroups) !== 'undefined') {
			return savingaccountsgroups.shown;
		}
	};

	$scope.showNotificationPanel = function() {
		$scope.notificationModal.show();
	};

	$ionicModal.fromTemplateUrl('templates/notificationModal.html', {
		scope: $scope,
		viewType: 'bottom-sheet',
		animation: 'animated slideInDown' 
	}).then(function(modal) {
		$scope.notificationModal = modal;
	});

	$scope.closeNotificationModal = function() {
		$scope.notificationModal.hide();

	};

	$scope.navigateAddMyAccount = function() {
		myAccountService.accountDetail = {};
		$state.go('app.addMyAccounts');
		
	};

})

/**
 *  MyAccountTermDepositDetail  and StatementDetail Controller to data load the details on myAccountsTdDetails Page
 *  @class invoke  : myAccountTermDepositService
 */

.controller('myAccountTermDepositDetailController', function($scope, invokeService, $state, $translate ,
						myAccountTermDepositService, popupService, myAccountService, mainSession, kkconst) {

	var lang  =  mainSession.lang;
	$scope.editMyAccounts = function() {

		$state.go('app.editMyAccounts');
	};
	$scope.backToMyAccounts = function() {
		myAccountService.accountDetail = {};
		$state.go('app.myAccount');
	};

	$scope.navigateToChangeTerm = function() {
		$state.go('app.myAccountsChangeTerm');
	};
	function successResponse(result){
		if(result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
			return true;
		}else{
			return false;
		}
	}
	function translateError(result,l){

		if( isNotEmp(result) && $scope.interestReceivingAccount ){
			return window.translationsError[l]['NOResults'];
		}

		var responseErrorCode = result.responseJSON.result.responseStatus.responseCode;
		if(responseErrorCode === 'RIB-E-CONN02' || 
			responseErrorCode === 'RIB-E-CONN01' || 
			responseErrorCode === 'RIB-E-AD0003' || 
			responseErrorCode === 'RIB-E-AD0004'){

			return window.translationsError[l][result.responseJSON.result.responseStatus.responseCode];
		} else {
			return window.translationsError[l][responseErrorCode];
		}
	}
	function isNotEmp(result){
		if( result.responseJSON.result.value.productType === '' && 
			result.responseJSON.result.value.ledgerBalance === '' && 
			result.responseJSON.result.value.lastUpdateDate === ''){
			return true;
		}else{
			return false;
		}
	}
	function isDepositSuccess(result){
		if(result.responseJSON.result.responseStatus && 
		result.responseJSON.result.responseStatus.responseCode === kkconst.success && 
		result.responseJSON.result.value){
			return true;
		}else{
			return false;
		}
	}
	function errorMsgInfo(result){
		var responseErrorCode = result.responseJSON.result.responseStatus.responseCode;
		if(responseErrorCode === "RIB-E-CONN02" || 
			responseErrorCode === "RIB-E-CONN01" || 
			responseErrorCode === "RIB-E-AD0003" || 
			responseErrorCode === "RIB-E-AD0004") {
			return window.translationsError[lang][result.responseJSON.result.responseStatus.responseCode];
		} else {
			return window.translationsError[lang][responseErrorCode];
		}
	}
	$scope.inizialiseTermDepostDetail = function() {
		$scope.selectedCurrentTermDepositAccountDetail = myAccountService.accountDetail;
		// call the TermDepositAccountDetail
		var termDepositAccountDetail = getMyAccountTermDepositDetail($scope.selectedCurrentTermDepositAccountDetail.myAccountID);
		// call the TermDepositAccountStatementDetail
		var termDepositAccountStatementDetail = getMyAccountTermDepositStatement($scope.selectedCurrentTermDepositAccountDetail.myAccountID);
		/**
		 * onSuccess to get the result of object
		 */
		termDepositAccountDetail.onSuccess = function(result) {
			if(successResponse() && result.responseJSON.result.value) {

				$scope.myAccountNumber = result.responseJSON.result.value.accountNO || '';
				$scope.myAccountAliasName = result.responseJSON.result.value.accountName || '';
				$scope.myAvailableBalance = result.responseJSON.result.value.availableBalance || '';
				$scope.accountType = result.responseJSON.result.value.productType;
				$scope.myLedgerBalance = result.responseJSON.result.value.ledgerBalance || '';
				$scope.interestReceivingAccount = result.responseJSON.result.value.interestAccountNO || '';
				$scope.lastUpdate = result.responseJSON.result.value.lastUpdateDate || '';
				
				$scope.errorMsgInfo = translateError(result,lang);
			} else {
				//if service results are empty
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);

			}
		};
		/**
		 * onFailure for TermDepositAccountDetail callBack
		 */
		/* termDepositAccountDetail.onFailure = function(result) {
			$scope.errorMsgInfo = translationsError[lang]["callFailed"];
		} */
		/**
		 * TermDepositAccountStatement OnSuccess callBack
		 */
		var statementList = [];
		termDepositAccountStatementDetail.onSuccess = function(result) {
			$scope.errorMsgStatement = false;
			
			if( result.responseJSON.result ){
				if(isDepositSuccess(result) && result.responseJSON.result.value.depositsList) {

					getStatementList(result.responseJSON.result.value.depositsList);
					
					$scope.TdstatementDetail = statementList;
					if($scope.TdstatementDetail.length === 0 || $scope.TdstatementDetail === '' || $scope.TdstatementDetail == null) {
						// $scope.errorMsgStatement = true;
						$scope.errorMsgStatement = window.translationsError[lang]['RIB-E-BIL010'];
					}
				} 
				$scope.errorMsgInfo = errorMsgInfo(result);
			} else {	
				//if service results are empty
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			} 
		};
		/**
		 * TermDepositAcountStatementDetail onFailure callback
		 */
		/*termDepositAccountStatementDetail.onFailure = function(result) {
			$scope.errorMsgInfo = translationsError[lang]["callFailed"];
		}*/
	};

	function getStatementList(depositsList) {
		var rtnStatementList = [];
		var monthTerm = "";
		var dayTerm = "";
		for(var i=0; i < depositsList.length; i++) {
			var statement_record = depositsList[i];
		
			if(statement_record.termMonth) {
				monthTerm = statement_record.termMonth + " M ";
			} else {
				monthTerm = "";
			}
			if(statement_record.termDay) {
				dayTerm = statement_record.termDay + " D";
			} else {
				dayTerm = "";
			}
			rtnStatementList.push({"balAvailable":statement_record.balAvailable,
				"dateMaturity" : statement_record.dateMaturity,
				"termMonth":monthTerm + "" + dayTerm,
				"interest" : statement_record.interest,
				"date" : statement_record.dateOpen,
				"depNo" : statement_record.depNo});
		}
		return rtnStatementList;
	}

	$scope.inizialiseTermDepostDetail();
	/**
	 * @adapter : KKadapter
	 * @procedure : inquiryMyAccountDetailProcedure
	 * @parameter : accountID
	 * @actionCode : ACT_MY_ACCOUNT_INQUIRY_DETAIL
	 * return : json Object
	 * once invoke this adapter will get the Term Deposit Account Detail
	 */
	function getMyAccountTermDepositDetail(accID) {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_MY_ACCOUNT_INQUIRY_DETAIL';
		obj.procedure = 'inquiryMyAccountDetailProcedure';
		obj.params.inquiryAccountStatement = {};
		obj.params.inquiryAccountStatement.myAcctId = accID;  
		obj.params.inquiryAccountStatement.statementDateFrom = '';
		obj.params.inquiryAccountStatement.statementDateTo = '';
		obj.params.paging = {};
		obj.params.paging.page = '1';
		obj.params.paging.pageSize = '10';
		invokeService.executeInvokePublicService(obj);
		return obj;
	}
	/**
	 * @adapter : KKadapter
	 * @procedure : inquiryMyAccountStatementProcedure
	 * @parameter : accountID
	 * @actionCode : ACT_MY_ACCOUNT_INQUIRY_STATEMENT
	 * return : json Object
	 * once invoke this adapter will get the Term Deposit Account statement
	 */
	function getMyAccountTermDepositStatement(accID) {
		var obj = {};
		obj.params = {};
		obj.actionCode = 'ACT_MY_ACCOUNT_INQUIRY_STATEMENT';
		obj.procedure = 'inquiryMyAccountStatementProcedure';
		obj.params.inquiryAccountStatement = {};
		obj.params.inquiryAccountStatement.myAcctId = accID;  
		obj.params.inquiryAccountStatement.statementDateFrom = '16/09/2015';
		obj.params.inquiryAccountStatement.statementDateTo = '16/08/2015';
		obj.params.paging = {};
		obj.params.paging.page = '1';
		obj.params.paging.pageSize = '10';
		invokeService.executeInvokePublicService(obj);
		return obj;
	}
});

// var selectedMonth=(new Date()).getMonth();
// var selectedYear=(new Date()).getFullYear();

var deleteAccountData={};