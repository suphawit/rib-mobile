angular.module('directive.pinPortal', [])
.directive('pinPortal', function() {
	 return {
        restrict: 'E',
        templateUrl: 'templates/ManagePin/pin-portal.html',
        scope: {
            onaction: '&',
            labelclass: '=',
            showmypin: '='
        },
        controller: ['$scope', function ($scope) {
            // do something
            
        }],
        link: function($scope, element, attr) {
            $scope.selectMethod = function(value){
                $scope.onaction({ value: value });
            };
        }
	};
});