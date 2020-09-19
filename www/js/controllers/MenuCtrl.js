angular.module('ctrl.menu', []).controller('menuCtrl',
	function ($scope, mainSession, $translate, $ionicSideMenuDelegate, $ionicScrollDelegate, $state, fundTransferTOService, fundTransferFROMService, fundTransferResponseService, kkconst, notificationService, $rootScope,amMoment, mutualFundService,deviceService) {
		$scope.lastLogin = mainSession.loginDetailCAA.lastLogin;

		$scope.isBiometricAvialable = true;

		deviceService.isAvailable().then(function(result) {
			console.log("isAvailable: " + result.isAvailable);
			if(result.isAvailable) {
				$scope.isBiometricAvialable = true;
			} else {
				console.log("result : "+ result.error.isDeviceSupported);
				if(result.error.isDeviceSupported === false){
					$scope.isBiometricAvialable = false;
				}
			}
		});

		
		

		var changeLoginDataLang = function () {
			$scope.firstName = mainSession.loginDetailCAA['firstName' + $translate.use().toUpperCase()];
			$scope.lastName = mainSession.loginDetailCAA['lastName' + $translate.use().toUpperCase()];
			amMoment.changeLocale($translate.use().toLowerCase());
		};

		// notificationService.badgeMenuCountProcedure(function ( resultCode, resultObj ) {
		// 	if (resultCode === kkconst.success) {
		// 		notificationService.setBadgeMenuList(resultObj.value);
		// 	}
		// })

		// $scope.notiMyRTP = function () {
		// 	var count = notificationService.getBadgeMenuCountStr('RTP');
		// 	if(count){
		// 		$scope.isShowNotiMyRTP = true;
		// 	}else{
		// 		$scope.isShowNotiMyRTP = false;
		// 	}
		// 	return count;
		// }

		// $scope.notiMyReceive = function () {
		// 	var count = notificationService.getBadgeMenuCountStr('RTP_RECEIVE');
		// 	if(count){
		// 		$scope.isShowNotiMyReceive = true;
		// 	}else{
		// 		$scope.isShowNotiMyReceive = false;
		// 	}
		// 	return count;
		// }

		// $scope.notiMyRequest = function() {
		// 	var count = notificationService.getBadgeMenuCountStr('MY_RTP');
		// 	if(count){
		// 		$scope.isShowNotiMyRequest = true;
		// 	}else{
		// 		$scope.isShowNotiMyRequest = false;
		// 	}
		// 	return count;
		// }

 		// initial Login language
		changeLoginDataLang();
		// add changeLoginDataLang to root scope function
		$rootScope.changeLoginDataLang = changeLoginDataLang;

		$scope.toggleLeftMenu = function () {
			$ionicSideMenuDelegate.toggleLeft();
		};

		/* Fund Transfer - Start */
		$scope.fundtransfergroups = [];
		$scope.fundtransfergroups[0] = {
			menu: 'Fund Transfer',
			items: [{
				submenu: 'Own Accounts'
			}, {
				submenu: 'Other Accounts'
			}],
			shown: false
		};
		$scope.toggleGroupFundTransfer = function (fundtransfergroups) {
			fundtransfergroups.shown = !fundtransfergroups.shown;
			$ionicScrollDelegate.resize();
		};
		$scope.isGroupShownFundTransfer = function (fundtransfergroups) {
			return fundtransfergroups.shown;
		};
		$scope.navigateToFundTransferAccounts = function () {

			//clear cache
			fundTransferTOService.clear();
			fundTransferTOService.clear();
			fundTransferFROMService.clear();
			fundTransferResponseService.clear();
			$state.go('app.fundTransferOtherAccounts');
		};
		/* Fund Transfer - End */

		/* Bill Payment - Start */
		$scope.billpaymentgroups = [];
		$scope.billpaymentgroups[0] = {
			menu: 'Bill Payment',
			items: [{
				submenu: 'Bill Payment1'
			}, {
				submenu: 'Bill Payment2'
			}],
			shown: false
		};
		$scope.toggleGroupBillPayment = function (billpaymentgroups) {
			billpaymentgroups.shown = !billpaymentgroups.shown;
			$ionicScrollDelegate.resize();
		};
		$scope.isGroupShownBillPayment = function (billpaymentgroups) {
			return billpaymentgroups.shown;
		};
		/*Bill Payment - End */

		$scope.groups = [{ "name": "menu.paybill", "items": [{ "subName": "label.manageBiller", "link": "#/manageBiller" }, { "subName": "label.subBillPayment", "link": "#/billPayment" }] }];
	  /*
	   * if given group is the selected group, deselect it
	   * else, select the given group
	   */
		$scope.toggleGroup = function (group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function (group) {
			return $scope.shownGroup === group;
		};

		$scope.PromptPayBillPaymentgroups = [{ "name": "menu.billpaymentPromptpay", "items": [{ "subName": "label.manageBiller", "link": "#/manageBillerPromptPay" }, { "subName": "label.subBillPayment", "link": "#/billPaymentPromptPay" }] }];


		$scope.toggleGroupPromptPayBillPayment = function (PromptPayBillPaymentgroups) {
			if ($scope.isGroupPromptpayShown(PromptPayBillPaymentgroups)) {
				$scope.shownGroupBill = null;

			} else {
				$scope.shownGroupBill = PromptPayBillPaymentgroups;

			}
		};

		$scope.isGroupPromptpayShown = function (PromptPayBillPaymentgroups) {
			return $scope.shownGroupBill === PromptPayBillPaymentgroups;
		};

		//////////////////////////////////////////////
		$scope.groupTransactionHistory = [{ "name": "menu.transactionHistoryRTP", "items": [{ "subName": "label.transfer", "link": "#/historyFundtransferRTP" }, { "subName": "label.billPayment", "link": "#/historyBillpaymentRTP" }, { "subName": "menu.requestTopay", "link": "#/transactionHistoryRTP" }, { "subName": "label.mutualFund", "link": "#/mutualFundHistory" }, { "subName": "label.kkpNdidServices", "link": "#/transactionHistoryNDIDAuthen" }] }];


		$scope.toggleGroupTransactionHistory = function (groupTransactionHistory) {
			if ($scope.isGroupTransactionHisShown(groupTransactionHistory)) {
				$scope.shownGroupHis = null;

			} else {
				$scope.shownGroupHis = groupTransactionHistory;

			}
		};

		$scope.isGroupTransactionHisShown = function (groupTransactionHistory) {
			return $scope.shownGroupHis === groupTransactionHistory;
		};


		$scope.groupMyRequestToPay = [{ "name": "menu.myRequestToPay", "items": [{ "subName": "submenu.myRequest", "link": "#/requestToPayOutList" }, { "subName": "submenu.myReceive", "link": "#/requestToPayList" }] }];
		$scope.toggleGroupMyRequestToPay = function (myRequestToPay) {
			if ($scope.isGroupMyRequestToPayShown(myRequestToPay)) {
				$scope.shownGroupRequestToPay = null;

			} else {
				$scope.shownGroupRequestToPay = myRequestToPay;

			}
		};

		$scope.isGroupMyRequestToPayShown = function (myRequestToPay) {
			return $scope.shownGroupRequestToPay === myRequestToPay;
		};


		$scope.groupMyAccount = [{ "name": "label.myAccount", "items": [{ "subName": "label.myDeposit", "link": "#/myAccount" },{ "subName": "label.myKKPromptPay", "link": "#/myAccount" }, { "subName": "label.QRGeneratorMenu", "link": "#/QRGenerator" }] }];
		$scope.isFirstLoad = true;

		$scope.toggleGroupMyAccount = function (groupMyAccount) {
			if ($scope.isGroupMyAccountShown(groupMyAccount)) {
				$scope.shownGroupMyAccount = null;

			} else {
				$scope.shownGroupMyAccount = groupMyAccount;

			}
			$scope.isFirstLoad = false;
		};

		$scope.isGroupMyAccountShown = function (groupMyAccount) {
			return $scope.shownGroupMyAccount === groupMyAccount || $scope.isFirstLoad;
		};

///////////////////////////////////////////////////////////////////////////5///////////////////////////////
		// $scope.groupMutualFund = [{ "name": "label.mutualFund", "items": [{ "subName": "label.summaryMutualFund", "link": "#/mutualFund" },{ "subName": "menu.tradeMutualFund", "link": "#/myMutualFundModal" },{ "subName": "menu.newsAndUpdate", "link": "#" },{ "subName": "menu.mutualFundSearch", "link": "#/mutualFundSearch" }] }];

			$scope.groupMutualFund = [{ "name": "label.mutualFund", "items": [{ "subName": "menu.myPortfolio", "link": "#/mutualFund" },{ "subName": "menu.mutualFundSearch", "link": "#/mutualFundSearch" },{ "subName": "menu.riskProfile", "link": "#/suitabilityScore" },{ "subName": "menu.mutualFundNews", "link": "#/mutualFundNews" }] }];


		$scope.toggleGroupMutualFund = function (groupMutualFund) {
			if ($scope.isGroupMutualFundShown(groupMutualFund)) {
				$scope.shownGroupMutualFund = null;

			} else {
				$scope.shownGroupMutualFund = groupMutualFund;

			}
			
		};

		$scope.isGroupMutualFundShown = function (groupMutualFund) {
			return $scope.shownGroupMutualFund === groupMutualFund;
		};


	});
