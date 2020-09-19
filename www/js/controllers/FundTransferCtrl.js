angular.module('ctrl.fund', [
    'ctrl.fundConfirm',
    'ctrl.fundComplete'
])
.controller('FundTransferCtrl',
    function ($scope,
        $state,
        $ionicModal,
        $translate,
        $ionicPopup,
        $ionicListDelegate,
        $stateParams,
        $filter,
        $ionicHistory,
        $ionicScrollDelegate,// NOSONAR
        popupService,
        fundtransferService,
        BankCodesImgService,
        myAccountService,
        generalService,
        mainSession,
        dateService,
        ValidationService,
        displayUIService,
        generalValueDateService,
        fundTransferTOService,
        scheduleFundtransferService,
        $timeout,
        kkconst,
        $q,
        anyIDService,
        requestToPayInComingService,
        $ionicPlatform
    ) {
        'use strict';
        //init variables
        $scope.showNext = true;
        $scope.isShowBack = false;
        $scope.showSelectBtn = true;
        $scope.showSelectFromAccountDetails = false;
        $scope.isPanelButtonsShow = true;
        $scope.isAccountFromList = false;
        $scope.showTDTermsnConditions = false;
        $scope.isCasa = true;
        $scope.isShowRecurringForm = true;
        $scope.ownAccountGroups = [];
        $scope.fundObj = {};
        $scope.dirOptions = {};
        $scope.dirBankCodeOptions = {};
        $scope.isFormQRScanner = false;
        $scope.scanFlag = 'N';

        var THEME_LIGHT_GRAY_BG_COLOR = 'themeLightGreyBGColor';
        var THEME_DARK_BLUR_BG_COLOR = 'themeDarkBlueBGColor';
        var SELECTED_BTN_BG_COLOR = 'selectedBtnBGColor';
        var UNSELECTED_BTN_BG_COLOR = 'unSelectedBtnBGColor';

        $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
        $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;

        var transferType = '';
        $scope.placeholderAmount = '0.00';
        $scope.isShowAccountName = false;
        $scope.toBankName = null;
        $scope.isNewAccount = false;

        $scope.banksList = fundtransferService.bankList;
        $scope.anyIdTypeList = fundtransferService.anyIdTypeList.slice(0);
        $scope.isStringDataType = true;
        //ป้องกันการแสดงข้อมูลไม่ทันในขณะ slide
        $scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
        $scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
        $scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
        $scope.anyIdTypeList.push.apply($scope.anyIdTypeList, fundtransferService.anyIdTypeList);
        ///////////////////////////////////////

        var CONSTANT_ACCOUNT_LIST_MODAL = 'templates/ManageAccounts/MyAccounts/account-list-modal.html';
        var CONSTANT_FROM_LIST_MODAL = 'templates/Fundtransfer/from-list-modal.html';
        var CONSTANT_ALERT_MODE_MOBILE = 'MOBILE';
        $scope.isRTP = false;

        //Dynamic Title Lable of SelectAccount Module
        $scope.accListlabelTitle = 'label.selecFromAccounts';
        var fundToObj = {};

        $ionicModal.fromTemplateUrl(CONSTANT_ACCOUNT_LIST_MODAL, {
                scope: $scope,
                animation: $scope.modalAnimate
            })
            .then(function (modal) {
                $scope.accListModal = modal;
            });
        $scope.$on('modal.hidden', function () {
            $scope.showNext = true;
        });
        $scope.selectAccount = function () {
            $scope.showNext = false;
            $scope.accListModal.show();
            if ($scope.ownAccountGroups.length === 0) {
                //Start select button account
                myAccountService.inquiryMyAccountCASASummary(function (responseCode, ownAccountGroups) {
                    if (responseCode === kkconst.success) {
                        $scope.ownAccountGroups = sortingAccount(ownAccountGroups);
                    } else {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseCode);
                    }
                });
            }
        };
        $scope.selectClose = function () {
            $scope.showNext = true;
            $scope.accListModal.hide();
        };

        $scope.checkIsAnyID = function (anyIDType) {
            return anyIDService.isAnyID(anyIDType);
        };

        $scope.getAnyIDIcon = function (anyIDType) {
            return anyIDService.getAnyIDinfo(anyIDType).icon;
        };

        $scope.getAnyIDIconColor = function (anyIDType) {
            return anyIDService.getAnyIDinfo(anyIDType).iconColor;
        };
        $scope.validationAnyID = function (anyIDType) {
            return anyIDService.getAnyIDinfo(anyIDType).maxLength;
        };

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

        var fromBankCode = null;
        $scope.userSelectedFromAccount = function (account) {
            setSelectFromAccount(fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA);

            //Bind Variables for FROM account data
            $scope.fundObj.selectedFromName = account.myAccountAliasName || '';
            $scope.fundObj.selectedFromAccNo = account.myAccountNumber || '';
            $scope.fundObj.selectedFromTotalActBalance = account.myAvailableBalance || '';
            $scope.fundObj.selectedFromAccountID = account.myAccountID;
            fromBankCode = account.bankCode;
            $scope.selectClose();
        };

        function setSelectFromAccount(action) {
            if (action === fundtransferService.CONSTANT_ACTION_FROM_ACCOUNT_DATA) {
                $scope.showSelectFromAccountDetails = true;
                $scope.showSelectBtn = false;
            } else {
                $scope.showSelectFromAccountDetails = false;
                $scope.showSelectBtn = true;
            }
        }

        //End select button account

        //Start select button From list
        $scope.accountCategoryList = [];
        $scope.ftToAllAccounts = [];
        $scope.ftToSelectedActsGroup = [];
        $scope.getListSuccess = false;
        $scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;

        //From List Modal
        $ionicModal.fromTemplateUrl(CONSTANT_FROM_LIST_MODAL, {
                scope: $scope,
                animation: $scope.modalAnimate
            })
            .then(function (modal) {
                $scope.formListModal = modal;
            });

        $scope.closeFormListModal = function () {
            $scope.showNext = true;
            $scope.formListModal.hide();
        };
        $scope.selectAccountFromList = function () {
            if ($scope.isRTP) {
                return;
            }
            $scope.showNext = false;
            if ($scope.ftToSelectedActsGroup.length === 0) {
                fundtransferService.inquiryToAccount(mainSession.lang, function (responseCode, resultObj) {
                    if (responseCode === kkconst.success) {
                        $scope.accountCategoryList = resultObj.accountCategoryList;
                        $scope.ftToAllAccounts = resultObj.ftToAllaccounts;
                        $scope.ddSelectSelected = resultObj.ftDefaultCategory[0];
                        $scope.ftToSelectedActsGroup = resultObj.ftToSelectedActsGroup;
                        $scope.getListSuccess = true;

                    } else {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseCode);
                    }
                });
            }
            $scope.formListModal.show();
        };
        $scope.showOtherAccountsCategory = function (categoryID, category) {
            $scope.ddSelectSelected = {
                catId: categoryID,
                catName: category
            };
            $scope.ftToSelectedActsGroup = $scope.ftToAllAccounts[categoryID] || [];
        };

        $scope.accountDetails = {};
        $scope.isOwnerAccount = false;
        $scope.selectTOAccount = function (accountDetails) {
            console.log('selectTOAccount, accountDetails', accountDetails);
            $scope.setSelectFromList(fundtransferService.CONSTANT_SELECTED_FROM_LIST);
            // ----set To Account details
            $scope.accountDetails = accountDetails;
            $scope.selectedAnyIDType = accountDetails.anyIDType;
            $scope.fundObj.clientPhoneNo = accountDetails.mobileNumber;
            $scope.fundObj.clientEmailId = accountDetails.email;
            $scope.clientImgUrl = $scope.getBankCodeImg(accountDetails.bankCode, 'image');

            $scope.isDisableAccname = true;

            $scope.toBankName = accountDetails.bankName;

            if (accountDetails.accountType === fundtransferService.CONSTANT_ACCOUNT_TYPE_TD) {
                $scope.value.isCheckTDTermsNConds = true;
                $scope.showTDTermsnConditions = true;
                $scope.isCasa = false;
            } else {
                $scope.showTDTermsnConditions = false;
                $scope.isCasa = true;
            }

            if (accountDetails.categoryId === 0) {
                $scope.isOwnerAccount = true;
            } else {
                $scope.isOwnerAccount = false;
            }

            $scope.closeFormListModal();
            //Check ORFT
            $scope.newAccountBankCode = accountDetails.bankCode;
            $scope.checkShowInputAccountName();
            $scope.value.accountNumber = $scope.accountDetails.accountNumber;
        };

        $scope.setSelectFromList = function (action) {
            $scope.isNewAccount = false;
            $scope.phoneColor = THEME_LIGHT_GRAY_BG_COLOR;
            $scope.emailColor = THEME_LIGHT_GRAY_BG_COLOR;
            $scope.showNext = true;
            if (action === fundtransferService.CONSTANT_SELECTED_FROM_LIST) {
                $scope.isAccountFromList = true;
                $scope.isPanelButtonsShow = false;

                //Set default to TD
                $scope.isCasa = false;

                // set default to account for interest
                $scope.showSelectBenefitAccountDetail = false;
                $scope.benefitAccountList = [];
            } else {
                $scope.isAccountFromList = false;
                $scope.isPanelButtonsShow = true;

                //Set default to casa
                $scope.isCasa = true;
            }
            $scope.showTDTermsnConditions = false;
            $scope.value.accountNumber = '##';
            $ionicScrollDelegate.scrollTop();
        };
        // ----------------- Select to Account From New Account -----
        $scope.isActiveBankCode = function (bCode) {
            if (bCode === $scope.bankCode) {
                return $scope.getBankCodeImg(bCode, 'color');
            } else {
                return $scope.getBankCodeImg('000', 'color');
            }
        };
        $scope.isDisableAccname = true;
        var tmpSelected = '';
        $scope.selectNewAccount = function () {
            $scope.isDisableAccname = false;
            $scope.fundObj.toAccountNo = '';//Set empty when click new Account
            $scope.fundObj.toAccountName = '';
            $scope.accountDetails = '';
            $scope.isNewAccount = true;
            $scope.isPanelButtonsShow = false;
            $scope.fundObj.clientPhoneNo = '';
            $scope.fundObj.clientEmailId = '';
            $scope.switchSelected(tmpSelected);

            $scope.isOwnerAccount = false;

            if (!angular.isUndefined($scope.banksList)) {
                for (var i = 0; i < $scope.banksList.length; i++) {
                    if ($scope.newAccountBankCode === $scope.banksList[i].bankCode) {
                        $scope.toBankName = $scope.banksList[i].bankName;
                    }
                }
            }
        };
        var amt = 0;

        function getAmt() {
            if (angular.isNumber($scope.fundObj.amount)) {
                return parseFloat($scope.fundObj.amount || '0.00');
            } else {
                return parseFloat(generalService.parseNumber($scope.fundObj.amount) || '0.00');
            }
        }

        $scope.checkShowInputAccountName = function () {

            $scope.AMLOLimit = '0'; //TODO remove to masterdata
            $scope.isShowAccountName = false;

            amt = getAmt();

            if (!angular.isUndefined($scope.banksList)) {
                var filtered = $.grep($scope.banksList, function (el) {
                    return el.bankCode === $scope.newAccountBankCode;
                });
                if ($scope.AMLOLimit !== undefined && filtered.length > 0) {
                    if (amt >= $scope.AMLOLimit && filtered[0].isORFT === '0' && filtered[0].bankCode !== kkconst.bankcode.kkbank &&
                        !anyIDService.isAnyID($scope.selectedAnyIDType)) {
                        $scope.isShowAccountName = true;
                        $scope.fundObj.toAccountName = $scope.accountDetails.accountName;

                    } else {
                        $scope.fundObj.toAccountName = '';
                    }
                } else {
                    $scope.fundObj.toAccountName = '';
                }
            }
        };

        function setDefualtBankCode() {
            //Set default bank list
            var kkBankName = 'KIATNAKIN BANK PCL.';
            if (!angular.isUndefined($scope.banksList)) {
                for (var i = 0; i < $scope.banksList.length; i++) {
                    if (kkconst.bankcode.kkbank === $scope.banksList[i].bankCode) {
                        kkBankName = $scope.banksList[i].bankName;
                    }
                }
            }
            $scope.setBankCode(kkconst.bankcode.kkbank, kkBankName);
        }

        $scope.newAccountBankCode = '';
        $scope.setBankCode = function (bankCode, bankName) {
            $scope.bankCode = bankCode;
            $scope.displaySelectedBankName = bankName;
            //for checking non ORFT
            $scope.newAccountBankCode = bankCode;
            $scope.checkShowInputAccountName();
            $scope.toBankName = bankName;
        };

        $scope.swiper = {};

        $scope.swiper_visible_slide = '';
        var getBankCodeImg = $scope.getBankCodeImg;
        $scope.onReadySwiperOnFund = function (swiper) {
            displayUIService.onReadySwiper(swiper, getBankCodeImg, $scope.swiper_visible_slide, $scope, function (bankId, bankName) {
                if ($scope.isNewAccount) {
                    $scope.setBankCode(bankId, bankName);
                }
            });
        };

        $scope.isDataEmpty = function (dataModel) {
            return dataModel === '' || dataModel === null;
        };

        $scope.validateMobileNo = function (value, target) {
            if (value !== '' && value !== undefined && value !== null) {
                if (!ValidationService.verifyPhoneFormat(value)) {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-ACC003');
                    if (target === 'clientPhoneNo') {
                        $scope.fundObj.clientPhoneNo = '';
                    } else if (target === 'toAccountNo') {
                        $scope.fundObj.toAccountNo = '';
                    }
                    return false;
                }
            }
            return true;
        };

        $scope.validateEmail = function (value) {
            if (value !== '' && value !== undefined && value !== null) {
                if (!ValidationService.verifyEmailFormat(value)) {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-ACC004');
                    $scope.fundObj.clientEmailId = '';
                    return false;
                }
            }
            return true;
        };

        /*$scope.funTransEmailPhonePopupInput = '';

        $scope.setUserAlertTo = function (alertToOption) {

            var maxLength = 0;

            if (alertToOption.model === 'mobile') {
                $scope.funTransEmailPhonePopupInput = $scope.fundObj.clientPhoneNo;
                maxLength = 10;
            } else {
                $scope.funTransEmailPhonePopupInput = $scope.fundObj.clientEmailId;
                maxLength = 40;
            }

            $ionicPopup.confirm({
                    scope: $scope,
                    title: `<i class="icon ${alertToOption.icon} fundTransferIcon-size"></i> ${$filter('translate')(alertToOption.label)}`,
                    cssClass: 'funTransEmailPhonePopup',
                    cancelText: $filter('translate')('button.cancel'),
                    okText: $filter('translate')('button.ok'),
                    template: `<input type="${alertToOption.inputType}" maxlength="${maxLength}" ng-model="funTransEmailPhonePopupInput"  placeholder="${$filter('translate')(
                        alertToOption.placeholder)}" class="borderGrey1px">`
                })
                .then(function (response) {
                    if (response) {
                        if ($scope.funTransEmailPhonePopupInput !== undefined) {
                            if (alertToOption.model === 'mobile' &&
                                ($scope.funTransEmailPhonePopupInput === '' || ValidationService.verifyPhoneFormat($scope.funTransEmailPhonePopupInput))) {
                                $scope.fundObj.clientPhoneNo = $scope.funTransEmailPhonePopupInput;
                            } else if (alertToOption.model === 'email' &&
                                ($scope.funTransEmailPhonePopupInput === '' || ValidationService.verifyEmailFormat($scope.funTransEmailPhonePopupInput))) {
                                $scope.fundObj.clientEmailId = $scope.funTransEmailPhonePopupInput;
                            }
                        } else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,
                                alertToOption.model === 'mobile'
                                    ? 'RIB-E-ACC003'
                                    : 'RIB-E-ACC004'
                            );
                            window.cordova.plugins.Keyboard.close();
                        }
                    } else {
                        $ionicListDelegate.closeOptionButtons();
                    }
                });
        };

        $scope.setUserPhone = function () {
            var alertToOption = {
                model: 'mobile',
                label: 'label.mobileNo',
                placeholder: 'label.placeholder.mobile',
                icon: 'ion-ios-telephone',
                inputType: 'tel'
            };
            $scope.setUserAlertTo(alertToOption);
        };

        $scope.setUserEmail = function () {
            var alertToOption = {
                model: 'email',
                label: 'label.email',
                placeholder: 'label.placeholder.email',
                icon: 'ion-ios-email-outline',
                inputType: 'email'
            };

            $scope.setUserAlertTo(alertToOption);
        };*/

        // ----------------- Today & Future Scheduling ---------------------------------
        $scope.selectTodayScheduleDate = function () {
            var defered = $q.defer();
            $ionicScrollDelegate.scrollBottom(true);
            $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
            $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;
            dateService.obj.futureStr = undefined;

            dateService.today()
                .then(function (result) {

                    if (result !== false) {

                        var date = result.date;
                        var day = result.day;
                        var month = result.month;
                        var year = result.year;

                        var dateStr = date;
                        var monthStr = month + 1;

                        var rawRecieveDate = '';
                        if (date < 10) {
                            dateStr = '0' + date;
                        }
                        if (month < 10) {
                            monthStr = '0' + (month + 1);
                        }
                        rawRecieveDate = dateStr + '/' + monthStr + '/' + year;

                        $scope.recieveDate = rawRecieveDate;
                        $scope.weekDayArray = '';
                        $scope.monthFullArray = generalValueDateService.monthsFullNameArray[month];
                        $scope.date = date;
                        $scope.year = year;

                        $translate.use(mainSession.lang);

                        dateService.obj.today = {};
                        dateService.obj.today.recieveDate = rawRecieveDate;
                        dateService.obj.today.weekDayArray = '';
                        dateService.obj.today.monthFullArray = $scope.monthFullArray;
                        dateService.obj.today.date = date;
                        dateService.obj.today.year = year;
                        //	});
                        defered.resolve(true);
                    } else {
                        defered.reject(false);
                    }
                });
            return defered.promise;
        };

        $scope.isRecurringEnabled = false;
        $scope.setRecurringEnabled = function (state) {
            $scope.isRecurringEnabled = state;
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.selectFutureScheduleDate = function () {
            if (!$scope.isRTP) {
                $ionicScrollDelegate.scrollBottom(true);
                dateService.selectFutureScheduleDate(dateService.obj.futureStr, function (dateObj, strDate, defultStr) {
                    if (dateObj !== null) {

                        $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
                        $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
                        $scope.isFutureDateTrans = true;

                        $scope.$apply(function () {
                            $scope.weekDayArray = dateObj.weekDayArray;
                            $scope.monthFullArray = dateObj.monthFullArray;
                            $scope.date = dateObj.date;
                            $scope.year = dateObj.year;
                            $translate.use(mainSession.lang);
                            $scope.recieveDate = strDate;

                            dateService.obj.futureStr = defultStr;
                        });
                    }
                });
            }
        };

        if (mainSession.lang === kkconst.LANGUAGE_th) {
            $scope.recurringTypesOptions = dateService.recurringTypesLangs.th;
            $scope.timeOfRecurringTypesOptions = dateService.timeOfRecurringTypesLangs.th;
        } else {
            $scope.recurringTypesOptions = dateService.recurringTypesLangs.en;
            $scope.timeOfRecurringTypesOptions = dateService.timeOfRecurringTypesLangs.en;
        }

        $scope.setScheduleType = function (type) {
            $scope.selectedPeriodTypeOption = type;
        };
        $scope.setTimeType = function (type) {
            $scope.selectedtimeOfPeriodTypeOption = type;
        };
        //Set dropdown default
        $scope.selectedPeriodTypeOption = $scope.recurringTypesOptions[0];
        $scope.selectedtimeOfPeriodTypeOption = $scope.timeOfRecurringTypesOptions[0];

        //End select button From list
        //---------------------------------End -- Recurring Period Modal------------------------------------------

        function setNotifyParams(sms, email) {
            if ($scope.fundObj.clientPhoneNo !== '' && $scope.fundObj.clientPhoneNo !== null) {
                // obj.params.alertSMS = $scope.fundObj.clientPhoneNo || '';
                sms($scope.fundObj.clientPhoneNo || '');
            } else {
                // obj.params.alertSMS = '';
                sms('');
            }

            if ($scope.fundObj.clientEmailId !== '' && $scope.fundObj.clientEmailId !== null) {
                //  obj.params.alertEmail = $scope.clientEmailId || '';
                email($scope.fundObj.clientEmailId || '');
            } else {
                // obj.params.alertEmail = '';
                email('');
            }
        }

        function confirmValidate() {
            if (!$scope.fundObj.selectedFromAccNo) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-TRN001');
                return true;
            }
            if ($scope.fundObj.amount === undefined || $scope.fundObj.amount === '' || parseFloat($scope.fundObj.amount) === 0) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-FUN009');
                return true;
            } else {
                $scope.onBlurFormatCurrency();
            }

            if ($scope.isPanelButtonsShow) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-TRN002');
                return true;
            }

            if ($scope.requireAccountName() && $scope.isShowAccountName && $scope.accountDetails.accountType !== fundtransferService.CONSTANT_ACCOUNT_TYPE_TD) {

                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-ACC022');
                return true;
            }
        }

        function validateAccount(anyIDType, number) {
            if (!number) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-REQ001', {AnyIdTypeName: $scope.anyidTypeLabelName});
                return true;
            } else {
                var regex = /^[0-9]*$/;
                var result = regex.test(number);
                if (!result) {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-REQ002', {AnyIdTypeName: $scope.anyidTypeLabelName});
                    return true;
                }
            }
            if (!$scope.newAccountBankCode && $scope.selectedAnyIDType === kkconst.ANY_ID_TYPE.ACCOUNT) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-REG003');
                return true;
            }
        }

        function setImmediateType() {
            if ($scope.isFutureDateTrans) {
                return 'L';
            } else {
                return 'T';
            }
        }

        var SCHEDULE_FUNDTRANSFER_DETAIL = 'SFD';

        function scheduleFundTransferDetailState() {
            if ($ionicHistory.viewHistory().backView !== null && $ionicHistory.viewHistory().backView.stateName === kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE) {
                return SCHEDULE_FUNDTRANSFER_DETAIL;
            } else {
                return '';
            }
        }

        function editType() {
            if (scheduleFundtransferService.recurringIsOneTime) {
                //This time
                return '0';
            } else {
                //All time
                return '1';
            }
        }

        function decideToFund(obj) {
            if (scheduleFundTransferDetailState() === SCHEDULE_FUNDTRANSFER_DETAIL) {
                //for edit schedule
                obj.params.editType = editType();
                obj.params.transactionId = scheduleFundtransferService.scheduleDataDetail.transactionID;
                obj.params.masterTransactionId = scheduleFundtransferService.scheduleDataDetail.masterTransactionID;
                editScheduleFundtransfer(obj, transferType);
            } else {
                prepareFundtransfer(obj, transferType);
            }
        }

        //Confirm event to Proceed to next Screen
        $scope.showConfirmPage = function () {

            if (confirmValidate()) {
                return;
            }
            var obj = {};
            obj.params = {};
            obj.params.fromAccount = $scope.fundObj.selectedFromAccountID + ':' + $scope.fundObj.selectedFromAccNo;
            obj.params.amount = parseFloat(generalService.parseNumber($scope.fundObj.amount) || '0.00');
            obj.params.transferDate = $scope.recieveDate;
            obj.params.alertLanguage = kkconst.LANGUAGE_TH;

            obj.params.scanFlag = $scope.scanFlag;

            // true for future dates
            obj.params.immediateType = setImmediateType();

            if ($scope.isRecurringEnabled) {
                obj.params.recurringType = 'Y';
                obj.params.scheduleType = $scope.selectedPeriodTypeOption.value; /*'2' $scope.recurringSheduleTypeData.recurringSheduleTypeSelect;*/
                obj.params.recurringTime = $scope.selectedtimeOfPeriodTypeOption.value; /* '1'  $scope.recurringSheduleTimeData.recurringSheduleTimeSelect;*/
            } else {
                obj.params.scheduleType = 0; /*'2' $scope.recurringSheduleTypeData.recurringSheduleTypeSelect;*/
                obj.params.recurringType = 'N';
                obj.params.recurringTime = 0; // @180329 fix for new funtransfer service
            }

            if ($scope.isNewAccount) {//New Account

                if (validateAccount($scope.selectedAnyIDType, $scope.fundObj.toAccountNo)) {
                    return;
                }

                if (!$scope.validateMobileNo($scope.fundObj.clientPhoneNo, '') || !$scope.validateEmail($scope.fundObj.clientEmailId)) {
                    return;
                }

                setNotifyParams(function (s) {
                    obj.params.alertSMS = s;
                }, function (e) {
                    obj.params.alertEmail = e;
                });

                obj.params.toBankCode = $scope.newAccountBankCode;
                if (anyIDService.isAnyID($scope.selectedAnyIDType)) {
                    obj.params.toBankCode = '';
                    $scope.toBankName = '';
                }

                obj.params.toAccount = '-1' + ',' + '-1' + ':' + $scope.fundObj.toAccountNo;
                obj.params.toAccountName = $scope.fundObj.toAccountName;//generalService.adjustText($scope.fundObj.toAccountName);//$scope.fundObj.toAccountName; // AMLO
                $scope.fundTransferTDShow = false;
                transferType = fundtransferService.CONSTANT_TRANSFER_TYPE_NEW;

                decideToFund(obj);

            } else if (isTrue($scope.isAccountFromList, $scope.isCasa)) {// CASA or Other account

                if (!$scope.isOwnerAccount) {
                    // setNotifyParams(obj);
                    if (!$scope.validateMobileNo($scope.fundObj.clientPhoneNo, '') || !$scope.validateEmail($scope.fundObj.clientEmailId)) {
                        return;
                    }

                    setNotifyParams(function (s) {
                        obj.params.alertSMS = s;
                    }, function (e) {
                        obj.params.alertEmail = e;
                    });
                }
                transferType = fundtransferService.CONSTANT_TRANSFER_TYPE_CASA;
                obj.params.toAccount = $scope.accountDetails.categoryId + ',' + $scope.accountDetails.accountID + ':' + $scope.accountDetails.accountNumber;
                $scope.fundTransferTDShow = false;
                obj.params.toBankCode = $scope.accountDetails.bankCode;
                obj.params.toAccountName = $scope.fundObj.toAccountName; // AMLO
                obj.params.rtpReferenceNo = $scope.accountDetails.rtpReferenceNo || '';

                if (anyIDService.isAnyID($scope.accountDetails.anyIDType)) {
                    obj.params.toBankCode = '';
                    $scope.toBankName = '';
                }

                decideToFund(obj);

            } else if (isTrue($scope.isAccountFromList, $scope.showTDTermsnConditions)) {//TD
                if (validateBenefitAccount()) {
                    return;
                }

                if ($('#select_field_term_freq')
                    .val() !== '') {
                    $scope.selected_term_option = JSON.parse($('#select_field_term_freq')
                        .val());
                } else {
                    $scope.selected_term_option = $scope.selected_term_type;
                }

                //$scope.selected_term_option = JSON.parse($('#select_field_term_freq').val());
                var fcconTdTermType = angular.copy($scope.selected_term_option);
                delete fcconTdTermType.term_description;
                delete fcconTdTermType.freq_description;

                $scope.fundTransferTDShow = true;
                transferType = fundtransferService.CONSTANT_ACCOUNT_TYPE_TD;
                obj.params.toAccount = '0' + ',' + $scope.accountDetails.accountID + ':' + $scope.accountDetails.accountNumber;

                fcconTdTermType.benefitAcc = $scope.benefitAccountNumber;
                obj.params.fcconTdTermType = fcconTdTermType;

                //No need parameters
                delete obj.params.immediateType;
                delete obj.params.recurringType;
                delete obj.params.transferDate;
                delete obj.params.scheduleType;
                delete obj.params.recurringTime;

                fundtransferService.objCreate.transferType = transferType;
                fundtransferService.objConfirm = $scope.fundObj;
                fundtransferService.objConfirm.toBankCode = $scope.accountDetails.bankCode;
                fundtransferService.objConfirm.accountNumber = $scope.accountDetails.accountNumber;
                fundtransferService.objConfirm.accountID = $scope.accountDetails.accountID;
                fundtransferService.objConfirm.toAccountName = $scope.accountDetails.accountAliasName;

                fundtransferService.getRatesByCIFType(obj, function (responseCode, resultObj) {
                    if (responseCode === kkconst.success) {
                        if (fromBankCode !== null) {
                            fundtransferService.obj.fromBankcode = fromBankCode;
                        } else {
                            fundtransferService.obj.fromBankcode = myAccountService.accountDetail.bankCode;
                        }
                        fundtransferService.obj.bankCode = $scope.accountDetails.bankCode;
                        fundtransferService.obj.toBankName = $scope.toBankName;
                        fundtransferService.obj.toAccountName = $scope.accountDetails.accountAliasName;

                        fundtransferService.objCreate.fundTransferTDShow = true;

                        // fundtransferService.objTD  = {};
                        fundtransferService.objTD = resultObj;

                        fundtransferService.objTD.fromAccount = $scope.fundObj.selectedFromAccNo;
                        fundtransferService.objTD.fcconTdTermType = fcconTdTermType;

                        fundtransferService.objCreate.isRequireOtp = fundtransferService.objTD.requireOtp || false;

                        $state.go(kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.STATE);
                    } else {
                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseCode);
                    }
                });
            } else {
                // do something
            }
        };

        function isTrue(param1, param2) {
            if (param1 && param2) {
                return true;
            }
            return false;
        }

        function prepareFundtransfer(obj, paramTransferType) {
            obj.params.anyIDType = $scope.selectedAnyIDType;
            fundtransferService.prepareFundtransfer(obj, function (responseStatus, resultObj) {
                if (responseStatus.responseCode === kkconst.success) {
                    fundtransferService.obj = resultObj;
                    fundtransferService.objCreate.selectedFromName = $scope.fundObj.selectedFromName;
                    fundtransferService.objCreate.selectedFromTotalActBalance = $scope.fundObj.selectedFromTotalActBalance;
                    fundtransferService.objCreate.fundTransferTDShow = $scope.fundTransferTDShow;
                    fundtransferService.objCreate.transferType = paramTransferType;
//				fundtransferService.obj.anyIDType	=  $scope.selectedAnyIDType;
                    fundtransferService.obj.toBankName = $scope.toBankName;
                    fundtransferService.objCreate.isRequireOtp = fundtransferService.obj.requireOtp || false;

                    // for RTP
                    fundtransferService.obj.additionalNote = $scope.fundObj.additionalNote;

                    if (fromBankCode !== null) {
                        fundtransferService.obj.fromBankcode = fromBankCode;
                    } else {
                        fundtransferService.obj.fromBankcode = myAccountService.accountDetail.bankCode;
                    }

                    $state.go(kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.STATE);
                } else {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseStatus.errorMessage);// popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
                }
            });
        }

        function editScheduleFundtransfer(obj, paramTransferType) {
            obj.params.anyIDType = $scope.selectedAnyIDType;
            fundtransferService.editSchedule(obj, function (responseStatus, resultObj) {
                if (responseStatus.responseCode === kkconst.success) {
                    fundtransferService.obj = resultObj;

                    fundtransferService.obj.fromBankcode = resultObj.fundTransferRequest.toBankCode;
                    fundtransferService.obj.toBankName = resultObj.fundTransferRequest.toBankName;
                    fundtransferService.obj.toAccountName = resultObj.fundTransferRequest.toAccountName;

                    //Add to object
                    fundtransferService.objCreate.selectedFromName = $scope.fundObj.selectedFromName;
                    fundtransferService.objCreate.selectedFromTotalActBalance = $scope.fundObj.selectedFromTotalActBalance;
                    fundtransferService.objCreate.fundTransferTDShow = $scope.fundTransferTDShow;
                    fundtransferService.objCreate.transferType = paramTransferType;
                    fundtransferService.objCreate.isRequireOtp = fundtransferService.obj.requireOtp || false;

                    $state.go(kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.STATE);
                } else {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseStatus.errorMessage);//popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,responseCode, {limitTransferAmount:resultObj} );
                }
            });
        }

        $scope.selected_term_option = {};
        $scope.selected_term_type = {};
        $scope.selected_term_freq = {};
        $scope.options_term_type = [];
        $scope.options_term_freq = [];

        $scope.onChangeTermType = function (option) {

            $scope.selected_term_type = option;
            for (var index in $scope.options_term_freq) {
                if ($scope.selected_term_type.term === $scope.options_term_freq[index].term) {
                    $scope.selected_term_freq.sel = $scope.options_term_freq[index];
                    break;
                }
            }
        };

        $scope.filterfreq = function (option) {
            return (option.term === $scope.selected_term_type.term && option.productTypeDescription === $scope.selected_term_type.productTypeDescription);
        };

        $scope.populateTermOptions = function () {

            $scope.selected_term_type = {};
            $scope.selected_term_freq = {};

            $scope.options_term_type = {};
            $scope.options_term_freq = {};

            var masterlist = $scope.fcconTdTermTypes;
            $scope.options_term_type = angular.copy(masterlist);
            console.log($scope.options_term_type);
            $scope.options_term_freq = angular.copy(masterlist);

            $scope.selected_term_type = $scope.options_term_type[0];

            for (var index in $scope.options_term_freq) {
                if ($scope.selected_term_type.term === $scope.options_term_freq[index].term) {
                    $scope.selected_term_freq = $scope.options_term_freq[index];
                    break;
                }
            }
        };

        function getTDTermsNConds() {

            var obj = {};
            obj.params = {};
            obj.params.language = mainSession.lang;
            obj.params.fromAccount = $scope.fundObj.selectedFromAccountID + ':' + $scope.fundObj.selectedFromAccNo;
            obj.params.toAccount = '0' + ',' + $scope.accountDetails.accountID + ':' + $scope.accountDetails.accountNumber;

            obj.params.amount = parseFloat(generalService.parseNumber($scope.fundObj.amount) || '0.00');
            obj.params.alertEmail = $scope.fundObj.clientEmailId;
            obj.params.alertSMS = $scope.fundObj.clientPhoneNo;
            obj.params.alertLanguage = $translate.use();

            fundtransferService.getTDTermsNConds(obj, function (responseCode, resultObj) {

                if (responseCode === kkconst.success) {
                    $scope.showNext = true;
                    fundtransferService.obj.fromBankcode = myAccountService.accountDetail.bankCode;

                    $scope.fcconTdTermTypes = resultObj.fcconTdTermTypes;

                    for (var index in $scope.fcconTdTermTypes) {
                        if ($translate.use() === kkconst.LANGUAGE_th) {
                            $scope.fcconTdTermTypes[index].term_description = $scope.fcconTdTermTypes[index].termNameTha;
                            $scope.fcconTdTermTypes[index].freq_description = $scope.fcconTdTermTypes[index].freqIntPayDescTha;
                        } else {
                            $scope.fcconTdTermTypes[index].term_description = $scope.fcconTdTermTypes[index].termNameEng;
                            $scope.fcconTdTermTypes[index].freq_description = $scope.fcconTdTermTypes[index].freqIntPayDescEng;
                        }
                    }
                    $scope.populateTermOptions();

                    $scope.benefitAccountList = resultObj.benefitAccList || [];
                } else {
                    $scope.showNext = false;
                    $scope.showTDTermsnConditions = false;
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, responseCode);
                }
            });
        }

        function isAmountEmpty() {
            var flag = false;
            if ($scope.fundObj.amount !== undefined && $scope.fundObj.amount !== 0 && $scope.fundObj.amount !== null && $scope.fundObj.amount !== '') {
                flag = true;
            }
            return flag;
        }

        function isAccountUndefined() {
            var flag = false;
            if ($scope.fundObj.selectedFromAccNo !== undefined && $scope.accountDetails.accountNumber !== undefined) {
                flag = true;
            }
            return flag;

        }

        // add delay
        $scope.value = {
            executeTDTermCondTimer: null,
            executeTDTermCondInterval: 500,
            isCheckTDTermsNConds: false,
            accountNumber: '##'
        };
        //watching for select to TD
        $scope.$watchGroup([
            'accountDetails.accountType',
            'fundObj.amount',
            'fundObj.selectedFromAccNo',
            'value.accountNumber'
        ], function (newValues, oldValues) {
            if ($scope.value.executeTDTermCondTimer !== null) {
                $timeout.cancel($scope.value.executeTDTermCondTimer);
                $scope.value.executeTDTermCondTimer = null;
            }

            $scope.value.executeTDTermCondTimer = $timeout(function () {

                if ($scope.accountDetails.accountType === fundtransferService.CONSTANT_ACCOUNT_TYPE_TD && !$scope.isCasa && isAmountEmpty() && isAccountUndefined()) {

                    if ($scope.value.isCheckTDTermsNConds) {
                        $scope.showTDTermsnConditions = true;
                        getTDTermsNConds();
                    }
                } else {
                    $scope.showTDTermsnConditions = false;
                }
            }, $scope.value.executeTDTermCondInterval);
        });

        setDefualtBankCode();//Set default bank list

        var rtpUIRederer = function () {
            $scope.isPanelButtonsShow = false;
            $scope.isAccountFromList = true;
            $scope.isShowRecurringForm = false;
            $scope.isRecurringEnabled = false;

            $scope.isRTP = true;

            fundToObj = requestToPayInComingService.getRequestToPayDetail();
            $scope.selectedAnyIDType = fundToObj.requesterIdType;
            $scope.clientImgUrl = $scope.getBankCodeImg('', 'image');
            $scope.fundObj.amount = fundToObj.amount + '';
            $scope.accountDetails.accountAliasName = fundToObj.requesterAccountName;
            $scope.toBankName = '';
            $scope.accountDetails.accountNumber = fundToObj.requesterIdValue;
            $scope.accountDetails.bankCode = '';
            $scope.accountDetails.categoryId = -1;
            $scope.accountDetails.accountID = -1;
            $scope.accountDetails.rtpReferenceNo = fundToObj.rtpreference;

            $scope.accountDetails.accountName = fundToObj.requesterAccountName;

            $scope.virtualKeyboardAmount.option.isKeyboardActive = true;
            // set virtual keyboard option
            $scope.virtualKeyboardAmount.option.setOption($scope.virtualKeyboardAmount.option);

            // for RTP incoming
            $scope.fundObj.additionalNote = fundToObj.additionalNote || '';
        };

        var QRScannerUIRender = function () {
            fundToObj = fundTransferTOService.getSelectedAccount();
            if (fundToObj.scanFlag == 'Y') {
                $scope.scanFlag = 'Y';
            } else {
                $scope.scanFlag = 'N';
            }

            tmpSelected = fundToObj.anyIDType;
            $scope.selectNewAccount();

            $scope.selectedAnyIDType = fundToObj.anyIDType;

            $scope.fundObj.toAccountNo = fundToObj.accountNumber;

            if (fundToObj.amount == null || parseFloat(fundToObj.amount) == 0) {
                $scope.virtualKeyboardAmount.option.isKeyboardActive = true;
            } else {
                $scope.fundObj.amount = fundToObj.amount;
                $scope.virtualKeyboardAmount.option.isKeyboardActive = false;
            }

            $scope.dirOptions = {
                activeItem: fundToObj.anyIDType
            };
            if (fundToObj.toBankCode !== undefined) {
                $scope.dirBankCodeOptions = {
                    activeItem: fundToObj.toBankCode
                };
            }
            $scope.virtualKeyboardAccount.option.isKeyboardActive = false;
            $scope.isFormQRScanner = true;
        };

        //private function
        var setFundFromOtherPage = function () {
            switch ($ionicHistory.viewHistory().backView.stateName) {
                case kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE:
                    $scope.showSelectBtn = false;
                    $scope.showSelectFromAccountDetails = true;
                    $scope.transTodayScheduleDate = SELECTED_BTN_BG_COLOR;
                    $scope.transFutureScheduleDate = UNSELECTED_BTN_BG_COLOR;
                    $scope.fundObj = {};
                    $scope.fundObj.selectedFromName = myAccountService.accountDetail.myAccountAliasName;
                    $scope.fundObj.selectedFromAccNo = myAccountService.accountDetail.myAccountNumber
                        ? myAccountService.accountDetail.myAccountNumber.substring(0, 10)
                        : myAccountService.accountDetail.myAccountNumber; //myAccountService.accountDetail.myAccountNumber
                    $scope.fundObj.selectedFromTotalActBalance = myAccountService.accountDetail.myAvailableBalance;
                    $scope.fundObj.selectedFromAccountID = myAccountService.accountDetail.myAccountID;
                    break;
                case kkconst.ROUNTING.OTHER_ACCOUNT.STATE:
                    //new other account
                    $scope.isPanelButtonsShow = false;
                    $scope.isAccountFromList = true;
                    fundToObj = fundTransferTOService.getSelectedAccount();
                    $scope.selectedAnyIDType = fundToObj.anyIDType;
                    $scope.accountDetails.bankCode = fundToObj.bankCode;
                    $scope.clientImgUrl = $scope.getBankCodeImg(fundToObj.bankCode, 'image');
                    $scope.accountDetails.accountAliasName = fundToObj.accountAliasName;
                    $scope.accountDetails.accountNumber = fundToObj.accountNumber;
                    $scope.accountDetails.bankCode = fundToObj.bankCode;
                    $scope.accountDetails.categoryId = fundToObj.categoryId;
                    $scope.accountDetails.accountID = fundToObj.accountID;

                    $scope.accountDetails.accountName = fundToObj.accountName;

                    $scope.fundObj.clientEmailId = fundToObj.email;
                    $scope.fundObj.clientPhoneNo = fundToObj.mobileNumber;
                    $scope.toBankName = fundToObj.bankName;
                    $scope.setBankCode(fundToObj.bankCode, fundToObj.bankName);

                    // set default anyid type
                    tmpSelected = 'ACCTNO';

                    break;
                case kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE:
                    $scope.toBankName = scheduleFundtransferService.scheduleDataDetail.bankName;
                    $scope.showSelectBtn = false;
                    $scope.showSelectFromAccountDetails = true;
                    $scope.isPanelButtonsShow = false;
                    $scope.isAccountFromList = true;
                    $scope.isCasa = true;
                    $scope.fundObj.selectedFromName = scheduleFundtransferService.scheduleDataDetail.fromAliasName;
                    $scope.fundObj.selectedFromAccNo = scheduleFundtransferService.scheduleDataDetail.fromAccountNumber;
                    $scope.fundObj.selectedFromAccountID = scheduleFundtransferService.scheduleDataDetail.fromAccountID;
                    var fromAccountNumber = scheduleFundtransferService.scheduleDataDetail.fromAccountNumber;
                    myAccountService.inquiryMyAccountBalanceAvailable(fromAccountNumber, function (resultCode, resultObj) {
                        if (kkconst.success === resultCode) {
                            $scope.fundObj.selectedFromTotalActBalance = resultObj.value;
                        } else {
                            popupService.showErrorPopupMessage('lable.error', resultCode);
                        }
                    });
                    $scope.fundObj.amount = scheduleFundtransferService.scheduleDataDetail.amount;
                    $scope.accountDetails.accountAliasName = scheduleFundtransferService.scheduleDataDetail.toAliasName;
                    $scope.accountDetails.accountNumber = scheduleFundtransferService.scheduleDataDetail.toAccountNumber;
                    $scope.accountDetails.accountID = scheduleFundtransferService.scheduleDataDetail.toAccountID;
                    $scope.accountDetails.categoryId = scheduleFundtransferService.scheduleDataDetail.toCategoryID;
                    $scope.accountDetails.bankCode = scheduleFundtransferService.scheduleDataDetail.bankCode;

                    $scope.isOwnerAccount = ($scope.accountDetails.categoryId === '0');

                    $scope.clientImgUrl = $scope.getBankCodeImg(scheduleFundtransferService.scheduleDataDetail.bankCode, 'image');
                    $scope.fundObj.clientPhoneNo = scheduleFundtransferService.scheduleDataDetail.toMobileNumber;
                    $scope.fundObj.clientEmailId = scheduleFundtransferService.scheduleDataDetail.toEmail;
                    $scope.recieveDate = scheduleFundtransferService.scheduleDataDetail.debitDate1;
                    var result = displayUIService.convertForShowWeekDayDate(scheduleFundtransferService.scheduleDataDetail.debitDate1);
                    $scope.weekDayArray = result.dayOfWeek;
                    $scope.date = result.date;
                    $scope.monthFullArray = result.month;
                    $scope.year = result.year;

                    // set schedule future calendar debit date
                    dateService.obj.futureStr = result.dateTime;

                    $scope.setBankCode(scheduleFundtransferService.scheduleDataDetail.bankCode, scheduleFundtransferService.scheduleDataDetail.bankName);
                    $scope.accountDetails.accountName = scheduleFundtransferService.scheduleDataDetail.toAccountName || '';
                    if (scheduleFundtransferService.recurringIsOneTime) {
                        $scope.isRecurringEnabled = false;
                        $scope.isShowRecurringForm = false;
                    } else {
                        $scope.isRecurringEnabled = true;
                        $scope.isShowRecurringForm = true;
                        var recurringType = $filter('filter')($scope.recurringTypesOptions, scheduleFundtransferService.scheduleDataDetail.recurringType);
                        $scope.selectedPeriodTypeOption = recurringType[0];
                        var recurringTimes = $filter('filter')($scope.timeOfRecurringTypesOptions, scheduleFundtransferService.scheduleDataDetail.recurringTimes);
                        $scope.selectedtimeOfPeriodTypeOption = recurringTimes[0];
                    }
                    $scope.transTodayScheduleDate = UNSELECTED_BTN_BG_COLOR;
                    $scope.transFutureScheduleDate = SELECTED_BTN_BG_COLOR;
                    $scope.isFutureDateTrans = true;
                    // set anyID type
                    $scope.selectedAnyIDType = scheduleFundtransferService.scheduleDataDetail.anyIDType;
                    $scope.checkShowInputAccountName();
                    console.log('por', $scope.accountDetails);

                    // set default anyid type
                    tmpSelected = 'ACCTNO';
                    break;
                case kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE:
                    rtpUIRederer();
                    break;
                case kkconst.ROUNTING.QR_CODE_SCANNER.STATE:
                    QRScannerUIRender();
                    break;
                case kkconst.ROUNTING.NOTIFICATION.STATE:
                    rtpUIRederer();
                    break;
                case kkconst.ROUNTING.MY_ACCOUNT.STATE:
                    rtpUIRederer();
                    break;
            }
        };

        $scope.selectTodayScheduleDate()
            .then(function (result) {
                if ($ionicHistory.viewHistory().backView !== null) {
                    $scope.isShowBack = true;
                    dateService.obj.futureStr = undefined;
                    setFundFromOtherPage();
                    $translate.use(mainSession.lang);
                } else {
                    $scope.isShowBack = false;
                    dateService.obj.futureStr = undefined;
                    $scope.fundObj.amount = '';

                }
            }, function () {
                //handle error
            });

        $scope.onFocusClearAmount = function () {
            $scope.fundObj.amount = generalService.onFocusClearAmount($scope.fundObj.amount);
            $scope.placeholderAmount = '';
        };

        $scope.onBlurFormatCurrency = function () {
            $scope.fundObj.amount = generalService.onBlurFormatCurrency($scope.fundObj.amount);
        };

        $scope.requireAccountName = function () {
            if (($scope.fundObj.toAccountName !== undefined)) {
                $scope.fundObj.toAccountName = generalService.adjustText($scope.fundObj.toAccountName);
            }

            if ($scope.isShowAccountName && ($scope.fundObj.toAccountName === undefined || $scope.fundObj.toAccountName.length <= 0)) {

                return true;
            }
            return false;
        };

        // String.prototype.trim = function(){
        // 	return this.replace(/^\s+|\s+$/g,'');
        // };

        // create virtual keyboard option
        $scope.virtualKeyboardAmount = {
            option: {
                disableDotButton: false,
                isKeyboardActive: true,
                maxlength: 12,
                IsEditModel: true
            },
            onkeyup: function (value) {
                $scope.fundObj.amount = value;
                $scope.checkShowInputAccountName();
            },
            onblur: function () {
                $scope.value.isCheckTDTermsNConds = false;
                $scope.onBlurFormatCurrency();
            },
            onfocus: function () {
                $scope.value.isCheckTDTermsNConds = true;
                $scope.onFocusClearAmount();
            }
        };

        $scope.virtualKeyboardAccount = {
            option: {
                disableDotButton: true,
                isKeyboardActive: true, //maxlength: 30,
                IsEditModel: true,
                setOption: function () {
                    // todo
                }
            }
        };

        $scope.virtualKeyboardMobileNo = {
            option: {
                disableDotButton: true,
                isKeyboardActive: true,
                IsEditModel: true,
                maxlength: 10
            }
        };

        $scope.isAcctNo = true;

        function isAcctNoFunc(type) {
            if (type === 'ACCTNO') {
                $scope.isAcctNo = true;
            } else {
                $scope.isAcctNo = false;
            }
        }

        $scope.selectedAnyIDType = '';

        $scope.switchSelected = function (selectedType) {
            $scope.selectedAnyIDType = selectedType;
            isAcctNoFunc($scope.selectedAnyIDType);
            $scope.virtualKeyboardAccount.option.maxlength = anyIDService.getAnyIDinfo(selectedType).maxLength;
            $scope.anyidTypeLabelName = anyIDService.getAnyIDinfo(selectedType).LabelName;

            if (selectedType !== tmpSelected) {
                $scope.fundObj.toAccountNo = '';
                $scope.checkShowInputAccountName();
                tmpSelected = selectedType;
            }
        };

        var minWidth = window.innerWidth;
        var w = 55;
        if (minWidth > 415) {
            w = 80;
        }
        var slidesPView = Math.floor(minWidth / w);

        $scope.bankListSwiper = {
            invokes: function (value) {
                if ($scope.isNewAccount) { //Set only new account
                    $scope.setBankCode(value.bankCode, value.bankName);
                }
            },
            overrideParams: {
                slidesPerColumn: 1,
                slidesPerView: slidesPView,
                spaceBetween: 2,
                loopedSlides: 25,
                loop: true,
                showNavButtons: false,
                slideToClickedSlide: $scope.onTouchEnd,
                centeredSlides: true,
                watchSlidesVisibility: true
            }
        };

        var mWidth = window.innerWidth;
        var anyWidth = 90;
        var space = 8;
        if (mWidth > 415) {
            anyWidth = 100;
            space = 4;
        }
        var perView = Math.floor(mWidth / anyWidth);

        $scope.anyIdTypeListSwiper = {
            activeItem: ($scope.selectedAnyIDType === undefined)
                ? undefined
                : $scope.selectedAnyIDType,
            invokes: function (value) {
                $scope.anyidTypeDescriptionName = value.anyidTypeDescriptionName;

                if (value.action === 'onTransitionEnd' && !$scope.isAccountFromList) {
                    $scope.anyidTypeLabelName = value.anyidTypeLabelName;
                    $scope.selectedAnyIDType = value.anyidTypeCode;
                    isAcctNoFunc($scope.selectedAnyIDType);
                    $scope.fundObj.anyidTypeLength = value.anyidTypeLength;
                    $scope.isStringDataType = value.anyidTypeDataType === kkconst.ANY_ID_TYPE_DATA_TYPE.STRING;
                    if (!$scope.isStringDataType) {
                        $scope.virtualKeyboardAccount.option.maxlength = value.anyidTypeLength;
                        if (value.anyidTypeLength == 0) {
                            $scope.virtualKeyboardAccount.option.maxlength = anyIDService.getDefaultValidate(value.anyidTypeCode);
                        }
                        $scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
                    }

                    if (value.anyidTypeCode !== tmpSelected) {
                        $scope.fundObj.toAccountNo = '';
                        tmpSelected = value.anyidTypeCode;
                    }
                    $scope.checkShowInputAccountName();
                }
            },
            overrideParams: {
                slidesPerColumn: 1,
                slidesPerView: perView,
                spaceBetween: space,
                loopedSlides: 25,
                loop: true,
                showNavButtons: false,
                slideToClickedSlide: $scope.onTouchEnd,
                centeredSlides: true,
                watchSlidesVisibility: true
            }
        };

        $scope.getContactPhone = function (target) {
            $ionicPlatform.ready(function () {
                navigator.contacts.pickContact(function (contact) {
                    contact = contact.phoneNumbers[0].value;
                    if (contact.substring(0, 3) === '+66') {
                        contact = contact.replace(contact.substring(0, 3), '0');
                    }
                    contact = contact.replace(/[^0-9.]/g, '');
                    if (target === 'clientPhoneNo' && $scope.validateMobileNo(contact, 'clientPhoneNo')) {
                        $scope.fundObj.clientPhoneNo = contact;
                    } else if (target === 'toAccountNo' && $scope.validateMobileNo(contact, 'toAccountNo')) {
                        $scope.fundObj.toAccountNo = contact;
                    }
                    $scope.$apply();
                }, function (err) {
                });
            });
        };

        var CONSTANT_BENEFIT_ACCOUNT_LIST_MODAL = 'templates/benefit-account-list-modal.html';

        function validateBenefitAccount() {
            if (!$scope.benefitAccountNumber) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'error.validBenefitAccount');
                return true;
            }
        }

        $ionicModal.fromTemplateUrl(CONSTANT_BENEFIT_ACCOUNT_LIST_MODAL, {
                scope: $scope,
                animation: $scope.modalAnimate
            })
            .then(function (modal) {
                $scope.benefitAcctListModal = modal;
            });

        $scope.closeBenefitAcctModal = function () {
            $scope.showNext = true;
            $scope.benefitAcctListModal.hide();
        };

        $scope.selectedBenefitAccount = function (account) {
            $scope.benefitAccountNumber = account;
            $scope.closeBenefitAcctModal();
        };

        $scope.showSelectBenefitAccountDetail = false;
        $scope.selectBenefitAccount = function (isShowDetail) {
            $scope.showNext = false;
            $scope.benefitAcctListModal.show();
            $scope.showSelectBenefitAccountDetail = isShowDetail;
        };
    }
);