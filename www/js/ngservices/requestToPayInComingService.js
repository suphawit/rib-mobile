angular.module('service.requestToPayInComingService', [])
.factory('requestToPayInComingService', function($q,invokeService,mainSession,kkconst,popupService,displayUIService,generalService) {
    var _requestToPayDetail;
    var _requestToPayInfo;
    return {
        getRequestToPayDetail: function(){
            return generalService.cloneObject(_requestToPayDetail);
        },
        setRequestToPayDetail: function(data){
            _requestToPayDetail = generalService.cloneObject(data);
        },
        getRequestToPayInfo: function(){
            return generalService.cloneObject(_requestToPayInfo);
        },
        setRequestToPayInfo: function(data){
            _requestToPayInfo = data;
        },
        inquiryRequestToPay: function(callback) {
            var deferred = $q.defer();
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_RTP_INQUIRY_INCOMING';
            obj.procedure = 'inquiryRTPIncomingProcedure';
            obj.onSuccess = function(result) {
                var resultObj = result.responseJSON.result;
                if(resultObj.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(resultObj.value);
                } else {
                    popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
                }
            };
            invokeService.executeInvokePublicService(obj);

            return deferred.promise;
        },
        createUIDataBinding: function(data){
            var returnData = [];
            var tmpDates = [];
            angular.forEach(data, function(value, key) {
                var transDateTime = value['createdDate'];
                var arrTransDateTime = transDateTime.split(' ');
                var item = $.inArray(arrTransDateTime[0], tmpDates);
                var dataObj = {
                    requesterFrom: value['requesterIdType'] === 'BILLERID' ? value['requesterAccountName']: value['requesterAccountName'] + ' (' + value['requesterIdValue'] + ')',
                    requesterAccountName: value['requesterAccountName'],
                    requesterIdTypeLabel: value['requesterIdTypeLabel'],
                    requesterIdType: value['requesterIdType'],
                    requesterIdValue: value['requesterIdValue'],
                    amount: value['amount'],
                    status: value['status'],
                    statusDesc: value['statusDesc'],
                    expiryDate: value['expiryDate'],
                    createdDate: value['createdDate'],
                    billReference1: value['billReference1'],
                    billReference2: value['billReference2'],
                    billReference3: value['billReference3'],
                    additionalNote: value['additionalNote'],
                    rtpreference: value['rtpreference'],
                    currencyCode: value['currencyCode'],
                    receiverAccountDisplayName: value['receiverAccountDisplayName'],
                    receiverAccountName: value['receiverAccountName'],
                    receiverIdType: value['receiverIdType'],
                    receiverIdTypeLabel: value['receiverIdTypeLabel'],
                    receiverIdValue: value['receiverIdValue'],
                    billPresentmentURL: value['billPresentmentURL']
                };
                if (item < 0) {
                    tmpDates.push(arrTransDateTime[0]);
                    returnData.push({
                        d: displayUIService.convertDateNoTimeForUI(transDateTime),
                        items: [dataObj]
                    });
                } else {
                    if (returnData[item]) {
                        returnData[item].items.push(dataObj);
                    }
                }
            });
            
            return returnData;
        },

        inquiryPayInfo : function (biller, callback) {
			var request = {
				params: {
					promptPayBillerId: biller.promptPayBillerId,
                    serviceCode: biller.serviceCode,
                    companyCode: biller.companyCode,
					ref1: biller.billReference1,
					ref2: biller.billReference2,
                    ref3: biller.billReference3,
				},
				actionCode: 'ACT_BPS_INQUIRY_PAY_INFO_ONLINE',
				procedure: 'inquiryPayInfoOnlineProcedure'
			};

			request.onSuccess = function (result) {
				callback(result.responseJSON);
			};

			request.onFailure = function (result) {
				callback(result.responseJSON);
			};

			invokeService.executeInvokePublicService(request);

		},

        deleteRTPIncoming : function (record, callback) {
                var request = {
                    params: {
                        fromAnyIdType: record.requesterIdType,
                        fromAnyIdValue: record.requesterIdValue,
                        rtpReference: record.rtpreference
                    },
                    actionCode: 'ACT_RTP_CANCEL',
                    procedure: 'cancelRtpProcedure'
                };

                request.onSuccess = function (result) {
                    callback(result.responseJSON);
                };

                request.onFailure = function (result) {
                    callback(result.responseJSON);
                };

                invokeService.executeInvokePublicService(request);

        }
    };
});