angular.module('ctrl.anyIdEditCtrl', [])
    .controller('anyIdEditCtrl', function ($scope, anyIDService, myAccountService, $ionicModal, mainSession, manageAnyIDService, popupService, kkconst, $state, amendAnyIDService) {

        viewInit();
        createModal();

        function viewInit() {
            var anyIDType = myAccountService.anyIdAccountCache.anyIDType;
            $scope.anyIDType = myAccountService.anyIdAccountCache.anyIDType;
            $scope.anyIDName = myAccountService.anyIdAccountCache.anyIDName;
            $scope.accountNo = myAccountService.anyIdAccountCache.accountNo;
            $scope.anyIDValue = myAccountService.anyIdAccountCache.anyIDValue;
            $scope.accountAliasName = myAccountService.accountAliasName;
            $scope.anyIDIcon = anyIDService.getAnyIDinfo(anyIDType).icon;
            $scope.anyIDIconColor = anyIDService.getAnyIDinfo(anyIDType).iconColor;
            $scope.showSelectBtn = true;
            $scope.isShowNext = false;
            $scope.isAccountSelected = false;
            $scope.isTermAndCondAccept = false;
        }

        $scope.selectAnyIDAccount = function () {
            myAccountService.inquiryMyAccountCASASummaryFilterRemoveAccount(function (responseCode, ownAccountGroups) {
                if (responseCode === kkconst.success) {
                    $scope.ownAccountGroups = ownAccountGroups;
                    $scope.isShowNext = false;
                    $scope.accListModal.show();
                } else {
                    popupService.showErrorPopupMessage('alert.title', responseCode);
                }

            }, $scope.accountNo);
        };

        function createModal() {
            createAccountListModal();
            createTermAndCondModal();
            $scope.$on('modal.hidden', function () {
                $scope.isShowNext = $scope.isAccountSelected;
            });
        }

        function createAccountListModal() {
            $scope.accListlabelTitle = 'label.selectAccounts';
            $ionicModal.fromTemplateUrl(
                'templates/ManageAccounts/MyAccounts/account-list-modal.html', {
                    scope: $scope,
                    animation: $scope.modalAnimate
                }).then(function (modal) {
                    $scope.accListModal = modal;
                });
        }
        function createTermAndCondModal() {
            $scope.termAndCondText = '';
            $ionicModal.fromTemplateUrl(
                'templates/AnyID/anyIdTermAndCondModal.html', {
                    scope: $scope,
                    animation: $scope.modalAnimate
                }).then(function (modal) {
                    $scope.termAndCondModal = modal;
                });
        }

        $scope.showTermAndConditions = function () {
            var objLanguage = { language: mainSession.lang };
            manageAnyIDService.getRegisterAnyIDTermsAndConditions(function (result) {
                if (result.responseStatus.responseCode === kkconst.success) {
                    $scope.termAndCondText = result.value.data;
                    $scope.isShowNext = false;
                    $scope.termAndCondModal.show();
                } else {
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, result.responseStatus.responseCode);
                }
            }, objLanguage);
        };

        $scope.userSelectedFromAccount = function (account) {
            $scope.isAccountSelected = true;
            $scope.showSelectBtn = false;
            $scope.myAccountAliasName = account.myAccountAliasName;
            $scope.myAccountNumber = account.myAccountNumber;
            $scope.myAccountID = account.myAccountID;
            $scope.myAccountName = account.myAccountName;
            $scope.selectClose();
        };

        $scope.termsAndCondChecked = function () {
            $scope.isTermAndCondAccept = !$scope.isTermAndCondAccept;
        }

        $scope.selectClose = function () {
            $scope.isShowNext = $scope.isAccountSelected;
            $scope.accListModal.hide();
            $scope.termAndCondModal.hide();
        };

        $scope.AnyIDRegisterSubmit = function(){
            if(!$scope.isTermAndCondAccept){
                popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.promptpayRegisterAgreeConditions');
            }else{
                verifyAmendAnyID();
            }
        };

        function verifyAmendAnyID(){
            var data = {
                anyIDType: $scope.anyIDType,
                anyIDValue: $scope.anyIDValue,
                fromAccountNo: $scope.accountNo,
                toAccountName: $scope.myAccountName,
                toAccountNo: $scope.myAccountNumber
            }
            amendAnyIDService.verifyTransactionAmendAnyID(
                data,
                function (responseStatus, resultObj) {
					if (responseStatus.responseCode === kkconst.success) {
                        var data = resultObj.value;
                        amendAnyIDService.setVerifyAmendAnyIDResponse(data);
                        $state.go(kkconst.ROUNTING.ANY_ID_EDIT_CONFIRM.STATE);		
					} else {
						popupService.showErrorPopupMessage('label.warning', responseStatus.errorMessage);
					}
				}
            )
        }
    });