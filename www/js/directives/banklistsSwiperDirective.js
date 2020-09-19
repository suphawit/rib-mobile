angular.module('directive.banklistSwiper', [])
.directive('banklistSwiper', ['BankCodesImgService', 'kkconst', function(BankCodesImgService, kkconst) {
	 return {
		    restrict: 'E',
		    scope: {
		    	'activeItem': '@',
		    	'items': '=',
		    	'overrideParameters': '=',
		    	'onDataUpdated': '&',
				'options': "="
		    },
		    templateUrl: 'templates/bankswiper-template.html',
	        link: function($scope, element, attr) {
	        	// scope variable
	        	$scope.value = {
	        		'activeBankCodeColor': '',
	        		'activeBankCode': '',
	        		'bankCodeImageList': {},
	        		'returnObj': {},
	        		'debug': {
	        			'isShow': false,
	        			'value': ''
	        		}
	        	};
	        	
	        	$scope.event = {
	        		'getItemsByBankCode': function(param){
	        			var returnValue = {};
	        			for(var i = 0; i < $scope.items.length; i++){
	        				var item = $scope.items[i];
	        				if(item['bankCode'] === param){
	        					returnValue = item;
	        					break;
	        				}
	        			}
	        			
	        			return returnValue;
	        		}
	        	};
	        	
	        	// store bank code image list
	        	$scope.value.bankCodeImageList = BankCodesImgService.getBankCodeImagesList();
	        	
	        	// scope swiper
	        	$scope.swiper = {};
	        	$scope.onReadySwiper = function (swiper) {
	        		var objSwiper = {
	        			'setDefault': function(){
	        				// set Default
	        				var activeBankCode = null;
							if($scope.activeItem === undefined || $scope.activeItem === ''){
								activeBankCode = kkconst.bankcode.kkbank;
							}else{
								activeBankCode = $scope.activeItem;
							}
	        				var defaultBankData = $scope.event.getItemsByBankCode(activeBankCode);
	    	        		var defaultBankCodeImage = $scope.value.bankCodeImageList[activeBankCode];
	    	        		var defaultItem = objSwiper.getItemByBankCode(activeBankCode);
	        				
	        				swiper.slideTo(defaultItem.index);
	        				
	    	        		$scope.value.returnObj = { 'bankCode': activeBankCode, 'bankName': defaultBankData.bankName };
	    	        		objSwiper.removeStyleToAllItem();
	    	        		defaultItem.element.children[0].style.backgroundColor = defaultBankCodeImage.color;
	    	        		
	    	        		// set isolate scope
	    	        		$scope.$apply(function(){
	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	        		});
	        			},
	        			'removeStyleToAllItem': function(){
        					angular.forEach(swiper.slides, function(value, key) {
				    			var img = value.children[0];
				    			img.style.backgroundColor = '';
				    		});
        				},
        				'getItemByBankCode': function(bankcode){
        					var returnObject = {};
        					for(var i = 0; i < swiper.slides.length; i++){
				    			var img = swiper.slides[i].children[0];
				    			if(img.id === bankcode){
				    				returnObject = { 'element': swiper.slides[i], index: i };
				    			}
				    		}
        					
        					return returnObject;
        				},
	        			'bindEvent': {
	        				'onTransitionEnd': function(){
	        					swiper.on('transitionEnd', function (e) {
	        						var activeIndex = e.activeIndex;
	        			    		var activeItem = swiper.slides[activeIndex].children[0];
	        			    		var bankid = activeItem.id;
	        			    		var bankname = activeItem.name;
	        			    		var bankColor = kkconst.bankDefaultColor;
	        			    		// set scope variable
	    	    	        		var bankCodeImage = $scope.value.bankCodeImageList[bankid];
	    	    	        		$scope.value.returnObj = { 'bankCode': bankid, 'bankName': bankname, 'action': 'onTransitionEnd' };
	    	    	        		
	    	    	        		objSwiper.removeStyleToAllItem();
	    	    	        		
	    	    	        		if(bankCodeImage !== undefined){
	    	    	        			bankColor = bankCodeImage.color;
	    	    	        		}
	    	    	        		activeItem.style.backgroundColor = bankColor;
	    	    	        		
	    	    	        		$scope.$apply(function(){
	    	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	    	        		});
	        	                }); 
	        				},
	        				'onSliderMove': function(){
	        					swiper.on('sliderMove', function (e) {
	        						var activeIndex = e.activeIndex;
	        			    		var activeItem = swiper.slides[activeIndex].children[0];
	        			    		var bankid = activeItem.id;
	        			    		var bankname = activeItem.name;
	        			    		var bankColor = kkconst.bankDefaultColor;
	    	    	        		var bankCodeImage = $scope.value.bankCodeImageList[bankid];
	    	    	        		$scope.value.returnObj = { 'bankCode': bankid, 'bankName': bankname, 'action': 'onSliderMove' };
	    	    	        		
	    	    	        		
	    	    	        		objSwiper.removeStyleToAllItem();
	    	    	        		
	    	    	        		if(bankCodeImage !== undefined){
	    	    	        			bankColor = bankCodeImage.color;
	    	    	        		}
	    	    	        		activeItem.style.backgroundColor = bankColor;
	    	    	        		
	    	    	        		$scope.$apply(function(){
	    	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	    	        		});
	    	    	        		
	        	                }); 
	        				},
	        				'onDebug': function(){
	        					$scope.value.debug.isShow = true;
	        				},
	        				'onSlideToClickedSlide': function(){
	        					$('.swiper-slide').on('click', function (){
	        						swiper.slideTo($(this).index());
	        						var name = this.children[0].name;
	        						$scope.value.debug.value = name;
	        					});
	        				}
	        			}
	        		};
	        		
					$scope.$watch('options', function (value) {
						if((value !== undefined)&&(value.activeItem)){ 		
							activeBankCode = value.activeItem;

	        				var defaultBankData = $scope.event.getItemsByBankCode(activeBankCode);
	    	        		var defaultBankCodeImage = $scope.value.bankCodeImageList[activeBankCode];
	    	        		var defaultItem = objSwiper.getItemByBankCode(activeBankCode);
	        
	        				swiper.slideTo(defaultItem.index);
	        				
	    	        		$scope.value.returnObj = { 'bankCode': activeBankCode, 'bankName': defaultBankData.bankName };
	    	        		objSwiper.removeStyleToAllItem();
	    	        		defaultItem.element.children[0].style.backgroundColor = defaultBankCodeImage.color;
	    	        		
							
	    	        		// set isolate scope
							swiper.lockSwipes(true);
	    	        		$scope.onDataUpdated({ value: $scope.value.returnObj });					
							// var activeCode  = value.activeItem;		 							
							// var anyidTypeIfo = $scope.event.getAnyIdTypeInfo(activeCode,'');

							// var returnObjesct = {};
							// for(var i = 1; i < swiper.slides.length; i++){ 									   
							// 	var img = swiper.slides[i].children[0]; 									   
							// 	if(img.id === $scope.activeItem){ 										   
							// 			returnObject = { 'element': swiper.slides[i], index: i };
							// 			break; 									   
							// 	} 								   
							// }

							// var defaultItem = returnObject; 						 							
							// swiper.slideTo(defaultItem.index); 							 							
							// $scope.value.returnObj = anyidTypeIfo; 							 							
							// $scope.value.returnObj.action = 'onTransitionEnd' 							 							
							// objSwiper.removeStyleToAllItem(); 							 							
							// defaultItem.element.children[0].style.backgroundColor = anyidTypeIfo.anyidTypeIconColor;
							// swiper.lockSwipes(true);	 							
							// $scope.onDataUpdated({ value: $scope.value.returnObj }); 	
					 	} 														
									 					
					}); 

	        		// execute function
		        	objSwiper.setDefault();
		        	objSwiper.bindEvent.onTransitionEnd();
		        	objSwiper.bindEvent.onSliderMove();
	        	};
	        	
	        }
	 };
}])

 .directive('selectAnyIdOption', function(kkconst) {
    return {
    	templateUrl: 'templates/Directive/transferTypeOption.html',
        restrict: 'E',
        scope: {
	    	'typeSelected': '=',
	    	'typeInit': '='
	    },
        
	  
        
        link: function(scope, iElement, iAttrs) {
        	scope.anyIDTypeData = kkconst.ANY_ID_TYPE;
        	scope.anyIDTypeSelected = scope.anyIDTypeData.ACCOUNT;
            
        	scope.select = function(type){
        		scope.anyIDTypeSelected = type;
        		scope.typeSelected(type);
        	};
        	
        	//set default
        	if(scope.typeInit === undefined){
        		scope.select(scope.anyIDTypeSelected);	
        	} else {
        		scope.anyIDTypeSelected = scope.typeInit.type || scope.anyIDTypeSelected;
        	}
        }
    };
})

