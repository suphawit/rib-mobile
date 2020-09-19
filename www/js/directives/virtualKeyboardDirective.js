'use strict';//NOSONAR

angular.module('directive.virtualKeyboard', ['service.virtualKeyboard'])
.directive('bindVirtualKeyboard', ['dataShareService', function(dataShareService) {
	 return {
		    restrict: 'A',
		    scope: {
		    	vkmodel: "=",
		    	vkoption: "=",
		    	onvkblur: "&",
		    	onvkfocus: "&",
		    	onvkkeyup: "&"
		    },
		    controller: ['$scope', function ($scope) {
				// do something
	        }],
	        link: function($scope, element, attr) {
		    	// scope variable
	        	$scope.event = {
	        		startWatchServiceBroadcast: function(){
	        			// service broadcast listener
	        		    $scope.$on('keyboardDirectiveKeyup', function(event, args) {
	        		    	if(args.controlId === $scope.controlId){
		        		    	// check maxlength option
		        		    	var targetModel = dataShareService.getModel($scope.controlId);
			        		    $scope.vkmodel = targetModel;
			        		    $scope.onvkkeyup({ value: targetModel });
	        		    	}
	        		    });
	        		    $scope.$on('keyboardDirectiveFocus', function(event, args) {
	        		    	if(args.controlId === $scope.controlId){
		        		    	$scope.onvkfocus();
	        		    	}
	        		    });
	        		    $scope.$on('keyboardDirectiveBlur', function(event, args) {
	        		    	if(args.controlId === $scope.controlId){
		        		    	$scope.onvkblur();
	        		    	}
	        		    });
	        		}, 
	        		bindVirtualKeyboard: function(){
	        			var $target = $(element);
	        		    $target.attr('readonly', 'readonly');
	        		    $target.attr('data-keyboard-target-id', $scope.controlId);
	        		    $target.css('background-color', 'transparent');
	        		    	
	        		    var tmpmodel = ($scope.vkmodel) ? $scope.vkmodel : "";
	        		    	
	        		    // set target
	        		    dataShareService.setTarget($scope.controlId, { "element": element, "option": $scope.internalOption, "model": tmpmodel });
	        		    dataShareService.broadcast("keyboardDirectiveAdded");
	        		},
	        		getGuid: function(){
	        			function s4() {
	    	    			return Math.floor((1 + Math.random()) * 0x10000)
	    	    			   .toString(16)
	    	    			   .substring(1);
	    	    			}
	    	    			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    	    			 s4() + '-' + s4() + s4() + s4();
	        		},
	        		setDefaultInternalOption: function(){
	        	    	$scope.internalOption.disableDotButton = false;
	        	    	$scope.internalOption.isKeyboardActive = true;
	        	        $scope.internalOption.maxlength = 6;
	        	        $scope.internalOption.IsEditModel = false;
	        			},
	        		setInternalOption: function(){
	        			// set default option
	        	        if($scope.internalOption === {} || JSON.stringify($scope.internalOption) === '{}'){
	        	        	$scope.event.setDefaultInternalOption();
	        	        }
	        	        $scope.internalOption.setOption = function(obj){
	        	        	dataShareService.setOption($scope.controlId, obj);
	        	        };
	        		},
	        		startWatchEditModel: function(){
	        			$scope.$watch(function(){
				    		return $scope.vkmodel;
				    	}, function(value) {
				    		dataShareService.setModel($scope.controlId, value);
				    	});
	        		}
	        	};
	        	
	        	// scope targetOption delegate function
	        	$scope.internalOption = $scope.vkoption;
	        	$scope.controlId = $scope.event.getGuid();
	        	
	        	// execute scope function
	        	$scope.event.setInternalOption();
	        	$scope.event.bindVirtualKeyboard();
	        	$scope.event.startWatchServiceBroadcast();
	        	
	        	if($scope.internalOption.IsEditModel === true){
	        		$scope.event.startWatchEditModel();
	        	}	
	        	
			}
	};
}])
.directive('virtualKeyboard', ['dataShareService', '$window', '$ionicScrollDelegate', '$timeout', 'generalService', function(dataShareService, $window, $ionicScrollDelegate, $timeout, generalService) {
	 return {
		    restrict: 'E',
	        templateUrl: 'templates/virtualkeyboard-template.html',
	        controller: ['$scope', function ($scope) {
				// do something
		    }],
	        link: function($scope, element, attr) {
		    	// scope variable
		    	$scope.value = {
		    		isShow: false,
		    		textDotButton: ".",
		    		target: {
		    			activeId: "",
		    			registControl: {}
		    		},
		    		windowHeight: $window.innerHeight,
		    		thisHeight: 0,
		    		thisElement: {},
		    		debug: {
		    			'isDebug': true,
		    			'debug_value': ''
		    		}
		    	};
		    	
		    	$scope.formatDecimal = {
			    	format: function(value, maxlength, postlength){
			        	var newValue = value;
			        	var converttoNum = generalService.parseNumber(value);
		            	var arrays = converttoNum.split(".");
			            if(arrays.length == 1){
			            	if(arrays[0].length >= maxlength){
			                	arrays[0] = arrays[0].substring(0,  maxlength);
			                 		
			                 	if(arrays.length >= 2){
			                 		arrays[1] = arrays[1].substring(0,  postlength);
			                 		newValue = arrays[0] +"."+arrays[1];
			                 	}else{
			                 		newValue = arrays[0];
			                 	}
			                }
		                 	
		            	}else{
		            		if(arrays[0].length >= maxlength || arrays[1].length > postlength){
			                 	arrays[0] = arrays[0].substring(0,  maxlength);
			                 	arrays[1] = arrays[1].substring(0,  postlength);
			                 		
			                 	if(arrays.length >= 2){
			                 		arrays[1] = arrays[1].substring(0,  postlength);
			                 		newValue = arrays[0] +"."+arrays[1];
			                 	}else{
			                 		newValue = arrays[0];
			                 	}
			                 }
		            	}
			                
			            return newValue;
			        }
		        };
		    	
		    	$scope.style = {
		    		"virtualKeyboard": {
		    			"position": "fixed",
		    			"top": $window.innerHeight + "px",
		    			"left": "0px",
		    			"width": "100%",
		    			"z-index": "7",
		    			"transition": "all 0.3s linear",
		    			"-webkit-transition": "all 0.3s linear"
		    		}
		    	};
		    	$scope.event = {
		    		init: function(){
		    			$scope.value.thisElement = element.children();
		    			$timeout(function(){
		    				$scope.value.thisHeight = $($scope.value.thisElement).innerHeight();
		    			},0);
		    		},
				    bindClickToShowKeyboard: function(target){
				    	$(target).on('touchstart', function(e){
				    		// set active id
				    		$scope.value.target.activeId = $(this).attr('data-keyboard-target-id');
				    		
				    		// broadcast onfocus
				    		dataShareService.broadcast("keyboardDirectiveFocus", { 'controlId': $scope.value.target.activeId });
				    		
				    		var targetOption = dataShareService.getOption($scope.value.target.activeId);
				    		// check option
				    		if (targetOption.disableDotButton == true){
			    				$scope.value.textDotButton = '';
			    			} else {
			    				$scope.value.textDotButton = '.';
			    			}
				    			
			    			if(targetOption.isKeyboardActive == true || targetOption.isKeyboardActive == undefined){
			    				$scope.value.isShow = true;
					    		$scope.$apply();
					    			
					    		$timeout(function(){
					    			$scope.event.showKeyboard();
					    			$scope.event.keyboardDisplayOnFocus();
					    		}, 0);
			    			}
				    	});
				    },
				    bindClickToHideKeyboard: function(){
				    	$(document).on('touchend', function(e){
				    		if ($scope.value.isShow){
					    		var target = (e.touch) ? e.touch[0].target : e.target;
					        	var $target = $(target);
	
					        	if (!$target.is('[data-keyboard-target-id]') && !$target.parents().is('.my-virtual-keyboard')) {
					            	$scope.event.hiddenKeyboard();
					            }
				    		}
				    	});
				    	
				    	document.addEventListener("backbutton", function(e){
				    		$scope.event.hiddenKeyboard();
					    }, false);
				    },
				    startWatchTarget: function(){
				    	// service broadcast listener
					    $scope.$on('keyboardDirectiveAdded', function() {
					    	$scope.event.addTarget(dataShareService.target);
					    });
					    
				    },
				    addTarget: function(data){
				    	if(data !== undefined && data !== null){
				    		
				    		angular.forEach(data, function(value, key) {
				    			if($scope.value.target.registControl[key] == undefined){
						    		$scope.event.bindClickToShowKeyboard(value.element);
						    		
						    		$scope.value.target.registControl[key] = value.element;
				    			}
				    		});
				    	} 
				    		
				    },
				    add: function(value){
				    	if(value === "") {
							return;	
						}
				    	var targetOption = dataShareService.getOption($scope.value.target.activeId);
				    	var targetModel = dataShareService.getModel($scope.value.target.activeId);
				    	var postlength = targetOption.postlength || 2;
				    	targetModel = (targetModel === undefined || targetModel === null) ? "" : targetModel + "";
				    	targetModel = targetModel + value;
				    	targetModel = $scope.formatDecimal.format(targetModel, targetOption.maxlength, postlength);
					    // set model target
					    dataShareService.setModel($scope.value.target.activeId, targetModel);
					    dataShareService.broadcast("keyboardDirectiveKeyup", { 'controlId': $scope.value.target.activeId });
				    },
				    del: function(){
				    	var targetModel = dataShareService.getModel($scope.value.target.activeId);
				    	
				    	targetModel = (targetModel === undefined || targetModel === null) ? "" : targetModel + "";
				    	targetModel = targetModel.substring(0, targetModel.length - 1);
				    		
				    	// set model target
				    	dataShareService.setModel($scope.value.target.activeId, targetModel);
				    	dataShareService.broadcast("keyboardDirectiveKeyup", { 'controlId': $scope.value.target.activeId });
				    },
				    showKeyboard: function(){
				    	// set keyboard active
			    		dataShareService.isVirtualKeyBoardActive = true;
				    	
				    	var keyboardTop = $scope.value.windowHeight - $scope.value.thisHeight;
			    		$scope.style.virtualKeyboard.top = (keyboardTop + 3) + 'px'; // margin = 3
				    	$scope.$apply();
				    },
				    hideKeyboard: function(isApply){
				    	$scope.style.virtualKeyboard.top = $scope.value.windowHeight + 'px';
				    	if(isApply === undefined || isApply === true){
		    				$scope.$apply();
		    			}
				    },
				    hiddenKeyboard: function(isApply){
				    	if ($scope.value.isShow === true){
				    		// set keyboard active
				    		dataShareService.isVirtualKeyBoardActive = false;
				    		
					    	$scope.event.hideKeyboard(isApply);
				    		$scope.event.keyboardDisplayOnBlur();
				    		
				    		// broadcast onblur
				    		dataShareService.broadcast("keyboardDirectiveBlur", { 'controlId': $scope.value.target.activeId });
				    		
				    		// delay for keyboard hide animation complete
				    		$timeout(function(){
				    			$scope.value.isShow = false;
				    			if(isApply === undefined || isApply === true){
				    				$scope.$apply();
				    			}
				    		},300);
				    	}
				    },
				    keyboardDisplayOnFocus: function() {
			    		var $input = $(dataShareService.getElement($scope.value.target.activeId));//$('input[data-keyboard-target-id="' + $scope.targetActiveId + '"');
			    	    var inputDivBottom = $input.offset().top + $input.innerHeight();
			    	        
			    	    $timeout(function () {
			    	    	var $keyboard = $($scope.value.thisElement);
			    	    	var keyboardHeight = $scope.value.thisHeight;
			    	        var docHeight = $scope.value.windowHeight;
			    	        // var posKeyboardTop = $keyboard.offset().top; //$(window).height() - $keyboard.height(); //$keyboard.offset().top;
			    	        var posKeyboardBottom = $keyboard.offset().top + keyboardHeight;
			    	        var keyboardBottomMargin = docHeight - posKeyboardBottom;
			    	        if (keyboardBottomMargin < 0) {
			    	        	keyboardBottomMargin = 0;
			    	        }
			    	      
			    	        var diffHeight = ((inputDivBottom + keyboardHeight) - docHeight) + keyboardBottomMargin;
			    	        if (diffHeight > 0) {
			    	        	//Add dummy div
			    	        	var mainContent = $('ion-content').has($input);
			    	            var content = mainContent.children('div.scroll');
			    	            var diffMargin = (mainContent.innerHeight() - content.innerHeight());
			    	            if (diffMargin < 0) {
			    	            	diffMargin = 0;
				    	        }
			    	            //$scope.value.debug.debug_value = ' mainContent: ' + mainContent.innerHeight() + ' content: ' + content.innerHeight();//'diffMargin: ' + diffMargin + ', diffHeight: ' + diffHeight;
			    	            content.append('<div class="body-dummy" style="height:' + (diffHeight + diffMargin + 15) + 'px;"></div>');
			    	            $timeout(function () {
			    	            	//scroll to show all
			    	                $ionicScrollDelegate.scrollTo(0, document.body.scrollHeight);
			    	            }, 200);
			    	        }
			    		}, 200);

			    	},
			    	keyboardDisplayOnBlur: function() {
			    		var $bodyDummy = $('.body-dummy');
			    		if($bodyDummy.length > 0){
			    			$bodyDummy.remove();
				    	    $timeout(function () {
	    	                    //scroll to show all
	    	                	$ionicScrollDelegate.scrollTo(0, document.body.scrollHeight);
	    	                }, 200);
			    		}
			    	}
		    	};
		    	
		    	// execute scope function
		    	$scope.event.startWatchTarget();
		    	$scope.event.bindClickToHideKeyboard();
		    	$scope.event.init();
			}
		  };
}]);