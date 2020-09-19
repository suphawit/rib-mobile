angular.module('ctrl.addOtherAccount', [])
.controller('AddOtherAccountCtrl', function($scope, $ionicHistory, $state, 
			BankCodesImgService, displayUIService, fundtransferService, 
			otherAccountService, ValidationService, popupService, 
			kkconst, fundTransferService, anyIDService, generalService, deviceService, manageAnyIDService,$ionicPlatform) {
	'use strict';
	$scope.displaySelectedBankName = null;  
	$scope.banksList = fundtransferService.bankList;
	$scope.anyIdTypeList = fundtransferService.anyIdTypeList.slice(0);
	//ป้องกันการแสดงข้อมูลไม่ทันในขณะ slide 
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
	$scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
	///////////////////////////////////////
	$scope.swiper_slides_per_view = Math.floor(deviceService.slidesPerView());
	$scope.accCatList = otherAccountService.accountCatList;
	$scope.accCatgry = null;
	$scope.isShowSwiper = false;
	$scope.extAccDetails = {};
	$scope.getBankCodeImg =  BankCodesImgService.getBankCodeImg;
	$scope.confirmDetails = {};
	$scope.accountID = true;
	$scope.isShowAnyIDTypeButton = true;
	$scope.isShowAccountName = false;
	$scope.isStringDataType = true;
	$scope.setDefaultAnyIDType = {};
	
	$scope.selectedType = '';
	$scope.switchSelected = function(selectedType){
		$scope.selectedType = selectedType;
	};

	var status_accno;
	var status;
	//set using in select anyid type
	var tmpBankCode = { isORFT : "", bankCode : "" };
	// anyid value
	$scope.anyIDInfo = anyIDService;
	$scope.anyIDType = kkconst.ANY_ID_TYPE;


	// initial any id type
	$scope.extAccDetails.anyIDType = $scope.anyIDType.ACCOUNT;
	otherAccountService.addOtherAccountSelected = $scope.anyIDType.ACCOUNT;
	
	$scope.switchSelected = function(selectedType){
		// clear any id value
		$scope.extAccDetails.accNo = '';
		otherAccountService.addOtherAccountSelected = selectedType;
		$scope.extAccDetails.anyIDType = selectedType;
		$scope.virtualKeyboardAccount.option.maxlength = $scope.anyIDInfo.getAnyIDinfo(selectedType).maxLength;
		// set virtual keyboard option
		$scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
	};
	
	var mWidth = window.innerWidth;
	var anyWidth = 90;
	var space = 7; 
	if(mWidth > 415){
		anyWidth = 100;
		space = 4; 
	}
   var perView = Math.floor(mWidth/anyWidth);

	function init(){
		$scope.anyIdTypeListSwiper = {
			activeItem: ($scope.confirmDetails.anyIDType === undefined) ? undefined : $scope.confirmDetails.anyIDType,
			invokes: function(value){
				$scope.extAccDetails.anyidTypeDescriptionName = value.anyidTypeDescriptionName;	
				
				if(value.action === 'onTransitionEnd'){

					$scope.isShowAccountName 					= BankCodesImgService.setToShowAccountName(tmpBankCode.isORFT, tmpBankCode.bankCode, value.anyidTypeCode);
					$scope.extAccDetails.accNo 					= '';
					otherAccountService.addOtherAccountSelected = value.anyidTypeCode;
					$scope.extAccDetails.anyIDType 				= value.anyidTypeCode;
					$scope.extAccDetails.anyidTypeLabelName 	= value.anyidTypeLabelName;
			    	$scope.extAccDetails.anyidTypeIconColor     = value.anyidTypeIconColor;
			    	$scope.extAccDetails.anyidTypeImage         = value.anyidTypeImage;
			    	$scope.extAccDetails.anyidTypeLength        = value.anyidTypeLength;				    	
			    	$scope.isStringDataType = value.anyidTypeDataType === kkconst.ANY_ID_TYPE_DATA_TYPE.STRING;

			    	if(!$scope.isStringDataType){

						$scope.virtualKeyboardAccount.option.maxlength = value.anyidTypeLength;
			    		if(value.anyidTypeLength == 0){
				    		$scope.virtualKeyboardAccount.option.maxlength = $scope.anyIDInfo.getDefaultValidate(value.anyidTypeCode);
						}		
						$scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
			    	}			    	
				}
			},
			overrideParams: {
				slidesPerColumn: 1,
				slidesPerView: perView,
				spaceBetween:  space,
				loopedSlides: 25,
				loop:  true,
				showNavButtons: false,
				slideToClickedSlide: $scope.onTouchEnd,
				centeredSlides: true,
				watchSlidesVisibility: true
			}
		};



		$scope.bankListSwiper = {
				activeItem: ($scope.confirmDetails.bankCode === undefined) ? undefined : $scope.confirmDetails.bankCode,
				invokes: function(value){
					$scope.setBankCode(value.bankCode, value.bankName);
					
					// execute on this
					if(value.action === 'onTransitionEnd'){
						var bankdata = BankCodesImgService.getBankDataByBankCode($scope.banksList,value.bankCode);
						// setToShowAccountName(bankdata.isORFT, value.bankCode);	
		
						$scope.isShowAccountName = BankCodesImgService.setToShowAccountName(bankdata.isORFT, value.bankCode, $scope.extAccDetails.anyIDType);
						tmpBankCode = { isORFT : bankdata.isORFT, bankCode : value.bankCode };
					}

					
				},
				overrideParams: {
					slidesPerColumn: 1,
					slidesPerView: $scope.swiper_slides_per_view,
					spaceBetween:  2,
					loopedSlides: 25,
					loop:  true,
					showNavButtons: false,
					slideToClickedSlide: $scope.onTouchEnd,
					centeredSlides: true,
					watchSlidesVisibility: true	    
				}
		};
	}
	
	function inquiryCategoryInfo(){
		otherAccountService.inquiryCategoryInfo(function(resultObj){
			otherAccountService.accountCatList = resultObj.value;
			$scope.accCatList = resultObj.value;
		});
	}

   $scope.setBankCode = function(bankCode, bankName) {
    	$scope.bankCode = bankCode;
    	$scope.displaySelectedBankName = bankName;
	};
   
   $scope.setActiveAccCatgry = function(accCatgry) {
        $scope.accCatgry = accCatgry;
   };
    
   $scope.isActiveAccCatgry = function(type) {
        return type === $scope.accCatgry;
   };

   function validateSplit(anyIDT,errMsg1,errMsg2,statusAccno){
		status_accno = statusAccno;
		if ($scope.extAccDetails.anyIDType === anyIDT) {
			if($scope.extAccDetails.accNo === undefined || $scope.extAccDetails.accNo.trim() === ''){			 
				popupService.showErrorPopupMessage('label.warning',errMsg1,{AnyIdTypeName:$scope.extAccDetails.anyidTypeLabelName});
				return true;
			} else {
				if(!statusAccno) {
					popupService.showErrorPopupMessage('label.warning',errMsg2,{AnyIdTypeName:$scope.extAccDetails.anyidTypeLabelName});
					return true;
					//otherAccountService.validateAcct(status_accno,errMsg2,{AnyIdTypeName:$scope.extAccDetails.anyidTypeLabelName});
				}
			}
		} else {
			// do something
		}
	  
		if(otherAccountService.validateAccDetails($scope.extAccDetails, $scope.isShowAccountName)){
			return true;
		}
   }

   function confirmService(request){

	   otherAccountService.addOtherAccount(request, function(resultObj){
				//success
				$scope.confirmDetails = {
						bankCode : resultObj.value.bankCode,
						bankName : resultObj.value.bankName,
						acctNo : resultObj.value.acctNo,
						acctName : resultObj.value.acctName,
						acctAliasName : resultObj.value.acctAliasName,
						catId : resultObj.value.catId,
						categoryName : resultObj.value.categoryName,
						mobile : resultObj.value.mobile,
						email : resultObj.value.email,
						anyIDType: resultObj.value.anyIDType,
						anyidTypeIconColor: resultObj.value.anyIDType === kkconst.ANY_ID_TYPE.ACCOUNT ? "" :  $scope.extAccDetails.anyidTypeIconColor,
						anyidTypeImage: resultObj.value.anyIDType === kkconst.ANY_ID_TYPE.ACCOUNT ? "" :  $scope.extAccDetails.anyidTypeImage,
					};
				otherAccountService.confirmOtherAccountDetail = $scope.confirmDetails;
				otherAccountService.isShowSwiper = $scope.isShowSwiper;
				otherAccountService.isRequireOtp = resultObj.value.requireOtp || false;
				$state.go('app.addOtherAccountDetail');
			
		});
   }
   $scope.showAddExtConfirmScreen = function() {
	   var validateM = validateSplit($scope.anyIDType.MOBILE_NO,'RIB-E-REQ001','RIB-E-REQ002',ValidationService.verifyPhoneFormat($scope.extAccDetails.accNo));
	   var validateC = validateSplit($scope.anyIDType.ID_CARD,'RIB-E-REQ001','RIB-E-REQ002',ValidationService.verifyAccountNo($scope.extAccDetails.accNo));
	   var validateE = validateSplit($scope.anyIDType.E_WALLET,'RIB-E-REQ001','RIB-E-REQ002',ValidationService.verifyEWalletFormat($scope.extAccDetails.accNo));
	   
		if(otherAccountService.validateBeforeConfirm($scope.extAccDetails,$scope.anyIDType,$scope.accCatgry,validateM,validateC,status_accno,validateE)){
			return;
		}
		otherAccountService.validateNotify(status,$scope.extAccDetails.mobile,'RIB-E-ACC003',ValidationService.verifyPhoneFormat( $scope.extAccDetails.mobile));
	   	otherAccountService.validateNotify(status,$scope.extAccDetails.email,'RIB-E-ACC004',ValidationService.verifyEmailFormat( $scope.extAccDetails.email));

		var request = {};
		request.accountNo = $scope.extAccDetails.accNo;
		request.accountAliasname = $scope.extAccDetails.accAliasName;
		request.bankCode = $scope.bankCode;
		request.category = $scope.accCatgry;
		request.email = $scope.extAccDetails.email;
		request.mobile = $scope.extAccDetails.mobile;
		request.anyIDType = $scope.extAccDetails.anyIDType;
		request.refTxnId= $scope.refTxnId;
		request.txnId = $scope.txnId;
		
		if(($scope.extAccDetails.acctName !== undefined)){
			request.accountName = generalService.adjustText($scope.extAccDetails.acctName);
		}
		// set bank code to empty then anyid used
		if($scope.anyIDInfo.isAnyID($scope.extAccDetails.anyIDType)){
			request.bankCode = '';
			request.accountName = '';
		}
		confirmService(request);
   };
   
   $scope.cancelAddExternalAccount = function(){
	   $scope.gotoOtherAccount();
   };
   
	$scope.virtualKeyboardAccount = {
		option: {
			disableDotButton: true,
			maxlength: 30,
			IsEditModel: true,
			setOption: function(){ 
				// do something 
			}
		}
	};
	
	$scope.virtualKeyboardMobileNo = {
		option: {
			disableDotButton: true,
			maxlength: 10
		}
	};
	
	$scope.virtualKeyboardCitizenID = {
		option: {
			disableDotButton: true,
			maxlength: 13
		}
	};

	historyPageInit();

	function historyPageInit(){
		var history = $ionicHistory.viewHistory();
		if (history.backView != null) {
			switch (history.backView.stateName) {
				case kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE:
					fromFundTransferCompletePage();
					break;
				case kkconst.ROUNTING.RTP_REQUEST_RESULT.STATE:
					fromCreateRTPResultPage();
					break;
				default:
					$scope.isShowSwiper = true;
					init();
					break;
			}
		}
	}

	function fromFundTransferCompletePage(){
		inquiryCategoryInfo();
		var data = fundTransferService.getaddAccountFundTransfer();

		$scope.extAccDetails.accNo = data.acc_no;
		$scope.extAccDetails.accAliasName = data.alias_name;
		$scope.extAccDetails.email = data.acc_email;
		$scope.extAccDetails.mobile = data.acc_mobile;
		$scope.extAccDetails.acctName = data.acc_Name;
		$scope.setBankCode(data.bank_id, data.alias_bank);
		$scope.TOimgUrl = data.TOimgUrl;
		$scope.isShowSwiper = false;
		$scope.extAccDetails.anyidTypeIconColor  = $scope.anyIDInfo.getAnyIDinfo(data.anyIDType).iconColor;
    	$scope.extAccDetails.anyidTypeImage      = $scope.anyIDInfo.getAnyIDinfo(data.anyIDType).icon;    
		$scope.isShowAnyIDTypeButton 			 = false;
		$scope.extAccDetails.anyIDType 			 = data.anyIDType;
		$scope.isShowAnyIDTypeButton = false;
		$scope.extAccDetails.anyIDType = data.anyIDType;
		otherAccountService.addOtherAccountSelected = data.anyIDType;
		$scope.refTxnId = data.refTxnId;
		$scope.txnId = data.txnId;
		var initBankdata = BankCodesImgService.getBankDataByBankCode($scope.banksList,data.bank_id);
		// setToShowAccountName(initBankdata.isORFT, data.bank_id);
		$scope.isShowAccountName = BankCodesImgService.setToShowAccountName(initBankdata.isORFT, data.bank_id, data.anyIDType);
		
		$scope.setDefaultAnyIDType = {type: data.anyIDType};
	}

	function fromCreateRTPResultPage(){
	}

	$scope.getContactPhone = function(){
		$ionicPlatform.ready(function() {
			navigator.contacts.pickContact(function(contact){
				contact = contact.phoneNumbers[0].value;
				if(contact.substring(0,3) === '+66'){
					
					contact = contact.replace(contact.substring(0,3),'0');   
				}
				$scope.extAccDetails.accNo = (contact).replace(/[^0-9.]/g, "");
				$scope.$apply();
			},function(err){
			});
		});
	};

	$scope.getContactPhoneForMobile = function(){
		$ionicPlatform.ready(function() {
			navigator.contacts.pickContact(function(contact){
				contact = contact.phoneNumbers[0].value;
				if(contact.substring(0,3) === '+66'){
					
					contact = contact.replace(contact.substring(0,3),'0');   
				}
				$scope.extAccDetails.mobile = (contact).replace(/[^0-9.]/g, "");
				$scope.$apply();
			},function(err){
			});
		});
	};

});