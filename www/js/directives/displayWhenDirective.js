angular.module('directive.displayWhen', [])
.directive('showWhen', ['$window', function($window) {
	 return {
	    restrict: 'A',
	    link: function($scope, $element, $attr) {

		  function checkExpose() {
			var mq = $attr.showWhen == 'large' ? '(min-width:768px)' : $attr.showWhen;
			
			
			if($window.matchMedia(mq).matches){
				$element.removeClass('ng-hide');
			} else {
				$element.addClass('ng-hide');		
			}
		  }

			var debouncedCheck = ionic.debounce(function() {
			$scope.$apply(function(){
			  checkExpose();
			});
		  }, 300, false);

		  function onResize() {
			debouncedCheck();
		  }

		  checkExpose();

		  ionic.on('resize', onResize, $window);

		  $scope.$on('$destroy', function(){
			ionic.off('resize', onResize, $window);
		  });

		}
	  };
	}])



.directive('hideWhen', ['$window', function($window) {
	 return {
	    restrict: 'A',
	    link: function($scope, $element, $attr) {

		  function checkExpose() {
			var mq = $attr.hideWhen == 'large' ? '(min-width:768px)' : $attr.hideWhen;
			if($window.matchMedia(mq).matches){
				$element.addClass('ng-hide');
			} else {
				$element.removeClass('ng-hide');
						
			}
		  }

			var debouncedCheck = ionic.debounce(function() {
			$scope.$apply(function(){
			  checkExpose();
			});
		  }, 300, false);

		  function onResize() {
				debouncedCheck();
		  }

		  checkExpose();

		  ionic.on('resize', onResize, $window);

		  $scope.$on('$destroy', function(){
			ionic.off('resize', onResize, $window);
		  });

		}
	  };
	}]);