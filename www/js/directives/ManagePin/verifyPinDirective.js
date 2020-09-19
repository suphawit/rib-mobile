angular.module('directive.verifyPin', [])
.directive('verifyPin', ['$timeout', function($timeout) {
	 return {
		    restrict: 'E',
            templateUrl: 'templates/ManagePin/verify-pin.html',
		    scope: {
		    	title: '=',
                onaction: '&',
                control: '='
		    },
		    controller: ['$scope', function ($scope) {
				// do something
	        }],
	        link: function($scope, element, attr) {
                var _maxPin = 6;
                var _paintPin = function(cssColor){		
                    for(var i=0; i < _maxPin;i++){ 
                        if($scope.data.passcode.length === i){ 
                            $scope.data.dotpins[i] = cssColor; 
                        }
                    }
                };

                var _clearPin = function(){
                    $scope.data.passcode = "";
                        
                    for(var i=0; i < _maxPin; i++){
                        $scope.data.dotpins[i] = 'circle-color-white';
                    }
                };

		    	// scope variable
                $scope.data = {
                    dotpins: [],
                    passcode: ''
                };

                $scope.event = {
                    init: function() {
                        _clearPin();
                    },
                    add: function(value) {
                        _paintPin('circle-color-black');

                        if($scope.data.passcode.length < _maxPin) {                            
                            $scope.data.passcode = $scope.data.passcode + value;
                            if($scope.data.passcode.length === _maxPin) {
                                $scope.onaction({ value: $scope.data.passcode });
                                $timeout(function() {
                                    $scope.event.init();
                                }, 800);
                            }
                        }else{
                            //do something
                        }
                    },
                    del: function() {		
                        $scope.data.dotpins[$scope.data.passcode.length-1] = 'circle-color-white';
                        if($scope.data.passcode.length > 0) {
                            $scope.data.passcode = $scope.data.passcode.substring(0, $scope.data.passcode.length - 1);
                        }
                    }
                };

                $scope.internalControl = $scope.control || {};
                $scope.internalControl.clearPin = function() {
                    _clearPin();
                };
                
			}
	};
}]);