angular.module('ctrl.QRVerifyDetailCtrl', [])
    .controller('QRVerifyDetailCtrl', function ($scope, kkconst, $ionicHistory, $ionicListDelegate, $interval, $ionicModal, $state, popupService, mainSession, cordovadevice, displayUIService, dateService, requestToPayInComingService, $ionicPlatform, QRScannerService, $translate, BankCodesImgService, fundtransferService, anyIDService) {
        $scope.detailTransaction = QRScannerService.getVerifyQRData();

        $scope.getBankCodeImg = BankCodesImgService.getBankCodeImg;
        $scope.getBankName = BankCodesImgService.getBankName;

        $scope.banksList = fundtransferService.bankList;
        var list = fundtransferService.anyIdTypeList;
        console.log(list);

        $scope.ref1Value = null;
        $scope.ref2Value = null;
        $scope.ref3Value = null;

        $scope.ref1Label = null;
        $scope.ref2Label = null;
        $scope.ref3Label = null;

        //padding bankcode if need
        $scope.detailTransaction.sendingBank = padZero($scope.detailTransaction.sendingBank, 3);
        $scope.senderImgUrl = $scope.getBankCodeImg($scope.detailTransaction.sendingBank, 'image');
        $scope.fromBankName = getBankName($scope.detailTransaction.sendingBank);

        if ($scope.detailTransaction.transactionType === 'BILL') {
            $scope.receiverImgColor = $scope.getBankCodeImg('069', 'color');

            if ($scope.detailTransaction.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                $scope.receiverImgUrl = kkconst.DEFAULT_E_DONATION_ICON;
            }else {
                $scope.receiverImgUrl = kkconst.DEFAULT_BILLER_ICON;
            }

            if ($scope.detailTransaction.refInfos) {
                $scope.detailTransaction.refInfos.forEach(function (element) {
                    if (element.no == "1") {
                        $scope.ref1Value = element.value || $scope.detailTransaction.ref1;
                        $scope.ref1Label = getLabel(element.textEn, element.textTh) || window.translationsLabel[$translate.use()]['label.history.bill.ref1'];
                    }
                    if (element.no == "2") {
                        $scope.ref2Value = element.value || $scope.detailTransaction.ref2;
                        $scope.ref2Label = getLabel(element.textEn, element.textTh) || window.translationsLabel[$translate.use()]['label.history.bill.ref2'];
                        if ($scope.detailTransaction.categoryId  == kkconst.E_DONATE_CATEGORY_ID) {
                            $scope.ref2Label = window.translationsLabel[$translate.use()]['label.history.edonation.ref2'];
                        }
                    }
                    if (element.no == "3") {
                        $scope.ref3Value = element.value || $scope.detailTransaction.ref3;
                        $scope.ref3Label = getLabel(element.textEn, element.textTh) || window.translationsLabel[$translate.use()]['label.history.bill.ref3'];
                    }
                });
            }else {
                $scope.ref1Value = $scope.detailTransaction.ref1;
                $scope.ref1Label = window.translationsLabel[$translate.use()]['label.history.bill.ref1'];

                $scope.ref2Value = $scope.detailTransaction.ref2;
                $scope.ref2Label = window.translationsLabel[$translate.use()]['label.history.bill.ref2'];

                $scope.ref3Value = $scope.detailTransaction.ref3;
                $scope.ref3Label = window.translationsLabel[$translate.use()]['label.history.bill.ref3'];
            }

        } else if ($scope.detailTransaction.transactionType === 'FUND') {
            //padding bankcode if need
            $scope.detailTransaction.receivingBank = padZero($scope.detailTransaction.receivingBank, 3);
            getReceiverImage();
        }

        var date = $scope.detailTransaction.transDate + $scope.detailTransaction.transTime;
        $scope.detailTransaction.transactionDate = moment(date, 'YYYYMMDDHH:mm:ss', $translate.use()).format('DD MMM YYYY HH:mm');

        function padZero(input, length) {
            var str = input.toString();
            return (Array(length + 1).join('0') + str).slice(-length);
        }

        function getBankName(bankCode) {
            if (!angular.isUndefined($scope.banksList)) {
                for (var i = 0; i < $scope.banksList.length; i++) {
                    if (bankCode === $scope.banksList[i].bankCode) {
                        return $scope.banksList[i].bankName;
                    }
                }
            }
        }

        function getReceiverImage() {
            if ($scope.detailTransaction &&
                $scope.detailTransaction.receiver &&
                $scope.detailTransaction.receiver.account &&
                $scope.detailTransaction.receiver.account.type) {
                if($scope.detailTransaction.receiver.account.type == kkconst.ANY_ID_TYPE.MOBILE_NO ||
                    $scope.detailTransaction.receiver.account.type == kkconst.ANY_ID_TYPE.ID_CARD ||
                    $scope.detailTransaction.receiver.account.type == kkconst.ANY_ID_TYPE.E_WALLET) {
                    $scope.receiverImgUrl = anyIDService.getAnyIDinfo($scope.detailTransaction.receiver.account.type).icon;
                    $scope.receiverImgColor = anyIDService.getAnyIDinfo($scope.detailTransaction.receiver.account.type).iconColor;
                }else {
                    $scope.receiverImgUrl = $scope.getBankCodeImg($scope.detailTransaction.receivingBank, 'image');
                    $scope.receiverImgColor = $scope.getBankCodeImg($scope.detailTransaction.receivingBank, 'color');
                    $scope.toBankName = getBankName($scope.detailTransaction.receivingBank);
                }
            }
        }

        function getLabel(textEn, textTh) {
            if($translate.use() === kkconst.LANGUAGE_en) {
                return textEn;
            }
            return textTh;
        }
    });