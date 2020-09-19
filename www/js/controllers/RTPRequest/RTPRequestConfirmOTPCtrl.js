angular.module('ctrl.rtpRequestConfirmOTPCtrl', [])
    .controller('rtpRequestConfirmOTPCtrl', function ($scope, $state, mainSession, kkconst, rtprequestService, popupService, anyIDService,displayUIService) {

        $scope.isEnableConfirm = true;

        viewInit();

        function viewInit() {
            $scope.resultVerify = rtprequestService.getResultRTPVerify();
            $scope.resultVerify.transactionDateUI = displayUIService.convertDateTimeForTxnDateUI($scope.resultVerify.transactionDate);
        }

        $scope.onClickBack = function () {
            $state.go(kkconst.ROUNTING.RTP_REQUEST.STATE);
        }

        $scope.onClickConfirm = function () {
            confirmRTPRequest();
        }

        $scope.getAnyIDIcon = rtprequestService.getAnyIDIcon;
        $scope.getAnyIDIconColor = rtprequestService.getAnyIDIconColor;
        $scope.getAnyIDLabelName = rtprequestService.getAnyIDLabelName;


        function confirmRTPRequest(){

			var dataConfirm = {
				verifyTransactionId: $scope.resultVerify.verifyTransactionId
			};
			rtprequestService.confirmRTPRequest(dataConfirm, function (resultCode, resultObj) {
				if (resultCode === kkconst.success) {
					var data = resultObj.value;
					rtprequestService.setResultRTPConfirm(data);
                    $state.go(kkconst.ROUNTING.RTP_REQUEST_RESULT.STATE);
				} else {
					popupService.showErrorPopupMessage('label.warning', resultCode);
				}
			});
		}
    });