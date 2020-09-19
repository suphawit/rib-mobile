angular.module('ctrl.promotions',[])
.controller('PromotionsCtrl', function($scope,loginService) {
	 
	  $scope.promotions = [
	    { title: 'Promotion1', id: 1 },
	    { title: 'Promotion2', id: 2 },
	    { title: 'Promotion3', id: 3 },
	    { title: 'Promotion4', id: 4 },
	    { title: 'Promotion5', id: 5 },
	    { title: 'Promotion6', id: 6 }
	  ];
})

.controller('PromotionCtrl', function($scope, $stateParams) {
	$scope.promotion = $stateParams.promotionId;
});

