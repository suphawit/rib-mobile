angular.module('service.requestToPayOutGoingService', [])
.factory('requestToPayOutGoingService', function($q,invokeService,mainSession,kkconst,popupService,displayUIService,generalService) {
	var _requestToPayDetail;
    return {
        getRequestToPayDetail: function(){
            return generalService.cloneObject(_requestToPayDetail);
        },
        setRequestToPayDetail: function(data){
            _requestToPayDetail = generalService.cloneObject(data);
        },
        inquiryRequestToPay: function(callback) {
            var deferred = $q.defer();
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_RTP_INQUIRY_OUTGOING';
            obj.procedure = 'inquiryRTPOutgoingProcedure';
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
                    receiverIdValue: value['receiverIdValue']
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
        }
    };

});