angular.module('ctrl.main',['service.common','ngIdle'])
.controller('MainCtrl', function($scope, $sce,$ionicSideMenuDelegate,invokeService, $translate,mainSession,deviceService,$state,// NOSONAR
		$timeout,$rootScope,$ionicModal,$ionicPopup,pinService,
		$ionicScrollDelegate,$ionicHistory,Idle, popupService, fundTransferFROMService, 
		fundtransferService, $q, kkconst, connectionService, statusBarService, $window, 
		$ionicLoading, $filter, webStorage,cordovadevice, notificationService,notificationSetDetailService, subscriptionService,
		challengeService) {

	$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams){ 
				if(toState.name === kkconst.ROUNTING.MENU.STATE){
					statusBarService.lightContent(false);
					
					// remove modal view ui and popup when route to menu page.
					// hide backdrop
					window.jQuery('ion-modal-view').remove();
					if(typeof popupService.savedPopup.close === 'function'){
						popupService.savedPopup.close();
					}
				}else{
					statusBarService.lightContent(true);
				}
			});
	//todo fix direct update
	// if (cordovadevice.properties("platform") !== "preview") {
		
	//   //Custom direct update
	//   wl_directUpdateChallengeHandler.handleDirectUpdate = function(directUpdateData,
	// 		  directUpdateContext) {//
	// 		      // custom WL.SimpleDialog for Direct Update
		  		
	// 		      var customDialogTitle = $filter('translate')('directupdate.dialog.title');
	// 		      var fileSize = 0;
	// 		      if(directUpdateData.downloadSize !== null && directUpdateData.downloadSize !== undefined){
	// 		    	  fileSize = parseFloat((directUpdateData.downloadSize/1024)/1024).toFixed(2);
	// 		      }
	// 		      var customDialogMessage = $filter('translate')('directupdate.dialog.detail') + " ("+fileSize+"MB)";
	// 		      var updateBtn = $filter('translate')('directupdate.dialog.updateBtn');
	// 		      WL.SimpleDialog.show(customDialogTitle, customDialogMessage,
	// 		          [{
	// 		              text : updateBtn,
	// 		              handler : function() {
	// 		                  directUpdateContext.start();
	// 		              }
	// 		          }
	// 		          ]
	// 		      );
	// 		  };
	// }

	$scope.passcode = '';
	$scope.starcode = '';
	$scope.isCAAToken = false;
	$scope.showTab = true;

	/** Setting Langauge**/
	$scope.langLabel = 'EN';
	$scope.lang = webStorage.getLocalStorage('language').code || 'th';
	$scope.userNamePlaceholder = '';
	$scope.passwordPlaceholder = '';
	//set default lang
	$scope.setlang = { checked: true };
	mainSession.lang = $scope.lang;// set default
	$translate.use(mainSession.lang);

	$scope.appVersion = mainSession.appVersion;
	
	$scope.$on('user-token', function(event, args) {
		var value = args.value;
		$scope.isCAAToken = value;

	});
	$scope.isPin = false;
	$scope.isCreatePage = false;

	var deviceUUID = "";
	
	mainSession.lastConnection = "";
	/*function to initialize the device ID, sets the value in mainSession service*/


	// $scope.initDeviceInfo = function() {
	//
	// 	/*$q synchronizes the function call*/
	// 	return $q(function(resolve, reject) {
	// 		var options = {
	// 			onSuccess: function(data){
	// 				// 	alert(JSON.stringify("data.deviceID="+data.deviceID))
	// 				mainSession.deviceUUID = data.deviceID;
	// 				resolve('success');
	// 			},
	// 			onFailure: function(data){
	//
	// 				reject('failure');
	// 			}
	// 		};
	//
	// 		/*WL.Device.getID is not supported on the web browsers
	// 		 * and to enable the testing and development, the error has been
	// 		 * handled and allows the use of hard-coded deviceUUID*/
	// 		// try{
	// 		// 	WL.Device.getID(options);
	// 		// } catch (e) {
	// 		// 	reject('WL.Device.getID not supported for this platform');
	// 		// }
	// 	});
	//
	// };
	
	$scope.createDeviceInfo = function() {
		/*WL.Device.getID is not supported on the web browsers
		 * and to enable the testing and development, the error has been
		 * handled and allows the use of hard-coded deviceUUID*/
			
			if (cordovadevice.properties("platform") !== "preview") {
					window.plugins.uniqueDeviceID.get(function(udid){
						var platform = cordovadevice.properties("platform");
						
						notificationService.init(udid,platform);
						//map UUID to device name in mobiblefirst console
						// WL.Client.getDeviceDisplayName({
						// 	onSuccess:function(res){
						// 		if(res === null){
						// 			WL.Client.setDeviceDisplayName(udid);
						// 		}
						// 	},onFailure:function(){
						//
						// 	}});
						document.addEventListener("deviceready", function () {
							mainSession.deviceUUID = udid;
							mainSession.createDeviceInfo();
							deviceUUID = mainSession.deviceUUID;
							checkDevice(deviceUUID);
						}, false);
						
				},function(){
					//do something
				});
		
		
			}else{
				deviceUUID = mainSession.deviceUUID;
	    		 
	    		mainSession.createDeviceInfo();
	    		checkDevice(deviceUUID);
			}
		
	};
	
	$scope.templates =
		[ { state: 'Login', url: 'templates/login-template.html'},
		  { state: 'Pin', url: 'templates/Pin/pin-template.html'},
		  { state: 'Illegal', url: 'templates/illegal-template.html'} ];

	$scope.template = '';
	$scope.pinState = '';
	$scope.suptitlePin = '';
	
	$scope.errorPinMessageEnable = false;
	$scope.errorPinMessage = '';

	$scope.stateGo = function(page,act){ 
		$scope.passcode = '';
		$scope.starcode = '';
		$scope.isPinErr = false;
		$scope.pinState =act;
		$scope.title = '';
		if (deviceService.isIllegal === kkconst.IS_ILLEGAL_TRUE) {
			$scope.template = $scope.templates[2];
		}else if(page === 'pin'){
			$scope.isPin = true;
			$scope.showTab = false;
			$scope.template = $scope.templates[1];
			$scope.templates[1].state=act;
			$scope.pinStarCss = '';
			$scope.pinButtonCss = '';
			if($scope.pinState === 'login'){
				$scope.showTab = true;
				$scope.title = 'header.loginPage';
				$scope.suptitlePin = 'label.enterPIN';
				$scope.pinStarCss = 'margin: 20px auto;width:95%';
				$scope.pinButtonCss = 'width:80%;margin:auto;';
				$scope.isCreatePage = false;
			} else if($scope.pinState === 'reset'){
				$scope.title = 'header.resetPIN';
				$scope.suptitlePin = 'input.setNewPIN';
				$scope.isCreatePage = true;
			} else if($scope.pinState === 'create'){
				$scope.title = 'header.createPIN';
				$scope.suptitlePin = 'label.createPIN';
				$scope.isCreatePage = true;
			} else if($scope.pinState === 'change'){
				$scope.title = 'header.changePIN';
			} else if($scope.pinState === 'createnew'){
				$scope.title = 'Create New Pin';
			} else {
				$scope.title = '';
				
				$scope.suptitlePin = '';
			}
		} else {
			$scope.isPin = false;
			$scope.showTab = true;
			$scope.template = $scope.templates[0];
			$scope.templates[0].state=act;
		}
	};

	//add check device is root/ jail here
	if (cordovadevice.properties("platform") !== "preview") {
		$scope.appVersion = AppVersion.version;
		mainSession.appVersion = AppVersion.version;
		IRoot.isRooted(function (result) {
				if (result) {
					deviceService.setIllegalDevice(kkconst.IS_ILLEGAL_TRUE);
					popupService.showErrorPopupMessage('label.warning', 'label.messageIllegalRootJail');
					$scope.stateGo(kkconst.page.illegal,kkconst.pin.illegal);
				}else {
					$scope.createDeviceInfo();
				}
			},
			function (error) {
				$scope.createDeviceInfo();
			});
		// $scope.createDeviceInfo();
	}else {
		$scope.createDeviceInfo();
	}
	
	$scope.stateShowPin = function(isPin){
		if(isPin){
			$scope.template = $scope.templates[1];
		}else{
			$scope.template = $scope.templates[0];
		}
	};

	$scope.isOverflowScroll = true;
	$scope.isShowBack = false;
	$scope.modalAnimate = 'none';
	$scope.onTouchEnd = true;
	
	if(mainSession.deviceOS === 'iOS'){
		$scope.isOverflowScroll = false;
		$scope.modalAnimate = 'slide-in-up';
		$scope.onTouchEnd = true;
	}else{
		$scope.isOverflowScroll = true;
		$scope.modalAnimate = 'none';
		$scope.onTouchEnd = false;
	}
	
	function checkDevice(deviceId){

		deviceService.checkDeviceUUID(deviceId,	function(response) {

			//deviceUUID found in database
			var respStatus = response.responseJSON.result.responseStatus;
			var respValue = response.responseJSON.result.value;

			if(respStatus.responseCode === kkconst.success) {
				//TODO some how get lang?
				// var language = resultcCheckDeviceUUID.responseJSON.result.value.language;
				var language = mainSession.lang;
				console.log(language);
				if(language != undefined || language != null) {
					mainSession.lang = language;
					$scope.lang = language;
				} 
				
				if(mainSession.lang == undefined || mainSession.lang == null){
					setFontQuark();
					$scope.langLabel = kkconst.LANGUAGE_EN;
					mainSession.lang = kkconst.LANGUAGE_th;
					$scope.lang = kkconst.LANGUAGE_th;
					console.log("testestestset1 = " + mainSession.lang);
				} else {
					if(mainSession.lang.toLowerCase() === kkconst.LANGUAGE_en){
						setFontClanOt();
						$scope.langLabel = kkconst.LANGUAGE_TH;
						mainSession.lang = kkconst.LANGUAGE_en;
						$scope.lang = kkconst.LANGUAGE_en;
						console.log("testestestset2 = " + mainSession.lang);
					}else{
						$scope.langLabel = kkconst.LANGUAGE_EN;
						mainSession.lang = kkconst.LANGUAGE_th;
						$scope.lang = kkconst.LANGUAGE_th;
						setFontQuark();
						console.log("testestestset3 = " + mainSession.lang);
					}
				}
				if (respValue.deviceStatus == true) {
					if(respValue.pin){
						$scope.isShowBack = true;

						$scope.stateGo(kkconst.page.pin,kkconst.pin.login);
						
						$scope.checkBioState();
					} else {
						$scope.isShowBack = false;
						// $scope.stateGo(kkconst.page.login,kkconst.login.normal);
						$state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);// NewCBS
					}				
					// add language
					webStorage.setLocalStorage('language', { code: mainSession.lang });
				} else {
					$scope.isShowBack = false;
					// $scope.stateGo(kkconst.page.login,kkconst.login.normal);
					$state.go(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE);// NewCBS
				}// end else
				$translate.use(mainSession.lang);
				$scope.userNamePlaceholder = window.translationsLabel[mainSession.lang]['input.username'];
				$scope.passwordPlaceholder = window.translationsLabel[mainSession.lang]['input.password'];
				connectionService.isCheckDevice = true;
				connectionService.check();
			
			}else{
				popupService.errorPopMsgCB('lable.error',respStatus.responseCode,function(ok){
					if(ok){
						// WL.Client.reloadApp();
						// location.reload();
						window.location = window.location.href.replace(/#.*/, '');
					}
				});
			}
		});
		
	}
	
	$scope.fonts = [
                    { face: "Quark-normal !important", size:"20px !important" },
                    { face: "Quark-bold !important;", size:"20px !important" },
                    { face: "ClanOt-narrowMedium !important", size:"16px !important" },
                    { face: "ClanOT-narrowThin !important", size:"16px !important" },
                    { face: "ClanOt-narrowBlack !important", size:"16px !important" },
                    { face: "ClanOt-narrownews !important", size:"16px !important" }
                
                ];
    $scope.font = $scope.fonts[1];//Quark-bold
    $scope.fontLeftMenu = $scope.fonts[0];//Quark-normal
    $scope.fontHeader = 'font-quark-header';//Quark-bold
    $scope.fontContent = 'font-quark-content';//Quark-bold
    $scope.fontMenuHeader = 'font-quark-menu-header';
    $scope.fontMenuLeft = 'font-quark-menu-left';//Quark-bold
    $scope.fontLabel = 'font-quark-label';
    $scope.fontLabelSmall = 'font-quark-label-small';
    $scope.fontLabelMedium = 'font-quark-label-medium';
    $scope.fontPinBtn = 'font-quark-pin-btn';
    $scope.fontTabMenu = 'font-quark-tab-menu-small';
    $scope.fontDisplay = 'font-quark-label-display';
    $scope.fontMain = "font-quark-light";
    function setFontQuark(){
    	$scope.font = $scope.fonts[1];//Quark-bold
		$scope.fontLeftMenu = $scope.fonts[0];//Quark-normal
		$scope.fontHeader = 'font-quark-header';//Quark-bold
		$scope.fontContent = 'font-quark-content';
		$scope.fontMenuLeft = 'font-quark-menu-left';
		$scope.fontLabel = 'font-quark-label';
		$scope.fontLabelSmall = 'font-quark-label-small';
		$scope.fontMenuHeader = 'font-quark-menu-header';
		$scope.fontPinBtn = 'font-quark-pin-btn';
		$scope.fontLabelMedium = 'font-quark-label-medium';
		$scope.fontTabMenu = 'font-quark-tab-menu-small';
		$scope.fontDisplay = 'font-quark-label-display';
		$scope.fontMain = "font-quark-light";
    }
    function setFontClanOt(){
    	$scope.font = $scope.fonts[2];//ClanOt-narrowMedium
		$scope.fontLeftMenu = $scope.fonts[5];//ClanOt-narrownews
		$scope.fontHeader = 'font-clanOt-header';
		$scope.fontContent = 'font-clanOt-medium-content';//Quark-bold
		$scope.fontMenuLeft = 'font-clanOt-medium-menu-left';
		$scope.fontLabel = 'font-clanOt-label';
		$scope.fontLabelSmall = 'font-clanOt-label-small';
		$scope.fontMenuHeader = 'font-clanOt-menu-header';
		$scope.fontPinBtn = 'font-clanOt-pin-btn';
		$scope.fontLabelMedium = 'font-quark-label-medium';
		$scope.fontTabMenu = 'font-clanOt-tab-menu-small';
		$scope.fontDisplay = 'font-clanOt-label-display';
		$scope.fontMain = "font-clanOt-news";
    }
    
    var changeLabelLanguage = function(lang){

		if(lang === kkconst.LANGUAGE_en){
			$scope.langLabel = kkconst.LANGUAGE_EN;
			mainSession.lang = kkconst.LANGUAGE_th;
			$scope.lang = kkconst.LANGUAGE_th
			setFontQuark();
		} else{
			$scope.langLabel = kkconst.LANGUAGE_TH;
			mainSession.lang = kkconst.LANGUAGE_en;
			$scope.lang = kkconst.LANGUAGE_en;
			setFontClanOt();
		}
		$scope.userNamePlaceholder = window.translationsLabel[mainSession.lang]['input.username'];
		$scope.passwordPlaceholder = window.translationsLabel[mainSession.lang]['input.password'];
		$translate.use(mainSession.lang);

    	// if(lang === kkconst.LANGUAGE_en){
		// 	$scope.langLabel = kkconst.LANGUAGE_TH;
		// 	$scope.lang = kkconst.LANGUAGE_th;
		// 	setFontClanOt();
		// }else{
		// 	$scope.langLabel = kkconst.LANGUAGE_EN;
		// 	$scope.lang = kkconst.LANGUAGE_en;
		// 	setFontQuark();
		// }
		// mainSession.lang = lang;
		// $scope.userNamePlaceholder = window.translationsLabel[lang]['input.username'];
		// $scope.passwordPlaceholder = window.translationsLabel[lang]['input.password'];
		// $translate.use(lang);
		// call Login data from menuCtrl
		if($rootScope.changeLoginDataLang !== undefined){
			$rootScope.changeLoginDataLang();
		}
		
    };
	$scope.ChangeLanguage = function(lang){
		changeLabelLanguage(lang);
		if($ionicHistory.currentView().stateId !== kkconst.ROUNTING.MENU.STATE 
		&& $ionicHistory.currentView().stateId !==kkconst.ROUNTING.SETTING_MAIN_MENU.STATE 
		&& $ionicHistory.currentView().stateId !==kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE){
			deviceService.changeLanguage(lang,function(responseCodeChangeLanguage) {
		    	 if(responseCodeChangeLanguage === kkconst.success) {
		    		//Load Banks list -- when language
		 			fundtransferService.inquiryBankInfo(function(responseCode,resultObj){
		 				 if(responseCode === kkconst.success){
		 					 fundtransferService.bankList = resultObj;
		 					 
		 					//  changeLabelLanguage(lang);
		 				 }else{
		 					 popupService.showErrorPopupMessage('alert.title',responseCode);
		 				 }
		 			 });
				 }else{
					 popupService.showErrorPopupMessage('alert.title',responseCodeChangeLanguage);
		    		 return;
				 }
			});
			//  changeLabelLanguage(lang);
			
		}else{
			// changeLabelLanguage(lang);
		}
		
		// add language
		webStorage.setLocalStorage('language', { code: mainSession.lang });
	};
	
	$scope.setStepPintitle = function(label){
		$scope.suptitlePin = label;
		$translate.use(mainSession.lang);
	};

	$scope.dotpins = [];
	
	var maxPin = 6;
	
	$scope.init = function() {
		$scope.passcode = "";
		$scope.starcode = "";
		
		for(var i=0;i< maxPin;i++){
			$scope.dotpins[i] = 'circle-color-white';
		}

		// check biometric
		$scope.setIsShowBioBtn();
	};
	
	var _paintPin = function(cssColor){		
		for(var i=0;i< maxPin;i++){ 
			if($scope.passcode.length === i){ 
				$scope.dotpins[i] = cssColor; 
			}
		}
	};
	
	$scope.add = function(value) {
		_paintPin('circle-color-black');
		
		$scope.errorPinMessageEnable = false;
		$scope.errorPinMessage = '';
		if($scope.passcode.length < maxPin) {
			
			$scope.passcode = $scope.passcode + value;
			$scope.starcode = $scope.starcode + "*";
			if($scope.passcode.length === maxPin) {
				$rootScope.$broadcast('pin-code', { value: $scope.passcode });
				$timeout(function() {
					$scope.init();
				}, 800);
			}
		}else{
			$timeout(function() {
				//do something
			}, 500);
		}

		$scope.setIsShowBioBtn(false);
	};

	$scope.del = function() {		
		$scope.dotpins[$scope.passcode.length-1] = 'circle-color-white';
		if($scope.passcode.length > 0) {
			$scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
			$scope.starcode = $scope.starcode.substring(0, $scope.starcode.length - 1);
		}
		
		if($scope.passcode.length == 0) {
			$timeout(function() {
				$scope.setIsShowBioBtn();
			}, 50);
		}
	};
	 
	$scope.logout = function(){
 		popupService.showConfirmPopupMessageCallback('label.confirm','button.logout',function(ok){
			if(ok){
				$state.go(kkconst.ROUNTING.MENU.STATE);
				$scope.isCAAToken = false;
				$scope.setIsShowBioBtn(false);
				checkDevice(deviceUUID);
				
				$scope.closeSettingModal();				
				// loginChallengeHandler.logout();
				subscriptionService.logout();
			}
		});
	};

	$scope.contactUS = function() {		 
		var obj = {}; 
		obj.params = {}; 
		obj.params.language = $scope.lang;
		obj.params.actionCode = 'contact_us';
		obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
		obj.procedure = 'getContactUsProcedure';

		//on success navigate to manage own screen with list of accounts.
		obj.onSuccess = function(result) {
			
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success){

			}

		};
		obj.onFailure = function(result) {
			$scope.results = result.responseJSON.result;
		};
		//invokeService.executeInvokePublicService(obj);
		invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});

		$state.go(kkconst.ROUNTING.CONTACTUS.STATE);
	};
	
	$scope.verifyResetPin = function(){

		pinService.obj.state = 'change-pin';
		$scope.changePasscode = "";
    	$scope.changeStarcode = "";
		 $state.go(kkconst.ROUNTING.CHANGE_PIN.STATE);
	}; 

	$scope.backToPINPage = function() {
		$state.go(kkconst.ROUNTING.MENU.STATE);		
	};
	
	$scope.showPromotions = function() {
		var obj = {}; 
		obj.params = {}; 
		obj.params.language = $scope.lang;
		obj.params.actionCode = 'promotion';
		obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
		obj.procedure = 'getPromotionProcedure';
		
		obj.onSuccess = function(result) {
			
			if(result.responseJSON.result.responseStatus.responseCode === kkconst.success){
				var promotionUrl = $sce.trustAsResourceUrl(result.responseJSON.result.value.data);
				window.open(promotionUrl, '_blank','shouldPauseOnSuspend=yes,location=no,hardwareback=no');
			}else{
				popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.errorMessage);
			}

		};
		obj.onFailure = function(result) {
			popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.errorMessage);
		};

		//invokeService.executeInvokePublicService(obj);
		invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	};

	//History
	$scope.historyFundtransfer ={ state: 'historyFundtransfer', url: 'templates/History/historyFundtransfer.html'};
	$scope.historyBillpayment ={ state: 'historyBillpayment', url: 'templates/History/historyBillpayment.html'};
	$scope.historyFundShow = true;
	
	$scope.changeHistoryTabShow = function (tab_name) {
		if(tab_name === 'historyFundtransfer'){
			$scope.historyFundShow = true;
		} else {
			$scope.historyFundShow = false;
		}
	};
	
	//Schedule
	$scope.scheduleBill ={ state: 'scheduleBill', url: 'templates/Schedule/schedule-billpayment.html'};
	$scope.scheduleFundtransfer ={ state: 'scheduleFundtransfer', url: 'templates/Schedule/schedule-fundtransfer.html'};
	$scope.scheduleFundShow = true;
	
	$scope.changeScheduleTabShow = function (tab_name) {
		if(tab_name === 'scheduleFundtransfer'){
			$scope.scheduleFundShow = true;
		} else {
			$scope.scheduleFundShow = false;
		}
	};
	
	$scope.gotoTransferScreen = function() {
		if($scope.scheduleFundShow) {
			fundTransferFROMService.clear();
			$state.go('app.fundTransferOtherAccounts');
		}else{
			$state.go('app.billPayment');
		}
	};
 
	$scope.toggleRightMenu = function(){     
	    $ionicSideMenuDelegate.toggleRight();
	};
	
	/* DashBoardMenu Items */
	$scope.toggleLeftMenu = function(){     
	    $ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.transactionHistory = function() {
		$state.go('app.transactionHistory');
	};

	$rootScope.badgeNumber = "0";
	$scope.gotoNotificationMenu = function() {
		$state.go('app.notification');
	};
	  	    	  
	//Setting Modal
	$ionicModal.fromTemplateUrl('templates/setting.html', {
		scope: $scope,
		animation: 'slide-in-right'
	}).then(function(modal) {
		$scope.settingModal = modal;
	});
	
	$scope.openSettingModal = function() {
		$scope.settingModal.show();
	};
	
	$scope.closeSettingModal = function() {
		$scope.settingModal.hide();
	};
	$scope.active = 'yes';
	$scope.setActive = function(type) {
		$scope.active = type;
	};
	
	$scope.isActive = function(type) {
		return type === $scope.active;
	};
	
	$scope.goToPreviousPage = function() {
	  var prevView = $ionicHistory.backView().stateId || "app.myAccount";
      $state.go( prevView );
	};
	
	$scope.showNotificationPanel = function() {
		 $scope.notificationModal.show(); 	 
	}; 
	  
	$ionicModal.fromTemplateUrl('templates/notificationModal.html', {
			scope: $scope,
		    viewType: 'bottom-sheet',
		    animation: 'animated slideInDown' 
		   
		  }).then(function(modal) {
		    $scope.notificationModal = modal;
	 });
		 
	 $scope.closeNotificationModal = function() {
		  $scope.notificationModal.hide();
		    
	 };
	  
	 $scope.showHideAllTab = function() {
		 if (screen.width >= 768) {
		     return "ng-hide";
		    } else {
		     return "ng-show";
		  }
	 };
	  
	 $scope.shouldHideAndDragSideMenu = function () {
	      if ($state.current.name === kkconst.ROUNTING.CONTACTUS.STATE || $state.current.name === 'app.locateUs' || $state.current.name === 'app.promotions' || $state.current.name === 'app.faq') {      
	    	  $ionicSideMenuDelegate.canDragContent(false);
	          return true;
	      }else{
	    	  $ionicSideMenuDelegate.canDragContent(true);
	    	  return false; 
	      }          
	 };
	  
	 //ng-idle  
	 $scope.$on('IdleStart', function() {
	      // the user appears to have gone idle
	 });
	 
	 $scope.$on('IdleWarn', function(e, countdown) {
		 //do something
	 });

	 $scope.$on('IdleTimeout', function() {		
	      // the user has timed out (meaning idleDuration + timeout has passed without any activity)
	      // this is where you'd log them out
		  var isInsidePages = $.inArray( $state.current.name , [kkconst.ROUNTING.CONTACTUS.STATE,'app.faq','app.promotions','app.locateUs'] );
		  if( isInsidePages < 0 ){		   
			popupService.showErrorPopupMessage('label.sessionexpired','label.loggedoutMessage');  	
			
			
			$scope.setIsShowBioBtn(false);
			checkDevice(deviceUUID);
			// loginChallengeHandler.logout();
			subscriptionService.logout();
		 }
	 });
	  
	 /* The user has come back from AFK and is doing stuff. 
	 * if you are warning them, you can use this to hide the dialog   */
	 $scope.$on('IdleEnd', function() {
		 //do something
	 });

	  $scope.$on('IdleEnd', function() {
	      // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
	  });

	  $scope.$on('Keepalive', function() {
	      // do something to keep the user's session alive
	  });
	 
//	  
	  $scope.initIdleStateChecker = function(){
//		  alert("start")
		 var isInsidePages = $.inArray( $state.current.name , ['app.contactUs','app.faq','app.promotions','app.locateUs'] );
		 if( isInsidePages < 0 ){
		   Idle.watch();			
		  }
	  };
	  
	  $scope.gotoFund = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.FUNDTRANSFER.STATE);
		  });
	  };
	  
	  $scope.gotoOtherAccount = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.OTHER_ACCOUNT.STATE);
		  });
	  };
	  
	  $scope.otherGotoFund = function() {
		  if ($scope.scheduleFundShow === true) {
			$ionicHistory.clearCache().then(function () {
				$state.go(kkconst.ROUNTING.FUNDTRANSFER.STATE);
			});
		  } else if ($scope.scheduleFundShow === false) {
			$ionicHistory.clearCache().then(function () {
				$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
			});
		  } else {
			//do something
		  } 
	  };


	  $scope.gotoBillRTP = function() {
		   $ionicHistory.clearCache().then(function () {
			 $state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
		  });
	  };

	  $scope.gotoEDonation = function() {
		   $ionicHistory.clearCache().then(function () {
			 $state.go(kkconst.ROUNTING.BILL_E_DONATION.STATE);
		  });
	  };
	  
	  $scope.gotoAnyID = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.ANYID.STATE);
		  });
	  };

	  $scope.gotoQRScanner = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.QR_CODE_SCANNER.STATE);
		  });
	  };
	  $scope.gotoQRGenerator = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.QR_CODE_GENERATOR.STATE);
		  });
	  };
	   $scope.gotoMyKKPromptPayPage = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.MY_ANYID_ACCOUNT.STATE);
		  });
	  };

	   $scope.gotoVerifyQRBillPaymentDetailPage = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.QR_VERIFY_BILL_PAYMENT_DETAIL.STATE);
		  });
	  };

	   $scope.gotoVerifyQRFundTransferDetailPage = function() {
		  $ionicHistory.clearCache().then(function () {
			  $state.go(kkconst.ROUNTING.QR_VERIFY_FUND_TRANSFER_DETAIL.STATE);
		  });
	  };

		$scope.gotoNDIDAuthenPage = function() {
			$ionicHistory.clearCache().then(function () {
				$state.go(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE);
			});
		};
		$scope.gotoNCBPage = function() {
			$ionicHistory.clearCache().then(function () {
				$state.go(kkconst.ROUNTING.LIST_CREDIT_BUREAU.STATE);
			});
		};

	  $scope.goBackPage = function(){
		 $ionicHistory.goBack(-1);
	  };
	 $scope.showTab = true;
	 $scope.focusToHideTab = function(isFocus){
		 if(mainSession.deviceOS === 'Android' && isFocus){
			 $scope.showTab = false;
		 }else{
			 $scope.showTab = true;
		 }
	 };
	 function directSuccess(result){
		 //do something
	 }
	 function directFail(result){
		 //do something
	 }
	 // Resume events
	 


	 $scope.$on('bg-noti', function(event, value) {
	
		//alert(JSON.stringify(value.value));
		if(mainSession.loginDetailCAA.sessionToken !== undefined && mainSession.loginDetailCAA.sessionToken !== null){
			var isBgData = notificationService.chkBackgroundData();
	
			if(isBgData != false){
				notificationSetDetailService.setBgDataDetail(isBgData).then(function (resp) {
					//deviceUUID found in database
					notificationService.clearBackgroundData();
					$state.go(resp);
				}, function (error) {
					popupService.showErrorPopupMessage('lable.error', error.errorMessage);
				});





			//	$state.go(isBgData);
			}
		}
				//var responseCode = value;
	
	});

	document.addEventListener('resume', function() {
		const outsideDashboardPages = 
		[
			kkconst.ROUNTING.MENU.STATE,
			kkconst.ROUNTING.LOCATEUS.STATE,
			kkconst.ROUNTING.CONTACTUS.STATE,
			kkconst.ROUNTING.FAQ.STATE,
			kkconst.ROUNTING.SETTING_MAIN_MENU.STATE,
			kkconst.ROUNTING.PRIVACYPOLICY.STATE,
			kkconst.ROUNTING.RESET_PIN_PORTAL.STATE,
			kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.STATE,
			kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.STATE,
			kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP1.STATE,
			kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.STATE,
		];
		
		var isOutsideDashboard = $.inArray($state.current.name, outsideDashboardPages) != -1;
		console.log("$state.current.name: " + $state.current.name);
		console.log("isOutsideDashboard: " + isOutsideDashboard);

		// Check bio state when the page is outside dashboard (login pin page).
		if(isOutsideDashboard) {
			$scope.checkBioState();
		}

		//check current is logged in

		//   WL.Client.login("wl_directUpdateRealm", {onSuccess:directSuccess, onFailure:directFail});
		connectionService.isCheckDevice = true;
		console.log("resume");
		// connectionService.check();
		
	}, false);
     
     $scope.style = {
    		 loginTemplateHeight: { 'height': ($window.innerHeight - 183) + 'px' },
    		 tab: { 'position': 'static' }
     };

	 $scope.buildNumber = '';
	 var getBuildNumber = function(){
		mainSession.getConfig(function(values){
			var tmpSrvendpoint = values.srvendpoint;
			if(tmpSrvendpoint && (tmpSrvendpoint.indexOf(kkconst.PREFIX_SIT_URL) > -1 || tmpSrvendpoint.indexOf(kkconst.PREFIX_UAT_URL) > -1)) {
				$scope.buildNumber = '('+kkconst.BUILD_NUM+')';
			}
		});
	 };

	 getBuildNumber();

	$scope.isShowBioBtn = false;
	$scope.isBioStateChanged = false;
	$scope.showBiometricAuthen = function() {
		$timeout(function() {
			$scope.$broadcast('biometric-action');
		}, 50);
	};

	$scope.setIsShowBioBtn = function(value) {
		if(value === undefined) {
			deviceService.checkLoginSetting().then(function(isBiometric) {
				console.log("State: " + $scope.isBioStateChanged);
				if(isBiometric && $scope.isBioStateChanged === false){
					$scope.isShowBioBtn = true;
				} else {
					$scope.isShowBioBtn = false;
				}
			});
		} else {
			$scope.isShowBioBtn = value;
		}
	};

	// Check bio state and update login label
	$scope.setIsBioStateChanged = function(value) {
		console.log("VALUE: " + value);
		if(value === undefined) {
			deviceService.isBioStateChanged().then(function(isStateChanged) {
				console.log("isStateChanged: " + isStateChanged);
				$scope.isBioStateChanged = isStateChanged;
				$scope.checkLoginLabel();
			});
		} else {
			$scope.isBioStateChanged = value;
			$scope.checkLoginLabel();
		}
	};

	$scope.checkLoginLabel = function() {
		if($scope.isBioStateChanged === true) {
			if(mainSession.deviceOS === 'iOS') {
				var bioLabel = mainSession.biometricType === 'faceID' ? 'label.verifyFaceID' : 'label.verifyTouchID';
				$scope.setStepPintitle(bioLabel);
			} else {
				$scope.setStepPintitle('label.verifyFingerprint');
			}
		} else {
			$scope.setStepPintitle('label.enterPIN');
		}
		console.log("LABEL: " + $scope.suptitlePin);
	};

	$scope.setBioIcon = function() {
		var returnValue = 'icon-fingerprint';

		if(mainSession.biometricType && mainSession.biometricType == 'faceID') {
			returnValue = 'icon-face-id_2';
		}

		return returnValue;
	};

	$scope.checkBioState = function() {
		deviceService.checkLoginSetting().then(function(isBiometric) {
			console.log("isBiometric: " + isBiometric);
			if(isBiometric){
				$scope.setIsBioStateChanged();
			} else {
				$scope.setIsBioStateChanged(false);
			}

			$scope.setIsShowBioBtn();
		});
	};

}).config(function(IdleProvider, KeepaliveProvider) {
	
    // configure Idle settings
	IdleProvider.idle(window.globalConstant.IdleTime.idle); // in seconds 14 minute
	IdleProvider.timeout(window.globalConstant.IdleTime.timeout); // in seconds count after idle
	KeepaliveProvider.interval(window.globalConstant.IdleTime.interval); // in 6 seconds
 
});
