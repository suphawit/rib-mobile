angular.module('service.invokeService', []).service(
	'invokeService',
	function ($rootScope, $ionicLoading, $translate, $state, $ionicPopup, popupService, $filter, kkconst, mainSession, connectionService, whiteList, cordovaNetworkInfo, cordovadevice) {// NOSONAR
		return {
			executeInvokePublicService: function (obj) {
				var txnDate = $filter('date')(new Date(), kkconst.DATE_FORMAT_TXN);
				var referenceNo = txnDate + Math.floor((Math.random() * 998) + 1).pad(3);
				// var WLOpt = {};
				var serviceName = obj.actionCode;

				var hideloading = arguments[1] ? arguments[1].isHideLoader : false

				if(!hideloading){
					$ionicLoading.show({ template: kkconst.SPINNER, noBackdrop: true });
				}
				obj.params.header = {
					transactionDate: txnDate,
					transactionDateTime: moment(new Date(), moment.HTML5_FMT.DATETIME_LOCAL_MS),
					serviceName: serviceName,
					systemCode: 'RIB',
					referenceNo: referenceNo,
					channelID: 'RIBMobile'};

				// inject laguage
				obj.params.language = mainSession.lang;

				// Ignore case sensitive
				if (typeof obj.params.username !== 'undefined') {
					obj.params.username = angular.lowercase(obj.params.username);
				}		
				if(mainSession.loginDetailCAA.sessionToken !== undefined && mainSession.loginDetailCAA.sessionToken !== null){
					// WLOpt = {'scope' : 'UserLoginCBS'};
				}
				//obj.params.token = 'tokens';
				obj.params.tokenID = '';
				obj.params.cisID = '';
				obj.params.clientIP = kkconst.DEVICE_IP;
				var newParams = obj.params;
			//	alert(kkconst.mainAdapter)
				var invokeAdapter = arguments[1] ? arguments[1].adapter : kkconst.mainAdapter;
				var urlRequest = '/'+invokeAdapter+'/'+obj.actionCode;
				if (cordovadevice.properties('platform') === 'preview') {
					connectionService.webRequest(obj,urlRequest,newParams);
				} else {
					connectionService.check();//check wifi or 3G
					if(obj.actionCode == 'getDateTime') {
						connectionService.getCurrentTimeFromServer(obj);
					}else {
						connectionService.pinTrustedCert(obj,urlRequest,newParams);
					}
				}
			}
		};
	});
