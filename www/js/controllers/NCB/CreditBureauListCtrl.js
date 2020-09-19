angular.module('ctrl.creditBureauList', [])
.controller('CreditBureauListCtrl', function($scope, $state, $ionicModal, mainSession, popupService, ribNCBService) {
    $scope.lang = mainSession.lang;
    $scope.isShown = true
    $status = {
        available: "01",
        expiredReport: "02",
        expiredRequest: "03",
        rejected: "04",
        waiting: "05",
        authenSuccess: "06",
        paid: "07",
    }
    
	$scope.ncbDoc = { modal: {} };
    
    $scope.initialNCBRequestList = function() {
        ribNCBService.NCBRequestList().then(function(result){
            $scope.ncbRequestList = result.ncbRequestList || [];
            $scope.isShown = result.ncbRequestList.length === 0 ? false : true;
        }, function() {
            $scope.ncbRequestList = [];
            $scope.isShown = false;
        });
    }

    $scope.bureauDetail = function(status, requestId, message) {
        if(status === $status.available) viewNCBDocument(requestId);
        else if(status === $status.waiting) $scope.gotoNDIDAuthenPage();
        else if(status === $status.paid) popupService.showErrorPopupMessage('alert.title', message);
    };

    $scope.gotoRequestBureau = function() {
        ribNCBService.NCBRequestData().then(function(result){
			ribNCBService.setCache({
				customerData: result.customerData || {},
				ncbPackageList: result.ncbPackageList || []
            });
            $state.go('app.requestBureauMenu');
        });
    };

    $ionicModal.fromTemplateUrl('templates/NCB/ncbDocumentDetail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.ncbDoc.modal = modal;
    });
	
	function viewNCBDocument(requestId){
        ribNCBService.viewNCBDocument(requestId)
            .then(function(result){
                // $scope.ncbDoc.text = result.ncbReportHTML;
                // $scope.ncbDoc.modal.show();
                const fileUrl = URL.createObjectURL(
					new Blob([result.ncbReportHTML], { type: "text/html" })
				);
				window.open(
					fileUrl,
					"_blank",
					'shouldPauseOnSuspend=yes,location=no,hardwareback=no'
				);
            });
	}
})