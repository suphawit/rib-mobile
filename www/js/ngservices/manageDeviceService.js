angular.module('service.manageDeviceService', [])
		.service('manageDeviceService',function(mainSession, invokeService, $q, deviceService, kkconst, popupService, cordovadevice) {
        var invokeAdapter = { adapter: 'UserManagementAdapter' };
        var deviceUUID 		= mainSession.deviceUUID;

        this.inquiryAllDevice = function(callback){
            var obj = {};
            obj.params = { deviceUUID: deviceUUID || null};
            obj.actionCode = 'ACT_GET_ALL_DEVICE';
            obj.procedure = 'getAllDeviceProcedure';
            obj.onSuccess = function(result) {
                    if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
                        callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
                    } else {
                        callback(result.responseJSON.result.responseStatus);
                    }
                };

                invokeService.executeInvokePublicService(obj,invokeAdapter);
            };

        this.deleteDevice = function(param,callback){
            var obj = {};
            obj.params = {  
                deviceId: param.custDeviceId || null,
                deviceUUID: '',
                actionBy: 'manage_device'
            };
            obj.actionCode = 'ACT_REMOVE_DEVICE';
            obj.procedure = 'removeDeviceProcedure';
            obj.onSuccess = function(result) {
                callback(result.responseJSON.result);
            };

                invokeService.executeInvokePublicService(obj,invokeAdapter);
            };
		});
