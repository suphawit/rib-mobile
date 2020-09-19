angular.module('service.notificationSetDetail', [])
    .service('notificationSetDetailService', function (kkconst, $q,BankCodesImgService,scheduleFundtransferService,scheduleBillpaymentService, notificationService,requestToPayInComingService) {
        'use strict';

        this.setTransferScheduleDetail = function(transferScheduleDetail){
       //   var transferScheduleDetail	= transferScheduleDetail;
            var imageURL 				= BankCodesImgService.getBankCodeImg(transferScheduleDetail.bankCode,'image');
            var imageColor 				= BankCodesImgService.getBankCodeImg(transferScheduleDetail.bankCode,'color');

            var tmpTransferScheduleDetail = [];
                tmpTransferScheduleDetail.push(transferScheduleDetail);
        
                scheduleFundtransferService.scheduleDataDetail = scheduleFundtransferService.returnSetAccountList(tmpTransferScheduleDetail)[0].items[0];
                scheduleFundtransferService.bankImageURL 		= imageURL;
                scheduleFundtransferService.bankImageColor 		= imageColor;
        };

        this.setPaymentScheduleDetail = function(paymentScheduleDetail){
            var tmpPaymentScheduleDetail = [];
            tmpPaymentScheduleDetail.push(paymentScheduleDetail);
            scheduleBillpaymentService.scheduleBillDataDetail = scheduleBillpaymentService.returnSetBillList(tmpPaymentScheduleDetail)[0].items[0];
        };

        // this.setRTPIncomingInfoDetail = function(notiItem){
		// 	notificationService.getRTPIncomingNotiDetail(notiItem).then(function (resp) {
		// 		var respStatus = resp.responseStatus;
		// 		if (respStatus.responseCode === kkconst.success) {
		// 			verifyRTPIncomingObj(resp);
		// 		} else {
		// 			popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
		// 		}

		// 	}, function (error) {
		// 		popupService.showErrorPopupMessage('lable.error', error.errorMessage);
		// 	});
		// };

        // var verifyRTPIncomingObj = function (RTPIncomingData) {
		// 	// var RTPIncomingData = resp.value.rtpInfoDetailList[0];
        //     // requestToPayInComingService.setRequestToPayDetail(RTPIncomingData);
        //    // alert(JSON.stringify(RTPIncomingData));
            
		// 	switch (RTPIncomingData.requesterIdType) {
		// 		case "BILLERID":
		// 			prepareBillPaymentObj(RTPIncomingData).then(function(redirectState){
        //                 redirectState = redirectState;
        //             });
		// 			break;
        //         default: 
                
        //             $scope.gotoFund();
        //             redirectState = kkconst.ROUNTING.FUNDTRANSFER.STATE;
		// 			break;
        //     }
            
		// }

    var prepareBillPaymentObj = function(data,callback){     
        var deferred = $q.defer();
		var requestToPayDetail = data;
        var dataRequestPayInfo = {
            promptPayBillerId: requestToPayDetail.requesterIdValue,
            // billReference1: requestToPayDetail.billReference1,
            // billReference2: requestToPayDetail.billReference2,
            ref1: requestToPayDetail.billReference1,
            ref2: requestToPayDetail.billReference2
        } 
       
        requestToPayInComingService.inquiryPayInfo(dataRequestPayInfo,
            function (response) {
                var respStatus = response.result.responseStatus;  
                if (respStatus.responseCode === kkconst.success) {
                   
                    var value = response.result.value;
                    var refInfos = [
                        {
                            textEn: window.translationsLabel['en']['label.referenece1'],
                            textTh: window.translationsLabel['th']['label.referenece1'],
                            value: requestToPayDetail.billReference1
                        },
                        {
                            textEn: window.translationsLabel['en']['label.referenece2'],
                            textTh: window.translationsLabel['th']['label.referenece2'],
                            value: requestToPayDetail.billReference2
                        },
                    ]
                   var payinfo = {
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
                    requestToPayInComingService.setRequestToPayInfo(payinfo);
                    deferred.resolve(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
                } else {
                    popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
                }
            }
        )

        return deferred.promise;
    };

        this.setBgDataDetail = function(notiItem,callback){
            var deferred = $q.defer();
            var notificationSetDetailService = this;
			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {

				//deviceUUID found in database
                var respStatus = resp.responseStatus;
                var redirectState = "";
				if (respStatus.responseCode === kkconst.success) {

                    switch (notificationService._backgroundData[0].actionType) {
                        case 'notification_info' : 
                            redirectState = kkconst.ROUNTING.NOTIFICATION.STATE;
                            deferred.resolve(redirectState);
                        break;
                        case 'transfer_result' :
                            redirectState = kkconst.ROUNTING.NOTIFICATION.STATE;
                            deferred.resolve(redirectState);
                        break;
                        case 'payment_result' :
                            redirectState = kkconst.ROUNTING.NOTIFICATION.STATE;
                            deferred.resolve(redirectState);
                        break;
                        case 'transfer_schedule' :

                            notificationSetDetailService.setTransferScheduleDetail(resp.value.detail);
                            redirectState = kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE;
                            deferred.resolve(redirectState);
                        break;	
                        case 'payment_schedule':
         
                            notificationSetDetailService.setPaymentScheduleDetail(resp.value.detail);
               
                            redirectState = kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.STATE;
                            deferred.resolve(redirectState);		
                        break;
                        case 'rtp_incoming' :
     
                            notificationService.getRTPIncomingNotiDetail(notiItem).then(function (resp) {
                                var respStatus = resp.responseStatus;                          
                                if (respStatus.responseCode === kkconst.success) {
                                    var RTPIncomingData = resp.value.rtpInfoDetailList[0];

                                    if(RTPIncomingData.status === 'UNPAID'){
                                        if(RTPIncomingData.requesterIdType === 'BILLERID'){
                                            prepareBillPaymentObj(RTPIncomingData).then(function(redirectStateCallBack){
                                                redirectState = redirectStateCallBack;
                                                deferred.resolve(redirectState);
                                            });
                                        }else{
                                            requestToPayInComingService.setRequestToPayDetail(RTPIncomingData);
                                            redirectState = kkconst.ROUNTING.FUNDTRANSFER.STATE;
                                            deferred.resolve(redirectState);
                                        }
                                    }else{
                                        redirectState = kkconst.ROUNTING.NOTIFICATION.STATE;
                                    }

                                } else {
                                    popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
                                }
                
                            }, function (error) {
                                popupService.showErrorPopupMessage('lable.error', error.errorMessage);
                            });


                        break;	
                        case 'notification_detail_by_user' : 
                            redirectState = kkconst.ROUNTING.NOTIFICATION.STATE;
                            deferred.resolve(redirectState);
                        break;
                        case 'ndid_authen_request' : 
                            redirectState = kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE;
                            deferred.resolve(redirectState);
                        break;
                        case 'ndid_ial_insufficien':
					        redirectState = kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE;
                            deferred.resolve(redirectState);
					    break;
				        case 'ndid_not_register':
					        redirectState = kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE;
                            deferred.resolve(redirectState);
					    break;
                        default:
                        redirectState = "false";
                    }
                    return deferred.promise;

				} else {
                    deferred.reject("false");
                    return deferred.promise;
					//popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
			//	popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
	
            return deferred.promise;
        };



        var notificationInfoDetail = function(notiItem){	};



    }); //End ServicePin