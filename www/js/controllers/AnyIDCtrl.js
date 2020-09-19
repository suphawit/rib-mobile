angular.module('ctrl.anyID', []).controller('AnyIDCtrl',
		function($scope,$state,mainSession,$ionicModal,popupService,myAccountService,fundtransferService,manageAnyIDService,
				ValidationService,displayUIService,generalValueDateService,fundTransferTOService,scheduleFundtransferService, $timeout, kkconst, $q,anyIDService,requestToPayInComingService,deviceService) {


	var regisAnyIDList  = [];
	var ans = [];
	regisAnyIDList = anyIDService.getAnyIDList();
		
		for(var i = 0; i < regisAnyIDList.length; i++)
		{
			if( (regisAnyIDList[i].type === "NATID") || (regisAnyIDList[i].type === "MSISDN")) {
				ans.push(regisAnyIDList[i]);
			}
		}

	$scope.anyIdTypeList = ans;
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);

	$scope.displaySelectedBankName = null;  
	$scope.banksList = fundtransferService.bankList;

	$scope.registerType = '';
	$scope.isregisterTypeChecked 		= {
			checked: true
	};
	//initial variable
	$scope.showConfirmBtn = true;
	$scope.termsAndConditionsChecked 	= {
			checked: false
	};
	
	$scope.anyIDValue = '';
	$scope.ownAccountGroups = [];
	$scope.accountRegisterObj = {};
	
	$scope.showSelectBtn 				= true;
	$scope.showSelectFromAccountDetails = false;
	
	var isCanAccess = true;
	/**************************************** 
	 * Account list Modal
	 * 
	 * *************************************/
	$scope.accListlabelTitle = 'label.selectAccounts';
	$ionicModal.fromTemplateUrl('templates/ManageAccounts/MyAccounts/account-list-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {
		$scope.accListModal = modal;
	});
	$scope.$on('modal.hidden', function() {
		if(isCanAccess === true){
			$scope.showConfirmBtn = true;
		}
	});
	$scope.selectAnyIDAccount=function(){
		$scope.showConfirmBtn = false;
		$scope.accListModal.show();
		if($scope.ownAccountGroups.length === 0){
			populateMySavingsAccountsList();
		
		}
	};
	$scope.selectClose = function(){
		if(isCanAccess === true){
			$scope.showConfirmBtn = true;
		}
		$scope.accListModal.hide();
		$scope.viewTermAndCondModal.hide();
	};
	function populateMySavingsAccountsList() {
		myAccountService.inquiryMyAccountCASASummary(function(responseCode,ownAccountGroups) {
			 if(responseCode === kkconst.success){
				$scope.ownAccountGroups = sortingAccount(ownAccountGroups);
			}else{
				 popupService.showErrorPopupMessage('alert.title',responseCode);
			 }
			
		});
	}
	function sortingAccount(request)
	{
		request.sort(function(a, b){        					 
			 var nameA = a.myAccountAliasName && a.myAccountAliasName.toLowerCase() || '';
			 var nameB = b.myAccountAliasName && b.myAccountAliasName.toLowerCase() || '';
			 
			//sort string ascending
			 if (nameA < nameB) {
				 return -1; 
			 }
			 if (nameA > nameB)  {
				return 1;  
			 }
			 
			 return 0; //default return value (no sorting)
		});
		return request;
	}
	
	$scope.userSelectedFromAccount = function( account){
		setSelectFromAccount(fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA);
		
		//Bind Variables for FROM account data
		$scope.accountRegisterObj.selectedFromName = account.myAccountAliasName || '';
		$scope.accountRegisterObj.selectedFromAccNo = account.myAccountNumber || '';
		$scope.accountRegisterObj.selectedFromAccID = account.myAccountID || '';
		$scope.selectClose();
		
		
	};
	function setSelectFromAccount(action){
		if(action === fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA){
			$scope.showSelectFromAccountDetails = true;
			$scope.showSelectBtn = false;
			
		}else{
			$scope.showSelectFromAccountDetails = false;
			$scope.showSelectBtn = true;
		}
	}
	/**************************************** 
	 * Account list Modal
	 * 
	 * *************************************/
	//data
	var checkToDisableNextButton = function(responseCode){
		if(responseCode === 'RIB-E-ANY014' || responseCode === 'RIB-E-ANY008'){
			$scope.showConfirmBtn = false;
			isCanAccess = false;
		}
	};
	$scope.inquiryCustomerAnyIDInformationResponseData = [];
	
	$scope.termAndCondText = '';
	$ionicModal.fromTemplateUrl('templates/AnyID/anyIdTermAndCondModal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {
		$scope.viewTermAndCondModal = modal;
	});
	
	$scope.viewTermAndConditions = function(){
		$scope.showConfirmBtn = false;
		$scope.viewTermAndCondModal.show();
		var objLanguage = { language: mainSession.lang };
		manageAnyIDService.getRegisterAnyIDTermsAndConditions(function(result){
			if(result.responseStatus.responseCode === kkconst.success){
				$scope.termAndCondText = result.value.data;
			} else {
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.responseCode);
			}
		}, objLanguage);
	};
	
	$scope.termsAndCondChecked = function(){
		$scope.termsAndConditionsChecked.checked = !$scope.termsAndConditionsChecked.checked;
	};
	$scope.initialRegisteredAnyIDChecked = function(){
		manageAnyIDService.inquiryCustomerAnyIDInformation(function(result){
			// result
			if(result.responseStatus.responseCode === kkconst.success){
				$scope.inquiryCustomerAnyIDInformationResponseData = result.value;
				//init anyid value to show in front;
				$scope.anyIDValue = $scope.inquiryCustomerAnyIDInformationResponseData[0].anyIDValue;
			} else {
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.responseCode);
				checkToDisableNextButton(result.responseStatus.responseCode);
			}
			
		});	
	};
	
	$scope.getinquiryCustomerAnyIDInformationByType = function(type){
		var returnValue = {};
		for(var i = 0; i < $scope.inquiryCustomerAnyIDInformationResponseData.length; i++){
			returnValue = $scope.inquiryCustomerAnyIDInformationResponseData[i];
			 
			 if(returnValue.anyIDType === type){
				 break;
			 }
		}
		return returnValue;	
	};
	
	$scope.registerAnyID = function(anyIdType){
		$scope.registerType = anyIdType;
		$scope.anyIDValue =  $scope.getinquiryCustomerAnyIDInformationByType(anyIdType).anyIDValue;
	};
	
	$scope.AnyIDRegisterSubmit = function(){
		var objRequest = {};
		var objResponse = {};
		
		if($scope.registerType === '') {
			// validate select account
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-I-ANY002');
		} else if(Object.keys($scope.accountRegisterObj).length === 0) {
			// validate select account
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.accountRequired');
		} else if($scope.termsAndConditionsChecked.checked === false ) {
			// validate term and condition agreed
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.promptpayRegisterAgreeConditions');
		} else {
			//$state.go(kkconst.ROUNTING.ANYID_CONFIRM.STATE);		
			objRequest['anyIDType']= $scope.registerType;
			objRequest['myAccountID'] = $scope.accountRegisterObj.selectedFromAccID;
			manageAnyIDService.requestVerifyRegisterAnyID(objRequest,function(result){
				if(result.responseStatus.responseCode === kkconst.success){
					objResponse = {
							'anyIDValue': result.value.anyIDValue,
							'anyIDType': result.value.anyIDType,
							'accountNumber': result.value.accountNO,
							'accountName': result.value.accountName,
							'register': result.value.register,
							'verifyTransactionId': result.value.verifyTransactionId
					};
					manageAnyIDService.setRegisterAnyIDConfirmData(objResponse);
					$state.go(kkconst.ROUNTING.ANYID_CONFIRM.STATE);		
				} else {
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.responseCode,
							{ 'CitizenID':$scope.getinquiryCustomerAnyIDInformationByType(kkconst.ANY_ID_TYPE.ID_CARD).anyIDValue
							 ,'MobileNo':$scope.getinquiryCustomerAnyIDInformationByType(kkconst.ANY_ID_TYPE.MOBILE_NO).anyIDValue});
				}
			});
		}
	};


	var mWidth = window.innerWidth;
	var space = 100; 
	if(mWidth > 415){
		space = 100; 
	}

	$scope.anyIdTypeListSwiper = {
		
		activeItem:  'NATID',
		itLock: false,
		invokes: function(value){	
			
			$scope.anyidTypeDescriptionName = value.anyidTypeDescriptionName;
			
			if(value.action === 'onTransitionEnd' && !$scope.isAccountFromList){
				$scope.anyidTypeLabelName 		= value.anyidTypeLabelName;
				$scope.selectedAnyIDType 		= value.anyidTypeCode;
				$scope.registerAnyID($scope.selectedAnyIDType);	
				$scope.isStringDataType 		= value.anyidTypeDataType === kkconst.ANY_ID_TYPE_DATA_TYPE.STRING;
		    	if(!$scope.isStringDataType){
		    		// if(value.anyidTypeLength !== 0){
			    	// 	$scope.virtualKeyboardAccount.option.maxlength = value.anyidTypeLength;
			    	// }					
		    		// $scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
		    	}
				
				// if(value.anyidTypeCode !== tmpSelected){
				// 	$scope.fundObj.toAccountNo = '';
				// 	tmpSelected = value.anyidTypeCode;
				// }
			}
		},
		
		overrideParams: {
			slidesPerColumn: 1,
			slidesPerView: 2.5,
			spaceBetween:  space,
			loopedSlides: 20,
			loop:  true,
			showNavButtons: false,
			slideToClickedSlide: $scope.onTouchEnd,
			centeredSlides: true,
			watchSlidesVisibility: true	
		}
	};


})
.controller('AnyIDConfirmCtrl', function($scope,$state,popupService,manageAnyIDService,kkconst,otpService,anyIDService,$timeout) {
	
	var ans = [];

	$scope.registeredAnyIDConfirm = manageAnyIDService.getRegisterAnyIDConfirmData();
	
	
	regisAnyIDList = anyIDService.getAnyIDList();
		for(var i = 0; i < regisAnyIDList.length; i++)
		{
			if( (regisAnyIDList[i].type === "NATID") || (regisAnyIDList[i].type === "MSISDN")) {
				ans.push(regisAnyIDList[i]);
			}
		}
	$scope.anyIdTypeList = ans;
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, ans);
	$scope.otpData = {
		otp: ''	
	};

	var mWidth = window.innerWidth;
	var space = 100; 
	if(mWidth > 415){
		space = 100; 
	}
 
   $scope.dirOptions = {activeItem : $scope.registeredAnyIDConfirm.anyIDType};
   
	$scope.anyIdTypeListSwiper = {
		activeItem:  $scope.registeredAnyIDConfirm.anyIDType,
		itLock: true,
		invokes: function(value){	
		
			$scope.anyidTypeDescriptionName = value.anyidTypeDescriptionName;
	
			if(value.action === 'onTransitionEnd' && !$scope.isAccountFromList){
				$scope.anyidTypeLabelName 		= value.anyidTypeLabelName;
				$scope.selectedAnyIDType 		= value.anyidTypeCode;
				$scope.isStringDataType 		= value.anyidTypeDataType === kkconst.ANY_ID_TYPE_DATA_TYPE.STRING;
		    	if(!$scope.isStringDataType){
		    		// if(value.anyidTypeLength !== 0){
			    	// 	$scope.virtualKeyboardAccount.option.maxlength = value.anyidTypeLength;
			    	// }					
		    		// $scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
		    	}
				
				// if(value.anyidTypeCode !== tmpSelected){
				// 	$scope.fundObj.toAccountNo = '';
				// 	tmpSelected = value.anyidTypeCode;
				// }
			}
		},
		overrideParams: {
			slidesPerColumn: 1,
			slidesPerView: 2.5,
			spaceBetween:  space,
			loopedSlides: 20,
			loop:  true,
			showNavButtons: false,
			slideToClickedSlide: $scope.onTouchEnd,
			centeredSlides: true,
			watchSlidesVisibility: true	
		}
	};


	
	$scope.AnyIDRegisterConfirm = function(){
		if($scope.otpData.otp !== ''){
			var objRequest = {};
			
			objRequest['verifyTransactionID'] = $scope.registeredAnyIDConfirm.verifyTransactionId;
			objRequest['verifyOTPRequest'] = {
				referenceNO: $scope.otpData.referenceNO,
				tokenOTPForCAA: $scope.otpData.tokenOTPForCAA,
				otp: $scope.otpData.otp
			};
			if($scope.registeredAnyIDConfirm.register){
				manageAnyIDService.requestRegisterAnyID(objRequest, handleResult);
			} else {
				manageAnyIDService.requestAmendAnyID(objRequest, handleResult);
			}
		} else {
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.input.otp');
		}
		
	};
	
	function handleResult(result){
		if(result.responseStatus.responseCode === kkconst.success){
			var objResponse = {
					'anyIDValue': result.value.anyIDValue,
					'anyIDType': result.value.anyIDType,
					'accountNumber': result.value.accountNO,
					'accountName': result.value.accountName,
					'responseCode': result.responseStatus.responseCode,
					'statusCode': result.value.statusCode,
					'statusMessage': result.value.statusMessage
			};
			manageAnyIDService.setRegisterAnyIDResultData(objResponse);
			$state.go(kkconst.ROUNTING.ANYID_RESULT.STATE);	
		} else {
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.responseCode);	
		}
	}
	
	$scope.isDisableBtn = false;
	$scope.requestOTP = function() {
		$scope.colorCode = 'blackTextColor';
		var param = {};
		param.actionOTP = 'register_anyid';
		param.anyIDType = $scope.registeredAnyIDConfirm.anyIDType;
		otpService.requestOTP(param,function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				$scope.isDisableBtn = true;
				$scope.isOtpReadOnly = false;
				$scope.otpData = {
					referenceNO : resultObj.value.referenceNo,
					tokenOTPForCAA : resultObj.value.tokenOTPForCAA,
					mobileNumber : resultObj.value.mobileNo,
					otp: ''
				};
				$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
				$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
			} else {
				$scope.isDisableBtn = false;
	        	popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,resultObj.responseStatus.responseCode);
			}
			$timeout.cancel(promise);
			var promise = $timeout(function() {
				$scope.isDisableBtn = false;
			}, 15000);
		});
	};

	$scope.requestOTP();
	  
  	// create virtual keyboard option
	$scope.virtualKeyboardOTP = {
		option: {
			disableDotButton: true,
			isKeyboardActive: false,
			maxlength: 6,
			IsEditModel: true
		}
	};


	

	
})
.controller('AnyIDCompleteCtrl',
		function($scope,manageAnyIDService,kkconst) {
	$scope.actionLabel = '';
	$scope.statusCode = '';
	$scope.isShowErrorDesc = false;
	$scope.registeredAnyIDResult = manageAnyIDService.getRegisterAnyIDResultData();
	
	$scope.filterOption = {};
	if($scope.registeredAnyIDResult.anyIDType === kkconst.ANY_ID_TYPE.ID_CARD){
		$scope.filterOption['CitizenID'] = $scope.registeredAnyIDResult.anyIDValue;
	} else if($scope.registeredAnyIDResult.anyIDType === kkconst.ANY_ID_TYPE.MOBILE_NO){
		$scope.filterOption['MobileNo'] = $scope.registeredAnyIDResult.anyIDValue;
	} else {
		// do something
	}
	
	if($scope.registeredAnyIDResult.statusCode === 'SC'){
		$scope.actionLabel = 'label.success';
		$scope.statusCode = kkconst.ANY_ID_SUCCESS;
	} else {
		$scope.isShowErrorDesc = true;
		$scope.actionLabel = 'label.fundTransferFailStatus';
		$scope.statusCode = $scope.registeredAnyIDResult.statusCode;
	}
		
});
