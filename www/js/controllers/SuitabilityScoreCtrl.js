angular.module('ctrl.suitabilityScore',[])
.controller('SuitabilityScoreCtrl', function($scope, $ionicModal,popupService,$state, kkconst, suitabilityScoreService,mutualFundService) {

    "use strict";
    var resultSuit = {};
    $scope.suitScoreResult = {};
    $scope.suitAssetAllocation = {};
    $scope.fundRiskTable = {}; 
    $scope.isShowScreen = false;

    $scope.goBackPage = function() {
        $state.go('app.myMutualFund');
    };


    $ionicModal.fromTemplateUrl('templates/MutualFund/MutualFund-assetAllocation-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {
		$scope.viewAssetAllocationModal = modal;
	});


    var getSuitabilityScore = function() {
        suitabilityScoreService
        .inquirySuitabilityScore()
        .then(function(resp){
            var respStatus = resp.result;
            if (respStatus.responseStatus.responseCode === kkconst.success) {
                    resultSuit = respStatus.value.currentCustSuitScoreData; 
                    if( resultSuit.suitExists === 'Y'){
                            $scope.suitScoreResult =  resultSuit;
                    }
            }else{
                 popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,respStatus.responseStatus.errorMessage );
            }
        });
    };


    $scope.selectClose = function(){
        $scope.viewAssetAllocationModal.hide();
    };
   
     
     $scope.getTableSuitPDF = function() {
         
         
            suitabilityScoreService.getRiskTable()
            .then(function(resp){
            var respStatus = resp.result;
            if (respStatus.responseStatus.responseCode === kkconst.success) {
                   $scope.fundRiskTable  = respStatus.value.data; 
                    $scope.viewAssetAllocationModal.show();
                   
          }else{
                // popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,respStatus.responseStatus.errorMessage );
            }
        });
       
     };
     
     function verifyIsUnitholderExist(){
        mutualFundService.verifyIsUnitHolderExist(function(resultObj){
            if(resultObj.responseStatus.responseCode === kkconst.success) {
                $scope.isUnitHolderExist = (resultObj.value.isExistingUnitholder == 'Y');
                if($scope.isUnitHolderExist){
                     getSuitabilityScore();
                }
            } else {
                popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.errorMessage);
            }
            $scope.isShowScreen = true;
        });
    }

    verifyIsUnitholderExist();

});

