angular.module('ctrl.historyRequestToPayCtrl', [])
.controller('HistoryFuntransferCtrl', function($scope, $state, popupService, invokeService, displayUIService, historyFundtransfertService, kkconst, $ionicScrollDelegate) {

	$scope.ft_history_list = [];
	$scope.isShowData = false;
	$scope.isNotShowData = false;
	var selectedCriteriaItem = '';

	$scope.getHistoryFundtranfer = function(month) {
		historyFundtransfertService.inquiryHistoryFundtransfer(month, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				if(resultObj.value != null && resultObj.value != '' && resultObj.value != 'undefined') {
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.ft_history_list = historyFundtransfertService.setTime(resultObj.value);
				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.ft_history_list = null;
					$scope.isNotConnectService = true;
				}
				$ionicScrollDelegate.scrollTop();
			} else {
				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = false;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});
	};

	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
		selectedCriteriaItem = $scope.selectedItem.value;
		$scope.getHistoryFundtranfer(selectedCriteriaItem);
	});

	$scope.changeMonth = function(selectedMonth) {
		if(selectedCriteriaItem != selectedMonth) {
			$scope.getHistoryFundtranfer(selectedMonth);
		}
	};

    $scope.openDetail = function (transaction) {
        console.log(transaction)
        historyFundtransfertService.setCurrentFundTransferDetail(transaction);
        $state.go(kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL.STATE);
    };

})
.controller('HistoryBillpaymentCtrl', function($scope, $state, popupService, invokeService, displayUIService, historyBillpaymentService, kkconst, $ionicScrollDelegate, cordovadevice) {

	$scope.bp_history_list = [];
	$scope.isShowData = false;
	$scope.isNotShowData = false;
	var selectedCriteriaItem = '';

	$scope.getHistoryBillpayment = function(month) {

		historyBillpaymentService.inquiryHistoryBillpayment(month, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				if(resultObj.value != null && resultObj.value != '' && resultObj.value.historys != null && resultObj.value.historys.totalItem > 0 && resultObj.value != 'undefined') {
					var valueItems = resultObj.value.historys.items;
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.bp_history_list = historyBillpaymentService.setTime(valueItems);

				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.bp_history_list = null;
					$scope.isNotConnectService = true;
				}
				$ionicScrollDelegate.scrollTop();
			} else {
				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = false;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});
	};

	$scope.openDetail = function(transaction) {
        historyBillpaymentService.setCurrentBillPaymentDetail(transaction);
        if(transaction.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            $state.go(kkconst.ROUNTING.TRANSACTION_HISTORY_E_DONATION_DETAIL.STATE);
        }else{
            $state.go(kkconst.ROUNTING.TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL.STATE);
		}
	};

	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
		selectedCriteriaItem = $scope.selectedItem.value;
		$scope.getHistoryBillpayment(selectedCriteriaItem);
	});

	$scope.changeMonth = function(selectedMonth) {
			if(selectedCriteriaItem != selectedMonth) {
				$scope.getHistoryBillpayment(selectedMonth);
			}
	};
})
    .controller('HistoryBillPaymentDetailCtrl', function ($scope, $state, kkconst, historyBillpaymentService, $ionicHistory, $ionicModal, cordovadevice, eDonationService, $interval, popupService, $translate, QRScannerService, $ionicPlatform, mainSession) {

        $scope.showDataConfirmComplete = historyBillpaymentService.getCurrentBillPaymentDetail();
        var userCardType = kkconst.E_DONATION_CITIZEN; // 'I'; // I = citizen or P = passport
        $scope.qrData;
        $scope.recieptImgUrl = null;
        $scope.recieptCanvas = null;
        console.log($scope.showDataConfirmComplete);
        if($scope.showDataConfirmComplete.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            $scope.defaultBillerLogo = kkconst.DEFAULT_E_DONATION_ICON;
            getUserCardType();
        }else {
            $scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
        }

        $scope.goBackPage = function(){
            $ionicHistory.goBack(-1);
        };
        createBillPaymentRecieptModal();

        $scope.showReceiptPage = function (){
            if ($scope.showDataConfirmComplete.transactionRef && $scope.showDataConfirmComplete.canGenQrSlip) {
                QRScannerService.generatePaymentQRVerifySlipProcedure($scope.showDataConfirmComplete,function (resultCode, resultObj) {
                    $scope.qrData = resultObj.value;
                    $scope.recieptModal.show();
                });
            }else {
                $scope.recieptModal.show();
            }
        };

        $scope.closeReceiptModal = function () {
            $scope.recieptModal.hide();
        };

        $scope.$on('modal.shown', function () {
            saveImage();
        });

        $scope.isCitizenType = function () {
            return userCardType ===  kkconst.E_DONATION_CITIZEN;
        };

        function createBillPaymentRecieptModal() {
            var templateURL = '';
            if($scope.showDataConfirmComplete.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                templateURL = 'templates/HistoryRequestToPay/historyEDonationReceiptModal.html';
            }else {
                templateURL = 'templates/HistoryRequestToPay/historyBillPayReceiptModal.html';
			}
            $ionicModal.fromTemplateUrl(templateURL, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.recieptModal = modal;
            });
        }

        function getReceiptGenerateFile(dateFormat) {
            var yyyy = dateFormat.getFullYear();
            // getMonth() is zero-based
            var mm = dateFormat.getMonth() + 1;
            var dd = dateFormat.getDate();
            var receiptFormat = 'KK_TXT_' + String(10000 * yyyy + 100 * mm + dd) + '_' + Math.floor((Math.random() * 100000) + 1);
            // Leading zeros for mm and dd
            return receiptFormat;
        }

        var stop;

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
            } else {
                //save screen
                $scope.getReceipt(function (data) {
                    // if (data.img) {
                    //     $scope.recieptImgUrl = data.img;
                    // }
                    console.log(data)
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

        var screenShotSaveCallback = function (error) {
            if (!error) {
                popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (resultObj) {
                    if (resultObj) {
                        $scope.closeReceiptModal();
                    }
                });
            }else {
                $scope.closeReceiptModal();
            }
        };

        function getUserCardType() {
            eDonationService.getCustomerType(function(responseStatus,resultObj){
                if(responseStatus.responseCode === kkconst.success){
                    userCardType = resultObj;
                }
            });
        }

        $scope.getLabel = function (label) {
            return window.translationsLabel[$translate.use()][label];
        };

        $scope.shareReceipt = function () {
            var shareImg = $scope.recieptImgUrl;
            window.plugins.socialsharing.share(null, null, shareImg, null);
        };

        $scope.displayRefName = function (index) {
            var billRef = $scope.showDataConfirmComplete.refInfos[index];
            if (index == 1  && $scope.showDataConfirmComplete.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                // ref 2 = card type
                return window.translationsLabel[$translate.use()]['label.history.edonation.ref2'];
            }
            var label = (mainSession.lang === 'en') ? billRef.textEn : billRef.textTh;
            return (label) ? label : getDefaultLabel(index);
        };

        $scope.displayRefValue = function (index) {
            return $scope.showDataConfirmComplete.refInfos[index].value;
        };

        function getDefaultLabel(index) {
            switch (index) {
                case 0:
                    return window.translationsLabel[$translate.use()]['label.history.ref1'];
                    break;
                case 1:
                    return window.translationsLabel[$translate.use()]['label.history.ref2'];
                    break;
                case 2:
                    return window.translationsLabel[$translate.use()]['label.history.ref3'];
                    break;
            }
        }
    })
    .controller('HistoryFundTransferDetailCtrl', function ($scope, $state, kkconst, historyFundtransfertService, $ionicHistory, $ionicModal, cordovadevice, $interval, popupService, BankCodesImgService, QRScannerService, $ionicPlatform, anyIDService) {

        $scope.fundTransferRequest = historyFundtransfertService.getCurrentFundTransferDetail();
        $scope.getBankCodeImg =  BankCodesImgService.getBankCodeImg;
        $scope.clientImgUrl =  $scope.getBankCodeImg($scope.fundTransferRequest.bankCode, 'image');
        $scope.fromImgUrl =  $scope.getBankCodeImg($scope.fundTransferRequest.fromBankCode, 'image');
        $scope.qrData;
        $scope.recieptImgUrl = null;
        $scope.recieptCanvas = null;

        $scope.isAnyID = anyIDService.isAnyID($scope.fundTransferRequest.anyIDType);
        $scope.anyIDIcon	= anyIDService.getAnyIDinfo($scope.fundTransferRequest.anyIDType).icon;
        $scope.anyIDIconColor	= anyIDService.getAnyIDinfo($scope.fundTransferRequest.anyIDType).iconColor;

        $scope.goBackPage = function () {
            $ionicHistory.goBack(-1);
        };
        createFundTransferRecieptModal();

        $scope.showReceiptPage = function () {
            if ($scope.fundTransferRequest.transactionRef && $scope.fundTransferRequest.canGenQrSlip) {
                QRScannerService.generateTransferQRVerifySlipProcedure($scope.fundTransferRequest,function (resultCode, resultObj) {
                    $scope.qrData = resultObj.value;
                    $scope.recieptModal.show();
                });
            }else {
                $scope.recieptModal.show();
            }
        };

        $scope.closeReceiptModal = function () {
            $scope.recieptModal.hide();
        };

        $scope.$on('modal.shown', function () {
            saveImage();
        });


        function createFundTransferRecieptModal() {
            var templateURL = 'templates/HistoryRequestToPay/historyFundTransferReceiptModal.html';
            $ionicModal.fromTemplateUrl(templateURL, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.recieptModal = modal;
            });
        }

        function getReceiptGenerateFile(dateFormat) {
            var yyyy = dateFormat.getFullYear();
            // getMonth() is zero-based
            var mm = dateFormat.getMonth() + 1;
            var dd = dateFormat.getDate();
            var receiptFormat = 'KK_TXT_' + String(10000 * yyyy + 100 * mm + dd) + '_' + Math.floor((Math.random() * 100000) + 1);
            // Leading zeros for mm and dd
            return receiptFormat;
        }

        var stop;


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
            } else {
                //save screen
                $scope.getReceipt(function (data) {
                    // if (data.img) {
                    //     $scope.recieptImgUrl = data.img;
                    // }
                    console.log(data)
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

        var screenShotSaveCallback = function (error) {
            if (!error) {
                popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (resultObj) {
                    if (resultObj) {
                        $scope.closeReceiptModal();
                    }
                });
            }
        };

        $scope.shareReceipt = function () {
            var shareImg = $scope.recieptImgUrl;
            window.plugins.socialsharing.share(null, null, shareImg, null);
        };

    })
