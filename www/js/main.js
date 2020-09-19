'use strict';
// function wlCommonInit(){
// 	/*
// 	 * Use of WL.Client.connect() API before any connectivity to a MobileFirst Server is required.
// 	 * This API should be called only once, before any other WL.Client methods that communicate with the MobileFirst Server.
// 	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
// 	 *
// 	 *    WL.Client.connect({
// 	 *    		onSuccess: onConnectSuccess,
// 	 *    		onFailure: onConnectFailure
// 	 *    });
// 	 *
// 	 */
//
// 	function closeLogger(status){
// 		var DEBUG = status;
// 		if(DEBUG){
// 		    if(!window.console) {
// 				window.console = {};
// 			}
// 		    var methods = ["log", "debug", "warn", "info","error"];
// 		    for(var i=0;i<methods.length;i++){
// 		    	console[methods[i]] = function(){
// 					//do something
// 				};
// 		    }
// 		}
//
// 	}
// 	closeLogger(false);
// 	angular.element(document).ready(function() {
// 		//     WL.Analytics.disable().then(function () {
// 		// 	      //Capture of analytics data is fully disabled.
// 		// 	    }).fail(function (errObj) {
// 		// 	        
// 		// 	    });
//
// 		// 	    WL.Logger.config({autoSendLogs: true
// 		// 	        ,enable:false
// 		// 	        ,level: 'error'});
//
// 		angular.bootstrap(document.body, ["kkapp"]);
// 			//var networkState = navigator.connection.type;
//
// 	});
// }

function closeLogger(status){
	var DEBUG = status;
	if(DEBUG){
		if(!window.console) {
			window.console = {};
		}
		var methods = ["log", "debug", "warn", "info","error"];
		for(var i=0;i<methods.length;i++){
			console[methods[i]] = function(){
				//do something
			};
		}
	}

}
closeLogger(true);
angular.element(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		angular.bootstrap(document.body, ["kkapp"]);
	}
});

if(navigator.platform === 'Win32' || navigator.platform === 'MacIntel'){
	var wlInitOptions = {
	'mfpContextRoot': '/mfp',
	'applicationId': 'com.kiatnakinbank.kkebankingweb.cbs'
	};
	// WL.Client.init(wlInitOptions);
}
