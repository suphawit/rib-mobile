angular.module('ctrl.mutualFundPurchaseConfirm', [])
    .controller('mutualFundPurchaseConfirmCtrl', function ($scope ,$ionicListDelegate,mutualFundService, popupService, kkconst, $state,displayUIService) {

		$scope.fundObj 						= {};
		$scope.fundConfirmInfo              = {};
		$scope.effectiveDate                = {};
		$scope.orderDate                    = {};
		
	function init() {
		$scope.fundConfirmInfo        = mutualFundService.getConfirmMutualFund();
		$scope.orderDate              = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.resultSubmitPrepair.orderDate);	
		$scope.effectiveDate          = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.resultSubmitPrepair.effectiveDate);					
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
			mutualFundService.submitConfirmMutualFund($scope.fundConfirmInfo.resultSubmitPrepair.verifyTransactionId)
					.then(function(resp){
					var respStatus = resp.result.responseStatus;
					   if (respStatus.responseCode === kkconst.success) {
								var submitConfirmMutualFund  = resp.result.value; 
								if( submitConfirmMutualFund.fundConnectStatusCode === 'PD'){
									overCutoffTime(submitConfirmMutualFund.confirmOrderDetail.cutOffTime);
								}else if( submitConfirmMutualFund.fundConnectStatusCode === 'SC'){
									mutualFundService.setConfirmResultMutualFund(submitConfirmMutualFund);
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.STATE);
								}else{
									mutualFundService.setConfirmResultMutualFund(submitConfirmMutualFund);
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.STATE);
								}
						}else{
							popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
						}
					});
			};

	$scope.checkIsSameDate = function(){
		var orderDate = new Date($scope.fundConfirmInfo.resultSubmitPrepair.orderDate);
		var effectiveDate = new Date($scope.fundConfirmInfo.resultSubmitPrepair.effectiveDate);
		return (orderDate < effectiveDate);
	}
		init();
   });