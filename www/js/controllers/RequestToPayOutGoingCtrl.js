angular.module('ctrl.rtpRequestOutGoingList', [])
.controller('RequestToPayOutGoingCtrl',function($scope,$ionicHistory, $state,kkconst,requestToPayOutGoingService){
    
      $scope.requestToPayList = {
        data:[],
        firstLoad: ''
    };

    var getRequestToPayList = function(){
        requestToPayOutGoingService.inquiryRequestToPay().then(function(result){
           
            var tmp = result.rtpInfoDetailList;
            if( tmp.length > 0 ){
                  $scope.requestToPayList.firstLoad = false;
            }else{
                  $scope.requestToPayList.firstLoad = true;
            }
            $scope.requestToPayList.data = requestToPayOutGoingService.createUIDataBinding(tmp);
        });
    };

    $scope.navigationToDetail = function(data){
        requestToPayOutGoingService.setRequestToPayDetail(data);
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_DETAIL.STATE);
    };

    $scope.deleteRow = function(row){
    };


    $scope.addMyRTP = function(){
        $ionicHistory.clearCache().then(function () {
		    $state.go(kkconst.ROUNTING.RTP_REQUEST.STATE);
		});
    };
    

    getRequestToPayList();

})
.controller('RequestToPayOutGoingDatailCtrl', function($scope,$state,kkconst,requestToPayOutGoingService, anyIDService,displayUIService) {
    $scope.requestToPayDetail = {
        data: {}
    };
      $scope.selectedAnyIDType  =  {};
    var urlState = '';
   

    $scope.checkIsAnyID = function(anyIDType){
		return anyIDService.isAnyID(anyIDType);
	};
	
	$scope.getAnyIDIcon = function(anyIDType){
		return anyIDService.getAnyIDinfo(anyIDType).icon;
	};
	
	$scope.getAnyIDIconColor = function(anyIDType){
		return anyIDService.getAnyIDinfo(anyIDType).iconColor;
	};
	
    var initData = function(){
        var tmp = requestToPayOutGoingService.getRequestToPayDetail();
        if(tmp){
            $scope.requestToPayDetail.data = tmp;
            var createdDateObj = displayUIService.convertDateTimeForUI($scope.requestToPayDetail.data.createdDate);
            $scope.requestToPayDetail.data.createdDateObj = createdDateObj;
            var expriedDateObj = displayUIService.convertDateTimeForUI($scope.requestToPayDetail.data.expiryDate);
            $scope.requestToPayDetail.data.expriedDateObj = expriedDateObj;
            urlState = (tmp.requesterIdType === 'BILLERID') ? kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE : kkconst.ROUNTING.FUNDTRANSFER.STATE;
            $scope.selectedAnyIDType = tmp.receiverIdType;
         
        }
      
    };

    //$scope.isAnyID = false;
    $scope.anyIDIconClass = '';

    $scope.gotoPage = function(){
        if(urlState === kkconst.ROUNTING.FUNDTRANSFER.STATE){
            $scope.gotoFund();
        }
        if(urlState === kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE){
            $scope.gotoBillRTP();
        }
    };

    $scope.goBackPage = function(){
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_LIST.STATE);
    };

    initData();
})