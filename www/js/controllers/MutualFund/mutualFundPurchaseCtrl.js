angular.module('ctrl.mutualFundPurchase', [])
    .controller('mutualFundPurchaseCtrl', function($scope, $translate,displayUIService,$filter,generalService,$ionicHistory,mutualFundService, fundtransferService,myAccountService, $ionicModal, popupService, kkconst, $state, $ionicScrollDelegate,$http,$sce,invokeService,mainSession,$ionicLoading) {

	$scope.showSelectFromAccountDetails = false;
	$scope.showSelectBtn 				= true;
	$scope.disableUnitHolder            = true;
	$scope.fundListTypeCheckStatus      = false;
	$scope.showFundListBtn  			= true;
	$scope.showUnitHolderBtn 			= true;
	$scope.showMinimumAmount            = false;
    $scope.ownAccountGroups 			= []; 

	$scope.fundListInfo                 = [];
	$scope.validateMessageValue         = {};
	$scope.accListlabelTitle = 'header.mutualFund.selectAcc';
	$scope.fundSearch                   = { fundCode: ''};
	$scope.checkRadioButton             = { name: ''};
	$scope.shownGroup                   = {};
	$scope.toggleFundlist               = false;
	$scope.fundObj = {
		fundListInfoShow : '',
		unitHolderData  :'',
		submitPrepair   :'',
		accountData     : '',
	};
	
	var MUTUALFUND_TYPE                 = 'BU';
	$scope.placeholderAmount 			= '0.00';
	$scope.transTodayScheduleDate 		= 'selectedBtnBGColor';
	$scope.transFutureScheduleDate 		= 'unSelectedBtnBGColor';
	$scope.isShowNext                   = true;
	$scope.curlang = $translate.use().toLowerCase();

	$ionicModal.fromTemplateUrl('templates/ManageAccounts/MyAccounts/account-list-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate,
	}).then(function(modal) {
		$scope.accListModalMutualFundPerchase = modal;
	});

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

	$ionicModal.fromTemplateUrl('templates/MutualFund/MutualFund-getMessageAccept-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate,
	}).then(function(modal) {
		$scope.messageAcceptModal = modal;
	});


	function createModal() {
		$scope.$on('modal.hidden', function () {
			$scope.isShowNext = true;
		});
	}


	function isPromotion(fund) {
        return fund.isPromotion === 'Y';
	}
	
    function isTaxTypeLTF(fund) {
         return fund.taxType == 'LTF';
    }

    function isTaxTypeRMF(fund) {
         return fund.taxType == 'RMF';
    }
	
    function isTaxTypeSSF(fund) {
         return fund.taxType == 'SSF';
    }
	
    function isTaxTypeSSFX(fund) {
         return fund.taxType == 'SSFX';
    }

	function groupFundsData(fundData) {
        var cloneFundData = jQuery.extend(true, [], fundData);
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
            var fund = cloneFundData[i];
            // we don't want data change because of pass by reference
            var cloneFund = jQuery.extend(true, {}, fund);
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
            // alert(JSON.stringify(Object.values(ret)));
       
        }
        //force sort object
        var ordered = {};
        Object.keys(ret).sort().forEach(function(key) {
            ordered[key] = ret[key];
        });

        var values = Object.keys(ordered).map(function(e) {
        return ordered[e]
        })
      
        return values;
      
    }  
    
   
	function fundListInit() {
		mutualFundService.getPortMutualFundList(MUTUALFUND_TYPE).then(function(resp){
		var respStatus = resp.result.responseStatus;

			if (respStatus.responseCode === kkconst.success) {
					var fundsData = groupFundsData(resp.result.value.fundData);
					$scope.fundListInfo  = fundsData;
					var isPromotionList = $scope.fundListInfo[0];
					if(isPromotionList.length > 0 ){
						if(isPromotionList[0].isPromotion === 'Y'){
							$scope.toggleGroup($scope.fundListInfo[0]);
						};
					};
					$scope.fundListModal.show();
			}else{
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
			}
		});
	}


	



	
	$scope.openSearchFundListModal = function(){
		
		if($scope.fundListInfo.length > 0){
			$scope.fundListModal.show();
		}else{
			fundListInit();
		}


		$scope.fundSearch.fundCode = '';
		$scope.isShowNext = false;
		$scope.fundListTypeCheckStatus = false;
	
	
	};


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
			  return 0; 
		});
		return request;
	}

	
     $scope.selectAccount = function(){
        $scope.isShowNext = false;
		$scope.accListModalMutualFundPerchase.show();
		if($scope.ownAccountGroups.length === 0){
			myAccountService.inquiryMyAccountCASASummary(function(responseCode,ownAccountGroups) {
			if(responseCode === kkconst.success){
					$scope.ownAccountGroups = sortingAccount(ownAccountGroups);
			}else{
					popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode);
			}
		});
		}
	};
	

	function setSelectFromAccount(action){
			if(action === fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA){
				$scope.showSelectFromAccountDetails = true;
				$scope.showSelectBtn                = false;
			}else{
				$scope.showSelectFromAccountDetails = false;
				$scope.showSelectBtn                = true;
			}
	}


	$scope.selectClose = function(){
			$scope.fundListModal.hide();
			$scope.isShowNext = true;
			$scope.unitHolderModal.hide();
			$scope.messageAcceptModal.hide();
			$scope.accListModalMutualFundPerchase.hide();
	};


	$scope.userSelectedFromAccount = function(account){
			setSelectFromAccount(fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA);
			//Bind Variables for FROM account data
			$scope.fundObj.accountData = account;
			$scope.fundObj.accountData.selectedFromName = account.myAccountAliasName || '';
			$scope.fundObj.accountData.selectedFromAccNo = account.myAccountNumber || '';
			$scope.fundObj.accountData.selectedFromTotalActBalance = account.myAvailableBalance || ''; 
			$scope.fundObj.accountData.selectedFromAccountID = account.myAccountID;
			$scope.selectClose();
	};


	function checkFundListDatail(){
		$scope.checkRadioButton.name  = '';
		if(['LTF','RMF','SSF','SSFX'].includes($scope.fundObj.fundListInfoShow.taxType)){
			$scope.fundListTypeCheckStatus = true;
		}else {
			$scope.fundListTypeCheckStatus = false;
		}
	}
	

	$scope.onSelectfundListDatail = function(fundListItems){
			$scope.fundListInfoShow = fundListItems;
			$scope.fundObj.fundListInfoShow = fundListItems;
			if(fundListItems.navDate !== ''){
				$scope.fundObj.fundListInfoShow.navDateFormat = displayUIService.convertDateNoTimeForUI($scope.fundObj.fundListInfoShow.navDate);	
			}		
			$scope.fundObj.LTF_Condition  = null;
			$scope.showFundListBtn = false;
			$scope.fundObj.fundListDetail = fundListItems.fundCode;
			$scope.checkRadioButton.name = '';
			$scope.checkSelectRadioButtonAccept = null;
			$scope.checkSelectRadioButtonDeclare = null;
			$scope.fundObj.unitHolderData = {}; //clear unitholder data
			$scope.getUnitHolder(fundListItems.fundId);
			$scope.fundObj.amount = "0.00";
			checkFundListDatail();
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

		if($scope.fundObj.amount === '' || parseFloat($scope.fundObj.amount) === 0 || $scope.fundObj.amount === undefined ){
    		popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.inputAmount');
			return true;
		}

		// if( parseFloat(($scope.fundObj.amount).replace(/,/g,'')) <  $scope.fundObj.fundListInfoShow.lowBuyValue ){
		// 	popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.fundConnext.amountLessthanMinimun');
		// 	return true;
		// }

		if(!$scope.fundObj.accountData.selectedFromAccNo ){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.selectAccPurchase');
			return true;
		} 
		if(['LTF','RMF','SSF','SSFX'].includes($scope.fundObj.fundListInfoShow.taxType)){
			if(!$scope.fundObj.LTF_Condition ){
		
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.acceptFundCondition');
				return true;
			}
			
			return false;
		}
	}

	$scope.setSelectedAnswer = function(value){
		if( value  ===  'accept'){
			$scope.fundObj.LTF_Condition = '1';
		}else{
			$scope.fundObj.LTF_Condition = '0';
		}
	};


	$scope.userSelectedUnitHolder = function(unitHolder){
		$scope.fundObj.unitHolderData = unitHolder;
		$scope.showUnitHolderBtn 	= false;
		$scope.showMinimumAmount  = true;
		$scope.selectClose();
	};



	$scope.getUnitHolder = function(fundID){
			mutualFundService.getUnitHolder(MUTUALFUND_TYPE,fundID).then(function(resp){
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
					$scope.fundListModal.close
				});
			}else{
				//Change ErrorMessage//

				$scope.fundListModal.close

				popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
			}
			});
	};


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

	$scope.onBlurFormatCurrency = function(){
		$scope.fundObj.amount =	 generalService.onBlurFormatCurrency($scope.fundObj.amount);
	};


	$scope.virtualKeyboardAccount = {
		option: {
			disableDotButton: true,
			isKeyboardActive: true,
			//maxlength: 30,
			IsEditModel: true,
			setOption :function(){
				// todo
			},
		}
	};

	function historyBackViewInit(){
	var history = $ionicHistory.viewHistory();
		if(history.backView !== null){
			if (history.backView.stateName === kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.STATE || history.backView.stateName === kkconst.ROUNTING.MUTUAL_FUND_SUMMARY_DETAIL.STATE) {
				$scope.onSelectfundListDatail(mutualFundService.getConfirmMutualFund());
			}
		}
	}


	function historybackViewPage() {

		var history = $ionicHistory.viewHistory();
			if (history.backView !== null) {
					switch (history.backView.stateName) {
						case kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE:
							$state.go(kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE);
							break;
						case kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.STATE:
							$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.STATE);
							break;
						case kkconst.ROUNTING.MUTUAL_FUND_SUMMARY_DETAIL.STATE:
							$state.go(kkconst.ROUNTING.MUTUAL_FUND_SUMMARY_DETAIL.STATE);
							break;
						default:
							break;
					}
					$scope.isShowBack = true;
			}
		}



		$scope.goBackPage  = function(){
			historybackViewPage();
		};


		$scope.goNextPage = function(){
			if(confirmValidate()){
				return;
			}else{ 
				mutualFundService.submitValidatePrepareFund($scope.fundObj.fundListInfoShow.fundId,MUTUALFUND_TYPE)
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
						//Change ErrorMessage//
						popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
					}
				});
			}
		};


		$scope.getPrepare = function(){
			$scope.messageAcceptModal.hide();
			$scope.isShowNext = true;
			prepare();
		};

		function prepare(){
			mutualFundService.submitPrepareMutualFund($scope.fundObj,MUTUALFUND_TYPE)
			.then(function(resp){
			var respStatus = resp.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.fundObj.resultSubmitPrepair  = resp.result.value;
					mutualFundService.setConfirmMutualFund($scope.fundObj);
					$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_CONFIRM.STATE);
				}else{
					//Change ErrorMessage//
					popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
				}
			});
		}

		createModal();
		historyBackViewInit();

    });
