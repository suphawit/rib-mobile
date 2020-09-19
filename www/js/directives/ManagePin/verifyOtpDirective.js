angular.module('directive.verifyOtp', [])
.directive('verifyOtp', ['$compile','$timeout','popupService', function($compile, $timeout, popupService) {
	 return {
        restrict: 'E',
        templateUrl: 'templates/ManagePin/verify-otp.html',
        scope: {
            fontstyle: '=',
            otpdata: '=',
            confirmdata: '=',
            onaction: '&',
            control: '='
        },
        controller: ['$scope', function ($scope) {
            // do something
        }],
        link: function($scope, element, attr) {
            var compileDirective = function(){
                var viewTemplate = '<input bind-virtual-keyboard vkmodel="otpdata.otp" vkoption="virtualKeyboardOTP.option" class="whiteBGColor" type="password"'
                                +' ng-model="otpdata.otp" placeholder="{{otpdata.referenceNo}}"  maxlength="6">';

                var viewTemplateCompiled;
                viewTemplateCompiled = $compile(angular.element(viewTemplate))($scope);
                element.find('#view').append(viewTemplateCompiled);
            };
            
            var doSubmit = function(form){
                console.log('fdfds',form.otp)
                if(!form.otp || form.otp === ''){
                    popupService.showErrorPopupMessage('alert.title','input.otp');
                }  else {
                    $scope.onaction({ value: 'submit' });
                }
            };
            
            $scope.input = {
                requestOTP: function(){
                    // do something
                    $scope.onaction({ value: 'otp' });
                }
            };

            // create virtual keyboard option
            $scope.virtualKeyboardOTP = {
                option: {
                    disableDotButton: true,
                    isKeyboardActive: false,
                    maxlength: 6,
                    IsEditModel: true
                }
            };

            $scope.isShowSubmitButton = ($scope.isshowbutton ? true : false);
            $scope.internalControl = $scope.control || {};
            $scope.internalControl.doSubmit = function() {
                doSubmit($scope.otpdata);
            };  
            $scope.internalControl.enableKeyboard = function() {
                console.log('enableKeyboard');
                $scope.virtualKeyboardOTP.option.isKeyboardActive = true;
            };  
            // console.log('$scope.control', $scope.control);

            compileDirective();     
        }

	};
}]);