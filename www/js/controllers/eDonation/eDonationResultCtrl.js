angular.module('ctrl.eDonationResultCtrl', ['monospaced.qrcode'])
    .controller('eDonationResultCtrl', function ($scope, kkconst, $ionicHistory, $ionicListDelegate, $interval, $ionicModal, $state, popupService, mainSession, cordovadevice, displayUIService, dateService, billPaymentRTPService, notificationService, requestToPayInComingService, $translate, eDonationService, $ionicPlatform) {
        $scope.isExistingBiller = true;

        $scope.showReceiptPage = function () {
            $scope.receiptEDonationModal.show();
        };

        $scope.closeReceiptModal = function () {
            $scope.receiptEDonationModal.hide();
        };

        $scope.$on('modal.shown', function () {
            saveImage();
        });

        $scope.defaultBillerLogo = kkconst.DEFAULT_E_DONATION_ICON;
        var userCardType = kkconst.E_DONATION_CITIZEN; // 'I'; // I = citizen or P = passport
        $scope.recieptCanvas = null;
        $scope.recieptImgUrl;
        $scope.isWaitToSaveSlip = true;

        createEDonationReceiptModal();
        viewInit();

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

        function viewInit() {
            var dataBillConfirmOTP = billPaymentRTPService.getDataBillpaymentConfirmOTP();
            console.log('dataBillConfirmOTP', dataBillConfirmOTP);
            var dataBillConfirmComplete = billPaymentRTPService.getDataBillpaymentConfirmComplete();
            console.log('dataBillConfirmComplete', dataBillConfirmComplete);

            getUserCardType();

            $scope.showDataConfirmComplete = {
                canPrintSlip: dataBillConfirmComplete.canPrintSlip,
                submitStatusDesc: dataBillConfirmComplete.submitStatusDesc,
                accountAliasName: dataBillConfirmOTP.account.myAccountAliasName,
                fromAccountName: dataBillConfirmOTP.account.myAccountName,
                fromBankName: dataBillConfirmOTP.account.bankName,
                fromAccountNumber: dataBillConfirmOTP.account.myAccountNumber,
                fromAccountNumberMark: dataBillConfirmComplete.accountFromNoMarking,
                availableBalance: dataBillConfirmComplete.availableBalance,
                payAmount: dataBillConfirmComplete.payAmount,
                billerAliasName: dataBillConfirmOTP.biller.aliasName,
                billerName: displayBillerName(dataBillConfirmComplete),
                referenceNo: dataBillConfirmComplete.referenceNo,
                txnDate: displayUIService.convertDateTimeForTxnDateNoSecUI(dataBillConfirmComplete.transactionDate),
                txnDateReciept: displayUIService.convertDateTimeForTxnDateNoSecUI(dataBillConfirmComplete.transactionDate),
                paymentDate: displayUIService.convertDateNoTimeForUI(dataBillConfirmComplete.paymentDate),
                feeAmount: dataBillConfirmComplete.feeAmount,
                refInfos: dataBillConfirmOTP.biller.refInfos,
                paymentStatus: dataBillConfirmComplete.paymentStatus,
                paymentStatusDesc: dataBillConfirmComplete.paymentStatusDesc,
                billpaymentStatusDesc: dataBillConfirmComplete.billpaymentStatusDesc,
                paymentStatusDisPlay: dataBillConfirmComplete.paymentStatus === '1' ?
                    dataBillConfirmComplete.paymentStatusDesc + ' - ' + dataBillConfirmComplete.billpaymentStatusDesc : dataBillConfirmComplete.paymentStatusDesc,
                recurringType: dataBillConfirmComplete.recurringType,
                scheduleType: dataBillConfirmComplete.scheduleType,
                recurringTimes: dataBillConfirmComplete.recurringTimes,
                noteMemo: dataBillConfirmComplete.memo,
                rtpReferenceNo: dataBillConfirmOTP.rtpReferenceNo,
                logoCompany: dataBillConfirmOTP.biller.logoCompany,
                resultVerifyBill: {
                    refInfos : dataBillConfirmOTP.resultVerifyBill.refInfos,
                },
                transactionRef: dataBillConfirmComplete.transactionRef,
                qrData: dataBillConfirmComplete.qrData
            };

            if (dataBillConfirmComplete.existingBillerInfo === 'N') {
                $scope.isExistingBiller = false;
            }

            if(dataBillConfirmComplete.existingBillerInfo === null || dataBillConfirmComplete.existingBillerInfo === 'Y'){
                $scope.isExistingBiller = true;
            }

            var history = $ionicHistory.viewHistory();

            if(dataBillConfirmComplete.canPrintSlip && !history.forwardView) {
                autoPrintSlip();
            }

            for( var i = 0; i < $scope.showDataConfirmComplete.refInfos.length ; i++){
                if(i > 1) {
                    $scope.showDataConfirmComplete.refInfos[i].isHideRef = true;
                }
            }
        }

        $scope.displayRefName = function (index) {
            var billRef = $scope.showDataConfirmComplete.refInfos[index];
            if (index == 1) {
                // ref 2 = card type
                return window.translationsLabel[$translate.use()]['label.history.edonation.ref2'];
            }
            return (mainSession.lang === 'en') ? billRef.textEn : billRef.textTh;
        };

        $scope.displayRefValue = function (index) {
            return $scope.showDataConfirmComplete.resultVerifyBill.refInfos[index].value ||
                $scope.showDataConfirmComplete.refInfos[index].value;
        };

        function displayBillerName(biller) {
            return (mainSession.lang === 'en') ? biller.billerNameEn : biller.billerNameTh;
        }

        function createEDonationReceiptModal() {
            var templateURL = 'templates/eDonation/eDonationReceiptModal.html';
            $ionicModal.fromTemplateUrl(templateURL, {
                scope: $scope,
                animation: 'slide-in-up',
            }).then(function (modal) {
                $scope.receiptEDonationModal = modal;
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

        function getReceipt() {
            if (cordovadevice.properties('platform') !== 'preview') {
                stop = $interval(function () {
                    var fileName = getReceiptGenerateFile(new Date());
                    navigator.screenshot.save(function (error, res) {
                        $interval.cancel(stop);
                        stop = undefined;
                        if (!error) {
                            popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (ok) {
                                if (ok) {
                                    $scope.closeReceiptModal();
                                }
                            });
                        }
                    }, 'jpg', 50, fileName);
                }, 1200);
            }
        }

        function addNewBillerCallback(ok) {
            if (ok) {
                gotoAddBiller();
            } else {
                $ionicListDelegate.closeOptionButtons();
            }
        }

        $scope.addNewBiller = function () {
            popupService.showConfirmPopupMessageCallback('label.addBiller', 'label.addbillerpopupmsg', function (ok) {
                addNewBillerCallback(ok);
            });
        };

        function gotoAddBiller() {
            var dataForAddBillAfterPay = billPaymentRTPService.getDataBillpaymentConfirmOTP();
            if (dataForAddBillAfterPay.biller.categoryId === undefined) {
                inquiryPayInfo(dataForAddBillAfterPay);
            } else {
                $ionicHistory.clearCache().then(function () {
                    $state.go(kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.STATE);
                });
            }
        }

        function inquiryPayInfo(dataForAddBillAfterPay) {
            var billerData = dataForAddBillAfterPay.biller;

            var param = {};
            param.promptPayBillerId = billerData.promptPayBillerId;
            billerData.refInfos.forEach(function (element) {
                if (element.no == "1" && (element.value && element.value != "" && element.value != null)) {
                    param.billReference1 = element.value;
                }
                if (element.no == "2" && (element.value && element.value != "" && element.value != null)) {
                    param.billReference2 = element.value;
                }
                if (element.no == "3" && (element.value && element.value != "" && element.value != null)) {
                    param.billReference3 = element.value;
                }
            });
            requestToPayInComingService.inquiryPayInfo(param,
                function (response) {
                    var respStatus = response.result.responseStatus;
                    if (respStatus.responseCode === kkconst.success) {
                        var PayInfo = response.result.value;
                        var newBillPayInfoData = {};
                        newBillPayInfoData.aliasName = PayInfo.aliasName;
                        newBillPayInfoData.billerId = PayInfo.billerId;
                        newBillPayInfoData.billerProfileId = PayInfo.billerProfileId;
                        newBillPayInfoData.categoryEn = PayInfo.categoryEn;
                        newBillPayInfoData.categoryId = PayInfo.categoryId;
                        newBillPayInfoData.categoryTh = PayInfo.categoryTh;
                        newBillPayInfoData.companyCode = PayInfo.companyCode;
                        newBillPayInfoData.companyEn = PayInfo.companyEn;
                        newBillPayInfoData.companyTh = PayInfo.companyTh;
                        newBillPayInfoData.logoCompany = PayInfo.logoCompany;
                        newBillPayInfoData.profileCode = PayInfo.profileCode;
                        newBillPayInfoData.promptPayBillerId = PayInfo.promptPayBillerId;
                        newBillPayInfoData.subServiceEn = PayInfo.subServiceEn;
                        newBillPayInfoData.subServiceTh = PayInfo.subServiceTh;
                        newBillPayInfoData.isFavourite = PayInfo.isFavourite;
                        newBillPayInfoData.billerNameEn = PayInfo.billerNameEn;
                        newBillPayInfoData.billerNameTh = PayInfo.billerNameTh;

                        newBillPayInfoData.refInfos = billerData.refInfos;


                        dataForAddBillAfterPay.biller = newBillPayInfoData;
                        billPaymentRTPService.setDataBillpaymentConfirmOTP(dataForAddBillAfterPay);

                        $ionicHistory.clearCache().then(function () {
                            $state.go(kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.STATE);
                        });
                    } else {
                        popupService.showErrorPopupMessage('label.warning', respStatus.errorMessage);
                    }
                }
            );
        }

        function getUserCardType() {
            eDonationService.getCustomerType(function(responseStatus,resultObj){
                if(responseStatus.responseCode === kkconst.success){
                    userCardType = resultObj;
                }
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

        var screenShotSaveCallback = function (error) {
            if (!error) {
                popupService.errorPopMsgCB('label.screenShotSuccessMsg', '', function (resultObj) {
                    if (resultObj) {
                        $scope.closeReceiptModal();
                    }
                });
            }
            $scope.isWaitToSaveSlip = false;
        };

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

        $scope.isCitizenType = function () {
            return userCardType ===  kkconst.E_DONATION_CITIZEN;
        };

        $scope.getLabel = function (label) {
            return window.translationsLabel[$translate.use()][label];
        }
    });
