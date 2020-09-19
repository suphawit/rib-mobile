angular.module('ctrl.mutualFund', [])
    .controller('mutualFundCtrl',
        function ($scope,
            $state,
            displayUIService,
            $ionicScrollDelegate,
            $translate,
            $timeout,
            suitabilityScoreService,
            popupService,
            $ionicModal,
            kkconst,
            mutualFundService,
            $ionicListDelegate,
            $ionicPopup,
            $filter,
            $ionicHistory
        ) {

            'use strict';
            $scope.isOutstandingDataNotEmpty = false;
            $scope.isShowScreen = false;
            $scope.isShowOrder = false;
            $scope.isUnitHolderExist = false;
            var totalpages;
            var totalRows;
            var pageNumber;
            $scope.fundListSchedulePD = {};
            $scope.orderPendings = [];
            $scope.navDate = {};
            var resultSuit;
            var TERM_AND_COND_MUTUALFUND_MODAL = 'templates/MutualFund/MutualFund-termAndCond-modal.html';
            var SELECTED_BTN_BG_COLOR = 'selectedBtnBGColor';
            var UNSELECTED_BTN_BG_COLOR = 'unSelectedBtnBGColor';
            $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
            $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;

            function confirmValidate() {
                popupService.showConfirmPopupMessageCallback('label.suitabilityLisk', 'label.fundConnext.RiskExpiry', function (ok) {
                    if (ok) {
                        $state.go('app.suitabilityScore');
                    } else {
                        $ionicListDelegate.closeOptionButtons();
                    }
                });
            }

            function reformatDateString(s) {
                var b = s.split(/\D/);
                return b.reverse()
                    .join('-');
            }

            function checkExpireDate() {
                var todayDate = moment(new Date())
                    .format('YYYY-MM-DD');
                suitabilityScoreService
                    .inquirySuitabilityScore()
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            resultSuit = respStatus.value.currentCustSuitScoreData;
                            $scope.suitScoreResult = resultSuit;
                            if (resultSuit.suitExists === 'Y') {
                                if (todayDate >= reformatDateString(resultSuit.expiryDate)) {
                                    confirmValidate();
                                } else {
                                    $ionicScrollDelegate.scrollTop();
                                    $scope.termAndcondModalMutualFundPurchase.show();
                                    $scope.suitScoreResult = null;
                                }
                            } else if (resultSuit.suitExists === 'N') {
                                $scope.suitScoreResult = null;
                                confirmValidate();
                            } else {
                                $scope.suitScoreResult = null;
                            }
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, respStatus.responseStatus.errorMessage);
                            return false;
                        }

                    });
            }

            $scope.termsAndCondChecked = function () {

                $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
                $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;
                $scope.termAndcondModalMutualFundPurchase.hide();
                var page = mutualFundService.getNevigatePageMutualFund();
                $ionicHistory.clearCache()
                    .then(function () {
                        $timeout($state.go(page), 5000);
                    });
            };

            function getTermAndConditions() {

                mutualFundService
                    .getMutualFundTermsAndConditions($translate.use())
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            $scope.termAndCondTextMutualFund = respStatus.value;
                            console.log(' $scope.termAndCondTextMutualFund===', $scope.termAndCondTextMutualFund);
                        } else {
                            popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
                        }
                    });
            }

            $scope.navigateToMutualFundPurchase = function () {
                mutualFundService.setNevigatePageMutualFund('app.mutualFundPurchase');
                checkExpireDate();
            };

            $scope.navigateToMutualFundSwitch = function () {
                mutualFundService.setNevigatePageMutualFund('app.mutualFundSwitch');
                checkExpireDate();
            };

            $scope.navigateToMutualFundRedeem = function () {
                mutualFundService.setNevigatePageMutualFund('app.mutualFundRedeem');
                $ionicScrollDelegate.scrollTop();
                $scope.termAndcondModalMutualFundPurchase.show();

            };

            $scope.nevigateToMutualFundPortDetails = function (portDataDetail) {
                mutualFundService.setSelectMutualFundPortDetail(portDataDetail);
                $state.go('app.mutualFundDetails');
            };

            function createTermAndConditionModal() {
                getTermAndConditions();
                $ionicModal.fromTemplateUrl(TERM_AND_COND_MUTUALFUND_MODAL, {
                        scope: $scope,
                        animation: $scope.modalAnimate,
                        backdrop: 'static',
                        keyboard: false

                    })
                    .then(function (modal) {
                        $scope.termAndcondModalMutualFundPurchase = modal;

                    });
            }

            $scope.selectClose = function () {
                $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
                $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
                $scope.termAndcondModalMutualFundPurchase.hide();

            };

            $scope.cancelPending = function (record) {

                popupService.savedPopup = $ionicPopup.confirm({
                    title: '<i class="icon ion-alert-circled"> </i>' + popupService.convertTranslate('label.FundOrderCancelConfirms'),
                    cssClass: 'myPopupClass',
                    cancelText: $filter('translate')('button.cancel'),
                    okText: $filter('translate')('button.ok'),
                    template: popupService.convertTranslate('label.cancelFundOrder')
                });

                popupService.savedPopup.then(function (response) {

                    if (response) {

                        mutualFundService
                            .cancelOrderTransaction(record)
                            .then(function (resp) {
                                var respStatus = resp.result;
                                if (respStatus.responseStatus.responseCode === kkconst.success) {
                                    if (respStatus.value.cancelOrderSuccess === 'Y') {
                                        popupService.showErrorPopupMessage('title.success', 'label.mutualFund.cancel.success');
                                        // $ionicScrollDelegate.scrollTop();
                                        getTransactionTransaction();
                                    }
                                } else {
                                    $ionicListDelegate.closeOptionButtons();
                                    popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);

                                }
                            });
                    } else {
                    }
                });
            };

            function getTransactionTransaction() {
                pageNumber = 1;
                mutualFundService
                    .getTransactionTransactionPD(pageNumber)
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            $scope.orderPendings = respStatus.value.transactionHistoryList;
                            totalRows = respStatus.value.paging.totalRows;
                            totalpages = respStatus.value.paging.totalpages;
                            pageNumber = respStatus.value.paging.pageNumber + 1;
                            $scope.isNotShowData = (totalRows <= 0);
                            $scope.isShowOrder = true;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            return $scope.orderPendings;
                        } else {
                            popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);

                        }
                    });
            }

            $scope.poppulateList = function () {
                mutualFundService
                    .getTransactionTransactionPD(pageNumber)
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            $scope.orderPendings = $scope.orderPendings.concat(respStatus.value.transactionHistoryList);
                            pageNumber = respStatus.value.paging.pageNumber + 1;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
                        }

                    });
            };

            $scope.canWeloadMoreContent = function () {
                return (pageNumber <= totalpages && !$scope.isNotShowData);
            };

            function compare(a, b) {
                if (a.availableAmount > b.availableAmount) {
                    return -1;
                }
                if (a.availableAmount < b.availableAmount) {
                    return 1;
                }
                return 0;
            }

            function prepareMutualFundDetailSummaryPortFolio(resultObj) {

                var dataList = resultObj.value.dataList;
                if (dataList !== null && dataList.length > 0) {
                    //have data
                    $scope.mutualFundPortDetails = dataList;
                    $scope.mutualFundPortDetails.sort(compare);
                    $scope.navDate = displayUIService.convertDateNoTimeForUI($scope.mutualFundPortDetails[0].navDate);

                    $scope.principal = 0;
                    $scope.valueOfpl = 0;
                    $scope.dividend = 0;
                    $scope.sumProfitLoss = 0;
                    $scope.labelFundCode = [];
                    $scope.availableAmount = [];

                    for (var index = 0; index < $scope.mutualFundPortDetails.length; index++) {
                        $scope.valueOfpl += $scope.mutualFundPortDetails[index].availableAmount;
                        $scope.labelFundCode[index] = $scope.mutualFundPortDetails[index].fundCode;
                        $scope.availableAmount[index] = $scope.mutualFundPortDetails[index].availableAmount;
                        $scope.mutualFundPortDetails[index].profitAmount = (($scope.mutualFundPortDetails[index].navValue - $scope.mutualFundPortDetails[index].avarageCost) *
                            $scope.mutualFundPortDetails[index].availableUnitBal);
                        $scope.mutualFundPortDetails[index].isProfit = ($scope.mutualFundPortDetails[index].profitAmount >= 0);
                        $scope.sumProfitLoss += $scope.mutualFundPortDetails[index].profitAmount;
                    }

                    $timeout(function () {
                        createChartMyPortfolio($scope.availableAmount, $scope.labelFundCode);
                    }, 0);

                    $scope.isOutstandingDataNotEmpty = true;
                } else {
                    //not have data
                    $scope.isOutstandingDataNotEmpty = false;
                }
                $scope.isShowScreen = true;
            }

            function createChartMyPortfolio(valueOfPl, fundCode) {
                var ctx = $('#myChart2');

                var myChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [
                            {
                                data: valueOfPl,

                                borderWidth: 0
                            }
                        ],
                        labels: fundCode

                    },
                    options: {
                        legend: {
                            display: false
                        },
                        pieceLabel: {
                            render: 'percentage',
                            fontStyle: 'bold', // fontFamily: 'Quark-Light',
                            fontSize: 14
                        }
                    }
                });
                chartColors(myChart);
            }

            function chartColors(chart) {
                var gradient = {
                    0: [
                        89,
                        79,
                        116,
                        1
                    ],
                    20: [
                        135,
                        125,
                        161,
                        1
                    ],
                    45: [
                        192,
                        185,
                        203,
                        1
                    ],
                    65: [
                        140,
                        140,
                        140,
                        1
                    ],
                    100: [
                        255,
                        255,
                        255,
                        1
                    ]
                };

                //Get a sorted array of the gradient keys
                var gradientKeys = Object.keys(gradient);
                gradientKeys.sort(function (a, b) {
                    return +a - +b;
                });
                var datasets = chart.config.data.datasets[0];
                var setsCount = datasets.data.length;

                //Calculate colors
                var chartColors = [];
                for (var i = 0; i < setsCount; i++) {
                    var gradientIndex = (i + 1) * (100 / (setsCount + 1)); //Find where to get a color from the gradient
                    for (var j = 0; j < gradientKeys.length; j++) {
                        var gradientKey = gradientKeys[j];
                        if (gradientIndex === +gradientKey) { //Exact match with a gradient key - just get that color
                            chartColors[i] = 'rgba(' + gradient[gradientKey].toString() + ')';
                            break;
                        } else if (gradientIndex < +gradientKey) { //It's somewhere between this gradient key and the previous
                            var prevKey = gradientKeys[j - 1];
                            var gradientPartIndex = (gradientIndex - prevKey) / (gradientKey - prevKey); //Calculate where
                            var color = [];
                            for (var k = 0; k < 4; k++) { //Loop through Red, Green, Blue and Alpha and calculate the correct color and opacity
                                color[k] = gradient[prevKey][k] - ((gradient[prevKey][k] - gradient[gradientKey][k]) * gradientPartIndex);
                                if (k < 3) {
                                    color[k] = Math.round(color[k]);
                                }
                            }
                            chartColors[i] = 'rgba(' + color.toString() + ')';
                            break;
                        }
                    }
                }

                //Copy colors to the chart
                for (i = 0; i < setsCount; i++) {
                    if (!datasets.backgroundColor) {
                        datasets.backgroundColor = [];
                    }
                    datasets.backgroundColor[i] = chartColors[i];
                    var borderStyle = {'border-left-color': chartColors[i]};
                    $scope.mutualFundPortDetails[i].borderStyle = borderStyle;
                    if (!datasets.borderColor) {
                        datasets.borderColor = [];
                    }
                    datasets.borderColor[i] = 'rgba(255,255,255,1)';

                }

                //Update the chart to show the new colors
                chart.update();
            }

            function prepareInit() {
                mutualFundService.checkIsAcceptConsent(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        if (resultObj.value.isAcceptedConsent == 'Y') {
                            init();
                        } else {
                            geFundConsent();
                        }
                    } else {
                        popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                    }
                });
            }

            function init() {
                createTermAndConditionModal();
                checkIsUnitholderExist();
                getTransactionTransaction();
            }

            function geFundConsent() {
                mutualFundService.getFundConsent(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        $scope.consentData = resultObj.value.data;
                        $scope.isShowConsentData = true;
                    } else {
                        popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                    }
                });
            }

            $scope.gotoDashbord = function () {
                $state.go(kkconst.ROUNTING.MY_ACCOUNT.STATE);
            };

            $scope.acceptConsent = function () {
                mutualFundService.acceptConsent(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        $scope.isShowConsentData = false;
                        init();
                    } else {
                        popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                    }
                });
            };

            function checkIsUnitholderExist() {
                mutualFundService.verifyIsUnitHolderExist(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        $scope.isUnitHolderExist = (resultObj.value.isExistingUnitholder == 'Y');
                        if ($scope.isUnitHolderExist) {
                            inquiryOutstandingData();
                        } else {
                            $scope.isShowScreen = true;
                        }
                    } else {
                        popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                    }
                });
            }

            function inquiryOutstandingData() {
                mutualFundService.getPortfolio(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        prepareMutualFundDetailSummaryPortFolio(resultObj);
                    } else {
                        popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                    }
                });
            }

            prepareInit();
        }
    )

    .controller('mutualFundDetailCtrl',
        function ($scope,
            $translate,
            displayUIService,
            $state,
            mutualFundService,
            invokeService,
            $window,
            popupService,
            kkconst,
            $ionicHistory,
            suitabilityScoreService,
            $ionicModal,
            $ionicScrollDelegate
        ) {
            $scope.mfTranscationPortDetail = {};
            $scope.profitLost = {};
            var SELECTED_BTN_BG_COLOR = 'selectedBtnBGColor';
            var UNSELECTED_BTN_BG_COLOR = 'unSelectedBtnBGColor';
            $scope.isDisableFundFactSheetBtn = false;
            $scope.isPurchasable = false;
            $scope.pdf = null;

            function init() {
                createTermAndConditionModal();
                $scope.curlang = $translate.use()
                    .toLowerCase();
                $scope.mfTranscationPortDetail = mutualFundService.getSelectMutualFundPortDetail();
                $scope.isPurchasable = false;
                if ($scope.mfTranscationPortDetail.fundAllowance !== undefined) {
                    for (var i = 0; i < $scope.mfTranscationPortDetail.fundAllowance.length; i++) {
                        if ($scope.mfTranscationPortDetail.fundAllowance[i].isAllow === 'BU') {
                            $scope.isPurchasable = true;
                            break;
                        }
                    }
                }
                $scope.profitLost = (($scope.mfTranscationPortDetail.navValue - $scope.mfTranscationPortDetail.avarageCost) * $scope.mfTranscationPortDetail.availableUnitBal);
                $scope.navDate = displayUIService.convertDateNoTimeForUI($scope.mfTranscationPortDetail.navDate);
            }

            function getTermAndConditions() {

                mutualFundService
                    .getMutualFundTermsAndConditions($translate.use())
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            $scope.termAndCondTextMutualFund = respStatus.value;
                        } else {
                            popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
                        }
                    });
            }

            function createTermAndConditionModal() {
                getTermAndConditions();
                $ionicModal.fromTemplateUrl('templates/MutualFund/MutualFund-termAndCond-modal.html', {
                        scope: $scope,
                        animation: $scope.modalAnimate
                    })
                    .then(function (modal) {
                        $scope.termAndcondModalMutualFundPurchase = modal;
                    });

            }

            $scope.selectClose = function () {
                $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
                $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
                $scope.termAndcondModalMutualFundPurchase.hide();

            };

            $scope.backToMutualFund = function () {
                $state.go('app.mutualFund');
            };

            function checkExpireDate() {
                var todayDate = moment(new Date())
                    .format('YYYY-MM-DD');
                suitabilityScoreService
                    .inquirySuitabilityScore()
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            resultSuit = respStatus.value.currentCustSuitScoreData;
                            $scope.suitScoreResult = resultSuit;
                            if (resultSuit.suitExists === 'Y') {
                                if (todayDate >= reformatDateString(resultSuit.expiryDate)) {
                                    confirmValidate();
                                } else {
                                    $ionicScrollDelegate.scrollTop();
                                    $scope.termAndcondModalMutualFundPurchase.show();
                                    $scope.suitScoreResult = null;
                                }
                            } else if (resultSuit.suitExists === 'N') {
                                $scope.suitScoreResult = null;
                                confirmValidate();
                            } else {
                                $scope.suitScoreResult = null;
                            }
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, respStatus.responseStatus.errorMessage);
                            return false;
                        }

                    });
            }

            function confirmValidate() {
                popupService.showConfirmPopupMessageCallback('label.suitabilityLisk', 'label.fundConnext.RiskExpiry', function (ok) {
                    if (ok) {
                        $state.go('app.suitabilityScore');
                    } else {
                        $ionicListDelegate.closeOptionButtons();
                    }
                });
            }

            function reformatDateString(s) {
                var b = s.split(/\D/);
                return b.reverse()
                    .join('-');
            }

            $scope.nevigateMutualFundPuechase = function () {
                checkExpireDate();
            };

            $scope.termsAndCondChecked = function () {
                $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
                $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;
                $scope.termAndcondModalMutualFundPurchase.hide();
                mutualFundService.getPortMutualFundList('BU')
                    .then(function (resp) {
                        var respStatus = resp.result.responseStatus;
                        if (respStatus.responseCode === kkconst.success) {
                            var fundsData = resp.result.value.fundData;
                            //fix for ios 8-9
                            // fundsData = fundsData.filter((fundData) => fundData.fundId ===  $scope.mfTranscationPortDetail.fundId)[0];
                            // mutualFundService.setConfirmMutualFund(angular.extend($scope.mfTranscationPortDetail, fundsData));
                            var fund;
                            for (var i in fundsData) {
                                if (fundsData[i].fundId === $scope.mfTranscationPortDetail.fundId) {
                                    fund = fundsData[i];
                                    break;
                                }
                            }
                            mutualFundService.setConfirmMutualFund(angular.extend($scope.mfTranscationPortDetail, fund));
                            $ionicHistory.clearCache()
                                .then(function () {
                                    $state.go('app.mutualFundPurchase');
                                });
                        } else {
                            popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
                        }
                    });
            };

            $scope.navigateFundFactSheet = function () {
                $scope.isDisableFundFactSheetBtn = true;
                mutualFundService.openFundFactSheet($scope.mfTranscationPortDetail.fundCode, $scope.mfTranscationPortDetail.fundFacsheetCode, function () {
                    $scope.isDisableFundFactSheetBtn = false;
                }, function (result) {
                    var errMsg = result.responseJSON.result.responseStatus.errorMessage;
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, errMsg);
                    $scope.isDisableFundFactSheetBtn = false;
                }, function (response) {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.canNotOpenFundFactSheet');
                    $scope.isDisableFundFactSheetBtn = false;
                });
            };

            // function initFundFactSheet () {
            //     var obj = {};
            //     obj.params = {};
            //     obj.params.language = $scope.curlang;
            //     obj.params.fundCode = $scope.mfTranscationPortDetail.fundCode;
            //     obj.actionCode = 'ACT_CODE_FUND_FACT_SHEET_URL';
            //     obj.procedure = 'getFundFactSheetUrlProcedure';
            //     obj.onSuccess = function (result) {
            //         if (result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
            //             var fundFactSheetLink = result.responseJSON.result.value.fundFactSheetUrl;
            //             var rootUrl = result.responseJSON.result.value.fundFactSheetRootUrl;
            //             checkIsNativeDevice(fundFactSheetLink, rootUrl);
            //         }
            //         ;
            //     }
            //     obj.onFailure = function (result) {
            //         var errMsg = result.responseJSON.result.responseStatus.errorMessage;
            //         popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, errMsg);
            //         $scope.isDisableFundFactSheetBtn = false;
            //     }
            //     invokeService.executeInvokePublicService(obj, {adapter: 'utilityAdapter'});
            // }
            //
            // function checkIsNativeDevice (fundFactSheetLink, rootUrl) {
            //     $http.get(fundFactSheetLink).then(function onSuccess (resp) {
            //         var fileHreflink = (new DOMParser().parseFromString(resp.data, "text/xml")).querySelectorAll(
            //             "a[href^='/public/idisc/th/Download/file/']")[0].getAttribute('href');
            //         var srcfilePDFLink = (rootUrl + fileHreflink);
            //         if (checkIsPDFLinkExist(srcfilePDFLink)) {
            //             if (mainSession.deviceOS === 'Android') {
            //                 srcfilePDFLink = 'http://docs.google.com/gview?embedded=true&url=' + srcfilePDFLink;
            //             }
            //             window.open(
            //                 $sce.trustAsResourceUrl(srcfilePDFLink),
            //                 '_blank',
            //                 'location=yes',
            //                 'clearcache=yes',
            //                 'clearsessioncache=yes',
            //                 'enableViewportScale=yes'
            //             );
            //             $scope.isDisableFundFactSheetBtn = false;
            //         }
            //         else {
            //             popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.canNotOpenFundFactSheet');
            //             $scope.isDisableFundFactSheetBtn = false;
            //         }
            //
            //     }).catch(function onError (response) {
            //         popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.canNotOpenFundFactSheet');
            //         $scope.isDisableFundFactSheetBtn = false;
            //     });
            // }

            $scope.onInit = function () {
                $scope.isPdfLoaded = false;
            };

            $scope.close = function () {
                $scope.mutualFundSheet.hide();
                $ionicModal.remove();
            };

            $scope.$on('modal.hidden', function () {
                $scope.isDisableFundFactSheetBtn = false;
            });

            // function checkIsPDFLinkExist (srcfilePDFLink) {
            //     var request = new XMLHttpRequest();
            //     request.open('HEAD', srcfilePDFLink, false);
            //     request.send();
            //     return (request.status === 200);
            // }

            init();
        }
    )
    .controller('mutualFundViewStatementCtrl', function ($scope, $state, popupService, mutualFundService, displayUIService, dateService, kkconst, $ionicLoading) {
        $scope.mutualFundViewStatementData = [
            [
                {
                    fundCode: null,
                    fundName: null,
                    listTrans: [
                        {
                            transDate: null,
                            transType: null,
                            amount: null,
                            unit: null,
                            navPerUnit: null,
                            costPerUnit: null,
                            transStatus: null
                        }
                    ]
                }
            ]
        ];
        $scope.mutualFundStatementYearList = [];
        $scope.selectedMutualFundStatementYear = {
            year: 0,
            value: 0
        };
        $scope.paging = {
            pageNumber: 1,
            totalPages: 0,
            totalRows: 0,
            started: false,
            haveData: false,
            finishLoading: true
        };

        $scope.selectedMutualFundPort = {};

        function init() {
            $ionicLoading.show({ template: kkconst.SPINNER, noBackdrop: true });
            $scope.selectedMutualFundPort = mutualFundService.getSelectMutualFundPortDetail();
            displayUIService.initLastFiveYear(function (yearList) {
                console.log('yearList', yearList);
                $scope.mutualFundStatementYearList = yearList;
                $scope.selectedMutualFundStatementYear = yearList[0];
                $scope.mutualFundStatementInquiry(yearList[0]);
            });
        }

        init();

        $scope.backToMutualFundDetail = function () {
            $state.go('app.mutualFundDetails');
        };

        $scope.mutualFundStatementInquiry = function (selected) {
            $scope.selectedMutualFundStatementYear = selected;
            console.log('mutualFundStatementInquiry year', $scope.selectedMutualFundStatementYear.value);
            $scope.paging.totalPages = 0;
            $scope.paging.totalRows = 0;
            $scope.paging.pageNumber = 1;
            $scope.paging.started = false;
            $scope.paging.haveData = false;
            $scope.paging.finishLoading = false;
            $scope.mutualFundViewStatementData = [];
            $scope.loadMutualFundStatementDetail();
        }

        $scope.haveNextMutualFundStatementDetail = function () {
            return $scope.selectedMutualFundStatementYear.value !== 0 && (!$scope.paging.started || ($scope.paging.haveData && !$scope.paging.finishLoading));
        }

        $scope.noData = function noData() {
            return $scope.paging.finishLoading && !$scope.paging.haveData;
        }

        $scope.loadMutualFundStatementDetail = function () {
            if (!$scope.haveNextMutualFundStatementDetail()) {
                console.log('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
                return;
            }
            $scope.paging.started = true;

            var param = {};
            param.pageNumber = $scope.paging.pageNumber++;
            param.pageSize = 20;
            param.fundCode = $scope.selectedMutualFundPort.fundCode;
            param.unitHolderNumber = $scope.selectedMutualFundPort.unitholderId;
            param.year = $scope.selectedMutualFundStatementYear.value;

            if ($scope.mutualFundViewStatementData.length !== 0) {
                $ionicLoading.hide();
            }

            mutualFundService.getPortMutualFundTransactionDetail(param)
                .then(function (result) {
                    console.log('ctrl.getPortMutualFundTransactionDetail, param, result', param, result);
                    if (kkconst.success === result.responseStatus.responseCode) {
                        if (result.value != null && result.value.length > 0) {
                            //have data
                            $scope.paging.totalPages = result.value[0].totalPages;
                            $scope.paging.totalRows = result.value[0].totalRows;
                            $scope.paging.haveData = result.value[0].totalRows > 0;

                            if ($scope.paging.pageNumber > $scope.paging.totalPages) {
                                $scope.paging.finishLoading = true;
                            }

                            if ($scope.mutualFundViewStatementData.length === 0) {
                                $scope.mutualFundViewStatementData = result.value[0].listTrans;
                            } else {
                                $scope.mutualFundViewStatementData = $scope.mutualFundViewStatementData.concat(result.value[0].listTrans);
                            }
                            console.log('finished mutualFundViewStatementData', $scope.mutualFundViewStatementData);
                        } else {
                            popupService.showErrorPopupMessage('alert.title', result.responseStatus.responseCode);
                            $scope.paging.finishLoading = true;
                        }
                    } else {
                        popupService.showErrorPopupMessage('alert.title', result.responseStatus.responseCode);
                        $scope.paging.finishLoading = true;
                    }

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
    });






