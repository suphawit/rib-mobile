angular.module('ctrl.mutualFundSwitch', [])
    .controller('mutualFundSwitchCtrl', function ($scope,$filter,$translate,generalService,displayUIService,$ionicListDelegate,$ionicHistory,mutualFundService, $ionicModal, popupService, kkconst, $state, $ionicScrollDelegate,$http,$sce,invokeService,mainSession,$ionicLoading) {
    
	$scope.showSelectFromAccountDetails = false;

	$scope.showFundListToBtn 			= true;
	$scope.disableUnitHolder            = true;
	$scope.fundListTypeCheckStatus      = false;
	$scope.showFundListBtn  			= true;
	$scope.showUnitHolderBtn 			= true;
	$scope.showMinimumAmount            = false;
	$scope.showSelectFundToList         = false;
	$scope.dataOutStanding = {};
	$scope.fundSearch = {fundCode: ''};
	$scope.shownGroup = {};

	//$scope.fundObj 						= {};
	$scope.fundListInfo                 = [];
	$scope.fundListInfoTo               = [];

	$scope.fundObj = {
		fundListInfoShow : '',
		accountData : '',
		unitHolderData :'',
		submitPrepair :'',
		fundListInfoToShow :'',
	};
	$scope.checkRadioButton                 = { name: ''};
	var SELECTED_BTN_BG_COLOR			= 'selectedBtnBGColor';
	var UNSELECTED_BTN_BG_COLOR			= 'unSelectedBtnBGColor';
	var MUTUALFUND_SW                   =  'SW';
	var MUTUALFUND_SI                   =  'SI';
	var MUTUALFUND_SO                   =  'SO';
	var MUTUALFUND_SE                   =  'SE';
	$scope.placeholderAmount 		 	= '0.00';
	$scope.fundObj.unitRedeem         	= 'label.currency';
	$scope.selectMutualFundPerCer       = UNSELECTED_BTN_BG_COLOR;
	$scope.selectMutualFundPerUnit      = SELECTED_BTN_BG_COLOR;
	$scope.selectMutualFundAll          = UNSELECTED_BTN_BG_COLOR;
	$scope.isShowNext = true;
	$scope.minimumUnitForSwitch 		= 0;
	$scope.mutualFundType				= 'switch' 
	$scope.isFinishLoadingFundList		= false;

		// -----------------MutualFund Baht & Unit and All Unit ------------------------
		$scope.mutualFundPerCer = function() {
			
			$scope.selectMutualFundPerCer  = SELECTED_BTN_BG_COLOR;
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
			$scope.unitRedeem 		       = 'label.mutualFund.switchAll';
			$scope.fundObj.unitRedeem      = 'label.mutualFund.unit'; 	

			$scope.virtualKeyboardAmount.option.isKeyboardActive = false;	
			if( !(angular.equals($scope.dataOutStanding,{})) ) {
				$scope.fundObj.amount = ($scope.dataOutStanding.availableBalanceUnitForSell).toString();
			}

	};


			$ionicModal.fromTemplateUrl('templates/MutualFund/Purchase/mutualFund-list-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate
			}).then(function (modal) {
				$scope.fundListModal = modal;
			});
				$scope.fundObj.fundListDetail = '';
	

	
			$ionicModal.fromTemplateUrl('templates/MutualFund/Switch/mutualFund-list-to-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate,
			}).then(function (modal) {
				$scope.fundListToModal = modal;
			});
	

			$ionicModal.fromTemplateUrl('templates/MutualFund/Purchase/mutualFund-unitHolder-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate,
			}).then(function(modal) {
				$scope.unitHolderModal = modal;
			});
			
	

			$ionicModal.fromTemplateUrl('templates/MutualFund/MutualFund-getMessageAccept-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate,
			}).then(function(modal) {
				$scope.messageAcceptModal = modal;
			});


	$scope.setSelectedAnswer = function(value){
		if( value  ===  'accept'){
			$scope.fundObj.LTF_Condition = '1';
		}else if( value === 'declare'){
			$scope.fundObj.LTF_Condition = '0';
		}
	};
	

	function createModal() {
			$scope.mutualFundPerUnit();
			$scope.$on('modal.hidden', function () {
				$scope.isShowNext = true;
			});
	}



	$scope.toggleFundlistGroup = function(dataListItem){
      		dataListItem.expands = !dataListItem.expands;
	};

	

	$scope.openSearchFundListModal = function(){
			$scope.isFinishLoadingFundList = false;
			$scope.fundSearch.fundCode = '';
			$scope.curlang = $translate.use().toLowerCase();
			$scope.isShowNext = false;
			$scope.fundListModal.show();
			$scope.fundListTypeCheckStatus = false;
			mutualFundService
			.getPortMutualFundList(MUTUALFUND_SO)
			.then(function(resp){	        
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var fundsData = groupFundsDataSwitchOUT(resp.result.value.fundData);
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
			var keyOfHighLight = '0';
			var keyOfSSF = '1';
			var keyOfSSFX = '2';
			var keyOfLTF = '3';
			var keyOfRMF = '4';
			ret[keyOfHighLight] = [];
			ret[keyOfSSF] = [];
			ret[keyOfSSFX] = [];
			ret[keyOfLTF] = [];
			ret[keyOfRMF] = [];

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
	

				if(isPromotion(cloneFund)) {
					//show on top
					var clonePromotion = jQuery.extend(true, {}, cloneFund);
					clonePromotion.fundPolicySort = keyOfHighLight;
					ret[keyOfHighLight].push(clonePromotion);
            	}
	
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

				if(isTaxTypeLTF(cloneFund)) {
					//always show below promotion group
					var cloneLTF = jQuery.extend(true, {}, cloneFund);
					cloneLTF.fundPolicySort = keyOfLTF;
					ret[keyOfLTF].push(cloneLTF);
				}

				if(isTaxTypeRMF(cloneFund)) {
					//always show below promotion and RMF group
					var cloneRMF = jQuery.extend(true, {}, cloneFund);
					cloneRMF.fundPolicySort = keyOfRMF;
					ret[keyOfRMF].push(cloneRMF);
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



		function groupFundsDataSwitchOUT(fundData) {
			// we don't want data change because of pass by reference
			const cloneFundData = jQuery.extend(true, [], fundData);
			
			var ret = {};
			var keyOfSSF = '1';
			var keyOfSSFX = '2';
			var keyOfLTF = '3';
			var keyOfRMF = '4';
			ret[keyOfSSF] = [];
			ret[keyOfSSFX] = [];
			ret[keyOfLTF] = [];
			ret[keyOfRMF] = [];

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

				if(isTaxTypeLTF(cloneFund)) {
					//always show below promotion group
					var cloneLTF = jQuery.extend(true, {}, cloneFund);
					cloneLTF.fundPolicySort = keyOfLTF;
					ret[keyOfLTF].push(cloneLTF);
				}

				if(isTaxTypeRMF(cloneFund)) {
					//always show below promotion and RMF group
					var cloneRMF = jQuery.extend(true, {}, cloneFund);
					cloneRMF.fundPolicySort = keyOfRMF;
					ret[keyOfRMF].push(cloneRMF);
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
         return fund.isPromotion == 'Y';
		}
	
		function isTaxTypeSSF(fund) {
			return fund.taxType == 'SSF';
	    }
	   
	    function isTaxTypeSSFX(fund) {
			return fund.taxType == 'SSFX';
	    }

		function isTaxTypeLTF(fund) {
			return fund.taxType == 'LTF';
		}

		function isTaxTypeRMF(fund) {
			return fund.taxType == 'RMF';
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
		

		$scope.openSearchFundListToModal = function(){
			$scope.fundSearch = {fundCode: ''};
			$scope.curlang = $translate.use().toLowerCase();
			$scope.isShowNext = false;
			$scope.fundListToModal.show();
		};


		$scope.openUnitHolderModal = function(){
			$scope.isShowNext = false;
			$scope.unitHolderModal.show();
		};


		$scope.getUnitHolder = function( MUTUALFUND_SE, fundId){
			mutualFundService.getUnitHolder(MUTUALFUND_SE,fundId)
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
							$scope.getFundListToModal(MUTUALFUND_SI,$scope.fundObj.fundListInfoShow.fundId);
							$scope.fundListModal.hide();
					});
				
				}else{
					$scope.fundListModal.hide();
					popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
				}
			});
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


	$scope.selectClose = function(){
		$scope.fundListModal.hide();
		$scope.fundListToModal.hide();
		$scope.isShowNext = true;
		$scope.unitHolderModal.hide();
		$scope.messageAcceptModal.hide();
	};


	$scope.onSelectfundListDatail = function(fundListItems){
		$scope.$on('modal.show',function(){
			$scope.fundListModal.close();
		});
			$scope.mutualFundPerUnit();
			$scope.fundListInfoShow = fundListItems;
			$scope.$watch(function () { $scope.fundListInfoShow; }, function () {
						$scope.fundObj.fundListInfoShow = fundListItems;	
						$scope.fundObj.fundListInfoShow.navDateFormat = displayUIService.convertDateNoTimeForUI($scope.fundObj.fundListInfoShow.navDate) || null;		
						$scope.fundObj.LTF_Condition  = null;
						$scope.showFundListBtn = false;
						$scope.fundObj.fundListInfoShow.fundname = fundListItems.fundNameEn;
						$scope.fundObj.fundListDetail =  fundListItems.fundCode;
						$scope.fundObj.unitHolderData = {}; //clear unitholder data
						$scope.getUnitHolder(MUTUALFUND_SE,$scope.fundObj.fundListInfoShow.fundId);	
			});
	};


	$scope.onSelectfundListToDatail = function(fundListToItems){
		$scope.selectClose();
		$scope.fundListToModal.hide();
		$scope.showFundListToBtn = false;
		$scope.showSelectFundToList = true;
		$scope.fundListInfoToShow = fundListToItems;
		
		$scope.fundListInfoToShow.navDate = displayUIService.convertDateNoTimeForUI($scope.fundListInfoToShow.navDate);			
	
		$scope.fundObj.fundListInfoToShow = fundListToItems;
		$scope.fundObj.fundListTo   = 	fundListToItems.fundId;
		$scope.showFundListBtn = false;
		$scope.fundObj.fundListInfoToShow.fundnameTo = fundListToItems.fundCode;
		$scope.checkRadioButton.name = null;
		$scope.firstMinimumUnitForSwitch  =  Math.ceil(( $scope.fundObj.fundListInfoToShow.firstLowBuyValue/$scope.fundObj.fundListInfoShow.navValue) * 10000 ) / 10000;
		$scope.nextMinimumUnitForSwitch  =  Math.ceil(( $scope.fundObj.fundListInfoToShow.nextLowBuyValue/$scope.fundObj.fundListInfoShow.navValue) * 10000 ) / 10000;
		checkFundListDatail();
		
	};

	

	$scope.getFundListToModal = function(MUTUALFUND_SI,fundId){
	
		$scope.showFundListToBtn = true;
		$scope.showSelectFundToList = false;
		mutualFundService.getPortMutualFundListSwitchIn(MUTUALFUND_SI,fundId)
		.then(function(resp){
		  
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var fundsData = groupFundsData(resp.result.value.fundData);
					$scope.fundListInfoTo  = fundsData;
				}else{
					
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		
	};


	function checkFundListDatail(){

		$scope.checkRadioButton.name  = '';
		if(['LTF','RMF','SSF','SSFX'].includes($scope.fundObj.fundListInfoShow.taxType)){
			$scope.fundListTypeCheckStatus = true;
		}else {
			$scope.fundListTypeCheckStatus = false;
		}
		
	}


	
	$scope.userSelectedUnitHolder = function(unitHolder){

		mutualFundService.getOutStandingFundID($scope.fundListInfoShow.fundId,unitHolder.unitHolderId)
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
			$scope.showUnitHolderBtn 	= false;
			$scope.showMinimumAmount  = true;
			$scope.selectClose();	
	};




	function confirmValidate(){
	
		if(!$scope.fundObj.fundListInfoShow.fundCode){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectMutualFund');
			return true;
		}

		if(!$scope.fundObj.unitHolderData.unitHolderId){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectUnitHolder');
			return true;
		}


		if(!$scope.fundObj.fundListInfoToShow.fundnameTo ){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'กรุณาเลือกกองทุนปลายทาง');
			return true;
		} 

		if($scope.fundObj.amount === '' || parseFloat($scope.fundObj.amount) === 0 || $scope.fundObj.amount === undefined ){
    		if($scope.selectMutualFundPerUnit === SELECTED_BTN_BG_COLOR){
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'validate.input.enterUnit');
				return true;
			}else{
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.inputAmount');
				return true;
			}
		}
		
		if(['LTF','RMF','SSF','SSFX'].includes($scope.fundObj.fundListInfoShow.taxType)){
			if(!$scope.fundObj.LTF_Condition ){
		
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.acceptFundCondition');
				return true;
			}
			
			return false;
		}
	}


	$scope.goNextPage = function(){
			
		if(confirmValidate()){
			return;
		}else{ 
			mutualFundService
			.submitValidatePrepareFund($scope.fundObj.fundListInfoShow.fundId,MUTUALFUND_SI,$scope.fundObj.fundListTo)
			.then(function(resp){
			var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
						$scope.validateMessageValue   = resp.result.value.acceptMessageData; 
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
		};//end function 




	$scope.getPrepare = function(){
		$scope.messageAcceptModal.hide();
		$scope.isShowNext = true;
		prepare();
	};

	function prepare(){
		if(($scope.selectMutualFundPerUnit === 'selectedBtnBGColor' ) || ($scope.selectMutualFundAll === 'selectedBtnBGColor') ){
			mutualFundService.submitPrepareMutualFundSwitch($scope.fundObj,MUTUALFUND_SW)
			.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.fundObj.submitPrepair  = resp.result.value; 
					mutualFundService.setConfirmMutualFund($scope.fundObj);
					$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.STATE);
				}else{
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		}else{
			mutualFundService
			.submitPrepareMutualFundSwitchAmount($scope.fundObj,MUTUALFUND_SW)
			.then(function(resp){
				var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.fundObj.submitPrepair  = resp.result.value; 
					mutualFundService.setConfirmMutualFund($scope.fundObj);
					$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.STATE);
				}else{
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		}
	}
		
	$scope.virtualKeyboardAmount = {
		option: {
			disableDotButton: false,
			isKeyboardActive: true,
			maxlength: 12,
			IsEditModel: true
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
			return '0.000';
		}else{
			var parts = number.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.');
		}
	}

	
	$scope.onBlurFormatCurrency = function(){
	
		if($scope.selectMutualFundPerCer  ===  'selectedBtnBGColor'){
			$scope.fundObj.amount =	 generalService.onBlurFormatCurrency($scope.fundObj.amount);
		}else if($scope.selectMutualFundPerUnit ===  'selectedBtnBGColor' ){
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
				case kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.STATE:
						//fromMutualFundPurchaseConfirm();
					break;
		}
	}
}

	createModal();
	historyBackViewInit();
   
    });
