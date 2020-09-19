angular.module('ctrl.rtpBlockList',[])
.controller('RequestToPayBlockListCtrl', function($scope,kkconst,requestToPayBlocklistService,anyIDService,$ionicListDelegate,popupService,mainSession,$ionicPopup,$filter) {
    
    $scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
    var requestRTPBlocklist = function(){
        requestToPayBlocklistService.inquiryBlocklist().then(function(result){
            $scope.rtpBlockList = result.rtpblockList || [];
            $scope.showBlockList = result.totalAllTransaction === 0 ? false : true;
        }, function(error) {
            $scope.rtpBlockList = [];
            $scope.showBlockList = false;
        });
    };
    var requestToUnblock = function(params){
        requestToPayBlocklistService.requestToUnblock(params).then(function(result){
            $ionicListDelegate.closeOptionButtons();
            popupService.showErrorPopupMessage('label.success','unblock.successMsg');
            requestRTPBlocklist();
        });
    };

    $scope.init = function(){
        requestRTPBlocklist();
    };
    $scope.rtpBlockList = [];
    $scope.showBlockList = true;
    // $scope.unblockItem = function(item){
    //     popupService.showConfirmPopupMessageCallback('label.confirm', window.translationsLabel[mainSession.lang]['label.confirmUnBlockRTPRecevie']+' '+item.value,function(ok){
	// 		if(ok){
    //             requestToUnblock(item);
	// 		} else {
	// 			$ionicListDelegate.closeOptionButtons();
	// 		}
	// 	});
    // };
    $scope.unblockItem = function(item ){
        popupService.savedPopup = $ionicPopup.confirm({
            title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i> ' + popupService.convertTranslate('label.confirmUnBlockRTPReceive'),
            cssClass:'myPopupClass',
            cancelText: $filter('translate')('button.cancel'),
            okText: $filter('translate')('button.ok'),
            template : window.translationsLabel[mainSession.lang]['body.confirmUnblockAccMsg']	
        });
        popupService.savedPopup.then(function(response) {
            if(response){
                requestToUnblock(item);
            }else{
                $ionicListDelegate.closeOptionButtons();
            }
        });
    };
    $scope.getAnyIdInfo = function(type){
        return anyIDService.getAnyIDinfo(type);
    }
});