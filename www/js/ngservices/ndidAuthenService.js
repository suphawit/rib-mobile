angular.module('service.ndidAuthenService', [])
    .factory('ndidAuthenService', function(invokeService, $q, mainSession, deviceService) {
    var _cache = null;
    var _invokeAdapter = { adapter: 'NdidAuthenAdapter'};
    var _requestList = [];
    var _prepareSubmitTransactionId;
    var _signatureList = [];

    function prepareSubmitRequestResult(listAuthenRequest){
        var tmpArr = listAuthenRequest || [];
        var returnValue = [];

        for(var i = 0; i < tmpArr.length; i++){
            if(tmpArr[i].requestResult != ''){
                returnValue.push({
                    "requestId": tmpArr[i].requestId,
                    "requestResult": tmpArr[i].requestResult
                });
            }
            
        }

        return returnValue;
    }

    function signRequestMessageHash() {
        var tmpArr = _requestList;
        var arrDefered = [];
        
        _signatureList = [];

        for(var i = 0; i < tmpArr.length; i++){
            if(tmpArr[i].requestResult != ''){
                var requestMessageHash = tmpArr[i].requestMessageHash;
                var defered = deviceService.sign(requestMessageHash).then(function(result){
                    return result.signature;
                });
                arrDefered.push(defered);

                _signatureList.push({
                    "requestId": tmpArr[i].requestId,
                    "signature": ''
                });
            }
            
        }

        $q.all(arrDefered).then(function(data) {
            for(var i = 0; i < data.length; i++){
                _signatureList[i].signature = data[i];
            }
            console.log('Both promises have resolved', data);
            console.log('Nemo -> _signatureList', _signatureList);
        });
    }

    return {
        getCache: function(){
            return _cache;
        },
        setCache: function(data){
            _cache = data;
        },
        invokeService: function(params){
            var defered = $q.defer();
            var obj = new Object();
            
            obj.params = params.params;
            obj.actionCode = params.actionCode;
            
            obj.onSuccess = function(result) {  
                var resultObj = result.responseJSON.result;
                defered.resolve(resultObj);
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return defered.promise;
        },
        submitRequest: function(prepareSubmitTransactionId) {
            var defered = $q.defer();
            var obj = new Object();

            var platform = {};
			platform.deviceType = mainSession.deviceType;
			platform.deviceToken = mainSession.deviceToken;
			platform.deviceName = mainSession.devicName;
			platform.deviceModel = mainSession.devicModel;
			platform.deviceUUID = mainSession.deviceUUID;
			platform.osName = mainSession.deviceOS;
            platform.osVersion = mainSession.deviceOsVersion;
            platform.isIllegal = deviceService.isIllegal;
            
            obj.params = {
                prepareSubmitTransactionId: prepareSubmitTransactionId,
                verifySignature: {
                    platform: platform,
                    signatureList: _signatureList
                }
            };
            obj.actionCode = 'SUBMIT_REQUEST';
            
            obj.onSuccess = function(result) {  
                _requestList = [];

                var resultObj = result.responseJSON.result;
                defered.resolve(resultObj);
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return defered.promise;
        },
        prepareSubmitRequest: function(requestList, authenMethod) {
            var defered = $q.defer();
            var obj = new Object();
            var prepareSubmitRequestList = prepareSubmitRequestResult(requestList);

            obj.params = {
                requestList: prepareSubmitRequestList,
                authenMethod: authenMethod
            };
            obj.actionCode = 'PREPARE_SUBMIT_REQUEST';
            
            obj.onSuccess = function(result) {  
                var resultObj = result.responseJSON.result;
                var value = resultObj.value;
                if(value && value.prepareSubmitTransactionId) {
                    _prepareSubmitTransactionId = value.prepareSubmitTransactionId;
                    _requestList = requestList;
                    signRequestMessageHash();
                }

                defered.resolve(resultObj);
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return defered.promise;
        },
        verifyPIN: function(pin) {
            var defered = $q.defer();
            var obj = new Object();
            obj.params = {
                pin: pin,
                prepareSubmitTransactionId: _prepareSubmitTransactionId
            };
            obj.actionCode = 'VERIFY_PIN';
            
            obj.onSuccess = function(result) {  
                var resultObj = result.responseJSON.result;
                defered.resolve(resultObj);
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return defered.promise;
        },
        verifyFaceRecog: function(faceImage) {
            var defered = $q.defer();
            var obj = new Object();
            obj.params = {
                faceImage: faceImage,
                prepareSubmitTransactionId: _prepareSubmitTransactionId
            };
            obj.actionCode = 'VERIFY_FACERECOG';
            
            obj.onSuccess = function(result) {  
                var resultObj = result.responseJSON.result;
                defered.resolve(resultObj);
            };

            // Execute
            invokeService.executeInvokePublicService(obj, _invokeAdapter);

            return defered.promise;
        }  
    };

});