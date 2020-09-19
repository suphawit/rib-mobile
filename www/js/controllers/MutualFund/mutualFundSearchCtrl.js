angular.module('ctrl.mutualFundSearch', [])
    .controller('mutualFundSearchCtrl', function ($scope, $state, kkconst, mutualFundService, popupService, $filter, $translate, $ionicScrollDelegate) {

        var SELECTED_BTN_BG_COLOR = 'selectedBtnBGColor';
        var UNSELECTED_BTN_BG_COLOR = 'unSelectedBtnBGColor';
        $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
        $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
        var MUTUALFUND_LIST = 'BU';
        $scope.fundObj = {};
        $scope.fundListInfo = [];
        $scope.fundSearch = {fundCode: ''};
        $scope.fundListInfoShow = {};
        $scope.shownGroup = {};
        $scope.lang = $translate.use()
            .toLowerCase();

        function init() {
            mutualFundService.checkIsAcceptConsent(function (resultObj) {
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    if (resultObj.value.isAcceptedConsent == 'Y') {
                        fundListInit();
                    } else {
                        geFundConsent();
                    }
                } else {
                    popupService.showErrorPopupMessage('alert.title', resultObj.responseStatus.errorMessage);
                }
            });
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

        function fundListInit() {
            mutualFundService
                .getPortMutualFundList(MUTUALFUND_LIST)
                .then(function (resp) {
                    var respStatus = resp.result.responseStatus;
                    if (respStatus.responseCode === kkconst.success) {
                        var fundsData = groupFundsData(resp.result.value.fundData);
                        $scope.fundListInfo = fundsData;
                        var isPromotionList = $scope.fundListInfo[0];
                        if (isPromotionList.length > 0) {
                            if (isPromotionList[0].isPromotion === 'Y') {
                                $scope.toggleGroup($scope.fundListInfo[0]);
                            }

                        }

                    } else {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-UNK999');
                    }
                });
        }

        function groupFundsData(fundData) {

            var cloneFundData = jQuery.extend(true, [], fundData);

            var ret = {};
            var keyOfHighLight = '0';
            var keyOfSSF = '1';
            var keyOfSSFX = '2';
            var keyOfLTF = '3';
            var keyOfRMF = '4';
            ret[keyOfHighLight] = [];
            ret[keyOfSSF] = [];
            ret[keyOfSSFX] = [];
            ret[keyOfLTF] = [];
            ret[keyOfRMF] = [];

            for (var i = 0; i < cloneFundData.length; ++i) {
                var fund = cloneFundData[i];
                // we don't want data change because of pass by reference
                var cloneFund = jQuery.extend(true, {}, fund);
                //group by fundPolicy
                if (ret[cloneFund.fundPolicy] === undefined) {
                    //we assign fund policy index if not assign
                    ret[cloneFund.fundPolicy] = [];
                }
                //just push fund to index
                cloneFund.fundPolicySort = cloneFund.fundPolicy;
                ret[cloneFund.fundPolicy].push(cloneFund);

                if (isPromotion(cloneFund)) {
                    //show on top
                    var clonePromotion = jQuery.extend(true, {}, cloneFund);
                    clonePromotion.fundPolicySort = keyOfHighLight;
                    ret[keyOfHighLight].push(clonePromotion);
                }

                if(isTaxTypeSSF(cloneFund)) {
                    //show on SSF
                    var cloneSSF = jQuery.extend(true, {}, cloneFund);
                    cloneSSF.fundPolicySort = keyOfSSF;
                    ret[keyOfSSF].push(cloneSSF);
                }
    
                if(isTaxTypeSSFX(cloneFund)) {
                    //show on SSFX
                    var cloneSSFX = jQuery.extend(true, {}, cloneFund);
                    cloneSSFX.fundPolicySort = keyOfSSFX;
                    ret[keyOfSSFX].push(cloneSSFX);
                }

                if (isTaxTypeLTF(cloneFund)) {
                    //always show below promotion group
                    var cloneLTF = jQuery.extend(true, {}, cloneFund);
                    cloneLTF.fundPolicySort = keyOfLTF;
                    ret[keyOfLTF].push(cloneLTF);
                }

                if (isTaxTypeRMF(cloneFund)) {
                    //always show below promotion and RMF group
                    var cloneRMF = jQuery.extend(true, {}, cloneFund);
                    cloneRMF.fundPolicySort = keyOfRMF;
                    ret[keyOfRMF].push(cloneRMF);
                }
                // alert(JSON.stringify(Object.values(ret)));

            }
            //force sort object
            var ordered = {};
            Object.keys(ret)
                .sort()
                .forEach(function (key) {
                    ordered[key] = ret[key];
                });

            var values = Object.keys(ordered)
                .map(function (e) {
                    return ordered[e];
                });

            return values;
        }

        function isPromotion(fund) {
            return fund.isPromotion == 'Y';
            //   return fund.lowBuyValue >= 1000;
        }

        function isTaxTypeLTF(fund) {
            return fund.taxType == 'LTF';
        }

        function isTaxTypeRMF(fund) {
            return fund.taxType == 'RMF';
        }
	
        function isTaxTypeSSF(fund) {
             return fund.taxType == 'SSF';
        }
        
        function isTaxTypeSSFX(fund) {
             return fund.taxType == 'SSFX';
        }

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
            $ionicScrollDelegate.scrollTop();
        };

        function hasMatchingFunds(group) {
            return $scope.fundSearch.fundCode && $filter('filter')(group, {fundCode: $scope.fundSearch.fundCode}).length;
        }

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group || hasMatchingFunds(group);
        };

        $scope.onSelectfundListDatail = function (fundListItems) {

            $scope.fundListInfoShow = fundListItems;
            mutualFundService.setConfirmMutualFund($scope.fundListInfoShow);
            $scope.fundListInfoShow.fundname = fundListItems.fundNameEN;
            $scope.fundObj.fundListDetail = fundListItems.fundNameEN;
            $state.go('app.mutualFundSearchDetail');

        };

        init();

    })

    .controller('mutualFundSearchDetailCtrl',
        function ($scope,
            suitabilityScoreService,
            $ionicModal,
            $translate,
            dateService,
            displayUIService,
            kkconst,
            mutualFundService,
            $ionicHistory,
            $state,
            mainSession,
            $sce,
            $window,
            invokeService,
            popupService
        ) {

            var SELECTED_BTN_BG_COLOR = 'selectedBtnBGColor';
            var UNSELECTED_BTN_BG_COLOR = 'unSelectedBtnBGColor';
            $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
            $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
            $scope.timesOfMutualFund = {};
            $scope.timesOfMutualModel = {};

            $scope.fundListInfo = {};
            var resultSuit;
            $scope.fundListInfoShow = mutualFundService.getConfirmMutualFund();
            var TERM_AND_COND_MUTUALFUND_MODAL = 'templates/MutualFund/MutualFund-termAndCond-modal.html';
            var dataChart = [];
            var fundFactSheetLink = '';
            $scope.isUnitHolderExist = false;
            $scope.isShowScreen = false;
            $scope.isDisableFundFactSheetBtn = false;
            $scope.pdf = null;

            function getTermAndConditions() {
                mutualFundService
                    .getMutualFundTermsAndConditions($translate.use())
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            $scope.termAndCondTextMutualFund = respStatus.value;
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, respStatus.responseCode);
                        }
                    });
            }

            function createTermAndConditionModal() {
                getTermAndConditions();
                $ionicModal.fromTemplateUrl(TERM_AND_COND_MUTUALFUND_MODAL, {
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

            function genBar(date, data) {
                return {
                    t: date.valueOf(),
                    dt: date,
                    y: data
                };
            }

            function createChart(datas) {
                $('canvas#myChart')
                    .remove();

                $('div#divChart')
                    .append('<canvas id="myChart"  width="100%" height="80%"></canvas>');
                var dateFormat = 'DD/MM/YYYY';
                var data = [];
                var labels = [];

                angular.forEach(datas, function (item, key) {
                    data.push(genBar(moment(item.navDate, dateFormat), item.navValue));
                    labels.push(moment(item.navDate, dateFormat));
                });

                var ctx = document.getElementById('myChart')
                    .getContext('2d');

                var cfg = {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                type: 'line',
                                pointRadius: 0,
                                fill: true,
                                lineTension: 1,
                                borderWidth: 2,
                                backgroundColor: '#c0b9cb'
                            }
                        ]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0
                            }
                        }, // events: [],
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [
                                {
                                    type: 'time',
                                    distribution: 'series',
                                    time: {
                                        unit: 'month'
                                    },
                                    ticks: {
                                        // source: 'labels',
                                        // display: false
                                        maxRotation: 90,
                                        minRotation: 90
                                    }, // scaleLabel: {
                                    //     display: true,
                                    //     labelString: 'value'
                                    // },
                                    gridLines: {
                                        display: false
                                    }
                                }
                            ],
                            yAxes: [
                                {
                                    // scaleLabel: {
                                    //     display: true,
                                    //     labelString: 'Closing price ($)'
                                    // }
                                    gridLines: {
                                        display: false
                                    }
                                }
                            ]
                        }, // tooltips: {
                        //     enabled: false,
                        // },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                            custom: function (tooltip) {
                                if (!tooltip) {
                                    return;
                                }
                                // disable displaying the color box;
                                tooltip.displayColors = false;
                            },
                            callbacks: {
                                title: function (tooltipItem, data) {
                                    return 'NAV';
                                },
                                label: function (tooltipItem, data) {
                                    console.log('--->label', tooltipItem, data);
                                    console.log('label', data['datasets'][0]['data'][tooltipItem['index']]['y']);
                                    return data['datasets'][0]['data'][tooltipItem['index']]['y'];
                                },
                                afterLabel: function (tooltipItem, data) {
                                    console.log('--->afterlabel', data['datasets'][0]['data'][tooltipItem['index']]['dt']);
                                    console.log('afterlabel', data['datasets'][0]['data'][tooltipItem['index']]['dt']);
                                    var time = data['datasets'][0]['data'][tooltipItem['index']]['dt'];
                                    return time.format('DD-MMMM-YYYY');
                                    // var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
                                    // return '(' + percent + '%)';
                                }
                            }
                        },
                        hover: {
                            // enabled: false,
                            mode: 'index',
                            intersect: false
                        }
                    }
                };
                var chart = new Chart(ctx, cfg);

            }

            function init() {
                createTermAndConditionModal();
                verifyIsUnitholderExist();
                $scope.curlang = $translate.use()
                    .toLowerCase();
                $scope.fundConfirmInfo = mutualFundService.getConfirmMutualFund();

                if ($scope.fundConfirmInfo.navDate !== '') {
                    $scope.fundListInfoShow.navDateFormat = displayUIService.convertDateNoTimeForUI($scope.fundConfirmInfo.navDate);
                }
                $scope.timesOfMutualFund = dateService.timeOfMutualFund[[mainSession.lang.toLowerCase()]];
                $scope.timesOfMutualModel = $scope.timesOfMutualFund[0];
            }

            function verifyIsUnitholderExist() {
                mutualFundService.verifyIsUnitHolderExist(function (resultObj) {
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        $scope.isUnitHolderExist = (resultObj.value.isExistingUnitholder == 'Y');
                    }
                    inquiryNavData(90, 3);
                    $scope.isShowScreen = true;
                });
            }

            function inquiryNavData(day, month) {
                mutualFundService
                    .inquiryNav($scope.fundListInfoShow.fundId, month)
                    .then(function (resp) {
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                            var navData = respStatus.value.navData;
                            createChart(navData);
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, respStatus.responseCode);
                        }
                    });
            }

            $scope.getTimesOfMutualFund = function (valueSelect) {
                var dataChartList = mutualFundService.getSummaryNAVChartData();
                dataChart = dataChartList[valueSelect];
                inquiryNavData(dataChartList[valueSelect].day, dataChartList[valueSelect].month);
            };

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

            $scope.nevigateMutualFundPuechase = function () {
                checkExpireDate();

            };

            $scope.termsAndCondChecked = function () {

                $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
                $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;
                $scope.termAndcondModalMutualFundPurchase.hide();

                $ionicHistory.clearCache()
                    .then(function () {
                        $state.go('app.mutualFundPurchase');

                    });

            };

            $scope.navigateFundFactSheet = function () {
                $scope.isDisableFundFactSheetBtn = true;
                mutualFundService.openFundFactSheet($scope.fundListInfoShow.fundCode, $scope.fundListInfoShow.fundFacsheetCode, function () {
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

            // function initFundFactSheet() {
            // var obj = {};
            // obj.params = {};
            // obj.params.language = $scope.lang;
            // obj.params.fundCode = $scope.fundListInfoShow.fundCode;
            // obj.actionCode = 'ACT_CODE_FUND_FACT_SHEET_URL';
            // obj.procedure = 'getFundFactSheetUrlProcedure';
            //     obj.onSuccess = function(result) {
            //         if(result.responseJSON.result.responseStatus.responseCode === kkconst.success){
            //             fundFactSheetLink = result.responseJSON.result.value.fundFactSheetUrl;
            //             var rootUrl = result.responseJSON.result.value.fundFactSheetRootUrl;
            //             checkIsNativeDevice(rootUrl);
            //         };
            //     }
            //     obj.onFailure = function(result){
            //         var errMsg = result.responseJSON.result.responseStatus.errorMessage ;
            //         popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,errMsg);
            //         $scope.isDisableFundFactSheetBtn = false;
            //     }
            //      invokeService.executeInvokePublicService(obj,{adapter:'utilityAdapter'});
            // };
            //
            // function checkIsNativeDevice(rootUrl){
            //     $http.get(fundFactSheetLink).then(function onSuccess(resp){
            //         var fileHreflink = (new DOMParser().parseFromString(resp.data, "text/xml")).querySelectorAll("a[href^='/public/idisc/th/Download/file/']")[0].getAttribute('href');
            //         var srcfilePDFLink = (rootUrl + fileHreflink);
            //         if(checkIsPDFLinkExist(srcfilePDFLink)){
            //             if(mainSession.deviceOS === 'Android'){
            //                     srcfilePDFLink = 'http://docs.google.com/gview?embedded=true&url='+srcfilePDFLink;
            //              }
            //             window.open($sce.trustAsResourceUrl(srcfilePDFLink), '_blank', 'location=yes','clearcache=yes','clearsessioncache=yes','enableViewportScale=yes');
            //             $scope.isDisableFundFactSheetBtn = false;
            //         }else{
            //             popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.canNotOpenFundFactSheet');
            //             $scope.isDisableFundFactSheetBtn = false;
            //         }
            //
            //     }).catch(function onError(response){
            //         popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.canNotOpenFundFactSheet');
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

            // function checkIsPDFLinkExist(srcfilePDFLink){
            //     var request = new XMLHttpRequest();
            //     request.open('HEAD', srcfilePDFLink, false);
            //     request.send();
            //     return (request.status === 200);
            // }

            init();

        }
    );
