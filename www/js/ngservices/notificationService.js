angular.module('service.notification', [])
    .service('notificationService', function (invokeService, kkconst, $q,$rootScope) {
        'use strict';
        this.badgeMenuList = [
            // {badge: 0, menuCode: 'MY_RTP'},
            // {badge: 0, menuCode: 'RTP_RECEIVE'},
        ];

        var push;

        var _backgroundData = [];
        var _invokeOption = {
            adapter: kkconst.notiAdapter
          
        };

        var _invokeOption_hideLoader = {
            adapter: kkconst.notiAdapter,
            isHideLoader:true
        };

        var udid;
        var platformNoti;
        this.registrationId = "";

        this.currentPage = 0;
        this.tmpNotificationList = [];
        this.tmpNotificationMaxItems = 0;



        //for initial push notification
        this.init = function (udidRecieve,platform) {

            var notificationService = this;
            
            var arrayTransfrom = {
                "iOS":"A",
                "Android":"G"
            };

            udid = udidRecieve;

            platformNoti = arrayTransfrom[platform];
            push = PushNotification.init({
                android: {
                    senderID: kkconst.SENDER_ID,
                    forceShow: true,
                    topics: ["KKRIB-ANDROID"]
                },

                ios: {
                    alert: "true",
                    badge: true,
                    sound: 'true',
                    topics: ["KKRIB-IOS"]
                }
            });

            push.on('registration', function (data) {
                notificationService.registrationId = data.registrationId;
                
            });
         
            push.on('notification', function (data) {

                var isForegroundNotification = data.additionalData.foreground || false;
                var badge = data.additionalData.payload.badge;
                var recievePayload = data.additionalData.payload;
                //apns return string
                // if(platformNoti === 'A'){
                //     recievePayload = JSON.parse(recievePayload);
                //     badge = recievePayload.badge;
                // }
                var payload = [];
                    payload.push(recievePayload);

                    notificationService.tmpNotificationList =  payload.concat(notificationService.tmpNotificationList);
                    $rootScope.$broadcast('new-noti', { value: notificationService.tmpNotificationList });
          
                if (isForegroundNotification) {
                 //foreground
                } else {
                  
                    
                    //background case;
                    notificationService._backgroundData = payload;
                    $rootScope.$broadcast('bg-noti', { value: payload});
                }

                if(!angular.isUndefined(badge)){
                    updateBadge(badge);
                }
                
            });
        };

        var updateBadge = function(badge){
            try{
                push.setApplicationIconBadgeNumber(function() {
                   
                }, function() {
                }, badge);

                $rootScope.badgeNumber = badge;
              //  $rootScope.$apply();
            }catch(e){

            }
        };


        this.getBackgroundData = function(){
            var notificationService = this;  
            if(!angular.isUndefined(notificationService._backgroundData) && notificationService._backgroundData.length > 0){
  
                return notificationService._backgroundData[0];
        
            }else{
                return false;
            }
        };

        this.clearBackgroundData = function(){
            var notificationService = this;  
            notificationService._backgroundData = [];
        };

        this.chkBackgroundData = function(){
            var notificationService = this;  
     
            if(!angular.isUndefined(notificationService._backgroundData) && notificationService._backgroundData.length > 0){
                var redirectState = "";
                return notificationService._backgroundData[0];
            }else{
                return false;
            }
        };
        

        this.clearLogoutNotification = function(){
            var notificationService = this;
            notificationService.registrationId = "";
            this.currentPage = 0;
            this.tmpNotificationList = [];
            $rootScope.badgeNumber = "0";
        };

        this.getBadgeNumber = function() {
            var notificationService = this;
            var obj = {};
                obj.params = {};
            
        
                obj.params.paging = {
                    "currentPage": 0,
                    "pageSize": 1
                };

            obj.actionCode = 'get_all_notification_by_user';
            obj.procedure = 'getAllNotification';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
      
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    if(resultObj.value.data.length > 0){
                        updateBadge(resultObj.value.badge);
                    
                    }
                }
            };
            invokeService.executeInvokePublicService(obj, _invokeOption);
            return true;
        
        };
 
        this.badgeMenuCountProcedure = function (callback) {
            var request = {
                params: {},
                actionCode: 'ACT_BADGE_MENU_COUNT',
                procedure: 'badgeMenuCountProcedure'
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                if (kkconst.success === resultCode) {
                    callback(resultCode, resultObj);
                } else {
                    callback(resultCode || kkconst.unknown);
                }
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                callback(resultCode || kkconst.unknown);
            };

            invokeService.executeInvokePublicService(request);
        };

        this.getNotiDetail = function (params, callback) {
            var deferred = $q.defer();
			var obj = {};
            obj.params = {};
            obj.params.txnId = params.txnId;
            obj.params.notificationType = params.actionType;
			//obj.params.language = mainSession.lang;
			obj.actionCode = 'ACT_GET_NOTIFICATION_DETAIL';
			obj.procedure = 'getNotificationDetailProcedure';
			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
                deferred.resolve(resultObj);
                return deferred.promise;
            };
            obj.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                deferred.reject(resultObj);
                return deferred.promise;
            };
            invokeService.executeInvokePublicService(obj);
            return deferred.promise;
		};

        this.getRTPIncomingNotiDetail = function (params, callback) {
            var deferred = $q.defer();
			var obj = {};
            obj.params = {};
            obj.params.rtpRef = params.dataType.txnId;
			//obj.params.language = mainSession.lang;
			obj.actionCode = 'ACT_RTP_INQUIRY_INCOMING_BY_RTP_REF';
			obj.procedure = 'inquiryRTPIncomingByRtpRefProcedure';
			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
                deferred.resolve(resultObj);
                return deferred.promise;
            };
            obj.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                deferred.reject(resultObj);
                return deferred.promise;
            };
            invokeService.executeInvokePublicService(obj);
            return deferred.promise;
		};


        this.getAllNotification = function (params, callback) {
     
            var page = params.currentPage;
            var pageSize = params.pageSize;
            var deferred = $q.defer();
            var obj = {};
                obj.params = {};
            var notificationService = this;
        
            //    obj.params.language = mainSession.lang;
            //init case
            if(page == 0 && notificationService.currentPage > 0){
                deferred.resolve([notificationService.tmpNotificationList,notificationService.tmpNotificationMaxItems]);
                return deferred.promise;
            }

            if(page == 0 && notificationService.currentPage === 0){
                notificationService.tmpNotificationList = [];
              
            }

            if (page === null) {
                page = notificationService.currentPage;
              //  deferred.resolve(this.tmpNotificationList);
    
            }
            
            obj.params.paging = {
                "currentPage": page,
                "pageSize": pageSize
            };

            obj.actionCode = 'get_all_notification_by_user';
            obj.procedure = 'getAllNotification';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
      
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    if(resultObj.value.data.length > 0){
                        notificationService.currentPage = notificationService.currentPage + 1;
                        notificationService.tmpNotificationList =  notificationService.tmpNotificationList.concat(resultObj.value.data);
                        notificationService.tmpNotificationMaxItems = resultObj.value.maxItems;
                        updateBadge(resultObj.value.badge);
                        deferred.resolve([notificationService.tmpNotificationList,resultObj.value.maxItems]);
                    }else{
                        deferred.resolve(null);
                    }
                 //   notificationService.tmpNotificationList = resultObj.value.data;
                  
                } else {
                    deferred.reject(resultObj.responseStatus);
                }
            };
            obj.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                deferred.reject(resultObj);
            
            };
            invokeService.executeInvokePublicService(obj, _invokeOption);
            return deferred.promise;
        };

         this.getNotificationInfoByUser = function (params, callback) {
            var deferred = $q.defer();
			var obj = {};
            obj.params = {};
            obj.params.Data = {'notificationId': params.notificationId};
			obj.actionCode = 'get_notification_detail';
			obj.procedure = 'getNotificationDetail';
			obj.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
                deferred.resolve(resultObj);
                return deferred.promise;
            };
            obj.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                deferred.reject(resultObj);
                return deferred.promise;
            };
            invokeService.executeInvokePublicService(obj,_invokeOption);
            return deferred.promise;
        };

        this.triggerNotification = function (params, callback) {
            var notificationService = this;

            var deferred = $q.defer();
            var obj = {};
                obj.params = {};
           
            obj.params.notificationId = params.notificationId;
         

            obj.actionCode = 'act_read_action_trigger';
            obj.procedure = 'triggerNotification';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
              
                if (resultObj.responseStatus.responseCode === kkconst.success) {
                    deferred.resolve(notificationService.tmpNotificationList);
                 //   notificationService.tmpNotificationList = resultObj.value.data;
                  
                } else {
                    deferred.reject(resultObj.responseStatus);
                }
            };

            updateBadge($rootScope.badgeNumber > 0 ? $rootScope.badgeNumber - 1 : $rootScope.badgeNumber);
           
        
            invokeService.executeInvokePublicService(obj, _invokeOption);
            return deferred.promise;
        };


        this.notificationSendLogOut = function (params, callback) {
       
            var notificationService = this;
            var deferred    = $q.defer();
            var obj         = {};
                obj.params  = {};
               
                obj.actionCode = 'act_notification_logoff';
                obj.procedure = 'logOffNotification';
                obj.onSuccess = function (result) {
                                
                    var resultObj = result.responseJSON.result;
              
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        deferred.resolve("success");
                    } else {
                        deferred.reject(resultObj.responseStatus);
                    }
                };

                obj.onFailure = function (result) {
                    var resultObj = result.responseJSON.result;
                    deferred.reject(resultObj);
                
                };

                invokeService.executeInvokePublicService(obj, _invokeOption_hideLoader);
           
            return deferred.promise;
        };

        this.registerDeviceNotification = function (params, callback) {
       
            var notificationService = this;
            var deferred    = $q.defer();
            var obj         = {};
                obj.params  = {};
                obj.params.deviceId = udid;
                obj.params.platform = platformNoti;
                obj.params.token    = notificationService.registrationId;

                obj.actionCode = 'push_mobile_device_registration';
                obj.procedure = 'registerDeviceNotification';
                obj.onSuccess = function (result) {
                                
                    var resultObj = result.responseJSON.result;
              
                    if (resultObj.responseStatus.responseCode === kkconst.success) {
                        deferred.resolve("success");
                    //   notificationService.tmpNotificationList = resultObj.value.data;
                    } else {
                        deferred.reject(resultObj.responseStatus);
                    }
                };

                obj.onFailure = function (result) {
                    var resultObj = result.responseJSON.result;
                    deferred.reject(resultObj);
                
                };

                if(notificationService.registrationId !== ""){
                    invokeService.executeInvokePublicService(obj, _invokeOption_hideLoader);
                }
            return deferred.promise;
        };

        this.getBadgeMenuList = function () {
            return this.badgeMenuList;
        };

        this.setBadgeMenuList = function (badgeMenuList) {
            this.badgeMenuList = badgeMenuList;
        };

        this.setBadgeMenuCount = function (menuCode, badge) {
            for (var index = 0; index < this.badgeMenuList.length; index++) {
                var item = this.badgeMenuList[index];
                if (item.menuCode === menuCode) {
                    item.badge = badge;
                    break;
                }
            }
        };

        this.getBadgeMenuCount = function (menuCode) {
            var count = 0;
            for (var index = 0; index < this.badgeMenuList.length; index++) {
                var item = this.badgeMenuList[index];
                if (item.menuCode === menuCode) {
                    count = item.badge;
                    break;
                }
            }
            return count;
        };
        this.getBadgeMenuCountStr = function (menuCode) {
            var badgelist = this.getBadgeMenuList();
            if (!badgelist) {
                return '';
            }
            if (menuCode === 'RTP') {
                var sum = 0;
                for (var index = 0; index < badgelist.length; index++) {
                    var item = badgelist[index];
                    sum += item.badge;
                }
                if (sum == 0) {
                    return '';
                }
                return sum > 99 ? '99+' : sum;
            }
            var count = this.getBadgeMenuCount(menuCode);
            if (count == 0) {
                return '';
            }
            return count > 99 ? '99+' : count;
        };
    }); //End ServicePin