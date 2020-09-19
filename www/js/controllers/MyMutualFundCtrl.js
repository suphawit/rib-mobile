angular.module('ctrl.myMutualFund', [])
.controller('myMutualFundCtrl', function($scope, displayUIService, $translate, $ionicModal, requestToPayInComingService,
		kkconst, $state,notificationService, popupService,notificationSetDetailService, mainSession, mutualFundService,manageAnyIDService) {
	'use strict';
	
	$scope.termAndCondText = '';
	$scope.resultMenu = '';


	$scope.navigateMyMutualFund = function (result) {
		$state.go(result.link);

	};

	var getMenu = function(){
		$scope.resultMenu  = mutualFundService.getPortMutualFundTransaction();
	};

	var init = function(){
		getMenu();
	};


	init();


})
.controller('myMutualFundModal', 
	function($scope, displayUIService, $translate, $ionicModal, requestToPayInComingService, $location,
		kkconst, $state,  $timeout,notificationService, popupService,notificationSetDetailService, mainSession, mutualFundService,manageAnyIDService) {
		'use strict';

//	$scope.isShowNext = false;
	var SELECTED_BTN_BG_COLOR			= 'selectedBtnBGColor';
	var UNSELECTED_BTN_BG_COLOR			= 'unSelectedBtnBGColor';
	$scope.transTodayScheduleDate 		= UNSELECTED_BTN_BG_COLOR;
	$scope.transFutureScheduleDate 		= SELECTED_BTN_BG_COLOR;
	

	var popupAlert = function(){
		popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'label.promptpayRegisterAgreeConditions');
	 };


	$scope.selectClose = function(){
		
		$scope.transTodayScheduleDate 		= UNSELECTED_BTN_BG_COLOR;
		$scope.transFutureScheduleDate 		= SELECTED_BTN_BG_COLOR;

	
	};

	$scope.termsAndCondChecked = function(){
		$scope.transTodayScheduleDate 		= SELECTED_BTN_BG_COLOR ;
		$scope.transFutureScheduleDate 		= UNSELECTED_BTN_BG_COLOR;
		var page = mutualFundService.getNevigatePageMutualFund();

		//$state.go('app.myMutualFund');
		$timeout($state.go(page), 5000);
		

	};

	var aaa =   $location.replace();
	

	$scope.goNextPage = function(){
		if(	$scope.transTodayScheduleDate  === 'selectedBtnBGColor' ){

		}else{
				popupAlert();
		}
	};



	$scope.viewTermAndConditions = function(){
	
		var objLanguage = { language: mainSession.lang };
		mutualFundService.getRegisterAnyIDTermsAndConditions(function(result){
			if(result.responseStatus.responseCode === kkconst.success){
				$scope.termAndCondText = result.value.termAndConditionData;
			
			} else {
				popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,result.responseStatus.responseCode);
			}
		}, objLanguage);
	};
	

	var init = function(){
		$scope.viewTermAndConditions();
	};


	init();

});









