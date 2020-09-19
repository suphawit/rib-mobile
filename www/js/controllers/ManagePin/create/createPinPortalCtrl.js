angular.module('ctrl.createPinPortalCtrl', [])
	.controller('createPinPortalCtrl', function ($scope, $state, kkconst, $ionicHistory) {
		console.log('createPinPortalCtrl');
		$scope.event = {
			isShowBack: true,
			isShowNext: false,
			goBackPage: function(){
				// do something
				$state.go(kkconst.ROUNTING.MENU.STATE);
			},
			goNextPage: function(){
				// do something
			}
		};

		$scope.pinportal = {
			onaction: function(value){
				console.log(value);
				var state = '';
                switch(value) {
                    case 'username':
                        state = kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.STATE;//$state.go(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.STATE);
                        break;
                    case 'debitcard':
                        state = kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.STATE;//$state.go(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.STATE);
                        break;
                    case 'kkproduct':
                        state = kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.STATE;//$state.go(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.STATE);
						break;
					case 'mypin':
                        state = kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.STATE;//$state.go(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.STATE);
                        break;
                }

				$ionicHistory.clearCache().then(function () {
					$state.go(state);
				});
			},
			canShowMyPIN: true
		};

		
	});