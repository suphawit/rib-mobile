angular.module('directive.verifyProductFormDirective', [])
.directive('verifyProductForm', ['popupService', 'mainSession', 'dateService', '$compile', function(popupService, mainSession, dateService, $compile) {
	 return {
		    restrict: 'E',
            templateUrl: 'templates/ManagePin/verify-product-form.html',
		    scope: {
                onaction: '&',
                control: '=',
                isshowbutton: '=',
                country: '=',
                product: '='
		    },
		    controller: ['$scope', function ($scope) {
				// do something
	        }],
	        link: function($scope, element, attr) {
                var lang  =  mainSession.lang;
                var doSubmit = function(form){
                    // console.log(form);
                    if(form.value.idType === ''){
                        popupService.showErrorPopupMessage('alert.title','input.carTypeValidation');
                    } else if(form.value.idNo === ''){
                        popupService.showErrorPopupMessage('alert.title','input.cardNoValidation');
                    // } else if(form.value.dateOfBirth === ''){
                    //     popupService.showErrorPopupMessage('alert.title','input.birthDateValidation');
                    } else if(form.value.productType === ''){
                        popupService.showErrorPopupMessage('alert.title','input.productTypeValidation');
                    } else if(form.value.productNo === ''){
                        popupService.showErrorPopupMessage('alert.title','lable.productNoValidation');
                    } else {
                        $scope.onaction({ value: form.value });
                    }
                };

                var init = function(){
                    $scope.input.value.idType = $scope.cardList[0].value;
                };

                $scope.event = {
                    setProductType: function(productType){
                        $scope.input.value.productType = productType.value;
                    },
                    selectDate: function() {
                        dateService.selectBirthDate(function(dateObj,strDate,defultStr){
                            if(dateObj !== null){
                                //console.log('dateService.selectBirthDate -> ', dateObj, strDate);
                                $scope.$apply(function() {
                                    // $translate.use(mainSession.lang);
                                    $scope.birthDate = strDate;
                                    $scope.input.value.dateOfBirth = strDate;
                                });
                            }
                        });
                    },
                    setCardType: function(cardType){
                        $scope.input.value.idType = cardType.value;
                        if(cardType.value === 'I'){
                            $scope.input.value.idIssueCountryCode = 'TH';
                        } else {
                            $scope.input.value.idIssueCountryCode = $scope.country.selected.countryCode;
                        }
                    },
                    setCountryCode: function(country){
                        // console.log(country);
                        $scope.input.value.idIssueCountryCode = country.countryCode;
                    }
                };

                $scope.chromeview = true;
                $scope.input = {
                    value: {
                        idType: '',
                        idNo: '',
                        productId: '',
                        dateOfBirth: '',
                        productType: '',
                        idIssueCountryCode: 'TH'
                    }
                };
                $scope.birthDate = '';
                $scope.countryDescField = mainSession.lang === 'en' ? 'descEn' : 'descTh';

                $scope.cardList = [
                    { name: window.translationsLabel[lang]['input.cardType.id'], value: 'I', icon: 'icon-card-id' },
				    { name: window.translationsLabel[lang]['input.cardType.passport'], value: 'P', icon: 'icon-passbook' }
                ];
                
                $scope.doSubmit = function(form){
                    doSubmit(form);
                };

                $scope.isShowSubmitButton = ($scope.isshowbutton ? true : false);
                $scope.internalControl = $scope.control || {};
                $scope.internalControl.doSubmit = function() {
                    doSubmit($scope.input);
                };

                var compileDirective = function(){
                    var virtualKeyBoardIdNoDirective = angular.element('<input bind-virtual-keyboard vkmodel="input.value.idNo" vkoption="virtualKeyboardIdNo.option" class="whiteBGColor" type="text" ng-model="input.value.idNo" maxlength="30">');
                    element.find('#lblIdNo').append(virtualKeyBoardIdNoDirective);
                    $compile(virtualKeyBoardIdNoDirective)($scope);

                    var virtualKeyBoardProductNoDirective = angular.element('<input bind-virtual-keyboard vkmodel="input.value.productId" vkoption="virtualKeyboardProductNo.option" class="whiteBGColor" type="text" ng-model="input.value.productId" maxlength="20">');
                    element.find('#lblProductNo').append(virtualKeyBoardProductNoDirective);
                    $compile(virtualKeyBoardProductNoDirective)($scope);
                };
                $scope.virtualKeyboardIdNo = {
                    option: {
                        disableDotButton: true,
                        maxlength: 30
                    }
                };

                $scope.virtualKeyboardProductNo = {
                    option: {
                        disableDotButton: true,
                        maxlength: 20
                    }
                };

                init();
                compileDirective();
			}
	};
}]);