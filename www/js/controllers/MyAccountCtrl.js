angular.module('ctrl.myAccountCtrl', ['ngIdle'])
.controller('MyAccountCtrl', 
	function($scope, $state, $translate,$ionicListDelegate,$ionicScrollDelegate, myAccountService, 
		popupService, mainSession, Idle, $rootScope, fundtransferService, kkconst,$ionicLoading,
		manageAnyIDService,anyIDService, notificationService, notificationSetDetailService,$ionicHistory, mutualFundService,deviceService,webStorage) {// NOSONAR

		var lang = mainSession.lang.toLowerCase();
		
		PageInit();

		$scope.title = '';
		$scope.describe ='';
		if (mainSession.deviceOS === 'iOS') {
			$scope.title = "title.useTouchOrFace";
			$scope.describe ="describe.useTouchOrFace";
		} else {
			$scope.title = "title.useFingerprint";
			$scope.describe ="describe.useFingerprint";
		}

		function PageInit() {
            //check state from page
			$scope.isShowBack = true;
			switch ($ionicHistory.viewHistory().currentView.stateName) {
				case kkconst.ROUNTING.MY_ACCOUNT.STATE:
					$scope.isFromMyAccount =  true;
					initANYIDType();
					initMyAccountPage();
					initSyncUnitHolder();
					break;
				case kkconst.ROUNTING.MY_ANYID_ACCOUNT.STATE:
					$scope.isFromMyANYIDAccount = true;
					inquiryAnyIdAccountGroup();
					break;
			}

			deviceService.allowBiometricAuthen();
        }

		var RIB_E_REG012 = "RIB-E-REG012";//Check user status is 0 and only one user
		function initMyAccountPage(){
			$ionicLoading.show({ template: kkconst.SPINNER, noBackdrop: true });
			myAccountService.listMyAccount(lang, function(resultCode, ownAccountGroups){
				if(kkconst.success === resultCode) {
					if(ownAccountGroups.length == 0){
						$scope.noMyAccount = true;
					}

					$scope.ownAccountGroups = ownAccountGroups;
					
					//Load Banks list
					fundtransferService.inquiryBankInfo(function(responseCode,resultObj){
						if(responseCode === kkconst.success){
							
							fundtransferService.bankList = resultObj;
							
						}else{
							popupService.showErrorPopupMessage('alert.title',responseCode);
						}
					});
					$scope.checkNoti();
					
				} else {
					if(resultCode !== RIB_E_REG012){
						popupService.showErrorPopupMessage('lable.error', resultCode);
					}
				}
			});
		//	
		}

		function initANYIDType() {
			//Load AnyIdType list
			manageAnyIDService.inquiryAnyIDType(function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success){
					fundtransferService.anyIdTypeList = resultObj.value;
					anyIDService.setAnyIDList(resultObj.value);
				}else{
					popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
				}
			});
		}

		function initSyncUnitHolder() {
			var isSyncUnitHolder = mutualFundService.getIsSyncUnitholderForFundConnext();
			if( !isSyncUnitHolder ){
				mutualFundService.setIsSyncUnitholderForFundConnext(true);
				mutualFundService.syncUnitHolderForFundConnext();
			}
		}
		
		$scope.isGroupShownSavingAccount = function(savingaccountsgroups) {
			if (typeof(savingaccountsgroups) !== 'undefined') {
				return savingaccountsgroups.shown;
			}
		};
		
		$scope.toggleGroupSavingAccount = function(savingaccountsgroups) {
			savingaccountsgroups.shown = !savingaccountsgroups.shown;
			$ionicScrollDelegate.resize();
		};
		
		$scope.navigateToAddMyAccounts = function() {
			$state.go('app.addMyAccounts');
		};
		
		$scope.navigateToMyAccountsDetail = function(accountData) {
			myAccountService.accountDetail = accountData;
			if(accountData.accountType === 'TD') {
				$state.go('app.myAccountsTdDetails');
			} else {
				$state.go('app.myAccountsCasaDetails');
			}
		};
		
		
		//ng-idle start
		$scope.initIdleStateChecker = function(){
			var isInsidePages = $.inArray( $state.current.name , ['app.contactUs','app.faq','app.promotions','app.locateUs'] );
			 if( isInsidePages < 0 ){
				 Idle.watch();			
			  }
		};

		function listMyAcct(plang){
			myAccountService.listMyAccount(plang, function(resultCode, ownAccountGroups){
				if(kkconst.success === resultCode) {
					$scope.ownAccountGroups = ownAccountGroups;
				} else {
					popupService.showErrorPopupMessage('lable.error', resultCode);
				}
			});
		}
		
		$scope.deleteAccount = function(accountData) {
			myAccountService.accountDetail = accountData;
			var myAccountID = myAccountService.accountDetail.myAccountID;
			
			var template = window.translationsLabel[lang]["label.deleteConfirmation"];

			popupService.showConfirmPopupMessageCallback('label.RemoveAccount',template,function(ok){
				if(ok){
					$ionicListDelegate.closeOptionButtons();
					myAccountService.deleteMyAccount(myAccountID, function(resultCodeDeleteMyAccount) {
						if(kkconst.success === resultCodeDeleteMyAccount) {
							popupService.showErrorPopupMessage('label.success', 'label.deleteAccoutSuccess');
							listMyAcct(lang);
							
						} else {
							$ionicListDelegate.closeOptionButtons();
							if(resultCodeDeleteMyAccount !== RIB_E_REG012){
								popupService.showErrorPopupMessage('lable.error', resultCodeDeleteMyAccount);
							}
						}
					});		
				}
				else{$ionicListDelegate.closeOptionButtons();}
			});		
			
		};


		$scope.anyIdAccountGroup = [];
		function inquiryAnyIdAccountGroup() {
			myAccountService.inquiryMyAnyIdList().then(function(resp){
				$scope.anyIdAccountGroup = resp;
				addAnyIdNameInfo();
			}, function(error){
				if(error.responseCode === 'RIB-E-ANY019'){
					$scope.noMyAnyIDAccount = true;
					showPopupRegisterPromptpay(error.errorMessage);
				}else{
					popupService.showErrorPopupMessage('lable.error', error.errorMessage);
				}
			});
		};

		function showPopupRegisterPromptpay(errorMessage) {
			popupService.showRegisterPopupMessageCallback(
				'alert.title',
				errorMessage,
				function (ok) {
					if (ok) {
						$ionicHistory.clearCache().then(function () {
							$state.go(kkconst.ROUNTING.ANYID.STATE);
						});
					}
				});
		}

		var addAnyIdNameInfo = function(){
			var tmp = $scope.anyIdAccountGroup.length > 0 ? $scope.anyIdAccountGroup[0] : {items: []};
			for(var i=0; i<tmp.items.length; i++){
				var anyIdInfo = anyIDService.getAnyIDinfo(tmp.items[i].anyIDType);
				tmp.items[i].anyIDName = anyIdInfo.LabelName;
				tmp.items[i].promptPayName  = (mainSession.lang === kkconst.LANGUAGE_en)? tmp.items[i].promptpayLabelEn : tmp.items[i].promptpayLabelTh;
			}
		};
		$scope.selectAnyIdDetail = function(account){
			myAccountService.anyIdAccountCache = account;
			$state.go('app.AnyIdDetails');
		};


		$scope.checkNoti = function(){

			var isBgData = notificationService.chkBackgroundData();
			if(isBgData != false){
				notificationSetDetailService.setBgDataDetail(isBgData).then(function (resp) {
					if(resp !== "app.notification"){
						notificationService.clearBackgroundData();
						$state.go(resp);
					}else if(resp === kkconst.ROUNTING.FUNDTRANSFER.STATE){
						$scope.gotoFund();
					}else if(resp === kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE){
						$scope.gotoBillRTP();
					}else{
						$state.go(resp);
					}
					
					
				}, function (error) {
					popupService.showErrorPopupMessage('lable.error', error.errorMessage);
				});

			//	
			//	$state.go(isBgData);
			}
		};
})

