angular.module('ctrl.qrgenerator',[])
.controller('QRGeneratorCtrl', function($scope,$ionicHistory,$ionicModal,QRScannerService,$ionicPopup,kkconst,popupService,generalService,rtprequestService,$state,$timeout,myAccountService) {
    $scope.showSelectBtn 				= true;
	$scope.showSelectFromAccountDetails = false;
    $scope.showNext 					= true;
    $scope.QRGenerateObj 				= { amount: '0.00'};
    $scope.placeholderAmount 			= '0.00';
    $scope.isDisableAmount              = true;

    $ionicModal.fromTemplateUrl(
        'templates/RTPRequest/mypromptpay-account-list-modal.html', {
            scope: $scope,
            animation: $scope.modalAnimate
        }
    ).then(function (modal) {
        $scope.accPromptpayListModal = modal;
    });

    $scope.getAnyIDIcon = rtprequestService.getAnyIDIcon;
    $scope.getAnyIDIconColor = rtprequestService.getAnyIDIconColor;
    $scope.getAnyIDLabelName = rtprequestService.getAnyIDLabelName;
    // End Initial value

    historyPageInit();

    function historyPageInit() {
        //check state from page
        var history = $ionicHistory.viewHistory();
        if (history.backView != null) {
            $scope.isShowBack = true;
            switch (history.backView.stateName) {
                case kkconst.ROUNTING.ANYID_DETAILS.STATE:
                    $scope.fromMyAccountPage = true;
                    fromMyAccountPage();
                    break;
            }
        }
    }

    function fromMyAccountPage() {
        $scope.showSelectFromAccountDetails = true;
        $scope.showSelectBtn = false;

        var selectedAnyIDAccount = myAccountService.anyIdAccountCache;
        $scope.QRGenerateObj = selectedAnyIDAccount;
    }

    $scope.openMyPromptpayAccount = function () {
        $scope.showNext = false;
        rtprequestService.inquiryRTPInquiryAnyidMy(function (resultCode, resultObj) {
            if (resultCode === kkconst.success) {
                if (resultObj.value.length) {
                    $scope.myAccountlist = sortingAccount(resultObj.value);
                    $scope.accPromptpayListModal.show();
                } else {
                    showPopupRegisterPromptpay(resultObj.responseStatus.errorMessage);
                    $scope.showNext = true;
                }
            } else {
                if(resultCode === 'RIB-E-ANY019'){
                    showPopupRegisterPromptpay(resultObj.responseStatus.errorMessage);
                }
                $scope.showNext = true;
            }
        });
    }

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

    $scope.selectedMyPromtpayAcc = function (account) {
        $scope.QRGenerateObj.anyIDValue = account.anyIDValue;
        $scope.QRGenerateObj.anyIDType = account.anyIDType;
        $scope.QRGenerateObj.accountName = account.accountName;
        
        $scope.showSelectFromAccountDetails = true;
        $scope.showSelectBtn = false;
        
        $scope.accPromptpayListModal.hide();
    }

    $scope.closeAccPromptpayListModal = function () {
        $scope.isShowNext = true;
        $scope.accPromptpayListModal.hide();
    }

    $scope.$on('modal.hidden', function () {
            $scope.showNext = true;
     });

    function sortingAccount(request) {
        request.sort(function (a, b) {
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
        return request;
    }

    //Start set virtual Keyboard
    $scope.virtualKeyboardAmount = {
		option: {
			disableDotButton: false,
			isKeyboardActive: false,
			maxlength: 12,
			IsEditModel: true
		},
		onkeyup: function(value){
			$scope.QRGenerateObj.amount = value;
		},
		onblur: function(){
			$scope.onBlurFormatCurrency();
		},
		onfocus: function(){
			$scope.onFocusClearAmount();
		}
	};

    $scope.onFocusClearAmount= function() {
		$scope.QRGenerateObj.amount = generalService.onFocusClearAmount($scope.QRGenerateObj.amount);
		$scope.placeholderAmount = '';
    };

    $scope.onBlurFormatCurrency = function(){
    	$scope.QRGenerateObj.amount =	 generalService.onBlurFormatCurrency($scope.QRGenerateObj.amount);
    };

    //End set Virtual Keyboard

    $scope.showCompletePage = function(){

		if(confirmValidate()){
			return;
		}

        var QRgeneratedata = {
            amount: $scope.QRGenerateObj.amount,
            anyIDValue: $scope.QRGenerateObj.anyIDValue,
            anyIDType: $scope.QRGenerateObj.anyIDType,
            accountName: $scope.QRGenerateObj.accountName

        }
        QRgeneratedata.amount = QRgeneratedata.amount == '0.00' ? null : parseFloat(generalService.parseNumber(QRgeneratedata.amount));

        QRScannerService.generateQRCodeData(QRgeneratedata,function (resultCode, resultObj) {
               if (resultCode === kkconst.success) {
                    QRgeneratedata.value = resultObj.value;
                    QRScannerService.setQRGeneratorObj(QRgeneratedata);
                    $state.go(kkconst.ROUNTING.QR_CODE_GENERATOR_COMPLETE.STATE);
               } else {
                   	popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, resultCode);
               }
       });
	};

    function confirmValidate(){
		if(!$scope.QRGenerateObj.anyIDValue ||  $scope.QRGenerateObj.anyIDValue == ''){
			popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-TRN001');
			return true;
		} 
        
        if( !$scope.isDisableAmount && ($scope.QRGenerateObj.amount === '' || parseFloat($scope.QRGenerateObj.amount) === 0 )){
    		popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,'RIB-E-FUN009');
			return true;
		} else{
			$scope.onBlurFormatCurrency();
		}
	}

    $scope.toggleDisableAmount = function (isDisable){
        $scope.isDisableAmount = isDisable;
        switch($scope.isDisableAmount){
            case true:
               $scope.virtualKeyboardAmount.option.isKeyboardActive = false;
               $scope.QRGenerateObj.amount = '0.00';
               $scope.placeholderAmount = '0.00';
            break;
            case false:
                $scope.virtualKeyboardAmount.option.isKeyboardActive = true;
                $timeout(function() {
                    var el = document.getElementById('myAmount');
                    angular.element(el).triggerHandler('touchstart');
                }, 0);
            break;
        }
    }
    
})

