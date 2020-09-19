angular.module('directive.verifyTermAndCond', [])
.directive('verifyTermAndCond', ['popupService', 'mainSession', function(popupService, mainSession) {
	 return {
        restrict: 'E',
        templateUrl: 'templates/ManagePin/verify-term-and-cond.html',
        scope: {
            htmldata: '=',
            onaction: '&',
            control: '='
        },
        controller: ['$scope', function ($scope) {
            // do something
        }],
        link: function($scope, element, attr) {
            var doSubmit = function(form){
                if(form.value.isAccept){
                    $scope.onaction({ value: form.value });
                } else {
                    popupService.showErrorPopupMessage('alert.title','label.promptpayRegisterAgreeConditions');
                }
            };

            $scope.input = {
                value: {
                    isAccept: false
                }
            };

            $scope.internalControl = $scope.control || {};
            $scope.internalControl.doSubmit = function() {
                doSubmit($scope.input);
            };
        }
	};
}]);