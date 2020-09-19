angular.module('service.managePinService', [])
		.service('managePinService',function(mainSession, invokeService, $q, deviceService, kkconst, popupService, cordovadevice,webStorage) {
            var invokeAdapter = { adapter: 'SubscriptionAdapter' };
            var deviceUUID 		= mainSession.deviceUUID;
            var deviceOS 		= mainSession.deviceOS;
            var deviceName 		= mainSession.devicName;
            var deviceModel 	= mainSession.devicModel;
            var deviceToken 	= mainSession.deviceToken;
            var deviceVersion 	= mainSession.deviceOsVersion;
            var deviceType		= mainSession.deviceType;

            var platform = {};
			platform.deviceType = deviceType;
			platform.deviceToken = deviceToken;
			platform.deviceName = deviceName;
			platform.deviceModel = deviceModel;
			platform.deviceUUID = deviceUUID;
			platform.osname = deviceOS;
			platform.osversion = deviceVersion;

            var _productType = [
                { name: window.translationsLabel[mainSession.lang]['prodType.fd'], value: 'FD' }//เงินฝาก,
                // { name: window.translationsLabel[mainSession.lang]['prodType.ca'], value: 'CA' },
                // { name: window.translationsLabel[mainSession.lang]['prodType.sa'], value: 'SA' },
                // { name: window.translationsLabel[mainSession.lang]['prodType.td'], value: 'TD' }
            ];

			this.resetPin = function(params){
                var defered = $q.defer();
                var obj = new Object();
                
                obj.params = {};

                var platform = {};
                platform.deviceType = mainSession.deviceType;
                platform.deviceToken = mainSession.deviceToken;
                platform.deviceName = mainSession.devicName;
                platform.deviceModel = mainSession.devicModel;
                platform.deviceUUID = mainSession.deviceUUID;
                platform.osName = mainSession.deviceOS;
                platform.osVersion = mainSession.deviceOsVersion;
                    
                obj.params.deviceToken = deviceToken;
                obj.params.deviceUUID = deviceUUID;
                obj.params.pin = params.pin;
                obj.params.platform = platform;
                obj.params.sessionToken = mainSession.loginDetailCAA.sessionToken;
                obj.params.verifyTransactionId = params.verifyTransactionId;
                obj.params.subscriptionChannel = params.subscriptionChannel;
                
                obj.actionCode = 'ACT_RESET_PIN';
                obj.procedure = 'resetPinProcedure';
                
                obj.onSuccess = function(result) {  
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };

                // Execute
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

            this.createPin = function(params){
                var defered = $q.defer();
                var obj = new Object();
                obj.params = {};
                    
                obj.params.pin = params.pin;
                obj.params.verifyTransactionId = params.verifyTransactionId;
                obj.params.subscriptionChannel = params.subscriptionChannel;

                var platform = {};
                platform.deviceType = mainSession.deviceType;
                platform.deviceToken = mainSession.deviceToken;
                platform.deviceName = mainSession.devicName;
                platform.deviceModel = mainSession.devicModel;
                platform.deviceUUID = mainSession.deviceUUID;
                platform.osName = mainSession.deviceOS;
                platform.osVersion = mainSession.deviceOsVersion;

                obj.params.platform = platform;
                
                obj.actionCode = 'ACT_CREATE_PIN';
                obj.procedure = 'createPinProcedure';
                
                obj.onSuccess = function(result) {  
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };

                // Execute
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

            this.getProductType = function(){
                return _productType;
            };

            var checkDeleteDeviceLimit = function(resultdeleteDeviceLimit){
                var defered= $q.defer();
                if (resultdeleteDeviceLimit.result.responseStatus.responseCode === kkconst.success) {
                    console.log('Delete Success');
                    defered.resolve(true);
                } else {
                    popupService.showErrorPopupMessage('alert.title','alert.terminate.unsuccess');
                }
                return defered.promise;
            };
            this.showDeleteDeviceConfirm = function(params, subscriptionCache, subscriptionChannel){
                var defered= $q.defer();
                if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
                    // WL.SimpleDialog.show(popupService.convertTranslate('alert.title'), popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDeviceName,
                    //     [{
                    //         text : popupService.convertTranslate('button.ok'),
                    //         handler : function() {
                    //             //press ok
                    //             deviceService.deleteDeviceLimit(actionType, params.oldDeviceID,
                    //                 // Callback function
                    //                 function(resultdeleteDeviceLimit) {
                    //                     checkDeleteDeviceLimit(resultdeleteDeviceLimit).then(function(result){
                    //                         defered.resolve(true);
                    //                     });
                    //                 });
                    //             }
                    //     }, {
                    //         text : popupService.convertTranslate('label.cancel'),
                    //         handler : function(){
                    //             //press cancel
                    //             }
                    //     }
                    // ]);
                    navigator.notification.confirm(
                        popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDeviceName,
                        function (resultClick) {
                            if(resultClick == 1) {
                                deviceService.deleteDeviceLimit(params.oldDeviceId, params.oldDeviceUUID, subscriptionCache, subscriptionChannel,
                                    // Callback function
                                    function(resultdeleteDeviceLimit) {
                                        checkDeleteDeviceLimit(resultdeleteDeviceLimit).then(function(result){
                                            defered.resolve(true);
                                        });
                                    });
                            }
                        },
                        popupService.convertTranslate('alert.title'),
                        [
                            popupService.convertTranslate('button.ok'),
                            popupService.convertTranslate('label.cancel')
                        ]
                    );
                } else {
                    window.swal({
                        title: popupService.convertTranslate('alert.title'),
                        text: popupService.convertTranslate('label.terminateDevice') +" "+ params.oldDeviceName,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText:  popupService.convertTranslate('button.ok'),
                        cancelButtonText: popupService.convertTranslate('label.cancel'),
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            //press ok
                            deviceService.deleteDeviceLimit(actionType, params.oldDeviceID,
                                // Callback function
                                function(resultdeleteDeviceLimit) {
                                    checkDeleteDeviceLimit(resultdeleteDeviceLimit).then(function(result){
                                        defered.resolve(true);
                                    });
                            });
                        }
                    });
                }
                return defered.promise;
            };
			
		});
