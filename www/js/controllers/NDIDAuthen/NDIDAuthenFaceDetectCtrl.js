angular.module('ctrl.ndidAuthenFaceDetect', [])
.controller('NDIDAuthenFaceDetectCtrl', function($scope, ndidAuthenService, popupService, kkconst, $state, $timeout, mainSession) {

    $scope.errorMessage = '';
    $scope.canRetry = null;
    
    $scope.init = function(){
        $scope.openFaceLivenessDetection();
    };

    $scope.openFaceLivenessDetection = function(){
        cordova.plugins.RibFaceRecog.openCamera(function(result){
            var msg = result.message;
            if (msg == "cancelled"){
                $state.go(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE);
            } else {
                $scope.errorMessage = '';
                $scope.canRetry = null;
                verifyFaceRecog(msg);
            }
        }, function(error){
            console.log(JSON.stringify(error));
        }, mainSession.lang);
    };

    $scope.onClickBack = function(){
        $state.go(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE);
    };

    function verifyFaceRecog(faceImg){
        ndidAuthenService.verifyFaceRecog(faceImg).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                var value = result.value;
                submitRequest(value.prepareSubmitTransactionId);
            } else {
                setFacerecogRetry(result.responseStatus);
                // popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
            }
        });
    }

    var submitRequest = function(prepareSubmitTransactionId){
        ndidAuthenService.submitRequest(prepareSubmitTransactionId).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                popupService.showErrorPopupMessage('label.sent','label.authenHasSent');
            }else {
                popupService.showErrorPopupMessage('title.fail',result.responseStatus.errorMessage);
            }

            $scope.gotoNDIDAuthenPage();
        });
    };

    var setFacerecogRetry = function(resp) {
        var canRetry = null;
        switch (resp.responseCode) {
            case kkconst.FACE_RECOG_ERROR.CANRETRY:
                canRetry = true;
                break;
            case kkconst.FACE_RECOG_ERROR.CANNOTRETRY:
                canRetry = false;
        }
         
        $scope.canRetry = canRetry;
        $scope.errorMessage = resp.errorMessage;
    };
});