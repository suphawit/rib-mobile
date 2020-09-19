angular.module('directive.verifyDebitcardForm', [])
.directive('verifyDebitcardForm', ['popupService', 'mainSession', '$compile', function(popupService, mainSession, $compile) {
	 return {
        restrict: 'E',
        templateUrl: 'templates/ManagePin/verify-debitcard-form.html',
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
                if(form.value.atmNumber === '' && form.value.atmPin === ''){
                    popupService.showErrorPopupMessage('alert.title','input.debitcard');
                } else if(form.value.atmNumber === ''){
                    popupService.showErrorPopupMessage('alert.title','label.debitcardValidation');
                } else if(form.value.atmPin === ''){
                    popupService.showErrorPopupMessage('alert.title','label.atmpinValidation');
                } else {
                    $scope.onaction({ value: form.value });
                }
            };

            $scope.input = {
                value: {
                    atmNumber: '',
                    atmPin: ''
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

            var compileDirective = function(){
                var virtualKeyBoardATMPinDirective = angular.element('<input bind-virtual-keyboard vkmodel="input.value.atmPin" vkoption="virtualKeyboardATMPin.option" class="whiteBGColor" type="password" ng-model="input.value.atmPin" maxlength="6">');
                element.find('#lblATMPin').append(virtualKeyBoardATMPinDirective);
                $compile(virtualKeyBoardATMPinDirective)($scope);

                var virtualKeyBoardATMNoDirective = angular.element('<input bind-virtual-keyboard vkmodel="input.value.atmNumber" vkoption="virtualKeyboardATMNo.option" class="whiteBGColor" type="text" ng-model="input.value.atmNumber" maxlength="30">');
                element.find('#lblATMNo').append(virtualKeyBoardATMNoDirective);
                $compile(virtualKeyBoardATMNoDirective)($scope);
            };
            $scope.virtualKeyboardATMPin = {
                option: {
                    disableDotButton: true,
                    maxlength: 6
                }
            };
            $scope.virtualKeyboardATMNo = {
                option: {
                    disableDotButton: true,
                    maxlength: 30
                }
            };
            compileDirective();
        }
	};
}]);