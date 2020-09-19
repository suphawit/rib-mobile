angular.module('ctrl.history', [])
.controller('HistoryFuntransferCtrl', function($scope, $state, popupService, invokeService, displayUIService, historyFundtransfertService, kkconst, $ionicScrollDelegate) {// NOSONAR
	
	$scope.ft_history_list = [];
	$scope.isShowData = false;
	$scope.isNotShowData = false;
	var selectedCriteriaItem = '';
	
	$scope.getHistoryFundtranfer = function(month) {
		historyFundtransfertService.inquiryHistoryFundtransfer(month, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				if(resultObj.value !== null && resultObj.value.length > 0 && (resultObj.value !== 'undefined' || resultObj.value !== undefined)) {
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.ft_history_list = historyFundtransfertService.setTime(resultObj.value);
				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.ft_history_list = null;
					$scope.isNotConnectService = true;
				}
				$ionicScrollDelegate.scrollTop();
			} else {
				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = false;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});	
	};
	
	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
		selectedCriteriaItem = $scope.selectedItem.value;
		$scope.getHistoryFundtranfer(selectedCriteriaItem);
	});
	
})
.controller('HistoryBillpaymentCtrl', function($scope, $state, popupService, invokeService, displayUIService, historyBillpaymentService, kkconst, $ionicScrollDelegate) {
	
	$scope.bp_history_list = [];
	$scope.isShowData = false;
	$scope.isNotShowData = false;
	var selectedCriteriaItem = '';
	
	$scope.getHistoryBillpayment = function(month) {
		historyBillpaymentService.inquiryHistoryBillpayment(month, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				if(resultObj.value !== null && resultObj.value.length > 0 && (resultObj.value !== 'undefined' || resultObj.value !== undefined)) {
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.bp_history_list = historyBillpaymentService.setTime(resultObj.value);
				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.bp_history_list = null;
					$scope.isNotConnectService = true;
				}
				$ionicScrollDelegate.scrollTop();
			} else {
				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = false;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});	
	};
	
	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
		selectedCriteriaItem = $scope.selectedItem.value;
		$scope.getHistoryBillpayment(selectedCriteriaItem);
	});
	
});