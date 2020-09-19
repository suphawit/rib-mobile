angular.module('ctrl.scheduleBillpayment', [])
	.controller('ScheduleBillpaymentCtrl',function($scope, $state, $ionicPopup, popupService,scheduleBillpaymentService,$ionicListDelegate,$filter,kkconst, $ionicScrollDelegate) {//NOSONAR
		
	    var recurrance = false;
		
		$scope.bpBillerscheduleList = {};
		$scope.bpBillerscheduleInputData = {};
		$scope.bpBillerListSelects = {};
		$scope.isShowData = false;
		$scope.isNotShowData = false;
		
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
	        return type !== $scope.active;
	    };
	    
		$scope.getScheduleBillpaymentList = function() {
			scheduleBillpaymentService.inquiryScheduleBill(function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success) {
					if(resultObj.value !== null && resultObj.value.length > 0 && (resultObj.value !== 'undefined'||resultObj.value !== undefined)) {
						$scope.isShowData = true;
						$scope.isNotShowData = false;
						$scope.isNotConnectService = true;
						$scope.accountListcount = scheduleBillpaymentService.returnSetBillList(resultObj.value);
					} else {
						$scope.isShowData = false;
						$scope.isNotShowData = true;
						$scope.accountListcount = null;
						$scope.isNotConnectService = true;
					}
					$ionicScrollDelegate.scrollTop();
				} else {
					$scope.isShowData = false;
					$scope.isNotShowData = true;
					$scope.isNotConnectService = false;
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		};
	
		function deleteBillSchedule(){
			popupService.savedPopup = $ionicPopup.confirm({
					title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i>'+ popupService.convertTranslate('label.AcctDelConfirmschdule'),
					cssClass:'myPopupClass',
//					okText:'OK',
					cancelText: $filter('translate')('button.cancel'),
					okText: $filter('translate')('button.ok'),
					scope: $scope,		
					template : "<div class='row'>"+
						"<div class='col'><span class='button-Color button scheduleDeleteBtn' translate='label.thisTime' id='thisTimeScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('thisTime') }\" ng-click=\"setActive('thisTime')\"></span></div>"+
						"<div class='col'><span class='button-Color button scheduleDeleteBtn scheduleDeleteBtnUnSelected' translate='label.allSchedule' id='allScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('allSchedule') }\" ng-click=\"setActive('allSchedule')\"></span></div>"+
					"</div>"});
			popupService.savedPopup.then(function(response) {
				if (response) {
					if(!recurrance) {
						deleteBillpaymemtSchudule();
					} else {
						deleteAllBillpaymemtSchudule();
					}
				} else {
					$ionicListDelegate.closeOptionButtons();
				}
				$scope.active = 'thisTime';
				recurrance = false;
			});
		}
		$scope.deleteAccountForSchedule = function(record){
			$scope.bpBillerscheduleInputData.masterTransactionID = record.masterTransactionID;
			$scope.bpBillerscheduleInputData.transactionID = record.transactionID;
			
			if((record.scheduleType === "0" && record.recurringType === "ONE TIME") || record.recurringTimes == 0) {
				popupService.savedPopup = $ionicPopup.confirm({
					title : '<i class="icon ion-alert-circled"> </i> '+popupService.convertTranslate('label.AcctDelConfirmschdule'), 
					cssClass:'myPopupClass',
	//				okText:'Confirm',
					cancelText: $filter('translate')('button.cancel'),
					okText: $filter('translate')('button.ok'),
					template : popupService.convertTranslate('label.deleteOneTime')
				});
				
				popupService.savedPopup.then(function(response) {
					if (response) {
						scheduleBillpaymentService.deleteAllBillpaymemtSchudule($scope.bpBillerscheduleInputData,function(resultObj){
							if (resultObj.responseStatus.responseCode === kkconst.success) {
								$scope.bpBillerscheduleList = resultObj.value;
								$scope.getScheduleBillpaymentList();
								popupService.showErrorPopupMessage('label.success','label.schedule.cancel.success');
							} else {
								popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
							}
						});
					} else {					
						$ionicListDelegate.closeOptionButtons();
					}
				});
				
			}else{
				deleteBillSchedule();
	// 		 	popupService.savedPopup = $ionicPopup.confirm({
	// 					title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i>'+ popupService.convertTranslate('label.AcctDelConfirmschdule'),
	// 					cssClass:'myPopupClass',
	// //					okText:'OK',
	// 					cancelText: $filter('translate')('button.cancel'),
	// 					okText: $filter('translate')('button.ok'),
	// 					scope: $scope,		
	// 					template : "<div class='row'>"+
	// 						"<div class='col'><span class='button-Color button scheduleDeleteBtn' translate='label.thisTime' id='thisTimeScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('thisTime') }\" ng-click=\"setActive('thisTime')\"></span></div>"+
	// 						"<div class='col'><span class='button-Color button scheduleDeleteBtn scheduleDeleteBtnUnSelected' translate='label.allSchedule' id='allScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('allSchedule') }\" ng-click=\"setActive('allSchedule')\"></span></div>"+
	// 					"</div>"});
	// 			popupService.savedPopup.then(function(response) {
	// 					if (response) {
	// 						if(!recurrance) {
	// 							deleteBillpaymemtSchudule();
	// 						} else {
	// 							deleteAllBillpaymemtSchudule();
	// 						}
	// 					} else {
	// 						$ionicListDelegate.closeOptionButtons();
	// 					}
	// 					$scope.active = 'thisTime';
	// 					recurrance = false;
	// 				});


				}
			$scope.getScheduleBillpaymentList();
		};
		
		function deleteBillpaymemtSchudule() {
			scheduleBillpaymentService.deleteBillpaymemtSchudule($scope.bpBillerscheduleInputData,function(resultObj){
				if (resultObj.responseStatus.responseCode === kkconst.success) {
					$scope.bpBillerscheduleList = resultObj.value;
					$scope.getScheduleBillpaymentList();
					popupService.showErrorPopupMessage('label.success','label.schedule.cancel.success');
				} else {
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		}

		function deleteAllBillpaymemtSchudule() {
			scheduleBillpaymentService.deleteAllBillpaymemtSchudule($scope.bpBillerscheduleInputData,function(resultObj){
				if (resultObj.responseStatus.responseCode === kkconst.success) {
					$scope.bpBillerscheduleList = resultObj.value;
					$scope.getScheduleBillpaymentList();
					popupService.showErrorPopupMessage('label.success','label.schedule.cancel.success');
				} else {
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		}
		$scope.navigationToScheduleBillpaymentDetail = function(record) {
				$scope.bpBillerListSelects = record;
				scheduleBillpaymentService.scheduleBillDataDetail = record;
				$state.go('app.scheduleBillpaymentDetail');		
				
		};
		
	
		$scope.getScheduleBillpaymentList();
		
})
.controller('scheduleBillpaymentDetailCtrl', function($scope, invokeService, $state, $ionicPopup,popupService, scheduleBillpaymentService,$ionicListDelegate,$ionicHistory,$filter,kkconst,downloadAndStoreFile) {// NOSONAR
	
	var recurrance = false;
	$scope.bpBillerListSelects  = scheduleBillpaymentService.scheduleBillDataDetail;
	$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;

	viewInitial();

	function viewInitial() {
		getBillerInfoIcon($scope.bpBillerListSelects);
	}

	$scope.backToScheduleFundTransferTransfer = function() {
		$state.go(kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE);
	};	
	
	$scope.changeFTSchedule = function(selectedFTRecord){
		
		// billPayService.setEditSchduleBillpayment = true;
		// var schduleSelectBills = scheduleBillpaymentService.scheduleBillDataDetail;
		
		if(selectedFTRecord.recurringTimes != 0 && selectedFTRecord.scheduleType > 0) {
			popupService.savedPopup = $ionicPopup.confirm({
				title : '<i class="icon ion-ios-gear fundTransferIcon-size"> </i> '+ popupService.convertTranslate('label.editSchedule'),
				cssClass:'blueColorGeneralPopup',
//				okText:'OK',
				okText: $filter('translate')('button.ok'),
				cancelText: $filter('translate')('button.cancel'),
				scope: $scope,			
			template : "<div class='row'>"+
						"<div class='col'><span class='button scheduleBlueBttns' translate='label.thisTime' id='thisTimeScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('thisTime') }\" ng-click=\"setActive('thisTime')\"></span></div>"+
						"<div class='col'><span class='button scheduleBlueBttns scheduleDeleteBtnUnSelected' translate='label.allSchedule' id='allScheduleDeleteSelectBtn' ng-class=\"{'scheduleDeleteBtnUnSelected' : isActive('allSchedule') }\" ng-click=\"setActive('allSchedule')\"></span></div>"+
						"</div>"
				});			
			popupService.savedPopup.then(function(response) {
				if (response) {					
					if(!recurrance) {
						scheduleBillpaymentService.recurringIsOneTime = true;
					}else{
						scheduleBillpaymentService.recurringIsOneTime = false;
					}
					$ionicHistory.clearCache().then(function () {
					    // Do... Whatever it is you do (if needed)
						// @160622 Tang: edit page routing
						//$state.go('app.billPayment');//$state.go('app.editScheduleBillPayment');
						$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
					});					
				} else {
					$ionicListDelegate.closeOptionButtons();
				}
			});
		} else {
			scheduleBillpaymentService.recurringIsOneTime = true;
			$ionicHistory.clearCache().then(function () {
			    // Do... Whatever it is you do (if needed)
				// @160622 Tang: edit page routing
				//$state.go('app.billPayment');//$state.go('app.editScheduleBillPayment');
				$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
			});
		}
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
        return type !== $scope.active;
    };
	
	$scope.backToScheduleFundTransferTransfer = function() {
		$state.go(kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE);
	};

	function getBillerInfoIcon(billerInfo){
		var iconName = downloadAndStoreFile.getBillerIconName(billerInfo);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			billerInfo.logoCompany = data;
		});
	}
	
});
