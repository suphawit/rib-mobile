angular.module('service.ribNCBService', [])
    .factory('ribNCBService', function(invokeService, $ionicHistory, $q, kkconst, popupService, $state) {
    var _cache = null;
    var _invokeAdapter = { adapter: 'RibNCBAdapter'};

    return {
        getCache: function(){
            return _cache;
        },
        setCache: function(data){
            _cache = data;
        },
        NCBRequestList: function(){
            // request for ncb document
            var deferred = $q.defer();
            var obj = new Object();

            obj.params = {};
            obj.actionCode = 'INQUIRY_NCB_REQUEST_LIST';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        viewNCBDocument: function(requestId) {
            // request for ncb document
            var deferred = $q.defer();
            var obj = new Object();

            obj.params = {
                requestId: requestId
            };
            obj.actionCode = 'OPEN_NCB_REPORT';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        NCBRequestData: function() {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = {};
            obj.actionCode = 'INQUIRY_NCB_REQUEST_DATA';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        prepareNCBRequest: function(selectedNCBPackageId, myAccountNumber) {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = {
                selectedNCBPackageId: selectedNCBPackageId,
                myAccountNumber: myAccountNumber
            };
            obj.actionCode = 'PREPARE_NCB_REQUEST';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        NCBRequestForm: function() {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = {};
            obj.actionCode = 'INQUIRY_NCB_REQUEST_FORM';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        NCBTermAndCondition: function() {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = {};
            obj.actionCode = 'INQUIRY_NCB_TERM_AND_COND';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        confirmNCB: function(transactionId, note) {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = {
                transactionId: transactionId,
                note: note
            };
            obj.actionCode = 'CONFIRM_NCB_REQUEST';
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else if(jsonResult.responseStatus.responseCode === "RIB-E-NCB0012") {
                    deferred.reject(jsonResult);
                }else {
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                    $ionicHistory.clearCache().then(function () {
                        $state.go(kkconst.ROUNTING.LIST_CREDIT_BUREAU.STATE);
                    });
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        },
        invokeService: function(params) {
            var deferred = $q.defer();
            var obj = new Object();
            
            obj.params = params.params;
            obj.actionCode = params.actionCode;
            obj.onSuccess = function(result) {
                const jsonResult = result.responseJSON.result
                if(jsonResult.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(jsonResult.value)
                }else {
                    deferred.reject(jsonResult.responseStatus);
                    popupService.showErrorPopupMessage('alert.title',result.responseJSON.errorMessage);
                }
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return deferred.promise;
        }
    };

});