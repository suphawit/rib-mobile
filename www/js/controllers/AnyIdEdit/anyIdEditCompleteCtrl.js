angular.module('ctrl.anyIdEditCompleteCtrl', [])
    .controller('anyIdEditCompleteCtrl', function ($scope, anyIDService, mainSession,  popupService, kkconst, $state, amendAnyIDService) {

        viewInit();

        function viewInit() {

            var confirmAmendAnyIDResponse = amendAnyIDService.getConfirmAmendAnyIDResponse();
            $scope.anyIDType = confirmAmendAnyIDResponse.anyIDType;
            $scope.anyIDValue = confirmAmendAnyIDResponse.anyIDValue
            $scope.fromAccountAliasName = confirmAmendAnyIDResponse.fromAccountAliasName;
            $scope.fromAccountNo = confirmAmendAnyIDResponse.fromAccountNo;
            $scope.toAccountNo = confirmAmendAnyIDResponse.toAccountNo;
            $scope.toAccountAliasName = confirmAmendAnyIDResponse.toAccountAliasName;
            
            $scope.labelStatus = 'label.success';
        }
    });