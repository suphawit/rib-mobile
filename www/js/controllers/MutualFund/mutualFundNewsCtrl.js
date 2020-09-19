angular.module('ctrl.mutualFundNews', [])
    .controller('mutualFundNewsCtrl', function ($scope ,$ionicListDelegate,mutualFundService, popupService, kkconst, $state,displayUIService) {
	
    $scope.isNotShowData = false;
    $scope.isShowData = false;
    
    function init() {
        displayUIService.initLastSixMonthly(function(resultObj){
			$scope.criteriaMonthlyList = resultObj;
			$scope.selectedItem = resultObj[0];
			selectedCriteriaItem = $scope.selectedItem.value;
			$scope.getFundDividendByMonth(selectedCriteriaItem);
		});
	}

    $scope.getFundDividendByMonth = function(periodSelect){
        var stringPeriod = periodSelect.substring(0,4);
		selectedCriteriaItem = stringPeriod.concat(periodSelect.substring(5));
        mutualFundService.getFundDividendNews(selectedCriteriaItem,function(resultObj){
            if(resultObj.responseStatus.responseCode === kkconst.success) {
                var DividendList = resultObj.value.dividendListData;
                 if(DividendList.length > 0){
                    $scope.isShowData = true;
                    $scope.isNotShowData = false;
                    $scope.dividendList = groupingFundDividendNewsByDate(DividendList);
                }else{
                    $scope.isShowData = false;
                    $scope.isNotShowData = true;
                }
            } else {
                $scope.isShowData = false;
                $scope.isNotShowData = true;
                popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.errorMessage);
            }
        });
    }

    function groupingFundDividendNewsByDate(DividendList){
        var dividendGroup = [];
        var groups = {};
        var groupName = {};
            for (var i = 0; i < DividendList.length; i++) {
            groupName = (DividendList[i].annouceDate).slice(0,2);
                if (!groups[groupName]) {		
                    groups[groupName] = [];
                }
                
                DividendList[i].annouceDateShow = displayUIService.convertDateTimeForTxnDateUI(DividendList[i].annouceDate);	
                DividendList[i].bookClosedDateShow = displayUIService.convertDateTimeForTxnDateUI(DividendList[i].bookClosedDate);	
                DividendList[i].paymentDateShow = displayUIService.convertDateTimeForTxnDateUI(DividendList[i].paymentDate);	
                groups[groupName].push((DividendList[i]));
            }
            var dividendGroup  = [];	
            for (var group in groups) {
                if (groups.hasOwnProperty(group)) {
                    dividendGroup.push({date: group, item: groups[group]});
                }
            }

            dividendGroup.sort(function(a, b){
                return  Number(b.date) - Number(a.date);
            });
            return dividendGroup;
	};

    init();
   });