angular.module('ctrl.schedule', [])
	.controller('ScheduleCtrl', function($scope, $ionicHistory) {
		$scope.isShowBack = false;
		if($ionicHistory.viewHistory().backView !== null){
			$scope.isShowBack = true;
		}else {
			$scope.isShowBack = false;
		}
	});