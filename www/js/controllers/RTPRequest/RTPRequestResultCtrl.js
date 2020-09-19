angular.module('ctrl.rtprequestResultCtrl', [])
    .controller('rtprequestResultCtrl', function ($scope, $state, $ionicHistory, $ionicListDelegate, mainSession, anyIDService, rtprequestService, displayUIService, popupService) {

        $scope.getAnyIDIcon = rtprequestService.getAnyIDIcon;
        $scope.getAnyIDIconColor = rtprequestService.getAnyIDIconColor;
        $scope.getAnyIDLabelName = rtprequestService.getAnyIDLabelName;

        viewInit();

        function viewInit() {
            $scope.resultRTPConfirm = rtprequestService.getResultRTPConfirm();
            $scope.resultRTPConfirm.transactionDateUI = displayUIService.convertDateTimeForTxnDateUI($scope.resultRTPConfirm.transactionDate);
        }

        var gotoAddNewToAccount = function () {

            var stateName = 'app.addOtherAccount';
            $ionicHistory.clearCache().then(function () {
                $state.go(stateName);
            });
        }

        $scope.addNewToAccount = function () {
            popupService.showConfirmPopupMessageCallback('label.addAcc', 'label.addaccountpopupmsg', function (ok) {
                if (ok) {
                    gotoAddNewToAccount();
                } else {
                    $ionicListDelegate.closeOptionButtons();
                }
            });
        }

    });