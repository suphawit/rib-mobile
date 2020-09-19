// // Uncomment the initialization options as required. For advanced initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center
//  var isCanAccess = true;
//  var wlInitOptions = {
// 	// # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
// 	//autoHideSplash: false,
//
// 	// # The callback function to invoke in case application fails to connect to MobileFirst Server
// 	//onConnectionFailure: function (){},
//
// 	// # MobileFirst Server connection timeout
// 	timeout: 150000,
//
// 	// # How often heartbeat request will be sent to MobileFirst Server
// 	heartBeatIntervalInSecs:  3 * 60,
//
// 	// # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest (JSONStore) on iOS or Android.
// 	//   Requires the FIPS 140-2 optional feature to be enabled also.
// 	//enableFIPS : false,
//
// 	// # The options of busy indicator used during application start up
// 	//busyOptions: {text: "Loading..."}
//
//
// 	 onErrorRemoteDisableDenial : function (message, downloadLink) {
// 		 if(message==="This device has been decommissioned") {
// 			 isCanAccess =false;
// 		 	// this device has been disabled
// 			 disableApp();
// 		 } else {
// 			 isCanAccess = false;
// 		 	// This app version has been disabled
// 			 if(downloadLink != null && downloadLink !== ""){
// 				 disableApp();
// 				 // WL.SimpleDialog.show(
// 					// 	 "New version available",
// 					// 	 message,
// 					// 	 [
// 					// 		{text: "Download new version", handler: function() {
// 					//
// 					// 		//  WL.App.openURL(downloadLink, "_blank",{});
// 					// 		window.open(downloadLink, '_system', 'location=no','hardwareback=no');
// 					// 		}
// 					// 		}
// 					// 	]
// 				 // );
// 				 navigator.notification.alert(
// 					 message,
// 					 function () {
// 						 window.open(downloadLink, '_system', 'location=no','hardwareback=no');
// 					 },
// 					 "New version available",
// 					 "Download new version"
// 				 );
// 			 }else{
//
// 				 disableApp();
// 			 }
// 		 }
// 	 }
// };
//  function wipeAppData() {
// 	 //do something
// 	}
// 	function disableApp() {
// 		// Make app unusable
// 		document.body.style.backgroundColor = "#c8cbd0";
//
// 		document.getElementById("indexPage").innerHTML =
//
// 	     '<div class="aligncenter ios-bar-maintain" style="text-align:center; font-size:16px">'
// 	     +'  <table style="width:100%; max-width:720px; height:100vh;text-align:center;border:0px; '
// 	     +'  margin-left:auto; margin-right:auto;" cellspacing="0" cellpadding="0">'
// 	     +'        <tr>'
// 	     +'            <td>'
// 	     +'                <table style="width:100%; height:100vh; text-align:center;border:0px;" cellspacing="0" cellpadding="0">'
// 	     +'                    <tbody>'
// 	     +'                        <tr>'
// 	     +'                            <td style="width:100%;  padding:10px; text-indent: 20px;  color: white;">'
// 	     +'                                <div style=" padding:10px; background-color: #0099c8;  text-align: left;">'
// 	     +'		ธนาคารขอแจ้งปิดระบบงาน เพื่อปรับปรุงระบบ KKP e-Banking ให้มีประสิทธิภาพมากยิ่งขึ้น มีผลทำให้ไม่สามารถเข้าใช้งานระบบได้ จึงขออภัยในความไม่สะดวกมา ณ โอกาสนี้'
// 	     +'                                     <br />'
// 	     +'						<div style ="margin:5px 0px 0px 0px; padding:0px;">ติดต่อสอบถามเพิ่มเติม KKP Contact Center 02 165 5555</div> 		'
// 	     +'                                </div>'
// 	     +'                                <div style=" padding:10px; background-color: #594F74;  text-align: left;">'
// 	     +'											We would like to announce that KKP e-Banking is temporary closed in order to improve the KKP e-Banking performance. We apologize for any inconvenience and appreciate your understanding. '
// 	     +'<br /><div style ="margin:5px 0px 0px 0px; padding:0px;">For more information, please contact KKP Contact Center 02 165 5555.</div>'
// 	     +'                                </div>'
// 	     +'									<div><img src="images/BrowserNotSupport.png" /></div>			'
// 	     +'                            </td>'
// 	     +'                        </tr>'
// 	     +'                    </tbody>'
// 	     +'                </table>'
// 	     +'            </td>'
// 	     +'        </tr>'
// 	     +'    </table>'
// 	     +'</div>';
//
// 		//window.location.href = "maintenance.html";
// 		document.addEventListener('backbutton', onBackKeyDown, false);
//
// 	}
//
// 	function onBackKeyDown(event) {
// 	    // Handle the back button
// 		// WL.App.close();
// 		navigator.app.exitApp();
// 	}
//
//
// 	document.addEventListener("resume", function()
// 		{
//
// 			if(isCanAccess === false){
//
// 				//WL.Client.login("wl_directUpdateRealm", {onSuccess:directSuccess, onFailure:directFail});
// 				// WL.Client.reloadApp();
// 				location.reload();
// 			}
//
// 		});
//
// 	function directSuccess(result){
// 		//do something
// 	}
// 	function directFail(result){
// 		//do something
// 	}
//
//
//
//
// if (window.addEventListener) {
// 	window.addEventListener('load', function() {
// 		//WL.Client.init(wlInitOptions);
// 	}, false);
// } else if (window.attachEvent) {
// 	window.attachEvent('onload',  function() {
// 		//  WL.Client.init(wlInitOptions);
// 	});
// } else {
// 	// do something
// }
