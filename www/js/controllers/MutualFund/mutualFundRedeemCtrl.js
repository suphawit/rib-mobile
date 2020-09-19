angular.module('ctrl.mutualFundRedeem', [])
    .controller('mutualFundRedeemCtrl', function ($scope,$filter,$translate,generalService,displayUIService,$ionicHistory,mutualFundService, fundtransferService, $ionicModal, popupService, kkconst, $state, $ionicScrollDelegate) {
  
    
	$scope.showSelectFromAccountDetails = false;
	$scope.showSelectBtn 				= true;
	$scope.showFundListBtn  			= true;
	$scope.showUnitHolderBtn 			= true;
	$scope.fundListTypeCheckStatus      = false;
	$scope.showMinimumAmount            = false;
	$scope.ownAccountGroups 			= [];
	//$scope.fundObj 						= {};
	$scope.fundListInfo                 = [];
	$scope.fundUnitHolderDafult         = '';
	$scope.dataOutStanding              = {};
	$scope.fundSearch = {fundCode: ''};
	$scope.shownGroup = {};
	
	$scope.fundObj = {
		fundListInfoShow : '',
		accountData : '',
		unitHolderData :'',
		submitPrepair :'',
	};

	$scope.checkRadioButton             = { name: ''};
   	var SELECTED_BTN_BG_COLOR			= 'selectedBtnBGColor';
	var UNSELECTED_BTN_BG_COLOR			= 'unSelectedBtnBGColor';
	$scope.placeholderAmount 			= '0.00';
	$scope.fundObj.unitRedeem 	      	= 'label.currency';
	var MUTUALFUND_LIST                 = 'SE';
	$scope.selectMutualFundPerCer       = UNSELECTED_BTN_BG_COLOR;
	$scope.selectMutualFundPerUnit      = SELECTED_BTN_BG_COLOR;
	$scope.selectMutualFundAll          = UNSELECTED_BTN_BG_COLOR;
	$scope.mutualFundType 				= "redeem";
	$scope.isFinishLoadingFundList		= false;

	$ionicModal.fromTemplateUrl('templates/MutualFund/MutualFund-getMessageAccept-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate,
	}).then(function(modal) {
		$scope.messageAcceptModal = modal;
	});
	
	$scope.isShowNext = true;
		// -----------------MutualFund Baht & Unit and All Unit ------------------------
		$scope.mutualFundPerCer = function() {
				$scope.selectMutualFundPerCer = SELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundPerUnit = UNSELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundAll     = UNSELECTED_BTN_BG_COLOR;
				$scope.placeholderAmount 	= '0.00';
				$scope.unitRedeem 	       	= 'label.currency';
				$scope.fundObj.unitRedeem   =  'label.currency';
				$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
				$scope.fundObj.amount = '';	       	  
				$scope.virtualKeyboardAmount.option.postlength = 2; 	    
		};

		$scope.mutualFundPerUnit = function() {
				$scope.selectMutualFundPerCer  = UNSELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundPerUnit = SELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundAll     = UNSELECTED_BTN_BG_COLOR;
				$scope.placeholderAmount 	   = '0.0000';
				$scope.unitRedeem 		       = 'label.mutualFund.unit';
				$scope.fundObj.unitRedeem      = 'label.mutualFund.unit'; 	
				$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
				$scope.fundObj.amount = '';	      
				$scope.virtualKeyboardAmount.option.postlength = 4;
			 
		};


		$scope.mutualFundAll = function() {
				$scope.selectMutualFundPerCer  = UNSELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundPerUnit = UNSELECTED_BTN_BG_COLOR;
				$scope.selectMutualFundAll     = SELECTED_BTN_BG_COLOR;
				$scope.placeholderAmount 	   = '0.0000';
				$scope.unitRedeem 		       = 'label.mutualFund.redeemAll'; 
				$scope.fundObj.unitRedeem      = 'label.mutualFund.unit'; 	
				$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
				$scope.virtualKeyboardAmount.option.isKeyboardActive = false;	
				if( !(angular.equals($scope.dataOutStanding,{})) ) {
					$scope.fundObj.amount = ($scope.dataOutStanding.availableBalanceUnitForSell).toString();
				}

		};


		$ionicModal.fromTemplateUrl('templates/MutualFund/Purchase/mutualFund-list-modal.html', {
			scope: $scope,
			animation: $scope.modalAnimate,
		}).then(function (modal) {
			$scope.fundListModal = modal;
		});


		$ionicModal.fromTemplateUrl('templates/MutualFund/Purchase/mutualFund-unitHolder-modal.html', {
			scope: $scope,
			animation: $scope.modalAnimate,
		}).then(function(modal) {
			$scope.unitHolderModal = modal;
		});


		$ionicModal.fromTemplateUrl('templates/MutualFund/Redeem/mutualFund-accountList-modal.html', {
			scope: $scope,
			animation: $scope.modalAnimate,
		}).then(function(modal) {
			$scope.accListModalMutualFundRedeem = modal;
		});



	$scope.setSelectedAnswer = function(value){
			$scope.checkRadioButton  = value;
	};
	

	function createModal() {
		$scope.mutualFundPerUnit();
		$scope.$on('modal.hidden', function () {
			$scope.isShowNext = true;
		});
	}

    function isTaxTypeSSF(fund) {
		return fund.taxType == 'SSF';
    }
   
   function isTaxTypeSSFX(fund) {
		return fund.taxType == 'SSFX';
    }

	$scope.openSearchFundListModal = function(){
			$scope.isFinishLoadingFundList = false;
			$scope.fundSearch.fundCode = '';
		 	$scope.curlang = $translate.use().toLowerCase();
			$scope.isShowNext = false;
			$scope.fundListModal.show();
			$scope.fundListTypeCheckStatus = false;
			mutualFundService
			.getPortMutualFundList(MUTUALFUND_LIST)
			.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var fundsData = groupFundsData(resp.result.value.fundData);
					$scope.fundListInfo  = fundsData;
					$scope.isFinishLoadingFundList = true;
				}else{
					$scope.isFinishLoadingFundList = true;
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		};

		function groupFundsData(fundData) {
			// we don't want data change because of pass by reference
			const cloneFundData = jQuery.extend(true, [], fundData);
			var ret = {};
			var keyOfSSF = '1';
			var keyOfSSFX = '2';
			ret[keyOfSSF] = [];
			ret[keyOfSSFX] = [];
			for (var i = 0; i < cloneFundData.length; ++i) {
				const fund = cloneFundData[i];
				// we don't want data change because of pass by reference
				const cloneFund = jQuery.extend(true, {}, fund);
				//group by fundPolicy
				if (ret[cloneFund.fundPolicy] === undefined) {
					//we assign fund policy index if not assign
					ret[cloneFund.fundPolicy] = [];
				}
				//just push fund to index
				cloneFund.fundPolicySort = cloneFund.fundPolicy;
				ret[cloneFund.fundPolicy].push(cloneFund);

				if(isTaxTypeSSF(cloneFund)) {
					//show on SSF
					var cloneSSF = jQuery.extend(true, {}, cloneFund);
					cloneSSF.fundPolicySort = keyOfSSF;
					ret[keyOfSSF].push(cloneSSF);
				}
	
				if(isTaxTypeSSFX(cloneFund)) {
					//show on SSFX
					var cloneSSFX = jQuery.extend(true, {}, cloneFund);
					cloneSSFX.fundPolicySort = keyOfSSFX;
					ret[keyOfSSFX].push(cloneSSFX);
				}
	
				
			}
			//force sort object
			const ordered = {};
			Object.keys(ret).sort().forEach(function(key) {
				ordered[key] = ret[key];
			});
			
			var values = Object.keys(ordered).map(function(e) {
				return ordered[e]
			})
		
			return values;
		}
		
		
		function isPromotion(fund) {
			 return fund.isPromotion === 'Y';
		}
	
		$scope.toggleGroup = function (group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
            $ionicScrollDelegate.scrollTop();
		};
	
		function hasMatchingFunds(group) {
			return $scope.fundSearch.fundCode &&
				$filter('filter')(group, {fundCode: $scope.fundSearch.fundCode}).length;
		}
	
		$scope.isGroupShown = function (group) {
			return $scope.shownGroup === group ||
				hasMatchingFunds(group);
		};
		

		$scope.openUnitHolderModal = function(){
			$scope.isShowNext = false;
			$scope.unitHolderModal.show();
	
		};


		$scope.toggleCategory = function(fundListID){
			for (var index = 0; index < $scope.fundListInfo.length; index++) {
				var value = $scope.fundListInfo[index];
				if(value.typeFund === fundListID){
					value.expanded = !value.expanded;
					break;
				}
			}
		};

		$scope.toggleCategoryType = function(fundListType){
			for (var i = 0; i < $scope.fundListInfo.length; i++) {
				var value = $scope.fundListInfo[i].detail;
				for (var index = 0; index < value.length; index++) {
					if(value[index].mutualFundType === fundListType){
						value[index].expanded = !value[index].expanded;
						break;
					}
				}
			}
		};

		$scope.toggleFundlistGroup = function(dataListItem){
    		dataListItem.expands = !dataListItem.expands;
		};



	 function sortingAccount(request){
		request.sort(function(a, b){        					 
			 var nameA = a.myAccountAliasName && a.myAccountAliasName.toLowerCase() || '';
			 var nameB = b.myAccountAliasName && b.myAccountAliasName.toLowerCase() || '';
			 //sort string ascending
			 if (nameA < nameB){ 
				 	return -1; 
				 } 
			 if (nameA > nameB){  
				 	return 1; 
				 }
			 
			 return 0; //default return value (no sorting)
		});
		return request;
	}


     $scope.selectAccount = function(){
        $scope.isShowNext = false;
		$scope.accListModalMutualFundRedeem.show();
		
	};



	$scope.userSelectedBankAccount = function(bankAccount){
		$scope.fundObj.unitHolderData.bankAccount = bankAccount;
       	$scope.selectClose();
	};


	

	$scope.selectClose = function(){
			$scope.fundListModal.hide();
			$scope.messageAcceptModal.hide();
			$scope.isShowNext = true;
			$scope.accListModalMutualFundRedeem.hide();
			$scope.unitHolderModal.hide();
	};

	
	

	$scope.onSelectfundListDatail = function(fundListItems){
			$scope.mutualFundPerUnit();
			$scope.fundListInfoShow = fundListItems;
			$scope.fundObj.fundListInfoShow = fundListItems;
		
			$scope.fundObj.fundListInfoShow.navDate = displayUIService.convertDateNoTimeForUI(fundListItems.navDate);			
			$scope.showFundListBtn = false;
			$scope.fundObj.fundListDetail = fundListItems.fundCode;
			$scope.checkRadioButton = null;
			$scope.fundObj.unitHolderData = {}; //clear unitholder data
			$scope.getUnitHolder(MUTUALFUND_LIST,$scope.fundObj.fundListInfoShow.fundId);
		
	};


	function checkFundListDatail(){

		$scope.checkRadioButton.name  = '';
		if( $scope.fundObj.fundListInfoShow.taxType  === 'LTF' ){
				$scope.fundListTypeCheckStatus = true;
				
		}else if( $scope.fundObj.fundListInfoShow.taxType  === 'RMF' ){
			    $scope.fundListTypeCheckStatus = true;	
			
		}else{
				$scope.fundListTypeCheckStatus = false;	
		}
	}
	

	

	function confirmValidate(){

	if(!$scope.fundListInfoShow.fundCode){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectMutualFund');
			return true;
		}


		if(!$scope.fundObj.unitHolderData.unitHolderId){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectUnitHolder');
			return true;
		}

		if( (!$scope.fundObj.unitHolderData.bankAccount) || ($scope.fundObj.unitHolderData.bankAccount === '') || ( $scope.fundObj.unitHolderData.bankAccount === '-')){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectAccRedeem');
			return true;
		} 

		if($scope.fundObj.amount === '' || parseFloat($scope.fundObj.amount) === 0 || $scope.fundObj.amount === undefined ){
			if($scope.selectMutualFundPerUnit === SELECTED_BTN_BG_COLOR ){
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'validate.input.enterUnit');
				return true;
			}else{
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.inputAmount');
				return true;
			}	
		}

		// var inputAmount = parseFloat($scope.fundObj.amount.replace(/,/g,'')); 

		// if(($scope.selectMutualFundPerCer === SELECTED_BTN_BG_COLOR) && 
		// 	(inputAmount.toFixed(2) < $scope.fundObj.fundListInfoShow.lowSellValue)){
		// 		popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.fundConnext.amountLessthanMinimun');
		// 		return true;
		// 	}
		// if( inputAmount.toFixed(4) < $scope.fundObj.fundListInfoShow.lowSellUnit){
		// 	popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.fundConnext.unitLessthanMinimun');
		// 	return true;
		// }
		
		if(($scope.checkRadioButton  !== null)){
				if($scope.checkRadioButton  === 'accept'){
					return false;
				}else if($scope.checkRadioButton  === 'declare'){
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.acceptFundCondition');
					return true;
				}else{

				}
			}
			return false;
		}


	$scope.openUnitHolderModal = function(){
		$scope.isShowNext = false;
		$scope.unitHolderModal.show();

	};


			
	$scope.userSelectedUnitHolder = function(unitHolder){
		mutualFundService.getOutStandingFundID(	$scope.fundListInfoShow.fundId,unitHolder.unitHolderId)
		.then(function(resp){
			var respStatus = resp.result;
			if (respStatus.responseStatus.responseCode === kkconst.success) {
				 var outStandingData = respStatus.value.dataList;
				
				$scope.$watch(function () { return outStandingData}, function () {
					if(	outStandingData.length !== 0){
						$scope.dataOutStanding  = outStandingData[0];
						$scope.dataOutStanding.navDate = displayUIService.convertDateNoTimeForUI($scope.dataOutStanding.navDate);			
					}
				});
				
			}else{
				popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
			}
		});
			$scope.fundUnitHolderDafult = unitHolder;
			$scope.fundObj.unitHolderData = unitHolder;
		
			$scope.showUnitHolderBtn	= false;
			$scope.showMinimumAmount  = true;
			$scope.selectClose();	
	};



	$scope.getUnitHolder = function(MUTUALFUND_LIST,fundId){
		
	        mutualFundService
			.getUnitHolder(MUTUALFUND_LIST,	fundId)
			.then(function(resp){
				var respStatus = resp.result;
				if (respStatus.responseStatus.responseCode === kkconst.success) {
					$scope.fundObj.unitHolderInfo = respStatus.value;
					$scope.$watch(function () { return 	$scope.fundObj.unitHolderInfo; }, function () {
						if( $scope.fundObj.unitHolderInfo.unitHolderList.length === 1 ){
								$scope.userSelectedUnitHolder($scope.fundObj.unitHolderInfo.unitHolderList[0]);
							
						}else{
								$scope.showUnitHolderBtn = true;
								$scope.selectClose();
						}
					});
					$scope.fundListModal.hide();
				}else{
					$scope.fundListModal.hide();
					popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
				}
				
			});
		
	};



	$scope.getPrepare = function(){
		$scope.messageAcceptModal.hide();
		$scope.isShowNext = true;
		prepare();
	};

	function prepare(){
		if(($scope.selectMutualFundPerUnit ===  "selectedBtnBGColor")  || ($scope.selectMutualFundAll ===  "selectedBtnBGColor")  ){
			mutualFundService
			.submitPrepareMutualFundRedeem($scope.fundObj,MUTUALFUND_LIST)
			.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.fundObj.submitPrepair  = resp.result.value; 
					mutualFundService.setConfirmMutualFund($scope.fundObj);
					$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.STATE);
				
				}else{
					
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		}else{
			mutualFundService
			.submitPrepareMutualFundRedeemAmount($scope.fundObj,MUTUALFUND_LIST)
			.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.fundObj.submitPrepair  = resp.result.value; 
					mutualFundService.setConfirmMutualFund($scope.fundObj);
					$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.STATE);
				
				}else{
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		}
	}



	$scope.goNextPage = function(){
		
		if(confirmValidate()){
			return;
		}else{
			mutualFundService.submitValidatePrepareFund($scope.fundObj.fundListInfoShow.fundId,MUTUALFUND_LIST)
				.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.validateMessageValue  =  resp.result.value.acceptMessageData; 
					if($scope.validateMessageValue.length === 0){
						prepare();
					}else{
						$scope.isShowNext = false;
						$scope.messageAcceptModal.show();
					}
				}else{
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});				
		}

	};


	$scope.virtualKeyboardAmount = {
		option: {
			disableDotButton: false,
			isKeyboardActive: true,
			maxlength: 12,
			IsEditModel: true,
			postlength: 4
		},
		onkeyup: function(value){
			$scope.fundObj.amount = value;
		},
		onblur: function(){
	
			$scope.onBlurFormatCurrency();
		},
		onfocus: function(){
	
			$scope.onFocusClearAmount();
		}
	};

	$scope.onFocusClearAmount= function() {
		$scope.fundObj.amount = generalService.onFocusClearAmount($scope.fundObj.amount);
		$scope.placeholderAmount = '';
    };
	
	function changeFormatNumber(amount){
	
		var number = parseFloat(amount.replace(/,/g,'')); 
		number =  number.toFixed(4);
		
		if(isNaN(number) == true){
			return "0.000";
		}else{
			var parts = number.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		}
	}


	
    $scope.onBlurFormatCurrency = function(){
		if($scope.selectMutualFundPerCer ===  "selectedBtnBGColor"){
			$scope.fundObj.amount =	 generalService.onBlurFormatCurrency($scope.fundObj.amount);
		
		}else if($scope.selectMutualFundPerUnit ===  "selectedBtnBGColor" ){
			$scope.fundObj.amount = changeFormatNumber($scope.fundObj.amount);
		
		}else{
	
			$scope.fundObj.amount =	 changeFormatNumber($scope.fundObj.amount);
		}
	
    };


	function historyPageInit() {
		
		var history = $ionicHistory.viewHistory();
			if (history.backView != null) {
					switch (history.backView.stateName) {
						case kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE:
							$state.go(kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE);
							break;
					
						case kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.STATE:
							$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.STATE);
							break;
					
					
						default:
							break;
					}
					$scope.isShowBack = true;
			}
		}


		$scope.goBackPage  = function(){
			historyPageInit();
		};
	

	$scope.virtualKeyboardAccount = {
		option: {
			disableDotButton: true,
			isKeyboardActive: true,
			//maxlength: 30,
			IsEditModel: true,
			setOption :function(){
				// todo
			}
		}
	};
	
	function historyBackViewInit(){
		var history = $ionicHistory.viewHistory();
	
		if(history.forwardView != null){
			switch (history.forwardView.stateName) {
					case kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.STATE:
						break;
			}
		}
	}

	createModal();
	historyBackViewInit();
	
   
    });
