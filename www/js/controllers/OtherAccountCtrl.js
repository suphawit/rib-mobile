angular.module('ctrl.otherAccount', [])
.controller('OtherAccountCtrl', function($scope, $rootScope, $state, $ionicListDelegate, mainSession, otherAccountService, popupService, BankCodesImgService, fundTransferTOService, editOtherAccountService, invokeService, kkconst, anyIDService, $ionicHistory) {// NOSONAR
	
	$scope.showPageOtherAccount = false;
	$scope.accountCategoryList = {};
	$scope.ftToAllAccounts = {};
	$scope.cataegorySelected = {};
	$scope.accountListSelected = {};
	$scope.cataegoryPrevious = null;
	$scope.accountListPrevious  = null;
	$scope.selection = null; 
	$scope.hasSubheader = "has-subheader-sub";
	$scope.isNotShowData = false;
	
	$scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;
	
	
	$scope.inquiryCategoryInfo = function(){
		otherAccountService.inquiryCategoryInfo(function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				otherAccountService.accountCatList = resultObj.value;
				$scope.getExternalAccouts();
			} else {
				popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.responseCode);
			}
		});
	};
	
	$scope.getExternalAccouts = function(){
		var lstOfExternalAccount = {};
		otherAccountService.inquiryExternalAccount(function(resultExternalAccount) {
			if(resultExternalAccount.responseStatus.responseCode === kkconst.success) {
				if(resultExternalAccount.value !== null && resultExternalAccount.value.length > 0 && resultExternalAccount.value !== 'undefined') {
					//success
					lstOfExternalAccount = resultExternalAccount.value;
					categorizeAccounts(lstOfExternalAccount);
					$scope.showPageOtherAccount = true;
					$scope.hasSubheader = "has-subheader-sub";
					$scope.isNotShowData = false;
				} else {
					//value null
					$scope.isNotShowData = true;
					$scope.showPageOtherAccount = false;
					$scope.hasSubheader = "";
				}
			} else {
				$scope.isNotShowData = false;
				$scope.showPageOtherAccount = false;
				popupService.showErrorPopupMessage('alert.title',resultExternalAccount.responseStatus.responseCode);
			}
		});	
	};
	
	function categorizeAccounts(lstOfExternalAccount) {
		otherAccountService.categorizeAccounts(lstOfExternalAccount,function(resultObj) {
			$scope.accountCategoryList = resultObj.accountCategoryList;
			$scope.ftToAllAccounts = resultObj.ftToAllaccounts;
			if($scope.cataegoryPrevious !== null){
				var result = false;
				var indexPreviousCat = 999;
				angular.forEach($scope.ftToAllAccounts, function(value, key) {
					if($scope.cataegoryPrevious.catName === value.categoryName) {
						result = true;
						indexPreviousCat = key;
					}
				});
				if(result){
					$scope.accountListSelected = $scope.ftToAllAccounts[indexPreviousCat];
					$scope.cataegorySelected = $scope.cataegoryPrevious;
				} else {
					$scope.cataegoryPrevious = resultObj.ftDefaultCategory[0];
					$scope.cataegorySelected = resultObj.ftDefaultCategory[0];
					$scope.accountListSelected = resultObj.ftToSelectedActsGroup;
				}
			} else {
				$scope.cataegoryPrevious = resultObj.ftDefaultCategory[0];
				$scope.cataegorySelected = resultObj.ftDefaultCategory[0];
				$scope.accountListSelected = resultObj.ftToSelectedActsGroup;
			}
		});
	}
	$scope.inquiryCategoryInfo();
	
	$scope.showOtherAccountsCategory = function(categoryID, category) { 
		$scope.cataegorySelected = { catId: categoryID,	catName: category	};		
		$scope.accountListSelected =  $scope.ftToAllAccounts[categoryID] || [];
		$scope.cataegoryPrevious = { catId: categoryID,	catName: category	};
		
		//for show menu
		$scope.selection = "default";
		$scope.previousIndex = null;
	};
	
	$scope.clearDeleteButton = function() {
		$ionicListDelegate.closeOptionButtons();
	};
	
	$scope.deleteExtAccount = function(accountDataToDel) {
		popupService.showConfirmPopupMessageCallback('label.RemoveAccount','label.deleteExternalAccConfirmation',function(ok){
			if(ok){
				removeExternalAccount(accountDataToDel);
			} else {
				$ionicListDelegate.closeOptionButtons();
			}
		});
	};
	
	function removeExternalAccount(accountDataToDel) {
		otherAccountService.removeExternalAccount(accountDataToDel, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				//success
				$ionicListDelegate.closeOptionButtons();
				popupService.showErrorPopupMessage('label.success','RemoveOtherAccount.successMsg');
				$scope.getExternalAccouts();
				
			} else {
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});	
	}
	
	$scope.previousIndex = null;
	$scope.showMenuDetail = function(index,item) {
		if(!$scope.disableClick){
			if($scope.previousIndex === null || $scope.previousIndex !== index){
				$scope.previousIndex = index;
				$scope.selection = item.acctNo;
			} else if($scope.previousIndex === index){
				if($scope.selection === "default"){
					$scope.selection = item.acctNo;
				} else {
					$scope.selection = "default";
				}
			} else {
				// do something
			}
		}
		//set disable button
		$scope.disableClick = false;
	};
	
	$scope.disableClick = false;
	$scope.transferFunds = function(account){
		$scope.disableClick = true;
		var otherAccount = {    			
    		accountAliasName: account.acctAliasName,
    		accountNumber: account.acctNo,
    		accountName : account.acctName,
    		accountID	: account.exAcctId,
    		anyIDType : account.anyIDType,
    		accountType: "",
    		bankCode: account.bankCode,
    		bankName: account.bankName,
    		categoryId: account.catId,
    		categoryName: account.categoryName,
    		email: account.email,
    		isFavourite: account.isFavourite,
    		mobileNumber: account.mobile    			
    	};
    	fundTransferTOService.setSelectedAccount( otherAccount );
    	fundTransferTOService.setTOaccNotSelected( false );
    	$scope.gotoFund();
	};

	$scope.goCreateRTP = function(account){
		$scope.disableClick = true;
		otherAccountService.setAccountSelected(account);
		$ionicHistory.clearCache().then(function () {
			$state.go(kkconst.ROUNTING.RTP_REQUEST.STATE);
		});
	}
	
	$scope.manageFavourite = function(item){
		$scope.disableClick = true;
		if(item.isFavourite === 'Y') {
			if($scope.cataegorySelected.catName === window.translationsLabel[mainSession.lang]['label.favourite']) {
				$scope.selection = "default";
				$scope.previousIndex = null;
			}
			item.isFavourite = false;
		} else {
			item.isFavourite = true;
		}
			
		otherAccountService.updateFavoriteAccount(item, function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				$scope.getExternalAccouts();
			} else {
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});
	};
	
	$scope.changeExternalAccountDetails = function(item){
		$scope.disableClick = true;
		otherAccountService.editOtherAccountSelected = item;
		$state.go('app.editOtherAccount');
	};
	
	$scope.isFavouriteClass = function(isFav) {		 
		 return isFav === 'Y' ? 'blackTextColor' : 'whiteTextColor';
	};
	
	$scope.showAddExtScreen = function() {
		//$state.go('app.addOtherAccount');
		$ionicHistory.clearCache().then(function () {
			$state.go('app.addOtherAccount');
		});
	};
	
	/** AnyID Icon Selection **/
	$scope.anyIDService = anyIDService; 
	
});