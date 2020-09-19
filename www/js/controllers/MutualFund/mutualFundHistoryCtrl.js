angular.module('ctrl.mutualFundHistory', [])
    .controller('mutualFundHistoryCtrl', function ($scope,mutualFundService, displayUIService,popupService,kkconst, $state) {


	$scope.isShowData = false;
	$scope.isNotShowData = false;
	$scope.fundListScheduleShow  = [];
	$scope.fundListSchedule = [];
	var fundListPageReload = [];
	var selectedCriteriaItem = '';
	var totalRows;
	var totalpages;
	var pageNumber;
	var stringPeriod = '';
	$scope.moredata = false;

	function changeFormatNumber(amount){
	
	
			var number =  parseFloat(amount).toFixed(4);
			if(isNaN(number) == true){
				return "0.000";
			}else{
				var parts = number.toString().split(".");
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return parts.join(".");
			
			}
		}
	

		function groupingMutualFund(){
			var groups = {};
			var groupName = {};
				for (var i = 0; i < $scope.fundListSchedule.length; i++) {
				groupName = ($scope.fundListSchedule[i].orderDate).slice(0,2);
					if (!groups[groupName]) {		
						groups[groupName] = [];
					}
					
					$scope.fundListSchedule[i].orderDateShow = displayUIService.convertDateTimeForTxnDateNoSecUI($scope.fundListSchedule[i].orderDate);	
					$scope.fundListSchedule[i].effectiveDateShow = displayUIService.convertDateNoTimeForUI($scope.fundListSchedule[i].effectiveDate);
					if($scope.fundListSchedule[i].confirmedDate && $scope.fundListSchedule[i].confirmedDate != null){
						$scope.fundListSchedule[i].confirmedDateShow = displayUIService.convertDateNoTimeForUI($scope.fundListSchedule[i].confirmedDate);				
					}
					groups[groupName].push(($scope.fundListSchedule[i]));
					console.log($scope.fundListSchedule[i].orderDateShow)
				}
				var fundListSchedule  = [];	
				for (var group in groups) {
                    if (groups.hasOwnProperty(group)) {
                        fundListSchedule.push({date: group, transactions: groups[group]});
                    }
				}
		
				fundListSchedule.sort(function(a, b){
					return  Number(b.date) - Number(a.date);
				});
				return fundListSchedule;
	};




	$scope.getHistoryMutualFund = function(periodSelect){
			
			pageNumber = 1;
			var stringPeriod = periodSelect.substring(0,4);
		
			selectedCriteriaItem = stringPeriod.concat(periodSelect.substring(5));
			mutualFundService.getTransactionHistoryMutualFund(selectedCriteriaItem,pageNumber)
		   .then(function(resp){
			   var respStatus = resp.result;
				if (respStatus.responseStatus.responseCode === kkconst.success) {
						$scope.fundListSchedule   =  respStatus.value.transactionHistoryList; 
						$scope.fundListScheduleShow   =  groupingMutualFund();
					
					if($scope.fundListSchedule.length > 0) {
							$scope.isNotShowData = false;
							totalpages = respStatus.value.paging.totalpages;
							totalRows = respStatus.value.paging.totalRows;
							$scope.$broadcast('scroll.infiniteScrollComplete');
					}else{
					
							$scope.isNotShowData = true;
							totalpages = '';
							totalRows = '';
							$scope.$broadcast('scroll.infiniteScrollComplete');

						}
			   }else{
					popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
				   
			   }
		   });
	}

	
	function init() {
	
		displayUIService.initLastSixMonthly(function(resultObj){
			$scope.criteriaMonthlyList = resultObj;
			$scope.selectedItem = resultObj[0];
			selectedCriteriaItem = $scope.selectedItem.value;
			$scope.getHistoryMutualFund(selectedCriteriaItem);
		});
	}

	


	$scope.poppulateList = function(){
		
		pageNumber++;
		mutualFundService
		.getTransactionHistoryMutualFund(selectedCriteriaItem,pageNumber)
		.then(function(resp){
			var respStatus = resp.result;
			if (respStatus.responseStatus.responseCode === kkconst.success) {
				$scope.isNotShowData = false;
				fundListPageReload = respStatus.value.transactionHistoryList;
				
				if($scope.fundListSchedule.length > 0) {
					$scope.fundListSchedule = $scope.fundListSchedule.concat(fundListPageReload);
					$scope.fundListScheduleShow = groupingMutualFund();
					
					if(pageNumber === respStatus.value.paging.totalpages){
						totalpages = '';
						totalRows  = '';
						pageNumber = '';
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}else{
						$scope.$broadcast('scroll.infiniteScrollComplete');
					
					}

				}else{
					 totalpages = '';
					 totalRows = '';
					 pageNumber = '';
					 $scope.$broadcast('scroll.infiniteScrollComplete');
				
				}
			}else{
				//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING,respStatus.responseCode);
				popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
			}

		});
	  };
	
	  $scope.canWeloadMoreContent = function() {
		  if($scope.fundListSchedule.length < totalRows ){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			return true;

		  }else{
			return false;
		  }
	
	  };

	  init();
   
    })

.controller('mutualFundTransactionDetailCtrl', function($scope,$state, mutualFundService, popupService, kkconst) {// NOSONAR
 
	$scope.dataTransectionDetail = {};

	function init() {
			$scope.dataTransectionDetail  =  mutualFundService.getFundTransactionToday();
	}

	$scope.cancelTransaction = function(){

		    popupService.showConfirmPopupMessageCallback('button.confirm', 'label.confirmDeleteTransaction', function (ok) {
			if (ok) {
					mutualFundService.cancelOrderTransaction($scope.dataTransectionDetail.mutualFundref,$scope.dataTransectionDetail.referenceNo)
					.then(function(resp){
						$state.go(kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_TODAY.STATE);
					});
			} 
			});

	};


	init();
		
	
});