angular.module('ctrl.requestBureauMenu', [])
.controller('RequestBureauMenuCtrl', function($scope, $ionicHistory, $ionicModal, $state, popupService, mainSession, myAccountService, kkconst, ribNCBService) {
	$ionicHistory.clearCache()
	$scope.Math = window.Math;
	$scope.lang = mainSession.lang;
	$scope.customerData = ribNCBService.getCache().customerData;
	$scope.ncbPackageList = ribNCBService.getCache().ncbPackageList;

	$scope.form = {
		packageItem: {
			packageId: '',
			packagePrice: 0
		}
	}
	$scope.termAndCond = { modal: {} };
	$scope.requestBereauScore = { modal: {} };
	
	createModal();

	$scope.setActiveChoice = function(index, packageId) {
		for (i = 0; i < $scope.ncbPackageList.length; i++) {
			$scope.ncbPackageList[i].isActive = false
		}
		$scope.ncbPackageList[index].isActive = true
		$scope.selectedNCBPackageId = packageId
		$scope.packageName = $scope.lang === "th" ? $scope.ncbPackageList[index].packageNameTh : $scope.ncbPackageList[index].packageNameEn
	}
	$scope.gotoNextPage = function() {
		$scope.requestBereauScore.isChecked = false
		$scope.termAndCond.isChecked = false
		if(!$scope.form.packageItem.packagePrice) popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-NCB-0001');
		else if(!$scope.account) popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-NCB-0002');
		else {
			ribNCBService.prepareNCBRequest(
				$scope.selectedNCBPackageId,
				$scope.account.myAccountNumber
			).then(function(result){
				$scope.transactionId = result.transactionId
				if(result.ncbFormRequest) viewRequestBereauScore();
				else viewTermAndConditions();
			});
		}
	}

	$scope.selectedAccount = function (account) {
		$scope.account = account;
		$scope.accListModal.hide();
	};
    $scope.openAccountList = function () {        
        myAccountService.inquiryMyAccountCASASummary(function (responseCode, ownAccountGroups) {
            if (responseCode === kkconst.success) {
                $scope.accountlists = sortingAccount(ownAccountGroups);
                $scope.accListModal.show();
            } else {
                popupService.showErrorPopupMessage('alert.title', responseCode);
            }
        });
	};
	
	$scope.termAndCond.checkedboxChecked = function () {
		$scope.termAndCond.isChecked = !$scope.termAndCond.isChecked;
	}
	
	$scope.requestBereauScore.checkedboxChecked = function () {
		$scope.requestBereauScore.isChecked = !$scope.requestBereauScore.isChecked;
	}
	
	$scope.gotoViewTermAndConditions = function () {
		if($scope.requestBereauScore.isChecked) viewTermAndConditions();
		else popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-NCB-0003');
	}
	
	$scope.gotoConfirmNCBRequest = function () {
		if($scope.termAndCond.isChecked) {
			$scope.termAndCond.modal.hide();
			ribNCBService.setCache({
				packagePrice: $scope.form.packageItem.packagePrice,
				customerData: ribNCBService.getCache().customerData,
				transactionId: $scope.transactionId,
				account: $scope.account,
				packageName: $scope.packageName
			});
			$state.go('app.confirmNCBRequest');
		} else popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-NCB-0004');
	}
	
	function viewTermAndConditions(){
		ribNCBService.NCBTermAndCondition().then(function(result){
			$scope.termAndCond.text = result.termAndCondHTML;
			$scope.requestBereauScore.modal.hide();
			$scope.termAndCond.modal.show();
		});
	}
	
	function viewRequestBereauScore(){
		ribNCBService.NCBRequestForm().then(function(result){
			$scope.requestBereauScore.text = result.ncbRequestFormHTML;
			$scope.termAndCond.modal.hide();
			$scope.requestBereauScore.modal.show();
		});
	}

	function createModal() {
		$ionicModal.fromTemplateUrl('templates/BillPaymentRTP/billPaymentRTP-NCB.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.accListModal = modal;
		});
		
		$ionicModal.fromTemplateUrl('templates/NCB/ncbTermAndCondModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function(modal) {
			$scope.termAndCond.modal = modal;
		});
		
		$ionicModal.fromTemplateUrl('templates/NCB/ncbRequestIndividualBureauScore.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function(modal) {
			$scope.requestBereauScore.modal = modal;
		});
	}

	function sortingAccount(request) {
		return request.sort(function (a, b) {
			var nameA = a.myAccountAliasName && a.myAccountAliasName.toLowerCase() || '';
			var nameB = b.myAccountAliasName && b.myAccountAliasName.toLowerCase() || '';
			//sort string ascending
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0; //default return value (no sorting)
		});
	}
})