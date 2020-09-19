angular.module('ctrl.rtpRequestInComingList',[])
.controller('RequestToPayInComingCtrl', function($scope,$state,kkconst,requestToPayInComingService, notificationService,popupService,$ionicPopup,$filter,mainSession,$ionicListDelegate,requestToPayBlocklistService) {
    $scope.requestToPayList = {
        data:[],
        firstLoad: ''
    };
    var getRequestToPayList = function(){
        requestToPayInComingService.inquiryRequestToPay().then(function(result){
            var countBadge = result.totalAllTransaction;
            notificationService.setBadgeMenuCount('RTP_RECEIVE',countBadge);

            var tmp = result.rtpInfoDetailList;
            if( tmp.length > 0 ){
                  $scope.requestToPayList.firstLoad = false;
            }else{
                  $scope.requestToPayList.firstLoad = true;
            }
            $scope.requestToPayList.data = requestToPayInComingService.createUIDataBinding(tmp);
        });
    };

    $scope.navigationToDetail = function(data){
        requestToPayInComingService.setRequestToPayDetail(data);
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE);
    };

    $scope.deleteRow = function(row){
    };

    getRequestToPayList();

    $scope.showDeleteRTPIncomingPopup = function(record){
        popupService.savedPopup = $ionicPopup.confirm({
            title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i> ' + popupService.convertTranslate('title.confirmDeleteRTPIncomingMsg'),
            cssClass:'myPopupClass',
            cancelText: $filter('translate')('button.cancel'),
            okText: $filter('translate')('button.ok'),
            template : popupService.convertTranslate('body.confirmDeleteRTPIncomingMsg')				
        });
        popupService.savedPopup.then(function(response) {
            if(response){
                deleteRTPIncoming(record)
            }
        });
        $scope.active = 'thisTime';
        recurrance = false;
    };

    function deleteRTPIncoming(record) {
        requestToPayInComingService.deleteRTPIncoming(record ,function(resultObj){
            if(resultObj.result.responseStatus.responseCode == kkconst.success) {
                popupService.showErrorPopupMessage('title.confirmDeleteRTPIncomingMsg','label.title.deleteMyAccountRTPReceiveSuccess');
                getRequestToPayList();
            } else {
                popupService.showErrorPopupMessage('alert.title',resultObj.result.responseStatus.errorMessage);
            }
        });
	}

    var requestToBlock = function(params){
        requestToPayBlocklistService.requestToBlock(params).then(function(result){
            $ionicListDelegate.closeOptionButtons();
            popupService.showErrorPopupMessage('label.success','block.successMsg');
        });
    };
    // $scope.requestToBlock = function(item){
    //     popupService.showConfirmPopupMessageCallback('label.confirm', window.translationsLabel[mainSession.lang]['button.block']+': '+item.requesterIdValue+' ['+item.requesterIdType+']',function(ok){
	// 		if(ok){
	// 			var obj = {
    //                 type: item.requesterIdType,
    //                 value: item.requesterIdValue,
    //                 name: item.requesterAccountName
    //             };
    //             requestToBlock(obj);
	// 		} else {
	// 			$ionicListDelegate.closeOptionButtons();
	// 		}
	// 	});
    // }
    $scope.requestToBlock = function(item ){
        popupService.savedPopup = $ionicPopup.confirm({
            title : '<i class="icon ion-alert-circled fundTransferIcon-size"> </i> ' + popupService.convertTranslate('label.confirmBlockRTPReceive'),
            cssClass:'myPopupClass',
            cancelText: $filter('translate')('button.cancel'),
            okText: $filter('translate')('button.ok'),
            template :  window.translationsLabel[mainSession.lang]['body.confirmBlockAccMsg']		
        });
        popupService.savedPopup.then(function(response) {
            if(response){
                var obj = {
                    type: item.requesterIdType,
                    value: item.requesterIdValue,
                    name: item.requesterAccountName
                };
                requestToBlock(obj);
            }else{
                $ionicListDelegate.closeOptionButtons();
            }
        });
    };

})
.controller('RequestToPayInComingDetailCtrl', function($scope,$state,kkconst,requestToPayInComingService, anyIDService, displayUIService, popupService, $sce, requestToPayBlocklistService, mainSession, $ionicListDelegate, billPaymentRTPService) {
    
    $scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
    $scope.requestToPayDetail = {
        data: {}
    };
     $scope.selectedAnyIDType  = {};
    $scope.checkIsAnyID = function(anyIDType){
		return anyIDService.isAnyID(anyIDType);
	};
	
	$scope.getAnyIDIcon = function(anyIDType){
		return anyIDService.getAnyIDinfo(anyIDType).icon;
	};
	
	$scope.getAnyIDIconColor = function(anyIDType){
		return anyIDService.getAnyIDinfo(anyIDType).iconColor;
	};
    
    var initData = function(){
        var tmp = requestToPayInComingService.getRequestToPayDetail();
        if(tmp){
            $scope.requestToPayDetail.data = tmp;
            var createdDateObj = displayUIService.convertDateTimeForUI($scope.requestToPayDetail.data.createdDate);
            var expriedDateObj = displayUIService.convertDateTimeForUI($scope.requestToPayDetail.data.expiryDate);
            $scope.requestToPayDetail.data.expriedDateObj = expriedDateObj;
            $scope.requestToPayDetail.data.createdDateObj = createdDateObj;
            $scope.selectedAnyIDType  = tmp.receiverIdType;
          
        }
      
    };
    $scope.gotoBillPaymentRTP = function(){
        var requestToPayDetail = requestToPayInComingService.getRequestToPayDetail()
        var dataRequestPayInfo = {
            promptPayBillerId: requestToPayDetail.requesterIdValue,
            // billReference1: requestToPayDetail.billReference1,
            // billReference2: requestToPayDetail.billReference2,
            ref1: requestToPayDetail.billReference1,
            ref2: requestToPayDetail.billReference2
        };

        billPaymentRTPService.inquiryPayInfoOnline(dataRequestPayInfo).then(function(response){
        // requestToPayInComingService.inquiryPayInfo(dataRequestPayInfo,
        //     function (response) {
                var respStatus = response.responseStatus;
                if (respStatus.responseCode === kkconst.success) {
                    var value = response.value;
                    // var refInfos = [
                    //     {
                    //         textEn: window.translationsLabel['en']['label.referenece1'],
                    //         textTh: window.translationsLabel['th']['label.referenece1'],
                    //         value: requestToPayDetail.billReference1
                    //     },
                    //     {
                    //         textEn: window.translationsLabel['en']['label.referenece2'],
                    //         textTh: window.translationsLabel['th']['label.referenece2'],
                    //         value: requestToPayDetail.billReference2
                    //     },
                    // ]
                    var refInfos = [];
                    for( var i = 0;i < value.refInfos.length; i++){
                        var refValue = '';
                        var refNo = '';
                        switch (i) {
                            case 0:
                                refValue = requestToPayDetail.billReference1;
                                refNo = 1;
                                break;
                            case 1:
                                refValue = requestToPayDetail.billReference2;
                                refNo = 2;
                                break;
                        }
                        var currentRef = value.refInfos[i];
                        var foRef = {
                            "no": refNo,
                            "value": refValue ,
                            "showRef": currentRef.showRef ,
                            "textEn":currentRef.textEn,
                            "textTh":currentRef.textTh
                        };
                        refInfos.push(foRef);
                    }
                    $scope.payinfo = {
                        promptPayBillerId : value.promptPayBillerId,
                        profileCode : value.profileCode,
                        billerId : value.promptPayBillerId,
                        companyEn : value.companyEn,
                        companyTh : value.companyTh,
                        subServiceEn : value.subServiceEn,
                        subServiceTh : value.subServiceTh,
                        aliasName : requestToPayDetail.requesterAccountName,
                        refInfos : refInfos,
                        rtpreference : requestToPayDetail.rtpreference,
                        amount:  requestToPayDetail.amount,
                        companyCode: value.companyCode || '',
                        serviceCode: value.serviceCode || ''
                    };
                    requestToPayInComingService.setRequestToPayInfo($scope.payinfo);
                    $scope.gotoBillRTP();
                } else {
                    popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
                }
            }
        )
    };

    $scope.isBillerRequest = function(requesterIdType){
        return requesterIdType === 'BILLERID';
    }

    $scope.goBackPage = function(){
        $state.go(kkconst.ROUNTING.REQUEST_TO_PAY_INCOMING_LIST.STATE);
    };

    $scope.openUrl = function(url){
        var trustUrl = $sce.trustAsResourceUrl(url);
		window.open(trustUrl, '_blank','shouldPauseOnSuspend=yes,location=no,hardwareback=no');
    };

    initData();
})
