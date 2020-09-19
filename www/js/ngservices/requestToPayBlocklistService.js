angular.module('service.requestToPayBlocklistService', [])
.factory('requestToPayBlocklistService', function($q,invokeService,mainSession,kkconst,popupService) {
    var _invokeOption = {adapter: kkconst.mainAdapter};
    return {
        inquiryBlocklist: function() {
            var deferred = $q.defer();
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_RTP_INQUIRY_BLOCKLIST';
            obj.procedure = 'inquiryRTPBlockListProcedure';
            obj.onSuccess = function(result) {
                var resultObj = result.responseJSON.result;
                if(resultObj.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(resultObj.value);
                } else {
                    deferred.reject(resultObj.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',resultObj.responseStatus.responseCode);
                }
            };
            invokeService.executeInvokePublicService(obj);

            return deferred.promise;
        },
        requestToUnblock: function(params) {
            var deferred = $q.defer();
            var obj = {};
            obj.params = {
                type: params.type,
                value: params.value,
                name: params.name
            };
            obj.actionCode = 'ACT_RTP_DELETE_BLOCKLIST';
            obj.procedure = 'deleteRTPBlockListProcedure';
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
        requestToBlock: function(params) {
            var deferred = $q.defer();
            var obj = {};
            obj.params = {
                type: params.type,
                value: params.value,
                name: params.name
            };
            obj.actionCode = 'ACT_RTP_CREATE_BLOCKLIST';
            obj.procedure = 'createRTPBlockListProcedure';
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
        }
    };

});