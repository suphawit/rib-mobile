angular.module('ctrl.eDonationCtrl', [])
    .controller('eDonationCtrl', function ($scope, $ionicHistory, $ionicModal, $state, generalService, $filter, popupService, scheduleBillpaymentService, $translate, generalValueDateService, mainSession, dateService, myAccountService, displayUIService, $ionicScrollDelegate, kkconst, billPaymentRTPService, requestToPayInComingService, manageBillerPromptPayService, cordovadevice, downloadAndStoreFile, eDonationService, $ionicListDelegate) {

        $scope.isShowNext = true;
        $scope.isShowSelectAccount = true;
        $scope.isShowNoBiller = false;
        $scope.isRTPPayment = false;
        $scope.memo = {
            txt: ''
        };
        $scope.placeholderAmount = '0.00';
        $scope.editScheduleBill = false;
        $scope.account = null;
        $scope.biller = null;
        $scope.serverDate = null;
        $scope.paymentDate = null;
        $scope.amountModel = {
            amount: ''
        };
        $scope.datePickerShow = undefined;
        $scope.accountlists = [];

        $scope.chromeview = false;
        $scope.isFromQRScannerPage = false;
        $scope.scanBillerData = {
            barcodeType: '',
            barcodeInfo: ''
        };

        $scope.bpBillerListInfo = [];
        $scope.noResult = false;
        $scope.allCategories = [];
        // var watchlistener;
        $scope.isNewBiller = false;
        $scope.isScanBiller = false;
        $scope.lang = $translate.use();
        $scope.isSendToRD = true;
        var userCardType = kkconst.E_DONATION_CITIZEN; // 'I'; // I = citizen or P = passport

        $scope.biller = {};

        createVirtualKeyboardAmount();
        createModal();
        viewInitial();

        $scope.defaultBillerLogo = kkconst.DEFAULT_E_DONATION_ICON;

        function viewInitial() {
            getServerDate();
            historyPageInit();
            getUserCardType();
            // preview select for chrome browser
            if (cordovadevice.properties('platform') === 'preview') {
                $scope.chromeview = true;
            }
        }

        function getUserCardType() {
            eDonationService.getCustomerType(function(responseStatus,resultObj){
                if(responseStatus.responseCode === kkconst.success){
                    userCardType = resultObj;
                    if($scope.isShowSendToRevenueDepartment()) {
                        $scope.isSendToRD = true;
                        $scope.biller.refInfos[1]['value'] = "1";
                    }else {
                        $scope.isSendToRD = false;
                        $scope.biller.refInfos[1]['value'] = "0";
                    }
                }
            });
        }

        function prepareData() {
            $scope.biller = manageBillerPromptPayService.getDataBillerDefault();
            $scope.account = eDonationService.getCurrentAccount();
            $scope.amountModel = eDonationService.getCurrentAmount();
            $scope.isNewBiller = eDonationService.getIsNewBiller();
            $scope.isScanBiller = eDonationService.getIsScanBill();
            $scope.memo = eDonationService.getMemo();

            console.log('$scope.biller.dataFormatType '+ $scope.biller.dataFormatType)
            if ($scope.isScanBiller) {
                $scope.scanBillerData.barcodeType = $scope.biller.dataFormatType;
                $scope.isFromQRScannerPage = true;
            }else {
                $scope.isFromQRScannerPage = false;
                $scope.scanBillerData.barcodeType = '';
            }

            inquiryPayInfoOnline($scope.biller);
            //reset data in service after use
            eDonationService.setCurrentAmount({amount: ''});
            eDonationService.setCurrentAccount(null);
            eDonationService.setIsNewBiller(false);
            eDonationService.setIsScanBill(false);
            eDonationService.setMemo({txt: ''});
        }

        function getServerDate() {
            dateService.today().then(function (result) {
                setServerDate(result);
                var serverdate_ui = $scope.serverDate.ui;

                if ($scope.editScheduleBill == false) {
                    $scope.paymentDate = {
                        strDate: $scope.serverDate.strDate,
                        ui: {
                            day_label: serverdate_ui.day_label,
                            date: serverdate_ui.date,
                            month_label: serverdate_ui.month_label,
                            year: serverdate_ui.year,
                        }
                    };
                }
            });
        }

        function historyPageInit() {
            //check state from page
            var history = $ionicHistory.viewHistory();
            if (history.backView != null) {
                switch (history.backView.stateName) {
                    case kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE:
                        fromAccountPage();
                        console.log('fromAccountPage ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE');
                        break;
                    case kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE:
                        $scope.isNewBiller = eDonationService.getIsNewBiller();
                        eDonationService.setIsNewBiller(false);
                        fromEditBillerDetailPage();
                        console.log('fromEditBillerDetailPage ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE');
                        break;
                    case kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE:
                        fromRTPPage();
                        console.log('fromRTPPage ROUNTING.REQUEST_TO_PAY_DETAIL.STATE');
                        break;
                    case kkconst.ROUNTING.QR_CODE_SCANNER.STATE:
                        fromQRCodeScannerPage();
                        console.log('fromQRCodeScannerPage ROUNTING.QR_CODE_SCANNER.STATE');
                        break;
                    case kkconst.ROUNTING.NOTIFICATION.STATE:
                        fromRTPPage();
                        console.log('fromRTPPage kkconst.ROUNTING.NOTIFICATION.STATE');
                        break;
                    case kkconst.ROUNTING.MY_ACCOUNT.STATE:
                        fromRTPPage();
                        console.log('fromRTPPage ROUNTING.MY_ACCOUNT.STATE');
                        break;
                    default:
                        prepareData();
                        console.log('prepareData');
                        break;
                }

                if($scope.biller && $scope.biller.refInfos && $scope.biller.refInfos.length < 2) {
                    $scope.biller.refInfos[1] = {value : '1'};
                }
            }
        }

        function fromQRCodeScannerPage() {
            var BillerData = manageBillerPromptPayService.getDataBillerDefault();
            $scope.biller = BillerData;
            $scope.amountModel.amount = BillerData.amount == null || parseFloat(BillerData.amount) == 0 ? '' : generalService.formatNumber(parseFloat(BillerData.amount));
            $scope.scanBillerData.barcodeType = BillerData.barcodeType;
            if ($scope.scanBillerData && $scope.scanBillerData.dataFormatType) {
                $scope.scanBillerData.barcodeType = $scope.scanBillerData.dataFormatType;
            }
            $scope.isScanBiller = eDonationService.getIsScanBill();
            if ($scope.isScanBiller) {
                $scope.virtualKeyboardAmount.option.isKeyboardActive = BillerData.flagAmountFix === 'N';
            }
            $scope.isFromQRScannerPage = true;
            //inquiryPayInfoOnline($scope.biller);
        }

        function fromRTPPage() {
            $scope.isRTPPayment = true;
            $scope.virtualKeyboardAmount.option.isKeyboardActive = true;
            var rtpPayInfo = requestToPayInComingService.getRequestToPayInfo();
            $scope.biller = rtpPayInfo;

            $scope.amountModel.amount = generalService.formatNumber(parseFloat(rtpPayInfo.amount));

            getBillerInfoIcon($scope.biller);

            inquiryPayInfoOnline($scope.biller);
        }

        function fromAccountPage() {
            var account = JSON.parse(JSON.stringify(myAccountService.accountDetail));
            // new account number support
            account.myAccountNumber = account.myAccountNumber ? account.myAccountNumber.substring(0, 10) : account.myAccountNumber;
            $scope.account = account;
        }

        function fromEditBillerDetailPage() {
            var data_editbill = manageBillerPromptPayService.getDataBillerDefault();
            $scope.biller = JSON.parse(JSON.stringify(data_editbill));

            if ($scope.biller.dataFormatType) {
                $scope.scanBillerData.barcodeType = $scope.biller.dataFormatType;
                $scope.isFromQRScannerPage = true;
            }else {
                $scope.isFromQRScannerPage = false;
                $scope.scanBillerData.barcodeType = '';
            }

            inquiryPayInfoOnline($scope.biller);
        }

        function getBillerById(billerId) {
            billPaymentRTPService.getBillersList(function (resultPaybill) {
                var respStatus = resultPaybill.result.responseStatus;
                if (respStatus.responseCode === kkconst.success) {
                    var billers = resultPaybill.result.value;
                    for (var index = 0; index < billers.length; index++) {
                        var biller = billers[index];
                        if (biller.billerId == billerId) {
                            $scope.biller = biller;
                            getBillerInfoIcon($scope.biller);
                            return;
                        }
                    }
                } else {
                    popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
                }
            });
        }

        function getAddNewBiller(dataFromScheduleEdit) {
            $scope.biller = dataFromScheduleEdit;

            $scope.biller.billerNameEn = dataFromScheduleEdit.billerName;
            $scope.biller.billerNameTh = dataFromScheduleEdit.billerName;
            getBillerInfoIcon($scope.biller);
            inquiryPayInfoOnlineForEditSchedule($scope.biller);
        }

        $scope.closeAccountListModal = function () {
            $scope.isShowNext = true;
            $scope.accListModal.hide();
        };

        $scope.goNextPage = function () {
            if ($scope.isSendToRD || userCardType === kkconst.E_DONATION_PASSPORT) { //if passport skip popup step
                goNextPageCallback(true)
            }else {
                popupService.showConfirmPopupMessageCallback('label.eDonation.confirm', 'label.eDonation.confirm.detail', function (ok) {
                    goNextPageCallback(ok);
                });
            }
        };

        $scope.onClickBack = function() {
            $ionicHistory.clearCache().then(function () {
                $scope.gotoBillRTP();
            });
        };

        function goNextPageCallback(ok) {
            if (ok) {
                if (!validatePayment()) {
                    return;
                }
                verifyBillPayment();
            } else {
                $ionicListDelegate.closeOptionButtons();
            }
        }

        $scope.displayBillerName = function (biller) {
            var billername = (mainSession.lang === 'en') ? biller.billerNameEn : biller.billerNameTh;
            return billername;
        };

        $scope.displayRefName = function (ref) {
            var refname = (mainSession.lang === 'en') ? ref.textEn : ref.textTh;
            return refname;
        };

        function setServerDate(serverDate) {
            var date = serverDate.date;
            var day = serverDate.day;
            var month = serverDate.month;
            var year = serverDate.year;
            var dateStr = date;
            var monthStr = month + 1;
            if (date < 10) {
                dateStr = '0' + date;
            }
            if (month < 10) {
                monthStr = '0' + (month + 1);
            }
            $scope.serverDate = serverDate;
            $scope.serverDate.strDate = dateStr + '/' + monthStr + '/' + year;
            $scope.serverDate.ui = {
                day_label: generalValueDateService.weekDayNamesArray[day],
                date: date,
                month_label: generalValueDateService.monthsFullNameArray[month],
                year: year,
            }
        }

        function getImmediateType() {
            return 'T';
        }

        function getRecurringType() {
            return 'N';
        }

        function getRecurringTime() {
            return 0;
        }

        function getScheduleType() {
            return 0;

        }

        function verifyBillPayment() {
            var custName = mainSession.getSession().firstNameEN + ' ' + mainSession.getSession().lastNameEN;
            var data_verify_billpayment = {
                fromAccountNumber: $scope.account.myAccountNumber,	//old service
                billerId: $scope.biller.billerId,
                billerProfileId: $scope.biller.billerProfileId,
                promptpayBillerId: $scope.biller.promptPayBillerId,
                categoryId: $scope.biller.categoryId ? $scope.biller.categoryId : '',
                payAmount: parseFloat(generalService.parseNumber($scope.amountModel.amount) || '0.00'),
                effectiveDate: $scope.paymentDate.strDate,
                paymentDate: $scope.paymentDate.strDate,
                msgLanguage: mainSession.lang.toLowerCase(),
                immediateType: getImmediateType(),
                memo: $scope.memo.txt,
                recurringType: getRecurringType(),
                recurringTimes: getRecurringTime(),
                scheduleType: getScheduleType(),
                rtpReferenceNo: ($scope.isRTPPayment) ? $scope.biller.rtpreference : undefined,
                reference1: getReferenceValue($scope.biller.refInfos[0]),
                reference2: getReferenceValue($scope.biller.refInfos[1]),
                reference3: getReferenceValue($scope.biller.refInfos[2]),
                profileCode: $scope.biller.profileCode,
                custName: custName,
                barcodeType: ($scope.isFromQRScannerPage) ? $scope.scanBillerData.barcodeType || '' : '',
                companyCode: $scope.biller.companyCode,
                serviceCode: $scope.biller.serviceCode
            };

            billPaymentRTPService.verifyBillPayment(data_verify_billpayment, function (resultPaybill) {
                var respStatus = resultPaybill.result.responseStatus;
                if (respStatus.responseCode === kkconst.success) {
                    var data_confirmOTP = {
                        resultVerifyBill: resultPaybill.result.value,
                        account: $scope.account,
                        biller: $scope.biller,
                        memo: $scope.memo.txt,
                        editScheduleBill: $scope.editScheduleBill,
                        recurringType: getRecurringType(),
                        recurringTimes: getRecurringTime(),
                        scheduleType: getScheduleType(),
                        rtpReferenceNo: ($scope.isRTPPayment) ? $scope.biller.rtpreference : undefined,
                    };
                    billPaymentRTPService.setDataBillpaymentConfirmOTP(data_confirmOTP);
                    console.log('test===> 111', data_confirmOTP)
                    $state.go(kkconst.ROUNTING.BILL_E_DONATION_CONFIRM.STATE);
                } else {
                    popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
                }
            });
        }

        $scope.openAccountList = function () {
            $scope.isShowNext = false;
            getAccountsList();
        };

        $scope.selectedAccount = function (account) {
            $scope.account = account;
            $scope.accListModal.hide();
        };

        function getReferenceValue(ref) {
            return (ref == undefined) ? undefined : ref.value;
        }


        function getAccountsList() {
            // if ($scope.accountlists.length == 0) {
            myAccountService.inquiryMyAccountCASASummary(function (responseCode, ownAccountGroups) {
                if (responseCode === kkconst.success) {
                    $scope.accountlists = sortingAccount(ownAccountGroups);
                    $scope.accListModal.show();
                } else {
                    popupService.showErrorPopupMessage('alert.title', responseCode);
                }
            });
            // }
        }

        function sortingAccount(request) {
            request.sort(function (a, b) {
                var nameA = a.myAccountAliasName && a.myAccountAliasName.toLowerCase() || '';
                var nameB = b.myAccountAliasName && b.myAccountAliasName.toLowerCase() || '';
                //sort string ascending
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0; //default return value (no sorting)
            });
            return request;
        }

        function createModal() {
            createAccountListModal();
            $scope.$on('modal.hidden', function () {
                $scope.isShowNext = true;
            });
        }

        function createAccountListModal() {
            var templateURL = 'templates/BillPaymentRTP/billPaymentRTP-Account-list-modal.html';
            $ionicModal.fromTemplateUrl(templateURL, {
                scope: $scope,
                animation: $scope.modalAnimate
            }).then(function (modal) {
                $scope.accListModal = modal;
            });
        }

        function createVirtualKeyboardAmount() {
            $scope.virtualKeyboardAmount = {
                option: {
                    disableDotButton: false,
                    isKeyboardActive: true,
                    maxlength: 12,
                    IsEditModel: true
                },
                onblur: function () {
                    $scope.placeholderAmount = '0.00';
                    $scope.amountModel.amount = generalService.onBlurFormatCurrency($scope.amountModel.amount);
                },
                onfocus: function () {
                    $scope.amountModel.amount = generalService.onFocusClearAmount($scope.amountModel.amount);
                    $scope.placeholderAmount = '';
                }
            };
        }

        function validatePayment() {
            if (!$scope.account) {
                popupService.showErrorPopupMessage('label.warning', ' validate.input.selectAccount');
                return false;
            }
            if (isEmpty($scope.amountModel.amount)) {
                popupService.showErrorPopupMessage('label.warning', 'validate.input.enterAmount');
                return false;
            }
            if (isEmpty($scope.amountModel.amount) ||
                ($scope.amountModel.amount === 0) ||
                ($scope.amountModel.amount === '0') ||
                ($scope.amountModel.amount === '0.00')) {
                popupService.showErrorPopupMessage('label.warning', 'validate.input.enterAmount');
                return false;
            }
            if (!$scope.biller) {
                popupService.showErrorPopupMessage('label.warning', 'validate.input.selectBiller');
                return false;
            }

            if ($scope.isNewBiller && isRefInfoEmpty($scope.biller.refInfos)) {
                popupService.showErrorPopupMessage('label.warning', 'validate.input.reference');
                return false;
            }

            return true;
        }

        function isRefInfoEmpty(refinfo) {
            console.log(refinfo)
            for (var index = 0; index < refinfo.length; index++) {
                if(isEDonationCategory() && index > 0) {
                    continue;
                }
                if (isEmpty(refinfo[index].value)) {
                    return true;
                }
            }

            return false;
        }

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }

        function getBillerInfoIcon(billerInfo) {
            var iconName = downloadAndStoreFile.getBillerIconName(billerInfo);
            var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
            downloadAndStoreFile.getFromImageUrl(iconUrl).then(function (data) {
                billerInfo.logoCompany = data;
            });
        }

        function parsePaymentInfoOnline(biller) {
            var returnObj = {};
            returnObj.companyCode = biller.companyCode || '';
            returnObj.serviceCode = biller.serviceCode || '';
            returnObj.promptPayBillerId = biller.promptPayBillerId;
            var refInfos = biller.refInfos;
            for (var i = 0; i < refInfos.length; i++) {
                returnObj['ref' + (i + 1)] = refInfos[i].value;
            }
            return returnObj;
        }

        function inquiryPayInfoOnline(biller) {
            var billerReq = parsePaymentInfoOnline(biller);
            billPaymentRTPService.inquiryPayInfoOnline(billerReq).then(function (resultObj) {
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    if(resultObj.value.billAmount <= 0) {
                        $scope.virtualKeyboardAmount.option.isKeyboardActive = true;
                    } else {
                        $scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N';
                    }

                    //if from qr scan and amount of scan or verifybill more than zero then disable input amount
                    if (($scope.isScanBiller || $scope.isFromQRScannerPage) && ($scope.amountModel.amount > 0 || parseFloat(resultObj.value.billAmount) > 0)) {
                        $scope.virtualKeyboardAmount.option.isKeyboardActive = false;
                    }

                    // check verify bill amount > 0 then replace with this amount if-not use amount from billpaymentRTP
                    if(parseFloat(resultObj.value.billAmount) > 0) {
                        $scope.amountModel.amount = generalService.formatNumber(parseFloat(resultObj.value.billAmount));
                    }

                    $scope.biller.companyCode = resultObj.value.companyCode || '';
                    $scope.biller.serviceCode = resultObj.value.serviceCode || '';
                } else {
                    popupService.showErrorPopupMessage('label.warning', resultObj.responseStatus.errorMessage);
                }
            });
        }

        function inquiryPayInfoOnlineForEditSchedule(biller) {
            var billerReq = parsePaymentInfoOnline(biller);
            billPaymentRTPService.inquiryPayInfoOnline(billerReq).then(function (resultObj) {
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    $scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N' ? false : true;
                    if (resultObj.value.billAmount != null) {
                        $scope.amountModel.amount = generalService.formatNumber(parseFloat(resultObj.value.billAmount));
                    }
                    $scope.biller.companyCode = resultObj.value.companyCode || "";
                    $scope.biller.serviceCode = resultObj.value.serviceCode || "";
                } else {
                    popupService.showErrorPopupMessage('label.warning', resultObj.responseStatus.errorMessage);
                }
            });
        }

        $scope.sendToRevenueDepartment = function (isSend) {
            if (isSend) {
                //send to rd
                $scope.isSendToRD = true;
                $scope.biller.refInfos[1]['value'] = "1";
            } else {
                $scope.isSendToRD = false;
                $scope.biller.refInfos[1]['value'] = "0";
            }
        };

        $scope.isShowSendToRevenueDepartment = function () {
            return userCardType ===  kkconst.E_DONATION_CITIZEN;
        };

        function isEDonationCategory() {
            return $scope.biller.categoryId == kkconst.E_DONATE_CATEGORY_ID;
        }
    });