.controller('CasaDetailCtrl', 
	function($scope, $state, myAccountService, mainSession,$ionicHistory,kkconst) {
		$scope.casaAccountDetail = myAccountService.accountDetail;
		$scope.accountType = window.translationsLabel[mainSession.lang][$scope.casaAccountDetail.accountType];

		$scope.navigateToBillPayment = function() {
			 $ionicHistory.clearCache().then(function () {
				  myAccountService.fromPage='casaAccountDetail';
				  $state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
				  //$state.go(kkconst.ROUNTING.BILL_PAYMENT.STATE);
			  });
		};
		
		$scope.navigateToEditMyAccounts = function(accountData) {
			$state.go('app.editMyAccounts');
		};
		
		$scope.navigateToMyAccounts = function() {
			$state.go('app.myAccount');
		};

		$scope.navigateToMyAnyIDAccounts = function() {
			$state.go('app.myAnyIDAccount');
		};	
	}
)
.controller('TdDetailCtrl', 
	function($scope, $state, myAccountService, mainSession) {
		$scope.tdAccountDetail = myAccountService.accountDetail; 
		$scope.accountType = window.translationsLabel[mainSession.lang][$scope.tdAccountDetail.accountType];
		
		$scope.navigateToEditMyAccounts = function() {
			$state.go('app.editMyAccounts');
		};
		
		$scope.navigateToMyAccounts = function() {
			$state.go('app.myAccount');
		};	
		
		$scope.navigateToChangeTerm = function() {
			$state.go('app.myAccountsChangeTerm');
		};
	}
)
.controller('CasaStatementCtrl', 
	function($scope, $state, $translate, myAccountService, popupService, mainSession, displayUIService, kkconst) {// NOSONAR
		$scope.casaAccountDetail = myAccountService.accountDetail; 
		
		var myAccountID = myAccountService.accountDetail.myAccountID;
		var selectedCriteriaItem = '';
		var currentPageNo = 0;
		var pageSize = 20;
		var lang = mainSession.lang.toLowerCase();
		var transactions_store = [];
		
		displayUIService.initLastSixMonthly(function(resultObj){
			$scope.criteriaMonthlyList = resultObj;
			$scope.selectedItem = resultObj[0];
            $scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.isEndPage = true;
			selectedCriteriaItem = $scope.selectedItem.value;
            currentPageNo = 1;
			myAccountService.inquiryCasaStatement(myAccountID, selectedCriteriaItem, currentPageNo, pageSize, function(resultCode, casaStatements) {
				if(kkconst.success === resultCode) {
					transactions_store = casaStatements;
					$scope.casaTransactions = angular.copy(transactions_store);
					myAccountService.formatDataStatment($scope.casaTransactions, lang, function(formatedData) {
						$scope.casaStatementDetail = formatedData[0];
					});
				} else {
					popupService.showErrorPopupMessage('lable.error', resultCode);
				}
                $scope.isEndPage = false;
			});	
		});
		
		$scope.navigateToMyAccountsDetail = function() {
			if(myAccountService.accountDetail.accountType === 'TD') {
				$state.go('app.myAccountsTdDetails');
			} else {
				$state.go('app.myAccountsCasaDetails');
			}
		};
		
		$scope.inquiryMyAccount = function( selectedCriteria ) {
			
			transactions_store = [];
			currentPageNo = 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.isEndPage = true;
			if (selectedCriteriaItem !== selectedCriteria) {
				myAccountService.inquiryCasaStatement(myAccountID, selectedCriteria, currentPageNo, pageSize, function(resultCode, casaStatements) {
					if(kkconst.success === resultCode) {
						console.log('casaStatements', casaStatements)
						transactions_store = casaStatements;
						$scope.casaTransactions = angular.copy(transactions_store);
						myAccountService.formatDataStatment($scope.casaTransactions, lang, function(formatedData) {
							$scope.casaStatementDetail = formatedData[0];
						});
					} else {
						popupService.showErrorPopupMessage('lable.error', resultCode);
					}
					$scope.isEndPage = false;
				});	
				selectedCriteriaItem = selectedCriteria;
			}
		};
		
		$scope.loadMore = function() {
			console.log('$scope.isEndPage', $scope.isEndPage)
			if (!$scope.isEndPage) {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.isEndPage=true;
				currentPageNo = currentPageNo + 1;
				console.log('currentPageNo',currentPageNo)
				myAccountService.inquiryCasaStatement(myAccountID, selectedCriteriaItem, currentPageNo, pageSize, function(resultCode, casaStatements) {					
					if(kkconst.success === resultCode) {
						
						transactions_store = transactions_store.concat(casaStatements);
						$scope.casaTransactions = angular.copy(transactions_store);
						
						myAccountService.formatDataStatment($scope.casaTransactions, lang, function(formatedData) {
							$scope.casaStatementDetail = formatedData[0];
						});
						$scope.isEndPage=false;
					} else if ('end' === resultCode) {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.isEndPage=true;
					} else {
						popupService.showErrorPopupMessage('lable.error', resultCode);
						$scope.isEndPage=false;
					}
				});
			}
		};
	}
)
.controller('TdStatementCtrl', 
	function($scope, $state, $translate, myAccountService, mainSession, kkconst, popupService,myAccountTermDepositService) {
		var myAccountID = myAccountService.accountDetail.myAccountID;
		var lang = mainSession.lang.toLowerCase();
		$scope.hasTdStatementDetail = false;

		myAccountService.inquiryTdStatement(myAccountID, lang, function(resultCode, tdStatements) {
			
			if(kkconst.success === resultCode) {
				prepareTdStatement(tdStatements);
			} else {
				popupService.showErrorPopupMessage('lable.error', resultCode);
			}
		});

		function prepareTdStatement(tdStatements) {

			for (var index = 0; index < tdStatements.length; index++) {


				tdStatements[index].term_description = '';

				if(tdStatements[index].termMonth > 0){
					tdStatements[index].term_description = myAccountTermDepositService.dayMonthDesc('M',tdStatements[index].termMonth);
				}
				
				 if(tdStatements[index].termDay > 0){
					tdStatements[index].term_description = tdStatements[index].term_description + " " + myAccountTermDepositService.dayMonthDesc('D',tdStatements[index].termDay);
				}
				
			}
			$scope.tdStatementDetail = tdStatements;
			if (tdStatements.length > 0) {
				$scope.hasTdStatementDetail = true;
			}
		}


})
.controller('AnyIdDetailsCtrl', function($scope, $state, myAccountService, mainSession,kkconst) {
	$scope.anyIdAccount = myAccountService.anyIdAccountCache;
	
	$scope.navigateToEditAccounts = function() {
		//$state.go('app.editMyAccounts');
	};
	
	$scope.navigateToMyAccounts = function() {
		$state.go('app.myAccount');
	};
});

/*.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
	IdleProvider.idle(60); // in seconds
	IdleProvider.timeout(1*60); // in seconds count after idle
	KeepaliveProvider.interval(10); // in6seconds
 
});*/
