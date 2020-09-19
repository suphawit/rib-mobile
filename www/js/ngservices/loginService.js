angular.module('service.login', ['service.invokeService'])
.service('loginService', function(invokeService,mainSession,$ionicPopup) {
	this.obj = {};

	this.login = function(request,callback){
		var deviceUUID 		= mainSession.deviceUUID;
		var deviceOS 		= mainSession.deviceOS;
		var deviceName 		= mainSession.devicName;
		var deviceModel 	= mainSession.devicModel;
		var deviceToken 	= mainSession.deviceToken;
		var deviceVersion 	= mainSession.deviceOsVersion;
		var deviceType		= mainSession.deviceType;

		var obj = {};
		obj.params = {};
		obj.params.username 	= request.username;
		obj.params.password 	= request.password;
		obj.params.language		= mainSession.lang;

		obj.params.platform = {};
		obj.params.platform.deviceType = deviceType;
		obj.params.platform.deviceToken = deviceToken;
		obj.params.platform.deviceName = deviceName;
		obj.params.platform.deviceModel = deviceModel;
		obj.params.platform.deviceUUID = deviceUUID;
		obj.params.platform.osname = deviceOS;
		obj.params.platform.osversion = deviceVersion;
		obj.params.appVersion = mainSession.appVersion;

		obj.actionCode = 'ACT_RBAC_LOGIN_BY_USERNAME_AND_PASSWORD';
		obj.procedure = 'loginByUsernameAndPasswordProcedure';
		obj.onSuccess = function(result) {

			callback(result);

		};
		obj.onFailure = function(result) {
			callback(result);
		};
		// Execute
		invokeService.executeInvokePublicService(obj);

	};
	
})
.service('pinService', function(invokeService,$ionicModal,mainSession,deviceService) {
	
	this.obj = {};
	this.loginPin = function(pin,myCallback){
		var deviceUUID = mainSession.deviceUUID;
		var deviceOS = mainSession.deviceOS;
		var deviceName = mainSession.devicName;
		var deviceModel = mainSession.devicModel;
		var deviceToken = mainSession.deviceToken;
		var deviceVersion = mainSession.deviceOsVersion;
		var deviceType = mainSession.deviceType;

		var obj = {};
		obj.params = {};
		obj.params.pin = pin;
		obj.params.activeType = 'testActionType';
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_VERIFY_MY_PIN';
		obj.procedure = 'loginByDeviceIdAndPinProcedure';
		obj.params.platform = {};
		obj.params.platform.deviceType = deviceType;
		obj.params.platform.deviceToken = deviceToken;
		obj.params.platform.deviceName = deviceName;
		obj.params.platform.deviceModel = deviceModel;
		obj.params.platform.deviceUUID = deviceUUID;
		obj.params.platform.osname = deviceOS;
		obj.params.platform.osversion = deviceVersion;
		obj.params.appVersion = mainSession.appVersion;
		obj.params.platform.isIllegal = deviceService.isIllegal;

			obj.onSuccess = function(result) {
				console.log('obj.onSuccess  result', result)
				myCallback(result.responseJSON);
			};
			obj.onFailure = function(result) {
				myCallback(result.responseJSON);
			};
		// Execute
		invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });
		//
	};
	this.verifyPin = function(pin,myCallback){


		var obj = {};
		var platform = {};
		obj.params = {};
		obj.params.pin = pin;
		obj.params.activeType = 'testActionType';
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_VERIFY_PIN';
		
		platform.deviceType = mainSession.deviceType;
		platform.deviceToken = mainSession.deviceToken;
		platform.deviceName = mainSession.devicName;
		platform.deviceModel = mainSession.devicModel;
		platform.deviceUUID = mainSession.deviceUUID;
		platform.osName = mainSession.deviceOS;
		platform.osVersion = mainSession.deviceOsVersion;
		platform.osname = mainSession.deviceOS;
		platform.osversion = mainSession.deviceOsVersion;
		platform.isIllegal = deviceService.isIllegal;

		obj.params.platform = platform;

			obj.onSuccess = function(result) {
				console.log('obj.onSuccess  result', result)
				myCallback(result.responseJSON);
			};
			obj.onFailure = function(result) {
				myCallback(result.responseJSON);
			};
		// Execute
		invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });
		//
	};
	this.showModal = function() {
    	//alert('ccc');
        var service = this;

        $ionicModal.fromTemplateUrl('templates/pin-modal.html', {
          scope: null
          //,controller: 'MyModalCotroller'
        }).then(function(modal) {
            service.modal = modal;
            service.modal.show();
        });
    };

    this.hideModal = function() {
        this.modal.hide();
    };
    
    
	this.obj = {};

	this.createPin = function(deviceID,pin,mycallback){
		//var deviceId = WL.Device.getID;
		var deviceUUID 		= mainSession.deviceUUID;
		// var deviceOS 		= mainSession.deviceOS;
		// var deviceName 		= mainSession.devicName;
		// var deviceModel 	= mainSession.devicModel;
		// var deviceToken 	= mainSession.deviceToken;
		// var deviceVersion 	= mainSession.deviceOsVersion;
		// var deviceType		= mainSession.deviceType;
		
		var obj = {};
		obj.params = {};
		obj.params.deviceUUID = deviceUUID;
		obj.params.pin = pin;
		obj.actionCode = 'ACT_CREATE_PIN';
		obj.procedure = 'createPINProcedure';
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
	
	// this.resetPin = function(allStrNumber1,mycallback){
	// 	var obj = {};
	//
	// 	var deviceUUID 		= mainSession.deviceUUID;
	// 	var deviceOS 		= mainSession.deviceOS;
	// 	var deviceName 		= mainSession.devicName;
	// 	var deviceModel 	= mainSession.devicModel;
	// 	var deviceToken 	= mainSession.deviceToken;
	// 	var deviceVersion 	= mainSession.deviceOsVersion;
	// 	var deviceType		= mainSession.deviceType;
	//
	// 	obj.params = {};
	// 	obj.params.pin = allStrNumber1 ;
	// 	obj.params.sessionTokenCAA = mainSession.loginDetailCAA.sessionToken;
	//
	// 	obj.params.platform = {};
	// 	obj.params.platform.deviceType = deviceType;
	// 	obj.params.platform.deviceToken = deviceToken;
	// 	obj.params.platform.deviceName = deviceName;
	// 	obj.params.platform.deviceModel = deviceModel;
	// 	obj.params.platform.deviceUUID = deviceUUID;
	// 	obj.params.platform.osname = deviceOS;
	// 	obj.params.platform.osversion = deviceVersion;
	// 	obj.params.platform.isIllegal = '';
	//
	// 	obj.actionCode = 'ACT_RESET_PIN';
	// 	obj.procedure = 'resetPINResetProcedure';
	//
	// 	obj.onSuccess = function(result) {
	// 		mycallback(result.responseJSON);
	// 	};
	//
	// 	obj.onFailure = function(result) {
	// 		 mycallback(result.responseJSON);
	// 	};
	// 	// Execute
	// 	invokeService.executeInvokePublicService(obj);
	//
	// };
	this.changePin = function(oldpin,newpin,mycallback){
		var obj = {};
		obj.params = {};
		obj.params.sessionTokenCAA = mainSession.loginDetailCAA.sessionToken;
		obj.params.newPIN = newpin;
		obj.params.oldPIN = oldpin;
		obj.actionCode = 'ACT_CHANGE_PIN';
		obj.procedure = 'changePINProcedure';	
		
		obj.onSuccess = function(result) {
			mycallback(result.responseJSON);                                                                                         
		};
		obj.onFailure = function(result) {
			mycallback(result.responseJSON);
		};
	// Execute
		invokeService.executeInvokePublicService(obj);
	};

}) //End ServicePin
.service('challengeService', function(mainSession, deviceService, invokeService) {
	
	this.request = function(callback) {

		var platform = {};
		platform.deviceType = mainSession.deviceType;
		platform.deviceToken = mainSession.deviceToken;
		platform.deviceName = mainSession.devicName;
		platform.deviceModel = mainSession.devicModel;
		platform.deviceUUID = mainSession.deviceUUID;
		platform.osName = mainSession.deviceOS;
		platform.osVersion = mainSession.deviceOsVersion;
		platform.isIllegal = deviceService.isIllegal;

		var obj = {};
		obj.params = {};
		obj.params.platform = platform;
		
		obj.actionCode = 'ACT_REQUEST_CHALLENGE';

		obj.onSuccess = function(result) {
			console.log('obj.onSuccess  result', JSON.stringify(result));
			callback(result.responseJSON);
		};
		obj.onFailure = function(result) {
			callback(result.responseJSON);
		};

		// Execute
		invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });
		//
	}

})
.service('biometricService', function(mainSession, deviceService, invokeService) {
	
	this.login = function(challenge, callback) {

		var platform = {};
		platform.deviceType = mainSession.deviceType;
		platform.deviceToken = mainSession.deviceToken;
		platform.deviceName = mainSession.devicName;
		platform.deviceModel = mainSession.devicModel;
		platform.deviceUUID = mainSession.deviceUUID;
		platform.osName = mainSession.deviceOS;
		platform.osVersion = mainSession.deviceOsVersion;
		platform.isIllegal = deviceService.isIllegal;

		var obj = {};
		obj.params = {};
		obj.params.challenge = challenge;
		obj.params.platform = platform;
		
		obj.actionCode = 'ACT_VERIFY_BIOMETRIC';

		obj.onSuccess = function(result) {
			console.log('obj.onSuccess  result', result)
			callback(result.responseJSON);
		};
		obj.onFailure = function(result) {
			callback(result.responseJSON);
		};

		// Execute
		invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });
		//
	}

});