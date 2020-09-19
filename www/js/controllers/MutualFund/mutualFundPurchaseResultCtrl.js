angular.module('ctrl.mutualFundPurchaseResult', [])
    .controller('mutualFundPurchaseResultCtrl', function ($scope, mutualFundService, popupService, displayUIService, $ionicModal, kkconst, $state, cordovadevice, $interval, $ionicPlatform) {
        $scope.fundResultInfo = {};
        $scope.fundConfirmInfoFundList = {};
        $scope.effectiveDate = {};
        $scope.orderDate = {};
        $scope.recieptImgUrl = null;
        $scope.recieptCanvas = null;
        $scope.isWaitToSaveSlip = true;
        var CONSTANT_RECEIPT_MUTUALFUND_MODAL = 'templates/MutualFund/Purchase/mutualFundPurchaseReceipt.html';

        function createFundRecieptModal() {
            $ionicModal.fromTemplateUrl(CONSTANT_RECEIPT_MUTUALFUND_MODAL, {
                scope: $scope,
                animation: $scope.modalAnimate
            }).then(function (modal) {
                $scope.recieptModal = modal;
            });
        }

        function init() {
            createFundRecieptModal();
            $scope.fundResultInfo = mutualFundService.getConfirmResultMutualFund();
            $scope.fundConfirmInfoFundList = mutualFundService.getConfirmMutualFund();
            $scope.effectiveDate = ($scope.fundResultInfo.fundConnectStatusCode === 'SC') ? displayUIService.convertDateNoTimeForUI($scope.fundResultInfo.confirmOrderDetail.effectiveDate) : null;
            $scope.orderDate = displayUIService.convertDateTimeForTxnDateNoSecUI($scope.fundResultInfo.orderDate);
            autoPrintSlip();
        }

        function autoPrintSlip() {
            angular.element(document).ready(function () {
                setTimeout(function () {
                    //TODO fix save without show modal in another release
                    // var node = document.getElementById('slip');
                    // domtoimage.toCanvas(node).then(function (canvas) {
                    //     canvas.id = "recieptCanvas";
                    //     canvas.style.width = "100%";
                    //     $scope.recieptCanvas = canvas;
                    //     $scope.recieptImgUrl = canvas.toDataURL();
                    //     console.log($scope.recieptCanvas)
                    //     saveImage();
                    // }).catch(function (error) {
                    //     //use save screen
                    //     console.log(error)
                    //     $scope.showReceiptPage();
                    // });
                    $scope.showReceiptPage();
                }, 1000);
            });
        }

        $scope.showReceiptPage = function () {
            $scope.recieptModal.show();
        };

        $scope.closeReceiptModal = function () {
            $scope.recieptModal.hide();
        };

        $scope.$on('modal.shown', function () {
            saveImage();
        });

        function getReceiptGenerateFile(dateFormat) {
            var yyyy = dateFormat.getFullYear();
            var mm = dateFormat.getMonth() + 1;
            var dd = dateFormat.getDate();
            return 'KK_TXT_' + String(10000 * yyyy + 100 * mm + dd) + '_' + Math.floor((Math.random() * 100000) + 1);
        }

        var stop;

        function screenShotSaveCallback(error) {
            if (!error) {
                popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (resultObj) {
                    if (resultObj) {
                        $scope.closeReceiptModal();
                    }
                });
            } else {
                $scope.closeReceiptModal();
            }
            $scope.isWaitToSaveSlip = false;
        };

        $scope.checkIsSameDate = function () {
            var orderDate = new Date($scope.fundResultInfo.orderDate.split(" ")[0]);
            var effectiveDate = new Date($scope.fundResultInfo.confirmOrderDetail.effectiveDate);
            return (orderDate < effectiveDate);
        }

        function saveImage() {
            $ionicPlatform.ready(function () {
                var permissions = window.cordova.plugins.permissions;
                permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                    if (status.hasPermission) {
                        callSaveImgPlugin();
                    } else {
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

        function callSaveImgPlugin() {
            if ($scope.recieptCanvas) {
                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function (msg) {
                        popupService.showErrorPopupMessage('label.success', 'label.saveImgSuccess');
                    },
                    function (err) {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail');
                    },
                    $scope.recieptCanvas
                );
                $scope.isWaitToSaveSlip = false;
            } else {
                //save screen
                $scope.getReceipt(function (data) {
                    var fileName = getReceiptGenerateFile(new Date());
                    var params = {data: data, prefix: fileName, format: 'JPG', quality: 80};
                    if (cordovadevice.properties('platform') !== 'preview') {
                        window.imageSaver.saveBase64Image(params, function (filePath) {
                                // $scope.recieptImgUrl = filePath;
                                $scope.recieptImgUrl = data;

                                screenShotSaveCallback(null);
                            },
                            function (msg) {
                                screenShotSaveCallback(msg);
                            });
                    }
                });
            }
        }

        init();

    })
;
