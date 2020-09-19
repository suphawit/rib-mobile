angular.module('ctrl.changeTermCtrl', []).controller('changeTermCtrl',function($scope, invokeService,popupService, $state, $translate,
							myAccountTermDepositService,$ionicModal, myAccountService, displayUIService, mainSession, kkconst) {


	$scope.showHideChangeTerm = true;
	$scope.showHideSelectTerm = false;
	var lang  =  mainSession.lang;

	$scope.isSelectedLang = lang;

	$scope.changeTermDepositData = myAccountService.accountDetail;
	$scope.accountTypeTerm = window.translationsLabel[mainSession.lang][myAccountService.accountDetail.accountType];
	
	$scope.newTermMonth = myAccountTermDepositService.getTermMonth();
	$scope.newTermPeriod = myAccountTermDepositService.getTermPeriod();

	var checkGetChangeTermSelectData = function(){
		if($scope.changeSelectTermData && $scope.changeSelectTermData.length > 0 ){
			getChangeSelectTermData();
		} else {
			$scope.errMsg = window.translationsError[lang]["RIB-E-ACCT01"];
		}
	};
	$scope.navigateToSelectTerm = function() {
		$scope.showHideChangeTerm = false; 
		$scope.showHideSelectTerm = true;
		$scope.errMsg = "";
		
		var obj = {};
		obj.params = {};
		obj.params.paging = {};
		obj.params.paging.page = "1";
		obj.params.paging.pageSize = "50";

		obj.params.myAcctId = myAccountService.accountDetail.myAccountID;
		obj.params.language = $translate.use();
		
		obj.actionCode = 'ACT_MY_ACCOUNT_INQUIRY_DETAIL_SWITCH_TERM_TD';
		obj.procedure = 'inquiryMyAccountDetailSwitchTermTDProcedure';

		obj.onSuccess = function(result) {
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				$scope.changeSelectTermData = result.responseJSON.result.value && result.responseJSON.result.value.depositsList || [];
				checkGetChangeTermSelectData();
			} else {
				var errCode = (result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode) || "RIB-E-ACCT01";
				$scope.errMsg = window.translationsError[lang][ errCode ];
			}
			
		};
		obj.onFailure = function() {//return result
			$scope.errMsg = window.translationsError[lang]["RIB-E-AD0001"];
		};
		invokeService.executeInvokePublicService(obj);
	};
	
	function getChangeSelectTermData() {
		for(var i in $scope.changeSelectTermData){
			if(i !== null){
				var months = $scope.changeSelectTermData[i].termMonth;
				var days = $scope.changeSelectTermData[i].termDay;
				
				var term_description = addTermDesc(months,days);
	
				$scope.changeSelectTermData[i].term_description = term_description;
			}
		}
	}
	
	function addTermDesc(months,days){
		var term_description = ' ';
		if(months !== null && months !== 0){
			term_description = myAccountTermDepositService.dayMonthDesc('M',months);
		}

		if(days !== null && days !== 0){
			term_description = term_description + " " + myAccountTermDepositService.dayMonthDesc('D',days);
		}

		return term_description;
	}

	$scope.navigateToChangeTermMain = function(){
		$scope.showHideChangeTerm = true; 
		$scope.showHideSelectTerm = false; 
	};
	
	$scope.fcconTdTermTypes = myAccountTermDepositService.getTermsMasterDataList();
	
	$scope.selected_term_option = myAccountTermDepositService.getSelectedTermOption();
	$scope.selected_term_type = myAccountTermDepositService.getSelectedTermType();
	$scope.selected_term_freq = myAccountTermDepositService.getSelectedTermFreq();
	$scope.options_term_type = myAccountTermDepositService.getOptionsTermType();
	$scope.options_term_freq = myAccountTermDepositService.getOptionsTermFreq();
	
	$scope.saveDataToService = function(){
		 myAccountTermDepositService.setSelectedTermOption($scope.selected_term_option);
		 myAccountTermDepositService.setSelectedTermType($scope.selected_term_type);
		 myAccountTermDepositService.setSelectedTermFreq($scope.selected_term_freq);
		 myAccountTermDepositService.setOptionsTermType($scope.options_term_type);
		 myAccountTermDepositService.setOptionsTermFreq($scope.options_term_freq);
		 
	};
	
	$scope.onChangeTermType = function(option){
		
		$scope.selected_term_type = option;
		for(var i in $scope.options_term_freq){
			if($scope.selected_term_type.term === $scope.options_term_freq[i].term){
				$scope.selected_term_freq.sel = $scope.options_term_freq[i];
				break;
			}
		}
		$scope.saveDataToService();
	};

    $scope.filterfreq = function(option){
        return (option.term === $scope.selected_term_type.term && option.productTypeDescription === $scope.selected_term_type.productTypeDescription);
    };
	    
	$scope.populateTermOptions = function(){
		$scope.selected_term_type = {};
		$scope.selected_term_freq = {};
		
		$scope.options_term_type = {};
		$scope.options_term_freq = {};
		
		var masterlist = $scope.fcconTdTermTypes;
		
		$scope.options_term_type = angular.copy(masterlist);
		$scope.options_term_freq = angular.copy(masterlist);
		
		$scope.selected_term_type = $scope.options_term_type[0];
		
		for(var i in $scope.options_term_freq){
			if($scope.selected_term_type.term === $scope.options_term_freq[i].term){
				$scope.selected_term_freq = $scope.options_term_freq[i];
				break;
			}
		}
		
		$scope.saveDataToService();
		
	};
	
	$scope.showTermCondition = function(data){
		
		myAccountTermDepositService.setSelectTermDepositInquiryDetail(data);

		var obj = {};
		obj.params = {};
		
		obj.params.accountNo = myAccountService.accountDetail.myAccountNumber;
		obj.params.depNo = data.depNo;
		
		obj.actionCode = 'ACT_INQUIRY_TERM_MASTER_DATA_SWITCH_TERM_TD';
		obj.procedure = 'inquiryTermMasterDataSwitchTermTDProcedure';
		
		
		obj.onSuccess = function(result) {
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				myAccountTermDepositService.setTermsMasterDataList(result.responseJSON.result.value.fcconTdTermTypes);
				myAccountTermDepositService.setTermNetAmount(result.responseJSON.result.value.netAmount);
				
				$scope.fcconTdTermTypes = result.responseJSON.result.value.fcconTdTermTypes;
				for (var i in $scope.fcconTdTermTypes) {
					if ($translate.use() === kkconst.LANGUAGE_th) {
						$scope.fcconTdTermTypes[i].term_description = $scope.fcconTdTermTypes[i].termNameTha;
						$scope.fcconTdTermTypes[i].freq_description = $scope.fcconTdTermTypes[i].freqIntPayDescTha;
					} else {
						$scope.fcconTdTermTypes[i].term_description = $scope.fcconTdTermTypes[i].termNameEng;
						$scope.fcconTdTermTypes[i].freq_description = $scope.fcconTdTermTypes[i].freqIntPayDescEng;
					}
				}
				
				$scope.populateTermOptions();
				
				$state.go('app.myAccountsChangeTermCondition');
				
			} else {
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			}
		};
		obj.onFailure = function() {//return result
			$scope.errMsg = $translate[lang]['RIB-E-AD0001'];
		};
		invokeService.executeInvokePublicService(obj);
	};

	$scope.deviceScroolheightDevice = function() {
		$scope.deviceScrollInner = window.innerHeight;
		$scope.deviceScrollheight = $scope.deviceScrollInner - 136;
		return $scope.deviceScrollheight + 'px';
	};
	
	$scope.changeTermCondition = myAccountTermDepositService.getSelectTermDepositInquiryDetail();

	$scope.termVal = myAccountTermDepositService.getTermsMasterDataList();
	
	if($scope.termVal) {
		for(var index = 0;  index < $scope.termVal.length; index++) {
			if(lang === kkconst.LANGUAGE_th) {
				myAccountTermDepositService.setDefaultTermObj($scope.termVal[0]);
				$scope.freqIntPay = $scope.termVal[0].freqIntPayDescTha;
				myAccountTermDepositService.setTermPeriod($scope.freqIntPay);
			} else {
				myAccountTermDepositService.setDefaultTermObj($scope.termVal[0]);
				$scope.freqIntPay = $scope.termVal[0].freqIntPayDescEng;
				myAccountTermDepositService.setTermPeriod($scope.freqIntPay);
			}
			$scope.termMonth = $scope.termVal[0].term;
			myAccountTermDepositService.setTermMonth($scope.termMonth);
		}
	}

	/*Terms Condition Modal*/

	$ionicModal.fromTemplateUrl('templates/ManageAccounts/MyAccounts/TermInterestConditionModal.html', {
		scope: $scope,
		viewType: 'bottom-sheet',
		animation: 'slide-in-up'
	}).then(function(modal) {

		$scope.TermConditionsModal = modal;
	});


	$scope.closeTermConditionModal = function() {
		$scope.TermConditionsModal.hide();
	};
	// select the term index
	$scope.termIndex = 0;
	$scope.selectedRecPeriodTypeIndex = null;
	$scope.selectedTermsMonth = function(i,term) {
		$scope.termIndex = i;
		$scope.termMonth = term;
		myAccountTermDepositService.setTermMonth(term);
		$scope.selectedRecPeriodTypeIndex = i;
	};
	$scope.selectedRecPeriodTimesIndex = null;   
	$scope.selectedTermPeriod = function(i,period) {
		myAccountTermDepositService.setConfirmTermData(period);
		if(lang === kkconst.LANGUAGE_th) {
			$scope.freqIntPay = period.freqIntPayDescTha;
			myAccountTermDepositService.setTermPeriod(period.freqIntPayDescTha);
			$scope.selectedRecPeriodTimesIndex = i;
		} else {
			$scope.freqIntPay = period.freqIntPayDescEng;
			myAccountTermDepositService.setTermPeriod(period.freqIntPayDescEng);
			$scope.selectedRecPeriodTimesIndex = i;
		}
	};
	
	$scope.ratesTerms = myAccountTermDepositService.getRatesTerms();
	$scope.verifyTransactionId = "";
	$scope.navigateChangeTermConfirm = function(){
		
		if($('#select_field_term_freq').val() !== ''){
			$scope.selected_term_option = JSON.parse($('#select_field_term_freq').val());
		}else{
			$scope.selected_term_option = $scope.selected_term_type;
		}
		var fcconTdTermType = angular.copy($scope.selected_term_option);
		
		delete fcconTdTermType["term_description"];
		delete fcconTdTermType["freq_description"];
		delete fcconTdTermType["$$hashKey"];
		fcconTdTermType.benefitAcc = $scope.changeTermCondition.benefitAcc;

		$scope.saveDataToService();
		
		var obj = {};
		obj.params = {};
		
		obj.params.language = lang;
		obj.params.accountNo = myAccountService.accountDetail.myAccountNumber;
		obj.params.depNo = $scope.changeTermCondition.depNo;
		
		obj.params.netAmount = myAccountTermDepositService.getTermNetAmount();
		obj.params.fcconTdTermType = fcconTdTermType;
		
		obj.actionCode = 'ACT_GET_RATES_BY_CIF_TYPE_SWITCH_TERM_TD';
		obj.procedure = 'getRatesByCIFTypeSwitchTermTDProcedure';
		
		
		obj.onSuccess = function(result) {
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				myAccountTermDepositService.setRatesTerms(result.responseJSON.result.value);
				$state.go('app.myAccountsChangeTermConfirm');
				
			} else {
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			}
		};
		
		obj.onFailure = function() {//return result
			$scope.errMsg = $translate[lang]["RIB-E-AD0001"];
		};
		invokeService.executeInvokePublicService(obj);
	};
	
	$scope.changeTdTermConfirm = function() {
		
		var fcconTdTermType = angular.copy($scope.selected_term_option);
		
		delete fcconTdTermType["term_description"];
		delete fcconTdTermType["freq_description"];
		
		var obj = {};
		obj.params = {};
		
		obj.actionCode = 'ACT_SWITCH_TERM_TD';
		obj.procedure = 'switchTermTDProcedure';
		
		obj.params.language = lang;
		obj.params.verifyTransactionId = myAccountTermDepositService.ratesTerms.verifyTransactionId;
		obj.params.benefitAcc = $scope.changeTermCondition.benefitAcc;
		
		obj.onSuccess = function(result) {
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				popupService.showErrorPopupMessage('label.success','changeTerm.successMsg');
//				Fix - 9672
				$state.go('app.myAccount');
			} else {
				popupService.showErrorPopupMessage('lable.error',result.responseJSON.result.responseStatus.responseCode);
			}
		};
		obj.onFailure = function() {//return result
			$scope.errMsg = $translate[lang]["RIB-E-AD0001"];
		};

		invokeService.executeInvokePublicService(obj);

	};
	
	$scope.navigateToBackChangeTerm = function() {
		$state.go('app.myAccountsChangeTerm');
	};
	
	$scope.navigateToBackChangeTermDetail = function() {
		$state.go('app.myAccountsTdDetails');
	};

	$scope.backToChangeTermMain = function(){
		$state.go('app.myAccountsChangeTermCondition');
	};
});
