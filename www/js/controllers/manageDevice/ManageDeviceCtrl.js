angular.module('ctrl.manageDeviceCtrl', [])
	.controller('manageDeviceCtrl', function ($scope, $state, kkconst, $ionicHistory, mainSession,manageDeviceService,popupService
    ,$ionicListDelegate,$ionicPopup,anyIDService,subscriptionService,$filter,connectionService,deviceService,$translate) {
        $scope.listOfDevice = [];
        function inquiryAllDevices() {
            manageDeviceService.inquiryAllDevice(function(responseStatus,resultObj){
                if(responseStatus.responseCode === kkconst.success){
                    $scope.listOfDevice = resultObj;
                    if($scope.listOfDevice.length > 0){
                        $scope.mobileIcon = anyIDService.getAnyIDinfo('MSISDN').icon;
                    }
                }
            });
        }

        $scope.getAnyIdInfo = function(type){
            return anyIDService.getAnyIDinfo(type);
        }

        $scope.deleteDevice = function(item){
            var template = window.translationsLabel[$translate.use()]["lbl.msgBodyDeleteDevice"];
            popupService.showConfirmPopupMessageCallback('lbl.msgDeleteDevice',template,function(ok){
                if(ok){
                    requestToDelete(item);
                }
                else{
                    $ionicListDelegate.closeOptionButtons();
                }
            });	
        };

        function requestToDelete(item){
            manageDeviceService.deleteDevice(item, function(resultObj){
    			if(resultObj.responseStatus.responseCode === kkconst.success) {
                    if(item.currentDevice){
                        logout();
                    }else{
                        popupService.showErrorPopupMessage('label.success','lbl.removeDeviceSuccess');
                        inquiryAllDevices();
                    }
    				
    			} else {
    				popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
    			}
    		});
        }

        function logout(){
            // loginChallengeHandler.logout();
            subscriptionService.logout();
            // location.reload();

            window.location = window.location.href.replace(/#.*/, '');
            // WL.Client.reloadApp();
        }


        inquiryAllDevices();
	});