.controller('HistoryRTPCtrl', function($scope, $state, popupService, displayUIService, historyRTPService, kkconst, $ionicScrollDelegate) {
	$scope.rtp_history_list = {
		data: []
	};
	$scope.isShowData = false;
	$scope.isNotShowData = false;
	$scope.isNotConnectService = false;
	var selectedCriteriaItem = '';

	$scope.getHistoryRTP = function(month) {

		historyRTPService.inquiryHistoryRTP(month, function(resultObj) {

			if(resultObj.responseStatus.responseCode === kkconst.success) {

				if(resultObj.value.rtpInfoDetailList != null && resultObj.value.rtpInfoDetailList != '' && resultObj.value.rtpInfoDetailList != 'undefined') {
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.rtp_history_list = historyRTPService.setTime(resultObj.value.rtpInfoDetailList);

				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.rtp_history_list = null;
					$scope.isNotConnectService = true;

				}
				$ionicScrollDelegate.scrollTop();
			} else {

				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = true;
				$scope.rtp_history_list = null;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);

			}

		});

	};

	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
		selectedCriteriaItem = $scope.selectedItem.value;
		$scope.getHistoryRTP(selectedCriteriaItem);

	});

	$scope.changeMonth = function(selectedMonth) {

			if(selectedCriteriaItem != selectedMonth) {
				$scope.getHistoryRTP(selectedMonth);
			}
	};
})
.controller('HistoryNDIDAuthenCtrl', function($scope, $state, popupService, displayUIService, historyNDIDAuthenService, kkconst, $ionicScrollDelegate, mainSession) {

	$scope.ndidAuthenHistoryList = [];
	$scope.isShowData = false;
    $scope.isNotShowData = false;

    var formatISOPeriodTime = function(dt) {
        return dt+'-01T00:00:00.000Z';
    };

	$scope.getHistoryNDIDAuthen = function(month) {
        var requestDateTime = formatISOPeriodTime(month);
		historyNDIDAuthenService.inquiryHistory(requestDateTime, function(resultObj) {
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				if(resultObj.value != null && resultObj.value != '' && resultObj.value.requestHistoryList != null && resultObj.value.requestHistoryList.length > 0) {
					var valueItems = resultObj.value.requestHistoryList;
					$scope.isShowData = true;
					$scope.isNotShowData = false;
					$scope.isNotConnectService = true;
					$scope.ndidAuthenHistoryList = historyNDIDAuthenService.setTime(valueItems);

				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.ndidAuthenHistoryList = null;
					$scope.isNotConnectService = true;
				}
				$ionicScrollDelegate.scrollTop();
			} else {
				$scope.isNotShowData = true;
				$scope.isShowData = false;
				$scope.isNotConnectService = false;
				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});
	};

	$scope.openDetail = function(transaction) {
        console.log('transaction: ', transaction);
        historyNDIDAuthenService.inquiryRequestMessage(transaction.requestId, function(result){
            console.log('result: ', result);
            var resultValue = result.value;
            transaction.fullRequestMessage = resultValue.requestMessage;
            historyNDIDAuthenService.setCurrentDetail(transaction);
            $state.go(kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL.STATE);
        });
        
	};

	displayUIService.initLastSixMonthly(function(resultObj){
		$scope.criteriaMonthlyList = resultObj;
		$scope.selectedItem = resultObj[0];
        $scope.getHistoryNDIDAuthen($scope.selectedItem.value);
	});
    
    $scope.getRequestStatus = function(item) {
        return mainSession.lang == 'en' ? item.requestStatusEn: item.requestStatusTh;
    };

    $scope.getRequestorName = function(item) {
        return mainSession.lang == 'en' ? item.requestorNameEn: item.requestorNameTh;
    };
}).controller('HistoryNDIDAuthenDetailCtrl', function ($scope, historyNDIDAuthenService, $ionicHistory, mainSession) {
    $scope.transactionDetail = historyNDIDAuthenService.getCurrentDetail() || {};

    $scope.goBackPage = function () {
        $ionicHistory.goBack(-1);
    };

    $scope.getRequestStatus = function(item) {
        return mainSession.lang == 'en' ? item.requestStatusEn: item.requestStatusTh;
    };

    $scope.getRequestorName = function(item) {
        return mainSession.lang == 'en' ? item.requestorNameEn: item.requestorNameTh;
    };
});