.directive('anyIdTypeListSwiper', ['kkconst', 'mainSession', function(kkconst,mainSession) {
	 return {
		    restrict: 'E',
		    scope: {
		    	'activeItem'		: "@",
		    	'items'				: "=",
		    	'overrideParameters': "=",
		    	'onDataUpdated'		: "&",
				'options'			: "="
		    },
		    templateUrl: 'templates/anyidtypeswiper-template.html',
	        link: function($scope, element, attr) {
	        	// scope variable
	        	$scope.value = {
	        		'returnObj': {},
	        		'debug'	   : { 'isShow': false,'value': ''}
	        	};	        	        	        	
	        	
	        	$scope.event = {
	        		'getItemsByCode': function(param){
	        			var returnValue = {};	
	        			for(var i = 0; i < $scope.items.length; i++){
	        				var item = $scope.items[i];
	        				if(item.type === param){
	        					returnValue = item;
	        					break;
	        				}
	        			}	        			
	        			return returnValue;
	        		},
	        		'getAnyIdTypeInfo': function(code,action){
	        			var anyidTypeIfo = $scope.event.getItemsByCode(code);
	        			return {'anyidTypeCode': code,
        				    	'anyidTypeDescriptionName': mainSession.lang ===  kkconst.LANGUAGE_th ? anyidTypeIfo.descriptionTH : anyidTypeIfo.descriptionEN,
    	        				'anyidTypeLabelName':mainSession.lang ===  kkconst.LANGUAGE_th ? anyidTypeIfo.labelTh : anyidTypeIfo.labelEn,
    	        				'anyidTypeIconColor':anyidTypeIfo.iconColor,
    	        				'anyidTypeImage':anyidTypeIfo.icon,
    	        				'anyidTypeDataType':anyidTypeIfo.valueType,
    	        				'anyidTypeLength':anyidTypeIfo.valueLength,
    	        				'action':action};
	        		}
	        	};
	        		        		        	
	        	// scope swiper
	        	$scope.swiper = {};
	        	$scope.onReadySwiper = function (swiper) {
	        		var objSwiper = {
	        			'setDefault': function(){
							// set Default
							var defaultActiveCode = $scope.items[0].type;
	        				var activeCode  = ($scope.activeItem === undefined || $scope.activeItem === "") ? defaultActiveCode : $scope.activeItem;
							var anyidTypeIfo = $scope.event.getAnyIdTypeInfo(activeCode,'');
							var defaultItem  = objSwiper.getItemByCode(activeCode);
	        				swiper.slideTo(defaultItem.index);
	    	        		$scope.value.returnObj = anyidTypeIfo;
	    	        		objSwiper.removeStyleToAllItem();
	    	        		defaultItem.element.children[0].style.backgroundColor = anyidTypeIfo.anyidTypeIconColor;
	    	        		
	    	        		$scope.$apply(function(){
	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	        		});
	        			},
	        			'removeStyleToAllItem': function(){
     					angular.forEach(swiper.slides, function(value, key) {
				    			var img = value.children[0];
				    			img.style.backgroundColor = "";
				    		});
     				},
     				'getItemByCode': function(code){
						 var returnObject = {};
     					for(var i = 1; i < swiper.slides.length; i++){
				    			var img = swiper.slides[i].children[0];
				    			if(img.id === code){
									returnObject = { 'element': swiper.slides[i], index: i };
									break;
				    			}
				    		}     					
     					return returnObject;
     				},
	        			'bindEvent': {
	        				'onTransitionEnd': function(){
	        					swiper.on('transitionEnd', function (e) {
	        			    		var activeItem = swiper.slides[e.activeIndex].children[0];	 
	        			    		var anyidTypeIfo = $scope.event.getAnyIdTypeInfo(activeItem.id,'onTransitionEnd');

	    	    	        		$scope.value.returnObj = anyidTypeIfo;	    	    	        		
	    	    	        		objSwiper.removeStyleToAllItem();	    	    	        		
	    	    	        		activeItem.style.backgroundColor = anyidTypeIfo.anyidTypeIconColor;
	    	    	        		
	    	    	        		$scope.$apply(function(){
	    	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	    	        		});
	        	                }); 
	        				},
	        				'onSliderMove': function(){
	        					swiper.on('sliderMove', function (e) {
	        			    		var activeItem = swiper.slides[e.activeIndex].children[0];
	        			    		var anyidTypeIfo = $scope.event.getAnyIdTypeInfo(activeItem.id,'onSliderMove');
	        			    		
	    	    	        		$scope.value.returnObj = anyidTypeIfo;	    	    	        		
	    	    	        		objSwiper.removeStyleToAllItem();
	    	    	        		activeItem.style.backgroundColor = anyidTypeIfo.anyidTypeIconColor;
	    	    	        		
	    	    	        		$scope.$apply(function(){
	    	    	        			$scope.onDataUpdated({ value: $scope.value.returnObj });
	    	    	        		});
	    	    	        		
	        	                }); 
	        				},
	        				'onDebug': function(){
	        					$scope.value.debug.isShow = true;
	        				},
	        				'onSlideToClickedSlide': function(){
	        					$('.swiper-slide').on('click', function (){
	        						swiper.slideTo($(this).index());
	        						var name = this.children[0].name;
	        						$scope.value.debug.value = name;
	        					});
	        				}
	        			}
	        		};

					$scope.$watch('options', function (value) {
						if((value !== undefined)&&(value.activeItem)){ 		
							$scope.activeItem = value.activeItem; 							
							var activeCode  = value.activeItem;		 							
							var anyidTypeIfo = $scope.event.getAnyIdTypeInfo(activeCode,'');

							var returnObject = {};
							for(var i = 30; i < swiper.slides.length; i++){ 									   
								var img = swiper.slides[i].children[0]; 									   
								if(img.id === $scope.activeItem){ 										   
										returnObject = { 'element': swiper.slides[i], index: i };
										break; 									   
								} 								   
							}

							var defaultItem = returnObject; 						 							
							swiper.slideTo(defaultItem.index); 							 							
							$scope.value.returnObj = anyidTypeIfo; 							 							
							$scope.value.returnObj.action = 'onTransitionEnd' 							 							
							objSwiper.removeStyleToAllItem(); 							 							
							defaultItem.element.children[0].style.backgroundColor = anyidTypeIfo.anyidTypeIconColor;
							swiper.lockSwipes(true);	 							
							$scope.onDataUpdated({ value: $scope.value.returnObj }); 	
					 	} 														
									 					
					}); 
	        		
	        		// execute function
		        	objSwiper.setDefault();
		        	objSwiper.bindEvent.onTransitionEnd();
		        	objSwiper.bindEvent.onSliderMove();
	        	};	        	
	        }
	 };
}]);
