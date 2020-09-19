angular.module('ctrl.requesttopay',[])
.controller('RequestToPayListCtrl', function($scope,$state,kkconst,requestToPayService) {
    $scope.requestToPayList = {
        data:[],
        hasRow: false
    };

    var getRequestToPayList = function(){
        requestToPayService.inquiryRequestToPay().then(function(result){
            var tmp = result.rtpInfoDetailList;
            // tmp.splice(1,Math.floor(Math.random() * 6) + 1);
            $scope.requestToPayList.hasRow = true;
            $scope.requestToPayList.data = requestToPayService.createUIDataBinding(tmp);
        });
    };

    $scope.navigationToDetail = function(data){
        requestToPayService.setRequestToPayDetail(data);
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE);
    };

    $scope.deleteRow = function(row){
    };

    getRequestToPayList();
})
.controller('RequestToPayDetailCtrl', function($scope,$state,kkconst,requestToPayService, anyIDService) {
    $scope.requestToPayDetail = {
        data: {}
    };
    var urlState = '';
    var checkIsAnyID = function(anyIDType){
		return anyIDService.isAnyID(anyIDType);
	};
    var getAnyIDIcon = function(anyIDType){
		return anyIDService.getAnyIDinfo(anyIDType).icon;
	};
    var initData = function(){
        var tmp = requestToPayService.getRequestToPayDetail();
        if(tmp){
            $scope.requestToPayDetail.data = tmp;
            urlState = (tmp.requesterIdType === 'BILLERID') ? kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE : kkconst.ROUNTING.FUNDTRANSFER.STATE;
            $scope.isAnyID = checkIsAnyID(tmp.receiverIdType);
            $scope.anyIDIconClass = getAnyIDIcon(tmp.receiverIdType);
        }
    };

    $scope.isAnyID = false;
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
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_LIST.STATE);
    };

    initData();
})