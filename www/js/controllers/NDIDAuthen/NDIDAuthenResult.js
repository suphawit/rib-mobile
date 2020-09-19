angular.module('ctrl.ndidAuthenResult', [])
.controller('NDIDAuthenResultCtrl', function($scope, ndidAuthenService, popupService, kkconst, $state, $ionicHistory) {

    $scope.authenResult = {};

    $scope.init = function(){
        _tmpCache = ndidAuthenService.getCache();
        setAuthenResult();
    };

    $scope.submitRequest = function(){
        var obj = {
            params: {
                prepareSubmitTransactionId: _tmpCache.prepareSubmitTransactionId
            },
            actionCode: 'SUBMIT_REQUEST'
        };
        ndidAuthenService.invokeService(obj).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                popupService.showErrorPopupMessage('label.sent','label.authenHasSent');
                ndidAuthenService.setCache(null);

                $scope.gotoNDIDAuthenPage();
            }else {
                popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
            }

        });
    };

    $scope.onClickBack = function(){
        $state.go(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE);
    };

    var _tmpCache = {};

    function setAuthenResult(){
        var tmpArr = _tmpCache.verifyResponseList;
        
        $scope.authenResult = {
            transactionDate: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
            countAccept: 0,
            countReject: 0
        };

        for(var i = 0; i < tmpArr.length; i++){
            if(tmpArr[i].requestResult === 'accept') {
                $scope.authenResult.countAccept++;
            } else {
                $scope.authenResult.countReject++;
            }
        }
        
    }

});