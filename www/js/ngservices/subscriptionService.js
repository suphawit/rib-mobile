angular.module('service.subscriptionService', [])
		.service('subscriptionService',function($state, mainSession, invokeService, $q, kkconst, Idle, notificationService, mutualFundService, deviceService) {
            var invokeAdapter = { adapter: 'SubscriptionAdapter' };
            var _cache = null;

            var platform = {};
			platform.deviceType = mainSession.deviceType;
			platform.deviceToken = mainSession.deviceToken;
			platform.deviceName = mainSession.devicName;
			platform.deviceModel = mainSession.devicModel;
			platform.deviceUUID = mainSession.deviceUUID;
			platform.osName = mainSession.deviceOS;
			platform.osVersion = mainSession.deviceOsVersion;

            this.requestOTPWithOutLogin = function(params) {
                var defered = $q.defer();
                var obj = {};
                obj.params = {};
                obj.params.actionOTP = params.actionOTP;
                obj.params.idType = params.idType;
                obj.params.idNo = params.idNo;
                obj.params.verifyTransactionId = params.verifyTransactionId;
                obj.params.subscriptionChannel = params.subscriptionChannel;

                obj.actionCode = 'ACT_REQUEST_OTP';
                obj.procedure = 'requestOTPProcedure';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

            this.verifyOTP = function(params) {
                var defered = $q.defer();

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
                obj.params.referenceNO = params.referenceNO;
                obj.params.otp = params.otp;
                obj.params.tokenOTPForCAA = params.tokenOTPForCAA;
                obj.params.verifyTransactionId = params.verifyTransactionId;
                obj.params.subscriptionChannel = params.subscriptionChannel;
                obj.params.platform = platform;

                obj.actionCode = 'ACT_VERIFY_OTP';
                obj.procedure = 'verifyOTPProcedure';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                 return defered.promise;
            };

            this.getCache = function(){
                return _cache;
            };
            this.setCache = function(data){
                _cache = data;
            };

            this.verifySubscriptionATMPin = function(params) {
                var defered = $q.defer();
				var obj = {};
				obj.params = {};
				obj.params.atmNumber = params.atmNumber;
                obj.params.atmPin = params.atmPin;
                obj.params.platform = platform;
                obj.params.actionType = params.actionType;
				obj.actionCode = 'ACT_VERIFY_SUBSCRIPTION_ATM_PIN';
				obj.procedure = 'verifySubscriptionAtmPinProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
				};
				invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
			};

            this.verifySubscriptionProductId = function(params) {
                var defered = $q.defer();
				var obj = {};

                platform.deviceType = mainSession.deviceType;
                platform.deviceToken = mainSession.deviceToken;
                platform.deviceName = mainSession.devicName;
                platform.deviceModel = mainSession.devicModel;
                platform.deviceUUID = mainSession.deviceUUID;
                platform.osName = mainSession.deviceOS;
                platform.osVersion = mainSession.deviceOsVersion;

				obj.params = {};
				obj.params.idType = params.idType;
                obj.params.idNo = params.idNo;
                obj.params.productType = params.productType;
                obj.params.productId = params.productId;
                // obj.params.birthDate = params.birthDate;
                obj.params.platform = platform;
                obj.params.actionType = params.actionType;
                obj.params.idIssueCountryCode = params.idIssueCountryCode;

				obj.actionCode = 'ACT_VERIFY_SUBSCRIPTION_PRODUCT_ID';
				obj.procedure = 'verifySubscriptionProductIdProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					defered.resolve(resultObj);
				};
				invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
			};

            this.verifySubscriptionUser = function(params) {
                var defered = $q.defer();
                var obj = {};

                platform.deviceType = mainSession.deviceType;
                platform.deviceToken = mainSession.deviceToken;
                platform.deviceName = mainSession.devicName;
                platform.deviceModel = mainSession.devicModel;
                platform.deviceUUID = mainSession.deviceUUID;
                platform.osName = mainSession.deviceOS;
                platform.osVersion = mainSession.deviceOsVersion;

                obj.params = {};
                obj.params.username = params.username;
                obj.params.password = params.password;
                obj.params.actionType = params.actionType;
                obj.params.platform = platform;
                obj.params.appVersion = mainSession.appVersion;
                obj.params.clientIP = kkconst.DEVICE_IP;

                obj.actionCode = 'ACT_VERIFY_USER_ACCOUNT';
                obj.procedure = 'verifyUserProcedure';
                obj.onSuccess = function(result) {
                    console.log('verifyUserProcedure result', JSON.stringify(result))
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

            this.updateTermAndCondition = function() {
                var defered = $q.defer();
                var obj = {};
                obj.params = {};
                obj.params.deviceUUID = mainSession.deviceUUID;
                // obj.params.verifyTransactionId = params.verifyTransactionId;
                // obj.params.subscriptionChannel = params.subscriptionChannel;
                obj.actionCode = 'ACT_UPDATE_TERM_AND_CONDITION';
                obj.procedure = 'updateTermAndConditionProcedure';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, {adapter: 'authenticationAdapter'});

                return defered.promise;
            };

            this.inquiryAllIssueCountry = function(params) {
                var defered = $q.defer();
                var obj = {};
                obj.params = {};
                
                obj.actionCode = 'ACT_INQUIRY_ALL_ISSUE_COUNTRY';
                obj.procedure = 'inquiryAllIssueCountryProcedure';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

            this.getCustomerInfo = function(publicKey) {
                var defered = $q.defer();
                var obj = {};
                obj.params = {};

                //publicKey
                obj.params.publicKey  = publicKey;

                obj.params.appVersion = mainSession.appVersion;
                obj.params.cisID = '';
                obj.params.tokenID = '';
                obj.params.language = mainSession.language;

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

                obj.actionCode = 'ACT_GET_CUST_INFO';
                obj.procedure = 'ACT_GET_CUST_INFO';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });

                return defered.promise;
            };
            this.logout = function(callback){
                if(!callback) {
                    callback = function () {
                        
                    }
                }
                var obj = {};
                obj.params = {};
                obj.params.sessionToken = mainSession.sessionToken;

                obj.actionCode = 'ACT_LOGOUT';
                obj.procedure = 'ACT_LOGOUT';
                obj.onSuccess = function(result) {
                    Idle.unwatch();
                    mainSession.loginDetailCAA.sessionToken = null;
                    mainSession.loginDetailCAA.userID = null;

                    notificationService.clearLogoutNotification();
                    mutualFundService.setIsSyncUnitholderForFundConnext(false);
                    mainSession.sessionToken = null;
                    mainSession.accessToken = null;
                    $state.go('menu');
                    callback(true);

                };
                obj.onFailure = function(result) {
                    mainSession.sessionToken = null;
                    mainSession.accessToken = null;
                    $state.go('menu');
                    callback(true);
                };
                // Execute
                invokeService.executeInvokePublicService(obj, { adapter: 'authenticationAdapter' });

            };

            this.newUserAuthenticationWithMyPIN = function(params) {
                var defered = $q.defer();
				var obj = {};

                platform.deviceType = mainSession.deviceType;
                platform.deviceToken = mainSession.deviceToken;
                platform.deviceName = mainSession.devicName;
                platform.deviceModel = mainSession.devicModel;
                platform.deviceUUID = mainSession.deviceUUID;
                platform.osName = mainSession.deviceOS;
                platform.osVersion = mainSession.deviceOsVersion;

				obj.params = {};
                obj.params.idNo = params.idNo;
                obj.params.pin = params.pin;
                obj.params.platform = platform;
                obj.params.idType = params.idType;
                obj.params.idIssueCountryCode = params.idIssueCountryCode;

				obj.actionCode = 'ACT_VERIFY_SUBSCRIPTION_MY_PIN';
				obj.procedure = 'verifySubscriptionMyPinProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					defered.resolve(resultObj);
				};
				invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };
            
            this.submitNewUserAuthen = function() {
                var defered = $q.defer();
                var obj = {};
                obj.params = {};
                obj.params.deviceUUID = mainSession.deviceUUID;
                
                obj.actionCode = 'ACT_UPDATE_TERM_AND_CONDITION';
                obj.procedure = 'updateTermAndConditionProcedure';
                obj.onSuccess = function(result) {
                    var resultObj = result.responseJSON.result;
                    defered.resolve(resultObj);
                };
                invokeService.executeInvokePublicService(obj, invokeAdapter);

                return defered.promise;
            };

		});
