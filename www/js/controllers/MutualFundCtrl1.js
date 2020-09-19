angular.module('ctrl.mutualFund1', [])
.controller('mutualFundCtrl1', function($scope, $state, popupService, kkconst, mutualFundService) {
	'use strict';
	$scope.isShowData = false;
	$scope.isNotShowData = true;
	$scope.isShowScreen = false;
	
	$scope.init = function(){
		mutualFundService.getPortMutualFundDetailSummary(function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				prepareMutualFundDetailSummary(resultObj);
			} else {
				$scope.isShowData = false;
				$scope.isNotShowData = true;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
			$scope.isShowScreen = true;
		});
	};
	
	function prepareMutualFundDetailSummary(resultObj) {
		var lstOfDetail 	= resultObj.value.lstOfDetail;
		var lstOfSummary	= resultObj.value.lstOfSummary;
		if(lstOfDetail !== null && lstOfDetail[0].listDetail.length > 0) {
			//have data
			var listDetail = lstOfDetail[0];
			$scope.mutualFundPortDetails = listDetail;
			if($scope.mutualFundPortDetails.listDetail != null && $scope.mutualFundPortDetails.listDetail.length > 0) {
				$scope.mutualFundSummaryDetails = lstOfSummary[0];
				for (var index = 0; index < $scope.mutualFundPortDetails.listDetail.length; index++) {
					$scope.mutualFundPortDetails.listDetail[index].navDate = reArrangeDate($scope.mutualFundPortDetails.listDetail[index].navDate);
				}
				$scope.isShowData = true;
				$scope.isNotShowData = false;
			} else {
				$scope.isShowData = false;
				$scope.isNotShowData = true;
			}
		} else{
			//not have data
			$scope.isShowData = false;
			$scope.isNotShowData = true;
		}
	}
	
	function reArrangeDate(dateStr){
		  var dt = [];
		  dt = dateStr.split("/");
		  var response = dt[1]+"/"+dt[0]+"/"+dt[2];
		  return new Date(response);
	}
	
	$scope.init();
	
	$scope.navigateToMutualFundDetails = function(mutualFundPortDetail) {
	   mutualFundService.setMutualFundPortDetail(mutualFundPortDetail);
	   $state.go('app.mutualFundDetails1');
	};
	
})

.controller('mutualFundDetailCtrl1', function($scope, $state, popupService, mutualFundService, kkconst) {
	
        $scope.mutualFundTransactionDetails = function(){
        	var param = {};
        	param.pageSize = '50';
        	param.pageNumber = '1';
        	param.fundCode = mutualFundService.getMutualFundPortDetail().fundCode;
        	param.unitHolderNumber = mutualFundService.getMutualFundPortDetail().unitholder;
    		mutualFundService.getPortMutualFundTransaction(param, function(resultObj){
    			if(resultObj.responseStatus.responseCode === kkconst.success) {
    				if(resultObj.value != null && resultObj.value.length > 0){
    					//have data
    					$scope.mfTransactionPortDetails = resultObj.value;
    				} else{
    					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
    				}
    			} else {
    				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
    			}
    		});
    	};
        
        $scope.mutualFundTransactionDetails();
        
        $scope.backToMutualFund = function() {
        	$state.go('app.mutualFund');
        };
});






