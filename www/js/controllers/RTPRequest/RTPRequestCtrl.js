angular.module('ctrl.rtpRequestCtrl', [])
    .controller('RTPRequestCtrl', function ($scope, $state, $ionicHistory, mainSession, generalService, dateService, generalValueDateService, anyIDService, kkconst, rtprequestService, $ionicModal, popupService, myAccountService,otherAccountService, ValidationService, $ionicPlatform) {
        var otherAccoutList;
        $scope.amountModel = {
            amount: '0.00'
        };
        $scope.accountModel = {
            accountNo: '',
            anyidTypeLength: 0
        };
        $scope.memo = {
            txt: ''
        };
        $scope.today;
        $scope.isShowNext = true;
        $scope.isShowRequestTo = true;
        $scope.isShowNewAccount = false;
        $scope.isShowOtherAnyIdAccountDetail = false;
        $scope.anyIdTypeList;
        $scope.selectedAnyIDType;
        $scope.isShowBack = false;
        $scope.noResult = false;

        viewInit();

        function viewInit() {
            createVirtualKeyboardAmount();
            createVirtualKeyboardAccount();
            getServerDate();
            anyIdTypeListInit();
            historyPageInit();
            swiperInit();
            modalMyPromptPayAccListInit();
            madalOtherAccListInit();
        }

        $scope.goNextPage = function () {
            if (!confirmValidate()) {
                return;
            }
            var data = {
                fromAnyIdType: $scope.myAccount.anyIDType,
                fromAnyIdValue: $scope.myAccount.anyIDValue,
                fromAccountNo: $scope.myAccount.accountNo,
                toAnyIdType: $scope.isShowNewAccount ? $scope.selectedAnyIDType : $scope.otherAnyIdAccount.anyIDType,
                toAnyIdValue: $scope.isShowNewAccount ? $scope.accountModel.accountNo : $scope.otherAnyIdAccount.acctNo,
                amount: $scope.amountModel.amount,
                memo: $scope.memo.txt
            }
            rtprequestService.verifyRTP(data, function (resultCode, resultObj) {
                if (resultCode === kkconst.success) {
                    rtprequestService.setResultRTPVerify(resultObj.value);
                    $state.go(kkconst.ROUNTING.RTP_REQUEST_CONFIRM.STATE);
                } else {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, resultCode); //{ limitTransferAmount: resultObj }
                }
            });
        }
        $scope.openNewAccount = function () {
            $scope.isShowRequestTo = false;
            $scope.isShowNewAccount = true;
        }
        $scope.openFromList = function () {
            $scope.isShowNext = false;
            rtprequestService.inquiryRTPInquiryAnyidOther(function (resultCode, resultObj) {
                if (resultCode === kkconst.success) {
                    $scope.accountCategoryList = resultObj.categoryList;
                    if (!otherAccoutList) {
                        // set default
                        $scope.selectedCategory = resultObj.categoryList[0];
                        otherAccoutList = resultObj.accountList;
                        if(resultObj.accountList.length !== 0){
                            $scope.otherAccoutListFilter = getOtherAccountListByCategory($scope.accountCategoryList[0].categoryName);
                        }else{
                            $scope.noResult = true;
                            $scope.otherAccoutListFilter = otherAccoutList;
                        }
                    } else {
                        otherAccoutList = resultObj.accountList;
                    }
                    $scope.getListSuccess = true;
                    $scope.otherAccListModal.show();
                } else {
                    popupService.showErrorPopupMessage('Warning', resultCode);
                    $scope.isShowNext = true;
                }
            });
        }
        $scope.selectedOtherAnyIdAccount = function (otherAnyIdAccount) {
            $scope.selectedAnyIDType = otherAnyIdAccount.anyIDType;
            $scope.otherAnyIdAccount = otherAnyIdAccount;
            $scope.isShowRequestTo = false;
            $scope.isShowNewAccount = false;
            $scope.isShowOtherAnyIdAccountDetail = true;
            $scope.closeFormListModal();
        }
        $scope.onChangeCategory = function (category) {
            $scope.selectedCategory = category;
            $scope.otherAccoutListFilter = getOtherAccountListByCategory(category.categoryName);
        };
        $scope.closeOtherAccoutDetail = function () {
            $scope.isShowOtherAnyIdAccountDetail = false;
            $scope.isShowRequestTo = true;
            $scope.otherAnyIdAccount = null;
        }
        $scope.closeFormListModal = function () {
            $scope.isShowNext = true;
            $scope.otherAccListModal.hide();
        }
        $scope.getAnyIDIcon = rtprequestService.getAnyIDIcon;
        $scope.getAnyIDIconColor = rtprequestService.getAnyIDIconColor;
        $scope.getAnyIDLabelName = rtprequestService.getAnyIDLabelName;

        $scope.selectedMyPromtpayAcc = function (account) {
            $scope.myAccount = account;
            $scope.accPromptpayListModal.hide();
        }
        $scope.openMyPromptpayAccount = function () {
            $scope.isShowNext = false;
            rtprequestService.inquiryRTPInquiryAnyidMy(function (resultCode, resultObj) {
                if (resultCode === kkconst.success) {
                    if (resultObj.value.length) {
                        $scope.myAccountlist = sortingAccount(resultObj.value);
                        $scope.accPromptpayListModal.show();
                    } else {
                        showPopupRegisterPromptpay(resultObj.responseStatus.errorMessage);
                        $scope.isShowNext = true;
                    }
                } else {
                    if(resultCode === 'RIB-E-ANY019'){
                        showPopupRegisterPromptpay(resultObj.responseStatus.errorMessage);
                    }
                    $scope.isShowNext = true;
                }
            });
        }
        $scope.closeAccPromptpayListModal = function () {
            $scope.isShowNext = true;
            $scope.accPromptpayListModal.hide();
        }
        $scope.closeAnyIDTypeSelection = function () {
            $scope.isShowRequestTo = true;
            $scope.isShowNewAccount = false;
            $scope.accountModel.accountNo = '';
        }

        $scope.$on('modal.hidden', function () {
            $scope.isShowNext = true;
        });

        function historyPageInit() {
            //check state from page
            var history = $ionicHistory.viewHistory();
            if (history.backView != null) {
                $scope.isShowBack = true;
                switch (history.backView.stateName) {
                    case kkconst.ROUNTING.OTHER_ACCOUNT.STATE:
                        fromOtherAccountPage();
                        break;
                    case kkconst.ROUNTING.ANYID_DETAILS.STATE:
                        fromMyAccountPage();
                        break;
                }
            }
        }

        function fromOtherAccountPage() {
            var account = otherAccountService.getAccountSelected();
            $scope.otherAnyIdAccount = account;
            $scope.isShowRequestTo = false;
            $scope.isShowNewAccount = false;
            $scope.isShowOtherAnyIdAccountDetail = true;
        }

        function getOtherAccountListByCategory(categoryName) {
            if (categoryName === window.translationsLabel[mainSession.lang]['label.favourite']) {
                return otherAccoutList.filter(function (account) {
                    if (account.isFavourite === 'Y') {
                        return account;
                    }
                })
            } else {
                return otherAccoutList.filter(function (account) {
                    if (account.categoryName === categoryName) {
                        return account;
                    }
                })
            }
        }
        function confirmValidate() {
            if (!($scope.isShowOtherAnyIdAccountDetail || $scope.isShowNewAccount)) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-TRN200');
                return false;
            }
            // new account
            if ($scope.isShowNewAccount) {
                if (validateAccount($scope.selectedAnyIDType, $scope.accountModel)) {
                    return false;
                }
            }
            if ($scope.amountModel.amount === '' || parseFloat($scope.amountModel.amount) === 0) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-ACC020');
                return false;
            } else {
                $scope.amountModel.amount = generalService.onBlurFormatCurrency($scope.amountModel.amount);
            }
            if (!$scope.myAccount) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-TRN201');
                return false;
            }

            // valid memo
            var memoText = $scope.memo.txt;
            if(memoText){
                if(ValidationService.validSpecialChar(memoText) || ValidationService.validNewline(memoText)){
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'RIB-E-UNK001');
                    return false;
                }
            }

            return true;
        }

        function validateAccount(anyIDType, accountModel) {
            if (!accountModel.accountNo) {
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, "RIB-E-REQ001", { AnyIdTypeName: $scope.anyidTypeLabelName });
                return true;
            } else {
                // var regex = /^[0-9]*$/;
                // var result = regex.test(accountModel.accountNo);
                var result = validateNumberPattern(anyIDType, accountModel.accountNo);
                if (!result) {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, "RIB-E-REQ002", { AnyIdTypeName: $scope.anyidTypeLabelName });
                    return true;
                }
            }
            
        }
        function madalOtherAccListInit() {
            $ionicModal.fromTemplateUrl(
                'templates/RTPRequest/otherAnyId-account-list-modal.html', {
                    scope: $scope,
                    animation: $scope.modalAnimate
                }
            ).then(function (modal) {
                $scope.otherAccListModal = modal;
            });
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

        function showPopupRegisterPromptpay(errorMessage) {
            popupService.showRegisterPopupMessageCallback(
                'alert.title',
                errorMessage,
                function (ok) {
                    if (ok) {
                        $ionicHistory.clearCache().then(function () {
                            $state.go(kkconst.ROUNTING.ANYID.STATE);
                        });
                    }
                });
        }

        function modalMyPromptPayAccListInit() {
            $ionicModal.fromTemplateUrl(
                'templates/RTPRequest/mypromptpay-account-list-modal.html', {
                    scope: $scope,
                    animation: $scope.modalAnimate
                }
            ).then(function (modal) {
                $scope.accPromptpayListModal = modal;
            });
        }

        function anyIdTypeListInit() {
            $scope.anyIdTypeList = anyIDService.getAnyIDList().filter(
                function (anyidtype) {
                    if (anyidtype.type !== kkconst.ANY_ID_TYPE.ACCOUNT) {
                        return anyidtype
                    }
                }
            );
            var loopdata = $scope.anyIdTypeList.slice(0);
            for (var index = 0; index < 4; index++) { // loop data for swiper
                $scope.anyIdTypeList.push.apply($scope.anyIdTypeList, loopdata);
            }
        }

        function swiperInit() {
            var win_width = window.innerWidth;
            var w = 55;
            if (win_width > 415) {
                w = 80;
            }
            var tmpSelected = '';
            $scope.anyIdTypeListSwiper = {
                activeItem: ($scope.selectedAnyIDType === undefined) ? undefined : $scope.selectedAnyIDType,
                invokes: function (value) {
                    $scope.anyidTypeDescriptionName = value.anyidTypeDescriptionName;

                    if (value.action === 'onTransitionEnd' && !$scope.isShowNewAccountx) {
                        $scope.anyidTypeLabelName = value.anyidTypeLabelName;
                        $scope.selectedAnyIDType = value.anyidTypeCode;
                        $scope.accountModel.anyidTypeLength = value.anyidTypeLength;
                        $scope.isStringDataType = value.anyidTypeDataType === kkconst.ANY_ID_TYPE_DATA_TYPE.STRING;
                        if (!$scope.isStringDataType) {
                            if (value.anyidTypeLength !== 0) {
                                $scope.virtualKeyboardAccount.option.maxlength = value.anyidTypeLength;
                            }
                            $scope.virtualKeyboardAccount.option.setOption($scope.virtualKeyboardAccount.option);
                        }
                        if (value.anyidTypeCode !== tmpSelected) {
                            $scope.accountModel.accountNo = '';
                            tmpSelected = value.anyidTypeCode;
                        }
                    }
                },
                overrideParams: {
                    slidesPerColumn: 1,
                    slidesPerView: Math.floor(win_width / w),
                    spaceBetween: 2,
                    loopedSlides: 25,
                    loop: true,
                    showNavButtons: false,
                    slideToClickedSlide: $scope.onTouchEnd,
                    centeredSlides: true,
                    watchSlidesVisibility: true
                }
            };
        }

        function getServerDate() {
            dateService.today().then(function (result) {
                var day_label = generalValueDateService.weekDayNamesArray[result.day];
                var month_label = generalValueDateService.monthsFullNameArray[result.month];
                $scope.today = {
                    date: result.date,
                    day: result.day,
                    day_label: day_label,
                    month: result.month,
                    month_label: month_label,
                    year: result.year,
                }
            });
        }

        function createVirtualKeyboardAccount() {
            $scope.virtualKeyboardAccount = {
                option: {
                    disableDotButton: true,
                    isKeyboardActive: true,
                    IsEditModel: true,
                    setOption: function () { }
                }
            };
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
                onkeyup: function () {

                },
                onfocus: function () {
                    $scope.amountModel.amount = generalService.onFocusClearAmount($scope.amountModel.amount);
                    $scope.placeholderAmount = '';
                }
            };
        }

        function validateNumberPattern(type, value){
            var returnValue = false;
            switch(type){
                case kkconst.ANY_ID_TYPE.MOBILE_NO:
                    returnValue = ValidationService.verifyPhoneFormat(value);
                    break;
                case kkconst.ANY_ID_TYPE.E_WALLET:
                    returnValue = ValidationService.verifyEWalletFormat(value);
                    break;
                case kkconst.ANY_ID_TYPE.ID_CARD:
                    // by pass ID card to backend
                    returnValue = true;
            }

            return returnValue;
        }


        function fromMyAccountPage() {
            var account = myAccountService.anyIdAccountCache;
            $scope.myAccount = account;
        }

        $scope.getContactPhone = function(){
            $ionicPlatform.ready(function() {
                navigator.contacts.pickContact(function(contact){
                    contact = contact.phoneNumbers[0].value;
                    if(contact.substring(0,3) === '+66'){
                        contact = contact.replace(contact.substring(0,3),'0');   
                    }
                    $scope.accountModel.accountNo = (contact).replace(/[^0-9.]/g, "");
                    $scope.$apply();
                },function(err){
                });
            });
        };
    })