angular.module('service.resetPin', ['service.invokeService','service.common'])
.service('resetPinService', function(invokeService,mainSession) {
	this.obj = {};
	this.resetPin = function(allStrNumber1,mycallback){
		//var deviceId = WL.Device.getID;
		//var deviceId = "123456789"; //Fix Device for TEST//
		//var username = "TaewTHreetip";
		var obj = new Object();
		
		var deviceUUID 		= mainSession.deviceUUID;
		var deviceOS 		= mainSession.deviceOS;
		var deviceName 		= mainSession.devicName;
		// var deviceModel 	= mainSession.devicModel;
		var deviceToken 	= mainSession.deviceToken;
		var deviceVersion 	= mainSession.deviceOsVersion;
		// var deviceType		= mainSession.deviceType;
		
		
		
		
		obj.params = {};
			
		obj.params.deviceToken = deviceToken;
			obj.params.deviceUUID = deviceUUID;
				obj.params.segmentID = "retail";
				obj.params.userID = mainSession.loginDetailCAA.userID;
				obj.params.password = allStrNumber1 ;
				obj.params.sessionToken = mainSession.loginDetailCAA.sessionToken;
				
				obj.params.deviceType = "M";
				obj.params.deviceName = deviceName;
				obj.params.osname = deviceOS;
				obj.params.osversion =  deviceVersion;
				obj.params.realmID = "kkb_pin";
		
		
		obj.actionCode = 'ACT_RESET_PIN';
		obj.procedure = 'resetPINResetProcedure';
		
		
		obj.onSuccess = function(result) {  
		//$scope.results = result.responseJSON.result;
			mycallback(result.responseJSON);
		};
	obj.onFailure = function(result) {
       //$scope.results = result.responseJSON.result;
		 mycallback(result.responseJSON);
	};
	// Execute
	invokeService.executeInvokePublicService(obj);
	//
	};

});//End ServicePin
