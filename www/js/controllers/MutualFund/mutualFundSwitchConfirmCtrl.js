angular.module('ctrl.mutualFundSwitchConfirm', [])
    .controller('mutualFundSwitchConfirmCtrl', function ($scope,$ionicListDelegate,displayUIService ,mutualFundService, popupService, kkconst, $state) {
  
    $scope.fundObj 						= {};
	$scope.fundConfirmInfo              = {};
	$scope.fundListInfoShow             = {};
	$scope.unitHolderInfo               = {};

	function init() {
		$scope.fundConfirmInfo        =  mutualFundService.getConfirmMutualFund();	
	
		$scope.orderDate = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.submitPrepair.orderDate);			
		$scope.effectiveDate = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.submitPrepair.effectiveDate);
		if(	$scope.fundConfirmInfo.submitPrepair.unit !== null){
			$scope.fundConfirmInfo.submitPrepair.unit =  parseFloat($scope.fundConfirmInfo.submitPrepair.unit).toFixed(4);
		 
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
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.STATE);
								}else{
									mutualFundService.setConfirmResultMutualFund(submitConfirmMutualFund);
									$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.STATE);
								}
							
					
					}else{
						//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-UNK999');
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