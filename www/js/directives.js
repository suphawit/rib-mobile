angular.module('kkapp.directives', ['directive.common','directive.displayWhen','directive.virtualKeyboard', 'directive.banklistSwiper', 'directive.verifyUsernameForm', 'directive.verifyDebitcardForm', 'directive.pinPortal', 'directive.verifyTermAndCond', 'directive.verifyPin', 'directive.verifyProductFormDirective', 'directive.verifyOtp'])
.directive('tfFloat', function() {
    return {
      restrict: 'E',
      replace: true,
      scope : {
        fid : '@?',
        value : '='
      },
      compile : function() {
        return {
          pre : function(scope, element, attrs) {
            // transpose `disabled` flag
            if ( angular.isDefined(attrs.disabled) ) {
              element.attr('disabled', true);
              scope.isDisabled = true;
            }

            // transpose the `label` value
            scope.label = attrs.label || "";
            scope.fid = scope.fid || scope.label;

            // transpose optional `type` and `class` settings
            element.attr('type', attrs.type || "text");
            element.attr('class', attrs.class );
          }
        };
      },
      template:
        '<material-input-group ng-disabled="isDisabled">' +
          '<label for="{{fid}}">{{label}}</label>' +
          '<material-input id="{{fid}}" ng-model="value">' +
        '</material-input-group>'
    };
  })
.directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    };
 })
