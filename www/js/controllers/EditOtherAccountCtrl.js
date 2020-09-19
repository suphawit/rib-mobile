angular.module('ctrl.editOtherAccount', [])
.controller('EditOtherAccountCtrl', function($scope, $state, BankCodesImgService, popupService, mainSession, otherAccountService, ValidationService, kkconst, anyIDService, generalService, $ionicPlatform) { // NOSONAR

	var anyIDType = otherAccountService.editOtherAccountSelected.anyIDType;
	$scope.editCategoryList = otherAccountService.accountCatList;
	$scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;
	$scope.currentSelectedAccount = otherAccountService.editOtherAccountSelected;
	$scope.catName = otherAccountService.editOtherAccountSelected.categoryName;
	$scope.catId = otherAccountService.editOtherAccountSelected.catId ;
	$scope.bankCode = otherAccountService.editOtherAccountSelected.bankCode ;
	
	$scope.isActiveCategory = function(type) {
		return type === $scope.catName;
	};
	
	$scope.init = function(){
		$scope.isAnyID		= anyIDService.isAnyID(anyIDType);
		$scope.anyIDIcon	= anyIDService.getAnyIDinfo(anyIDType).icon;
		$scope.anyIDIconColor	= anyIDService.getAnyIDinfo(anyIDType).iconColor;
	};
	$scope.init();
	
	$scope.setCategoryID = function( category ) {
		$scope.catId = category.catId;
		$scope.catName = category.catName;
	};
	
	$scope.isShowAcctName = function(){
		var status;
			if($scope.isAnyID || $scope.currentSelectedAccount.isORFT === '1' || $scope.currentSelectedAccount.bankCode === '069'){
				status = false;
			}else{
				status = true;
			}
		return status;
	};
	
	
	$scope.backToOtherAccounts = function() {
		$scope.gotoOtherAccount();
	};
	function isNotEmpty_(obj_){
		if((obj_ !== undefined && obj_ !== null && obj_.length!==0)){
			return true;
		}else{
			return false;
		}
	}
	function validateNotify(){
		var mobileNumberEntered = $scope.currentSelectedAccount.mobile;
		if(isNotEmpty_(mobileNumberEntered) && (!ValidationService.verifyPhoneFormat( $scope.currentSelectedAccount.mobile))){
			popupService.showErrorPopupMessage('label.mobileNo','RIB-E-ACC003');
			return;
		}
		
		var emailEntered =  $scope.currentSelectedAccount.email;
		if(isNotEmpty_(emailEntered) && !ValidationService.verifyEmailFormat( $scope.currentSelectedAccount.email)){
			popupService.showErrorPopupMessage('label.email','RIB-E-ACC004');
			return;
		}
	}
	function validateEditOther(){
		if ($scope.currentSelectedAccount.acctAliasName === null || $scope.currentSelectedAccount.acctAliasName.trim() === '') {
			popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC021');
			return true;
		}
		
		var status = ValidationService.verifyAliasName($scope.currentSelectedAccount.acctAliasName);
		if(!status) {
        	popupService.showErrorPopupMessage('label.acctAliasName','RIB-E-ACC002');
			return true;
		}
		
		validateNotify();

		var acctNameEntered = $scope.currentSelectedAccount.acctName;
		if((acctNameEntered === null || acctNameEntered.length === 0) && ($scope.isShowAcctName()) ){
			popupService.showErrorPopupMessage('label.input.acctName','RIB-E-ACC022');
			return true;
		}
	}
  
	/**  ToNavigate to editOtherAccount	 */
	$scope.navigateToEditOtherAccountsDetail = function() {
		
		
		if(validateEditOther()) return;
		
		if(!$scope.isShowAcctName()){
			 $scope.currentSelectedAccount.acctName = '';
		}
		
		var editDetails = {
				'catName': $scope.catName, 
				'acctAliasName':$scope.currentSelectedAccount.acctAliasName,
				'bankName':$scope.currentSelectedAccount.bankName,
				'accNo':$scope.currentSelectedAccount.acctNo,
				'acctName' : generalService.adjustText($scope.currentSelectedAccount.acctName),//$scope.currentSelectedAccount.acctName,
				'mobile':$scope.currentSelectedAccount.mobile,
				'email' : $scope.currentSelectedAccount.email,
				'catId' : $scope.catId,
				'anyIDType':$scope.currentSelectedAccount.anyIDType
	   };
		otherAccountService.editotherAccountDetailSelected = editDetails;
		$state.go('app.editOtherAccountDetail');		
	};
	
	$scope.virtualKeyboardMobileNo = {
			option: {
				disableDotButton: true,
				maxlength: 10
			}
		};

	$scope.getContactPhoneForMobile = function(){
		$ionicPlatform.ready(function() {
			navigator.contacts.pickContact(function(contact){
				contact = contact.phoneNumbers[0].value;
				if(contact.substring(0,3) === '+66'){
					
					contact = contact.replace(contact.substring(0,3),'0');   
				}
				$scope.currentSelectedAccount.mobile = (contact).replace(/[^0-9.]/g, "");
				$scope.$apply();
			},function(err){
			});
		});
	};
})
.controller('EditOtherAccountDetailCtrl', function($scope, $state, otherAccountService, BankCodesImgService, popupService, mainSession, kkconst, anyIDService) {// NOSONAR
	
	$scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;
	var currentSelectedAccount = {};
	$scope.init = function() {
	 	$scope.currentEditDetails = otherAccountService.editotherAccountDetailSelected;
	 	currentSelectedAccount  = otherAccountService.editOtherAccountSelected;
	 	var anyIDType =  otherAccountService.editotherAccountDetailSelected.anyIDType;
	 	$scope.bankCode = currentSelectedAccount.bankCode ;
	 	
		$scope.isAnyID		= anyIDService.isAnyID(anyIDType);
		$scope.anyIDIcon	= anyIDService.getAnyIDinfo(anyIDType).icon;
		$scope.anyIDIconColor	= anyIDService.getAnyIDinfo(anyIDType).iconColor;
	 	
	};
	$scope.init();
	
	$scope.backToEditOtherAccounts = function() {
		$state.go('app.editOtherAccount');
	};
	
	$scope.onConfirmSaveEditedOtherAccount = function(){
		var params = {};
		params.acctAliasName = $scope.currentEditDetails.acctAliasName;
		params.mobile = $scope.currentEditDetails.mobile;
		params.email = $scope.currentEditDetails.email;
		params.exAcctId = currentSelectedAccount.exAcctId;
		params.acctNo = currentSelectedAccount.acctNo;
		params.acctName = currentSelectedAccount.acctName;
		params.status = currentSelectedAccount.status;
		params.bankName = currentSelectedAccount.bankName;
		params.productId = currentSelectedAccount.productId;
		params.bankCode = currentSelectedAccount.bankCode;
		params.isFavourite = currentSelectedAccount.isFavourite;
		params.msgLang = currentSelectedAccount.msgLang;
		params.catName = $scope.currentEditDetails.catName;
		params.catId = $scope.currentEditDetails.catId;
		params.anyIDType = $scope.currentEditDetails.anyIDType;
		
		otherAccountService.confirmSaveEditedOtherAccount(params,function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				popupService.showErrorPopupMessage('label.success','ChangeOtherAccount.successMsg');
				$scope.gotoOtherAccount();
			} else {
				popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.responseCode);
			}
		});
	};
	
});
