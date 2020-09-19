angular.module('directive.common', [])
.directive('ionBottomSheet', [function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      controller: [function() {
		  //do something
	  }],
      template: '<div class="modal-wrapper" ng-transclude></div>'  
    };
  }])
.directive('ionBottomSheetView', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('bottom-sheet modal');
    }
  };  
})

.directive('ionTopSheetView', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('top-sheet modal');
    }
  };  
})

.filter("kkdatetime", function($filter){
		
		/* Following custom filter only works on below formats
		 * DateTime : dd/mm/yyyy hh:mm:ss - Or - dd-mm-yyyy hh:mm:ss
		 * Date: dd/mm/yyyy - Or - dd-mm-yyyy
		 */
		
		return function(input, format) {
			var _isoDate, _time, _dStr, _date;
			//check if input value is already a valid date
			if( Object.prototype.toString.call(input) === "[object Date]" && !isNaN(input.getTime()) ){				 
				_isoDate = $filter('date')(new Date(input.getTime()), format);				 
				return _isoDate;				 			
			}
			
			if(input === null || input === '' || (input.indexOf("/") === -1 && input.indexOf("-") === -1) ){				
				  return ""; 
			} 
			
			input = input.trim();			
			
			var convertToISODateFormat = function(arr){
				if(arr.length === 3 ){
					return arr[2] + "/" + arr[1] + "/" + arr[0];
				}else{
					return arr.join("/");
				}
			};
			
			var dt = input.split(' ');				
			_dStr = dt[0].split(/[^0-9]/);
				
			//if time part exists
			if(dt.length > 1){
				_time = dt[1];
			}else{
				_time = '';
			}				
			_date = convertToISODateFormat(_dStr) + ' ' + _time;
			 
			_isoDate = $filter('date')(new Date(_date), format);
			
			return _isoDate;	
		};
	})
	
.directive('decimalPlaces',function(){
    return {
        link:function(scope,ele,attrs){
            ele.bind('keypress',function(e){
                var newVal=$(this).val()+(e.charCode!==0?String.fromCharCode(e.charCode):'');
                if($(this).val().search(/(.*)\.[0-9][0-9]/)===0 && newVal.length>$(this).val().length){
                    e.preventDefault();
                }
            });
        }
    };
})



