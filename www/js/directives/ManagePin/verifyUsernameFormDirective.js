angular.module('directive.verifyUsernameForm', [])
.directive('verifyUsernameForm', ['popupService', 'mainSession', function(popupService, mainSession) {
	 return {
        restrict: 'E',
        templateUrl: 'templates/ManagePin/verify-username-form.html',
        scope: {
            onaction: '&',
            control: '=',
            isshowbutton: '='
        },
        controller: ['$scope', function ($scope) {
            // do something
        }],
        link: function($scope, element, attr) {
            var doSubmit = function(form){
                if(form.value.username === '' && form.value.password === ''){
                    popupService.showErrorPopupMessage('alert.title','input.login');
                } else if(form.value.username === ''){
                    popupService.showErrorPopupMessage('alert.title','lable.userNameValidation');
                } else if(form.value.password === ''){
                    popupService.showErrorPopupMessage('alert.title','lable.passWordValidation');
                } else {
                    $scope.onaction({ value: form.value });
                }
            };

            $scope.input = {
                value: {
                    username: '',
                    password: ''
                }
            };
            
            $scope.doSubmit = function(form){
                doSubmit(form);
            };

            $scope.isShowSubmitButton = ($scope.isshowbutton ? true : false);
            $scope.internalControl = $scope.control || {};
            $scope.internalControl.doSubmit = function() {
                doSubmit($scope.input);
            };
        }
	};
}]);