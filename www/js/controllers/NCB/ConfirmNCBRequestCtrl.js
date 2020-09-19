angular.module('ctrl.confirmNCBRequest', [])
.controller('ConfirmNCBRequestCtrl', function($scope, cordovadevice, dateService, kkconst, generalValueDateService, $interval, $ionicModal, $ionicPlatform, mainSession, popupService, ribNCBService) {
    $scope.customerCache = ribNCBService.getCache()
    $scope.modal
    $scope.form = {
        bureauNote: ''
    }
    $scope.lang = mainSession.lang

    $scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
    
    dateService.today().then(function (res) {
        $scope.today = {
            date: res.date,
            monthLabel: generalValueDateService.monthsArray[res.month],
            year: res.year
        }
    })

    $ionicModal.fromTemplateUrl('templates/NCB/ncbSlip.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeReceiptModal = function () {
        $scope.modal.hide();
        $scope.gotoNDIDAuthenPage();
    };
		
    $scope.NCBSlip = function() {
        ribNCBService.confirmNCB(ribNCBService.getCache().transactionId, $scope.form.bureauNote)
            .then(function(result){
                $scope.response = result
                $scope.modal.show();
                setTimeout(function(){ saveImage(); }, 1000);
            }, function(errorResult){
                $scope.response = errorResult.errorValue
                $scope.response.errorMessage = errorResult.responseStatus.errorMessage,
                $scope.modal.show();
                setTimeout(function(){ saveImage(); }, 1000);
            });
    }
    

    function saveImage() {
        $ionicPlatform.ready(function () {
            var permissions = window.cordova.plugins.permissions;
            permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                if (status.hasPermission) {
                    callSaveImgPlugin();
                }
                else {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                        if (status.hasPermission) {
                            callSaveImgPlugin();
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail');
                            $scope.closeReceiptModal();
                        }
                    }, null);
                }
            });

        });
    }

    function callSaveImgPlugin() {
        $scope.getReceipt(function (data) {
            var fileName = getReceiptGenerateFile(new Date());
            var params = {data: data, prefix: fileName, format: 'JPG', quality: 80};
            if (cordovadevice.properties('platform') !== 'preview') {
                window.imageSaver.saveBase64Image(params, function (filePath) {
                        $scope.recieptImgUrl = data;
                        screenShotSaveCallback(null);
                    },
                    function (msg) {
                        screenShotSaveCallback(msg);
                    });
            }
        });
    }

    $scope.getReceipt = function (callback) {
        if (cordovadevice.properties('platform') !== 'preview') {
            stop = $interval(function () {
                navigator.screenshot.URI(function (error, res) {
                    callback(res.URI);
                    $interval.cancel(stop);
                    stop = undefined;
                }, 'jpg', 50);
            }, 1200);
        }
    };

    $scope.shareReceipt = function () {
        var shareImg = $scope.recieptImgUrl;
        window.plugins.socialsharing.share(null, null, shareImg, null);
    };

    var screenShotSaveCallback = function (error) {
        if (!error) {
            var content = $scope.response.errorMessage ? 
                {
                    header: 'label.warning',
                    text: $scope.response.errorMessage
                } : {
                    header: 'label.screenShotSuccessMsg',
                    text: ''
                }
            popupService.errorPopMsgCB(content.header, content.text, function (resultObj) {
                if ($scope.response.errorMessage) {
                    $scope.modal.hide();
                    $scope.gotoNCBPage();
                } else if (resultObj) {
                    $scope.closeReceiptModal();
                }
            });
        }
    };

    function getReceiptGenerateFile(dateFormat) {
        var yyyy = dateFormat.getFullYear();
        var mm = dateFormat.getMonth() + 1; // getMonth() is zero-based
        var dd = dateFormat.getDate();
        var receiptFormat = 'KK_TXT_' + String(10000 * yyyy + 100 * mm + dd) + '_' + Math.floor((Math.random() * 100000) + 1);
        return receiptFormat; // Leading zeros for mm and dd
    };
})