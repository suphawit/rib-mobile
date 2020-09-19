angular.module('service.device', ['service.invokeService'])
	.service('deviceService', function (invokeService, mainSession, kkconst, downloadAndStoreFile, webStorage, $q, popupService) {
		'use strict';
		this.obj = {};
		this.isCheckDevice = false;
		this.isIllegal = kkconst.IS_ILLEGAL_FALSE;
		this.deviceID = '';
		
		this.checkFirstLogin = function (callback) {

			var obj = {};
			obj.params = {};
			obj.params.deviceID = obj.deviceID;
			//obj.params.deviceID = WL.device.getID();
			obj.actionCode = 'UM001-010';
			obj.procedure = 'checkDeviceIDProcedure';

			obj.onSuccess = function (result) {
				callback(result);
			};
			obj.onFailure = function (result) {
				callback(result);
			};

			// Execute
			invokeService.executeInvokePublicService(obj);

		};

		this.checkLoginSetting = function() {
			var deferred = $q.defer();
			
			if(webStorage.getLocalStorage("isBiometric") === true) {
				this.isAvailable().then(function(result) {
					if(result.isAvailable) {
						if(mainSession.deviceOS === 'iOS' && result.error != undefined && result.error.isLocked === true) {
							deferred.resolve(false);
						} else {
							deferred.resolve(true);
						}
					}
					console.log("isAvailable: " + result.isAvailable);
					
				});
			} else {
				deferred.resolve(false);
			}
			
			return deferred.promise;
		};


		this.checkDeviceUUID = function(deviceId,callback) {
			console.log('deviceId', deviceId)
			
			var that = this;
			var obj = {};
			obj.params = {}; 
			obj.params.deviceUUID = mainSession.deviceUUID;
			obj.actionCode = 'ACT_CHECK_DEVICE_UUID';

			obj.onSuccess = function(result) {
				console.log('result: ', JSON.stringify(result));
				var responseJSON = result.responseJSON;
				if(responseJSON.result){
					var respValue = responseJSON.result.value;

					// Check whether public key is inactive
					if(respValue.key === false) {
						// Remove private key in device
						that.deactivate(function(result){
							console.log(result.success);
						});
						// Disable login setting flag
						if(webStorage.getLocalStorage("isBiometric") == true) {
							webStorage.setLocalStorage("isBiometric", false);
							console.log("isBiometric disabled.");
						}
					}
					
					downloadAndStoreFile.setDataVersion(respValue['bankInfoVersion']);
					downloadAndStoreFile.setBillerFileVersion(respValue['billerImageVersion']);
				}
				
				callback(result);
			};
			obj.onFailure = function(result) {
				callback(result);
			};

			// Execute
			invokeService.executeInvokePublicService(obj,{adapter:'UserManagementAdapter'});
				
		};

		this.deleteDeviceLimit = function (deviceId, oldDeviceUUID, subscriptionCache, subscriptionChannel, callback) {

			//condition check service (call service)
			var platform = {};
			platform.deviceType = mainSession.deviceType;
			platform.deviceToken = mainSession.deviceToken;
			platform.deviceName = mainSession.devicName;
			platform.deviceModel = mainSession.devicModel;
			platform.deviceUUID = mainSession.deviceUUID;
			platform.osName = mainSession.deviceOS;
			platform.osVersion = mainSession.deviceOsVersion;

			var obj = {};
			obj.params = {};
			obj.params.deviceId = deviceId;
			obj.params.deviceUUID = oldDeviceUUID;
			obj.params.actionBy = subscriptionCache.actionType;
			obj.params.platform = platform;
			obj.params.subscriptionChannel = subscriptionChannel;
			obj.params.verifyTransactionId = subscriptionCache.verifyTransactionId;

			obj.actionCode = 'ACT_REMOVE_DEVICE';
			obj.procedure = 'deleteDeviceIDProcedure';

			obj.onSuccess = function (result) {
				callback(result.responseJSON);
			};

			obj.onFailure = function (result) {
				callback(result.responseJSON);
			};
			console.log(obj)
			// Execute
			invokeService.executeInvokePublicService(obj, { adapter: 'UserManagementAdapter' });

		};

		this.changeLanguage = function (lang, callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = lang;
			obj.actionCode = 'ACT_CHANGE_LNG';
			obj.procedure = 'changeLNGProcedure';
			obj.onSuccess = function (result) {
				var responseCode = result.responseJSON.result.responseStatus.responseCode;
				callback(responseCode);
			};
			invokeService.executeInvokePublicService(obj);
		};

		this.isIOS = function (isIOSCallback) {
			if (device.platform == 'iOS') {
				isIOSCallback(true);
			} else {
				isIOSCallback(false);
			}
		};
		this.isAndroid = function (isAndroidCallback) {
			if (device.platform == 'Android') {
				isAndroidCallback(true);
			} else {
				isAndroidCallback(false);
			}
		};

		this.setIllegalDevice = function (flag) {
			var deviceService = this;
			deviceService.isIllegal = kkconst.IS_ILLEGAL_TRUE;
		};

		// this.isJail = function(){
		//
		// 	var deviceService = this;
		// 	jailbreakdetection.isJailbroken(
		// 			function(result){
		// 				if(result){
		// 					deviceService.isIllegal = kkconst.IS_ILLEGAL_TRUE;
		// 				}
		// 			},
		// 			function(){//return error
		// 			}
		// 	);
		// };
		// this.isRoot = function(){
		// 	rootdetection.isDeviceRooted(
		// 		function(result){
		// 			var isDevicesRooted = result == 1;
		// 			if(isDevicesRooted){
		// 				deviceService.isIllegal = kkconst.IS_ILLEGAL_TRUE;
		// 			}
		// 		},
		// 		function(error){//return error
		// 		}
		// 	);
		// };
		// this.jailRootDetect = function(){
		// 	var deviceService = this;
		// 	if (cordovadevice.properties('platform') !== 'preview' && cordovadevice.properties('platform') !== null) {
		// 	  mainSession.appVersion = AppVersion.version;
		// 	  this.isIOS(function(ios){
		// 		  if(ios){
		// 			  deviceService.isJail();
		// 		  }else{
		// 			  deviceService.isRoot();
		// 		  }
		// 	  });
		//   }
		// };
		this.slidesPerView = function () {
			var w = 55;
			if (window.innerWidth > 415) {
				w = 80;
				return window.innerWidth / w;
			}
			return window.innerWidth / w;
		};

		this.isAvailable = function () {
			var deferred = $q.defer();

			cordova.plugins.BiometricAuthen.isAvailable(
				function(success) {
					if(mainSession.deviceOS === 'iOS' && mainSession.biometricType === '') {
						mainSession.biometricType = success.biometricType;
						console.log("biometricType: " + mainSession.biometricType);
					}
					deferred.resolve({isAvailable: true});
				},
				function(error) {
					console.log(error);
					if(mainSession.deviceOS === 'iOS' && mainSession.biometricType === '') {
						mainSession.biometricType = error.biometricType;
						console.log("biometricType: " + mainSession.biometricType);
					}
					if(error.isDeviceSupported === false || error.isEnrolled === false || error.isFaceIDPermitted === false) {
						webStorage.setLocalStorage("isBiometric", false);
						console.log("isBiometric disabled.");
						deferred.resolve(
							{
								isAvailable: false,
								error: error
							}
						);
					} else if(mainSession.deviceOS === 'iOS' && error.isLocked === true) {
						deferred.resolve(
							{
								isAvailable: true,
								error: error
							}
						);
					}
					deferred.resolve({isAvailable: true});
				}
			);

			return deferred.promise;
		};

		this.isBioStateChanged = function () {
			var deferred = $q.defer();

			cordova.plugins.BiometricAuthen.isBioStateChanged(
				function() {
					deferred.resolve(true);
				},
				function() {
					deferred.resolve(false);
				}
			);

			return deferred.promise;
		};

		this.setBioState = function () {
			cordova.plugins.BiometricAuthen.setBioState(
				function() {
					console.log("Biometric state is set.");
				},
				function() {
					console.log("Biometric state cannot be set.");
				}
			);
		};

		this.activate = function (callback) {
			cordova.plugins.BiometricAuthen.activate(
				{
					clientID: mainSession.deviceUUID
				},
				callback,
				function (error) {
					console.log(error);
				}
			);
		};

		this.sign = function (challenge) {
			var defered = $q.defer();
			cordova.plugins.BiometricAuthen.sign(
				{
					clientID: mainSession.deviceUUID,
					challenge: challenge
				},
				function(result) {
					defered.resolve(result);
				},
				function (error) {
					console.log(error.error);
				}
			);
			return defered.promise;
		};

		this.authenticate = function (challenge, successCallback, errorCallback) {
			cordova.plugins.BiometricAuthen.authenticate(
				{
					clientID: mainSession.deviceUUID,
					challenge: challenge,
					lang: mainSession.lang
				},
				successCallback,
				errorCallback
			);
		};

		this.deactivate = function (callback) {
			cordova.plugins.BiometricAuthen.deactivate(
				{
					clientID: mainSession.deviceUUID
				},
				callback,
				function (error) {
					console.log(error);
				}
			);
		};

		this.allowBiometricAuthen = function() {
			if(JSON.stringify(webStorage.getLocalStorage("isBiometric")) === '{}') {
				this.isAvailable().then(function(result) {
					console.log("isAvailable: " + result.isAvailable);
					if(result.isAvailable) {
						biometric();
					}
				});
			}

			var that = this;
			var biometric = function(){
				var title = '';
				var describe ='';
				if (mainSession.deviceOS === 'iOS') {
					console.log("mainSession.biometricType"+mainSession.biometricType);
					if(mainSession.biometricType === 'faceID') {
						title= "title.useFace";
						describe ="describe.useFace";
					  }else if( mainSession.biometricType === 'touchID'){
						  title = "title.useTouch";
						  describe ="describe.useTouch";
					  }
					
				} else {
					title = "title.useFingerprint";
					describe ="describe.useFingerprint";
				}

				popupService.showConfirmBiometricPopupMessageCallback(title, describe, function(ok) {
					console.log('that -> ', that);
					
					if(ok) {
						console.log('ok -> ', ok);

						webStorage.setLocalStorage("isBiometric", true);
						console.log(webStorage.getLocalStorage("isBiometric"));

						that.setBioState();
					} else {
						webStorage.setLocalStorage("isBiometric", false);
						console.log(webStorage.getLocalStorage("isBiometric"));
					}
				});
			};
		};

	});
