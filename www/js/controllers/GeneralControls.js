angular.module('ctrl.generalControllers', [])

.controller('tabsControler',
    function ( $scope , $ionicSideMenuDelegate   ) {
	 
	$scope.toggleRightMenu = function(){		 
		$ionicSideMenuDelegate.toggleRight();
	}; 

})

.controller('menuControler',function ( $scope , $ionicModal) {
	
	$scope.showNotificationPanel = function() {
		 $scope.notificationModal.show(); 	 
	};
	 		  
	$ionicModal.fromTemplateUrl('templates/notificationModal.html', {
		scope: $scope,
	    viewType: 'bottom-sheet',
	    animation: 'animated slideInDown' 
	  }).then(function(modal) {
	    $scope.notificationModal = modal;
	});
		 
	$scope.closeNotificationModal = function() {
	    $scope.notificationModal.hide();
	     
	};	 
}) 
.controller('contactUsCtrl', function($scope, $translate, $state, invokeService, popupService, mainSession, kkconst, $sce) {
	
	$scope.mailTo = kkconst.CONTACT_US_MAILTO;
	$scope.init = function() {
		var obj = {
				params: {}
			}; 
			var lang = mainSession.lang; 
			obj.params.language = lang;
			obj.params.actionCode = 'contact_us';
			obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
			obj.procedure = 'getContactUsProcedure';
			 
			obj.onSuccess = function(result) {		 
				if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
					$scope.contactUsDetails = result.responseJSON.result.value;
					$scope.contactUsAddrList = result.responseJSON.result.value.list;
					// taton add new change
					$scope.contactDetail = result.responseJSON.result.value.data;
					$scope.workingTimeMobile = $sce.trustAsHtml(result.responseJSON.result.value.workingTimeMobile);
				} else {		 
		        	popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.responseCode);
				}			
			}; 
			//invokeService.executeInvokePublicService(obj);
			invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	};
	
	$scope.init();
	
	$scope.openPhoneDailerWindow = function(phone) {
		var p = 'tel:' + ((phone.replace(/\s/g, '')) || '021655555');
        window.open(p, '_system');
    };
	
	$scope.locateUS = function() {
		$state.go('app.locateUs');	 
	};
	
})
.controller('locateUsCtrl', function($scope, $translate, invokeService, popupService) {
	// do something 
})
.controller('promotionCtrl', function($scope, $sce, $translate, invokeService, popupService, kkconst) {
	
	var promoteionUrl = $sce.trustAsResourceUrl(kkconst.PROMOTION_URL);
	$scope.promoArrayList = [
	         {src: 'images/tempPromo.png' , url: promoteionUrl},
	         {src: 'images/logoKK_contact.png' , url: promoteionUrl},
	         {src: 'images/Bank_KK.png' , url: promoteionUrl}
	];
	
	$scope.openInExternalWindow = function(url){
		window.open( url , '_blank','shouldPauseOnSuspend=yes' );
		//cordova.InAppBrowser.open(url, '_blank', 'location=yes');
	};
	 
})
.controller('faqCtrl', function($scope, $translate, invokeService, popupService, mainSession, kkconst) {
	$scope.toggleGroup = function(group) {
	
	    if ($scope.isGroupShown(group)) {
	      $scope.shownGroup = null;
	    } else {
	      $scope.shownGroup = group;
	    }
   };
  
   $scope.isGroupShown = function(group) {
     return $scope.shownGroup === group;
   };
	  
	var obj = {
		params: {}
	}; 
	var lang = mainSession.lang; 
	obj.params.language = lang;
	obj.params.actionCode = 'faq';
	obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
	obj.procedure = 'getFAQProcedure';
	 
	obj.onSuccess = function(result) {		 
		if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){
			
			$scope.faqtDetails = result.responseJSON.result.value.data;
			 
			
		} else {		 
			popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.responseCode);
		}			
	}; 
	//invokeService.executeInvokePublicService(obj);
	invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	  
})

    .controller('privacyPolicyCtrl', function($scope, $translate, invokeService, popupService, mainSession, kkconst) {

        var obj = {
            params: {}
        };
        var lang = mainSession.lang;
        obj.params.language = lang;
        obj.params.actionCode = 'policy';
        obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
        obj.procedure = 'getPrivacyProcedure';

        obj.onSuccess = function(result) {
            if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success){

                $scope.privacyPolicyDetails = result.responseJSON.result.value.data;


            } else {
                popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.responseCode);
            }
        };
        invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});

    });