angular.module('ctrl.scheduleFundtransfer', [])
	.controller('ScheduleFundtransferCtrl', function($scope, $translate, $ionicModal, $ionicSideMenuDelegate, $state,mainSession, $timeout, $rootScope, popupService, $ionicListDelegate, $ionicPopup, scheduleFundtransferService, BankCodesImgService,$filter,kkconst, $ionicScrollDelegate) {
		  
		var recurrance = false;
		
		$scope.isShowData = false;
		$scope.isNotShowData = false;
		$scope.active = 'thisTime';
		
		$scope.errorMsg='';
		$scope.toggleRight = function() {
			$ionicSideMenuDelegate.toggleRight();
		}; 
		
		$scope.inquiryFundTransferData = function(){
			scheduleFundtransferService.inquiryFundTransfer(function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success) {
					if(resultObj.value !== null && resultObj.value.length > 0 && resultObj.value !== 'undefined'){
						$scope.isShowData = true;
						$scope.isNotShowData = false;
						$scope.isNotConnectService = true;
						$scope.accountListcount = scheduleFundtransferService.returnSetAccountList(resultObj.value);
					} else {
						$scope.isNotShowData = true;
						$scope.isShowData = false;
						$scope.accountListcount = null;
						$scope.isNotConnectService = true;
					}
					$ionicScrollDelegate.scrollTop();
				} else {
					$scope.isNotShowData = true;
					$scope.isShowData = false;
					$scope.isNotConnectService = false;
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		
		};
		
		$scope.deleteAccountForSchedule = function(record){
			if((record.scheduleType === "0" && record.recurringType === "ONE TIME") || record.recurringTimes == 0) {
				 
				popupService.savedPopup = $ionicPopup.confirm({
					title : '<i class="icon ion-alert-circled"> </i>' + popupService.convertTranslate('label.AcctDelConfirmschdule'), 
					cssClass:'myPopupClass',
//					okText:'Confirm',
					cancelText: $filter('translate')('button.cancel'),
					okText: $filter('translate')('button.ok'),
					template : popupService.convertTranslate('label.deleteOneTime')
				});
				
				popupService.savedPopup.then(function(response) {
					if (response) {
						scheduleFundtransferService.deleteFundTransferAllSchedule(record ,function(resultObj){
							if(resultObj.responseStatus.responseCode === kkconst.success) {
								//success
								$scope.inquiryFundTransferData();
								popupService.showErrorPopupMessage('label.schedule.fundtranfer.title','label.schedule.fundtranfer.delete');
							} else {
								//fail
								popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
							}
						});
					} else {					
						$ionicListDelegate.closeOptionButtons();
					}
				});
			}else{
				popupService.savedPopup = $ionicPopup.confirm({
					title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i> ' + popupService.convertTranslate('label.AcctDelConfirmschdule'),
					cssClass:'myPopupClass',
					cancelText: $filter('translate')('button.cancel'),
					okText: $filter('translate')('button.ok'),
					scope: $scope,		
					template : "<div class='row'>"+
						"<div class='col'><span class='button-Color button scheduleDeleteBtn' translate='label.thisTime' id='thisTimeScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('thisTime') }\" ng-click=\"setActive('thisTime')\"></span></div>"+
						"<div class='col'><span class='button-Color button scheduleDeleteBtn scheduleDeleteBtnUnSelected' translate='label.allSchedule' id='allScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('allSchedule') }\" ng-click=\"setActive('allSchedule')\"></span></div>"+
					"</div>"					
				});
				popupService.savedPopup.then(function(response) {
	
					checkDeleteScheduleType(response, record);
				});
				$scope.active = 'thisTime';
				recurrance = false;
			}	
		};
		
		function checkDeleteScheduleType(response, record){
				if (response) {
				
						if(!recurrance) {
						
							//delete schedule
							deleteFundTransferSchedule(record);
						} else {
				
							//delete all schedule
							deleteFundTransferAllSchedule(record);
						}
				} else {
					$ionicListDelegate.closeOptionButtons();
				}
		}

		function deleteFundTransferSchedule(record) {

			scheduleFundtransferService.deleteFundTransferSchedule(record ,function(resultObj){
				if(resultObj.responseStatus.responseCode == kkconst.success) {
					popupService.showErrorPopupMessage('label.schedule.fundtranfer.title','label.schedule.fundtranfer.delete');
					$scope.inquiryFundTransferData();
				} else {
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		}

		function deleteFundTransferAllSchedule(record) {
	
			scheduleFundtransferService.deleteFundTransferAllSchedule(record ,function(resultObj){
				if(resultObj.responseStatus.responseCode == kkconst.success) {
					popupService.showErrorPopupMessage('label.schedule.fundtranfer.title','label.schedule.fundtranfer.delete');
					$scope.inquiryFundTransferData();
				} else {
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		}
		
	  	$scope.setActive = function(type) {
	        $scope.active = type;
	        if($scope.active === 'thisTime'){
	        	recurrance = false;
	        } else {
	        	recurrance = true;
	        }
	    };
	    $scope.isActive = function(type) {
	        return type != $scope.active;
	    };	
	
		$scope.navigationToScheduleFundTransferDetail = function(schedulelist) {
			var imageURL = BankCodesImgService.getBankCodeImg(schedulelist.bankCode,'image');
			var imageColor = BankCodesImgService.getBankCodeImg(schedulelist.bankCode,'color');
			scheduleFundtransferService.scheduleDataDetail = schedulelist;
			scheduleFundtransferService.bankImageURL = imageURL;
			scheduleFundtransferService.bankImageColor = imageColor;
			$state.go(kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE);
		};
		
		$scope.inquiryFundTransferData();
	})
	
	.controller('scheduleFundTransferDetailCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $ionicListDelegate, fundTransferResponseService,$translate,scheduleFundtransferService,mainSession, popupService,$filter,kkconst, anyIDService) {
		
		var recurrance = false;
		$scope.imageURL = scheduleFundtransferService.bankImageURL;
		$scope.imageColor = scheduleFundtransferService.bankImageColor;
		$scope.scheduleDetailList = scheduleFundtransferService.scheduleDataDetail;
		console.log($scope.scheduleDetailList)
		scheduleFundtransferService.inquiryFundTransferFee($scope.scheduleDetailList, function(resultObj){
			if(resultObj.responseStatus.responseCode === kkconst.success) {
				$scope.fees = resultObj.value.fee;
			} else {
				// popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
			}
		});
			
		$scope.changeFTSchedule = function(selectedFTRecord) {		
			if(selectedFTRecord.recurringTimes != 0 && selectedFTRecord.scheduleType > 0) {
				popupService.savedPopup = $ionicPopup.confirm({
					title : '<i class="icon ion-ios-gear fundTransferIcon-size"> </i> '+ popupService.convertTranslate('label.editSchedule'),
					cssClass:'blueColorGeneralPopup',
					cancelText: $filter('translate')('button.cancel'),
					okText: $filter('translate')('button.ok'),
					scope: $scope,			
				template : "<div class='row'>"+
							"<div class='col'><span class='button scheduleBlueBttns' translate='label.thisTime' id='thisTimeScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('thisTime') }\" ng-click=\"setActive('thisTime')\"></span></div>"+
							"<div class='col'><span class='button scheduleBlueBttns scheduleDeleteBtnUnSelected' translate='label.allSchedule' id='allScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('allSchedule') }\" ng-click=\"setActive('allSchedule')\"></span></div>"+
							"</div>"
					});			
				popupService.savedPopup.then(function(response) {
					if (response) {					
						if(!recurrance) {
							scheduleFundtransferService.recurringIsOneTime = true;
						}else{
							scheduleFundtransferService.recurringIsOneTime = false;
						}
						$scope.gotoFund();
					} else {
						$ionicListDelegate.closeOptionButtons();
					}
				});
			} else {
				scheduleFundtransferService.recurringIsOneTime = true;
				$scope.gotoFund();
			}
			$scope.active = 'thisTime';
			recurrance = false;
		};
		
		$scope.active = 'thisTime';
	    $scope.setActive = function(type) {
	        $scope.active = type;
	        if($scope.active === 'thisTime'){
	        	recurrance = false;
	        } else {
	        	recurrance = true;
	        }
	    };
	    $scope.isActive = function(type) {
	        return type != $scope.active;
	    };	
		
		$scope.backToScheduleFundTransferTransfer = function() {
			$state.go(kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE);
		};
		
		$scope.anyIDService = anyIDService; 
	});