.directive('accountNameValidation',function(generalService, mainSession){
    return {

        restrict: 'A',
        require: 'ngModel',
        scope: {
            bindModel:'=ngModel'

          },
        
        link: function (scope, element, attr, ngModelCtrl) {
        	var pattern = /([^\s A-Z\- ])$/g;
//        	var pattern = /^[A-Z]+((-[A-Z])|( [A-Z])|[A-Z])+$/g;
            var transformedTxt;
            var newTextCode;
            var createPosition;
            var init = true;
            var isfromUser = false;
            var isNullKeyCode = false;

			var getValueKey = function(str){
				return (str.length > 0) ? str.charCodeAt(str.length-1) : null;
			};

            function fromUser(text) {

            	isfromUser = true;
	              text = text.toUpperCase();
	              newTextCode = getValueKey(text)
	              
	       
	              createPosition = getCaretPosition(element[0]);
	              
	              
	                if (!text && mainSession.deviceOS !== 'Android'){
	                	transformedTxt = text;
	                    return text;
	                }
	              
	                var transformedInput = text.replace(pattern, '');
	                
	            	if(mainSession.deviceOS === 'Android'){
	            		transformedInput = text;
	            		 ngModelCtrl.$setViewValue(transformedInput);
	 	                 ngModelCtrl.$render();
	            	}else{
	            	     if (transformedInput !== text) {
	 	                    ngModelCtrl.$setViewValue(transformedInput);
	 	                    ngModelCtrl.$render();
	 	                }
	            	}
	           
	                transformedTxt = transformedInput;
	                return transformedInput;
              
            }
            
            
            function setCaretPosition(input, pos){
	              if (!input) {
	            	  return 0;
	              }
	              if (input.offsetWidth === 0 || input.offsetHeight === 0) {
	                  return; // Input's hidden
	              }
	              if (input.setSelectionRange) {
	                  input.focus();
	                  input.setSelectionRange(pos, pos);
	              } else if (input.createTextRange) {
	                  // Curse you IE
	                  var range = input.createTextRange();
	                  range.collapse(true);
	                  range.moveEnd('character', pos);
	                  range.moveStart('character', pos);
	                  range.select();
	              } else {
					  // do something
				  }
	          }
            
            
            function getCaretPosition(input){
			              if (!input){ 
			            	  	return 0;
			              }
			              if (input.selectionStart !== undefined) {
			                  return input.selectionStart;
			              } else if (document.selection) {
			                  // Curse you IE
			                  input.focus();
			                  var selection = document.selection.createRange();
			                  		selection.moveStart('character', input.value ? -input.value.length : 0);
			                  return selection.text.length;
			              } else {
							  // do something
						  }
			              return 0;
			          }
       
                    element.on('keyup', function (event) {
         
                      var keyCode = event.charCode ? event.charCode : (window.event) ? window.event.keyCode : event.which;
                      if(mainSession.deviceOS === 'Android'){
                      		//var inputVal = this.value;
                      	} else {
                            if(isfromUser && newTextCode !=="32" && mainSession.deviceOS === 'Android'){
     	                	   element.val(transformedTxt)
     	                   }else{
     	              		 if(keyCode == "32" && transformedTxt.length <= createPosition){
     			            	element.val(transformedTxt+" ")
     			             }else{
     			              	element.val(transformedTxt)
     				         }
     				       }  
                            setCaretPosition(element[0], createPosition);
                      	}
                      
                     
                   });
                    

                    
                   
                   function adjustTextFocus(){
                	   if(init){
		        	   		init = false;
		        	   		if(scope.bindModel == undefined || scope.bindModel =="" || scope.bindModel == null){
		        	   			return false;
		        	   		}
		        	   		transformedTxt = scope.bindModel
		        	   	}else{
		        	   		transformedTxt = element.val();
		        	   	}
                	   transformedTxt = transformedTxt.toUpperCase();
                	   	transformedTxt = generalService.adjustText(transformedTxt);
                         
                         element.val(transformedTxt);
                         ngModelCtrl.$setViewValue(transformedTxt);
		                 ngModelCtrl.$render();
                   }
              
                   element.on('focus', function (event) {   
                      adjustTextFocus();
                
			      });
                   

                
                      
                  element.on('focusout', function (event) {   
                      adjustTextFocus();
                 
			      });
                      
                         	 
			      element.on('keydown', function (event) {
			    	  isfromUser = false;
			    	
			             	var keyCode = event.charCode ? event.charCode : (window.event) ? window.event.keyCode : event.which;
			             	// if(keyCode == 229 || (keyCode == 0 && mainSession.deviceOS === 'Android')){
			             	// 	isNullKeyCode = true;
			             	// }else{
			             	// 	isNullKeyCode = false;
			             	// }
			             	if(keyCode == "13"){
			             	    adjustTextFocus();
			             		
			            }
			            	
			                event.preventdefault;
			                
			        });
			            adjustTextFocus();
			    
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})
    
.directive('currencyInput', function() {
	return {
		restrict: 'A',
		scope: {
			field: '='
		},
		replace: true,
		template: '<span><input type="text" ng-model="field" class="fontSize18px whiteTextColor txtCenterAlignTextBox resizedEnterAmtTextbox" ></input>{{field}}</span>',
		link: function(scope, element, attrs) {

			$(element).bind('keyup', function(e) {
				// var input = element.find('input');
				//var inputVal = input.val();

				//clearing left side zeros
				while (scope.field.charAt(0) == '0') {
					scope.field = scope.field.substr(1);
				}

				scope.field = scope.field.replace(/[^\d.\',']/g, '');

				var point = scope.field.indexOf(".");
				if (point >= 0) {
					scope.field = scope.field.slice(0, point + 3);
				}

				var decimalSplit = scope.field.split(".");
				var intPart = decimalSplit[0];
				var decPart = decimalSplit[1];

				intPart = intPart.replace(/[^\d]/g, '');
				if (intPart.length > 3) {
					var intDiv = Math.floor(intPart.length / 3);
					while (intDiv > 0) {
						var lastComma = intPart.indexOf(",");
						if (lastComma < 0) {
							lastComma = intPart.length;
						}

						if (lastComma - 3 > 0) {
							intPart = intPart.splice(lastComma - 3, 0, ",");
						}
						intDiv--;
					}
				}

				if (decPart === undefined) {
					decPart = "";
				}
				else {
					decPart = "." + decPart;
				}
				var res = intPart + decPart;

				scope.$apply(function() {scope.field = res});

			});

		}
	};
}).directive('containerOffset', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.height = element.prop('offsetHeight');
            scope.width = element.prop('offsetWidth');
        }
    };
  });