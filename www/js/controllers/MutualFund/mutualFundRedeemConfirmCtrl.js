angular.module('ctrl.mutualFundRedeemConfirm', [])
    .controller('mutualFundRedeemConfirmCtrl', function ($scope,displayUIService,$q ,generalService,$ionicListDelegate,$ionicHistory,$translate,generalValueDateService,	$ionicScrollDelegate,mutualFundService,anyIDService, fundtransferService,myAccountService, $ionicModal, mainSession, manageAnyIDService, popupService, kkconst, $state) {
      
   
	$scope.showSelectFromAccountDetails = false;
	$scope.isHidebackConfirmMutualFund	= false;
	$scope.showFundListBtn  			= true;
	$scope.showUnitHolderBtn 			= true;
	$scope.showMinimumAmount            = false;
    $scope.fundObj 						= {};
	$scope.fundConfirmInfo              = {};
	$scope.fundListInfoShow             = {};
	$scope.unitHolderInfo               = {};

	function init() {
		$scope.fundConfirmInfo      =  mutualFundService.getConfirmMutualFund();
		$scope.orderDate = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.submitPrepair.orderDate);		
		$scope.effectiveDate = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.submitPrepair.effectiveDate);				
		if(	$scope.fundConfirmInfo.submitPrepair.unit !== null){
			$scope.fundConfirmInfo.submitPrepair.unit=  parseFloat($scope.fundConfirmInfo.submitPrepair.unit).toFixed(4);
		 }
	}


	function confirmValidate(cutOffTime){
		if(true){
			popupService.showConfirmPopupMessageCallback(kkconst.ALERT_WARNING_TITLE,'label.fundConnext.cutOfTime', function (ok) {
				if (ok) {
					    $scope.goNextPage();
				} else {
						$ionicListDelegate.closeOptionButtons();
				}
			},{CutOffTime:cutOffTime});
		}
	};

	function overCutoffTime(cutOffTime){
		confirmValidate(cutOffTime);
	};


	$scope.goNextPage = function(){

		mutualFundService
					.submitConfirmMutualFund($scope.fundConfirmInfo.submitPrepair.verifyTransactionId)
					.then(function(resp){
					var respStatus = resp.result.responseStatus;
						if (respStatus.responseCode === kkconst.success) {
								
								var submitConfirmMutualFund  = resp.result.value; 
							
								if( submitConfirmMutualFund.fundConnectStatusCode == 'PD'){
									overCutoffTime(submitConfirmMutualFund.confirmOrderDetail.cutOffTime);
								}else if( submitConfirmMutualFund.fundConnectStatusCode == 'SC'){
									mutualFundService.setConfirmResultMutualFund(submitConfirmMutualFund);
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.STATE);
								}else{
									mutualFundService.setConfirmResultMutualFund(submitConfirmMutualFund);
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.STATE);
								}
						}else{
							popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
						}
					
					});
	};

	$scope.checkIsSameDate = function(){
		var orderDate = new Date($scope.fundConfirmInfo.submitPrepair.orderDate);
		var effectiveDate = new Date($scope.fundConfirmInfo.submitPrepair.effectiveDate);
		return (orderDate < effectiveDate);
	}

    init();
	
    });