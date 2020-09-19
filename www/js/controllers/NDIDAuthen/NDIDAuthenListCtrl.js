angular.module('ctrl.ndidAuthenlist', [])
.controller('NDIDAuthenListCtrl', function($scope, ndidAuthenService, popupService, kkconst, $state, $ionicModal, $translate, mainSession, historyNDIDAuthenService) {
    $scope.listAuthenRequest = [];
    $scope.firstLoad = false;
    
    $scope.style = {
        checkMark: function(value){
            return (value == 'accept' ? 'themeDarkBlueBGColor whiteTextColor': (value == 'reject' ? 'color-bg-red-01 whiteTextColor' : 'color_000 whiteTextColor'));
        },
        iconCheck: function(value){
            return value == 'reject' ? 'ion-close': 'ion-checkmark';
        }
    };

    $scope.event = {
        isDisableBtn: true,
        gotoDetail: function(index, event){
            $scope.modal.data = event;

            historyNDIDAuthenService.inquiryRequestMessage(event.requestId, function(result){
                var requestorName = mainSession.lang == 'en' ? event.requestorNameEn : event.requestorNameTh;
                var requestDescription = mainSession.lang == 'en' ? event.requestDescriptionEn : event.requestDescriptionTh;
                var resultValue = result.value;
                if(event.requestSupport == true){
                    _selectedIndex = index;
                    $scope.modal.template = {
                        id: 'label.authenConfirmMsg',
                        value: { refCode: event.refCode, requestMessage: resultValue.requestMessage, requestorName: requestorName }
                    };
                } else {
                    $scope.modal.template = {
                        id: 'label.authenErrorMsg',
                        value: { refCode: event.refCode, requestMessage: resultValue.requestMessage, requestorName: requestorName, requestDescription: requestDescription }
                    };
                }
    
                $scope.authenConfirmModal.show();
            });
            
        },
        goNextPage: function(){
            prepareSubmitRequest();
        }
    };

    $scope.modal = {
        closeConfirmModal: function() {
            $scope.authenConfirmModal.hide();
        },
        onClickConfirm: function(value) {
            $scope.event.isDisableBtn = false;
            $scope.listAuthenRequest[_selectedIndex].requestResult = value;
            $scope.authenConfirmModal.hide();
        },
        init: function(){
            $ionicModal.fromTemplateUrl('templates/NDIDAuthen/authen-confirm-modal.html', {
                scope: $scope,
                animation: $scope.modalAnimate
            }).then(function(modal) {
                $scope.authenConfirmModal = modal;
            });
        },
        template: {
            id: '',
            value: {}
        },
        data: {}
    };

    $scope.init = function(){
        $scope.inquiryRequestListByCifNo();

        $scope.modal.init();
    };

    var _selectedIndex = 0;

    $scope.inquiryRequestListByCifNo = function(){
        var obj = {
            params: {},
            actionCode: 'INQUIRY_REQUEST_LIST'
        };

        ndidAuthenService.invokeService(obj).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                $scope.listAuthenRequest = result.value.requestList;
                initPrepareSubmitRequest();
            }else {
                popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
                $scope.firstLoad = true;
            }

        });
    }

    function prepareSubmitRequest(){
        ndidAuthenService.prepareSubmitRequest($scope.listAuthenRequest, kkconst.NDID_TRANSACTION_TYPE.RIBMOBILE_LOGINPIN_PIN).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                var value = result.value;
                if(value.prepareSubmitTransactionType == kkconst.NDID_TRANSACTION_TYPE.RIBMOBILE_LOGINPIN) {
                    submitRequest(value.prepareSubmitTransactionId);
                } else {
                    $state.go(kkconst.ROUNTING.CONFIRM_AUTHEN_NDID.STATE);
                }
                
            }else {
                popupService.showErrorPopupMessage('alert.title',result.responseStatus.errorMessage);
            }

        });
    }
    
    function initPrepareSubmitRequest() {
        var tmpArr = $scope.listAuthenRequest || [];

        for(var i = 0; i < tmpArr.length; i++){
            $scope.listAuthenRequest[i].requestResult = "";
            var tmpDatetime = $scope.listAuthenRequest[i].requestDateTime;
            $scope.listAuthenRequest[i].requestDateTime = $translate.instant('label.datetime', {date: moment(tmpDatetime).format('DD/MM/YYYY'), time: moment(tmpDatetime).lang($translate.use()).format('LT')});
        }

        $scope.firstLoad = tmpArr.length == 0;
    }

    var submitRequest = function(prepareSubmitTransactionId){
        ndidAuthenService.submitRequest(prepareSubmitTransactionId).then(function(result){
            if(result.responseStatus.responseCode === kkconst.success) {
                popupService.showErrorPopupMessage('label.sent','label.authenHasSent');
            }else {
                popupService.showErrorPopupMessage('title.fail',result.responseStatus.errorMessage);
            }

            $scope.inquiryRequestListByCifNo();
        });
    };
});