.filter('filterMapAddress', function() {
  return function(input, search) {	
    if (!input) {
        return input;
    }
    if (!search) {
        return input;
    }
    if(search.length < 3) {
        return input;
    }
    search = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value, key) {       
      var actualTitle = (''+ value.title).toLowerCase();
      var actualAdrs = (''+value.province).toLowerCase();      
      if (actualTitle.indexOf(search) !== -1 || actualAdrs.indexOf(search) !== -1) {
        result[key] = value;
      }
    });
    return result;    
  };
})
.directive("decimals", function ($filter) {
    return {
        restrict: "A", // Only usable as an attribute of another HTML element
        require: "?ngModel",
        scope: {
            decimals: "@",
            decimalPoint: "@"
        },
        link: function (scope, element, attr, ngModel) {
            var decimalCount = parseInt(scope.decimals) || 2;
            var decimalPoint = scope.decimalPoint || ".";
            // Run when the model is first rendered and when the model is changed from code
            ngModel.$render = function() {
                if (ngModel.$modelValue != null && ngModel.$modelValue >= 0) {
                    if (typeof decimalCount === "number") {
                        element.val(ngModel.$modelValue.toFixed(decimalCount).toString().replace(".", ","));
                    } else {
                        element.val(ngModel.$modelValue.toString().replace(".", ","));
                    }
                }
            };
            // Run when the view value changes - after each keypress
            // The returned value is then written to the model
            ngModel.$parsers.unshift(function(newValue) {
                if (typeof decimalCount === "number") {
                    var floatValue = parseFloat(newValue.replace(",", "."));
                    if (decimalCount === 0) {
                        return parseInt(floatValue);
                    }
                    return parseFloat(floatValue.toFixed(decimalCount));
                }
                
                return parseFloat(newValue.replace(",", "."));
            });
            // Formats the displayed value when the input field loses focus
            element.on("change", function(e) {
                var floatValue = parseFloat(element.val().replace(",", "."));
                if (!isNaN(floatValue) && typeof decimalCount === "number") {
                    if (decimalCount === 0) {
                        element.val(parseInt(floatValue));
                    } else {
                        var strValue = floatValue.toFixed(decimalCount);
                        element.val(strValue.replace(".", decimalPoint));
                    }
                }
            });
        }
    };
    
    
})
.directive('decimalOnly', function () {
	    return  {
	        restrict: 'A',	         
	        link: function (scope, elm, attrs, ctrl) {
	            elm.on('keypress', function (event) {	            	 
	            	var valid = true;
	                var keyCode = event.charCode ? event.charCode : (window.event) ? window.event.keyCode : event.which;
                    // var keyValid = function(){
					// 	if (keyCode == 46 || keyCode == 8 || keyCode == 9){
					// 		return true;
					// 	}
					// };
	                // Allow: backspace, delete, tab, escape, and enter
	                if (
	                    // Allow: home, end, left, right
	                    (keyCode >= 35 && keyCode <= 39)
	                   ) {
	                    // let it happen, don't do anything
	                    valid = true;
	                }
	                else {
	                    // Ensure that it is a number and stop the keypress
	                    if ((keyCode < 48 || keyCode > 57)) {
	                        keyCode = 0;
	                        valid = false;
	                        event.preventDefault();
	                    }
	                }

	                return (valid);                    	 
	                
	            });
	        }
	    };
    })
    .directive('affixWithinContainer', function($document, $ionicScrollDelegate) {

    	  var transition = function(element, dy, executeImmediately) {
    	    element.style[ionic.CSS.TRANSFORM] == 'translate3d(0, -' + dy + 'px, 0)' ||
    	    executeImmediately ?
    	    element.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + dy + 'px, 0)' :
    	    ionic.requestAnimationFrame(function() {
    	      element.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + dy + 'px, 0)';
    	    });
    	  };

    	  return {
    	    restrict: 'A',
    	    require: '^$ionicScroll',
    	    link: function($scope, $element, $attr, $ionicScroll) {
    	      var $affixContainer = $element.closest($attr.affixWithinContainer) || $element.parent();

    	      var top = 0;
    	      var height = 0;
    	      var scrollMin = 0;
    	      var scrollMax = 0;
    	      var scrollTransition = 0;
    	      var affixedHeight = 0;
    	      var updateScrollLimits = _.throttle(function(scrollTopValue) {
    	          top = $affixContainer.offset().top;
    	          height = $affixContainer.outerHeight(false);
    	          affixedHeight = $element.outerHeight(false);
    	          scrollMin = scrollTopValue + top;
    	          scrollMax = scrollMin + height;
    	          scrollTransition = scrollMax - affixedHeight;
    	      }, 500, {
    	          trailing: false
    	      });

              var affix = null;
    	      var unaffix = null;
    	      var $affixedClone = null;
    	      
              var cleanupAffix = function() {
    	          $affixedClone && $affixedClone.remove();
    	          $affixedClone = null;
    	      };
    	      
              var setupAffix = function() {
    	          unaffix = null;
    	          affix = function() {
    	              $affixedClone = $element.clone().css({
    	                  position: 'fixed',
    	                  top: 0,
    	                  left: 0,
    	                  right: 0
    	              });
    	              $($ionicScroll.element).append($affixedClone);

    	            //   setupUnaffix();
                    affix = null;
                    unaffix = function() {
                        cleanupAffix();
                        setupAffix();
                    };
    	          };
    	      };

            //   var setupUnaffix = function() {
    	    //       affix = null;
    	    //       unaffix = function() {
    	    //           cleanupAffix();
    	    //           setupAffix();
    	    //       };
    	    //   };

              
    	      
    	      $scope.$on('$destroy', cleanupAffix);
    	      setupAffix();

    	      var affixedJustNow;
    	      var scrollTop;
    	      $($ionicScroll.element).on('scroll', function(event) {
    	        scrollTop = (event.detail || event.originalEvent && event.originalEvent.detail).scrollTop;
    	        updateScrollLimits(scrollTop);
    	        if (scrollTop >= scrollMin && scrollTop <= scrollMax) {
    	            affixedJustNow = affix ? affix() || true : false;
    	            if (scrollTop > scrollTransition) {
    	                transition($affixedClone[0], Math.floor(scrollTop-scrollTransition), affixedJustNow);
    	            } else {
    	                transition($affixedClone[0], 0, affixedJustNow);
    	            }
    	        } else {
    	            unaffix && unaffix();
    	        }
    	      });
    	    }
    	  };
    	});

