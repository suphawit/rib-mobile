angular.module('ctrl.loginSetting', [])
  .controller('LoginSettingCtrl', function ($scope, $translate, $sce, webStorage, invokeService, mainSession, popupService,$timeout,kkconst, $ionicPopup, deviceService,pinService,$ionicModal,subscriptionService) {


      $scope.checkOS = '';
      $scope.suptitlePin = '';
      if (mainSession.deviceOS === 'iOS') {

        if( mainSession.biometricType === 'faceID') {
          $scope.checkOS ="item.useFace";
          $scope.suptitlePin ="label.pinFace";
        }else  if( mainSession.biometricType === 'touchID'){
            $scope.checkOS = "item.useTouch";
            $scope.suptitlePin = "label.pinTouch";
        }
       
      } else {
        $scope.checkOS = "item.useFingerprint";
        $scope.suptitlePin = "label.pinFingerprint";
      }

      var isBiometric;

      $scope.turnClearAppData = {
        checked: false
      };

      	// pin confirm
    	$scope.dotpins = [];

    	var maxPin = 6;

      function logout(){
        // loginChallengeHandler.logout();
        subscriptionService.logout();
        // location.reload();

        window.location = window.location.href.replace(/#.*/, '');
        // WL.Client.reloadApp();
      }

    
    	$scope.$on('pin-code', function(event, args) {
    		var pin = args.value;
    		$scope.actionPin = '';
        console.log("$broadcast('pin-code') value", pin)
        pinService.verifyPin(pin, function (response) {
          if(response.result.responseStatus.responseCode === kkconst.success){
            webStorage.setLocalStorage("isBiometric",true);
            $scope.turnClearAppData.checked = true;
            console.log(webStorage.getLocalStorage("isBiometric"));
            $scope.confirmPinModal.hide();
            
            // Update bio state after verified by MyPIN
            deviceService.setBioState();

          } else if(response.result.responseStatus.responseCode === "RIB-E-LOG005") {
            // popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,response.result.responseStatus.errorMessage);
            popupService.showErrorPopupMessage('lable.error', response.result.responseStatus.errorMessage );
          }else if(response.result.responseStatus.responseCode === "RIB-E-LOG010"){
            webStorage.setLocalStorage("isBiometric",false);
            $scope.turnClearAppData.checked = false;
            popupService.showErrorPopupMessage('lable.error', response.result.responseStatus.errorMessage);
            logout();
          }
        })
    	});

    	$scope.init = function() {
    		$scope.passcode = "";
    		$scope.starcode = "";

    		for(var i=0;i< maxPin;i++){
    			$scope.dotpins[i] = 'circle-color-white';
    		}
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
    				$scope.$broadcast('pin-code', { value: $scope.passcode });
    				$timeout(function() {
    					$scope.init();
    				}, 800);
    			}
    		}else{
    			$timeout(function() {
    				//do something
    			}, 500);
    		}
    	};

    	$scope.del = function() {
    		$scope.dotpins[$scope.passcode.length-1] = 'circle-color-white';
    		if($scope.passcode.length > 0) {
    			$scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
    			$scope.starcode = $scope.starcode.substring(0, $scope.starcode.length - 1);
    		}
    	};

    	$ionicModal.fromTemplateUrl('templates/confirm-pin-biometric.html', {
    		scope: $scope,
    		animation: $scope.modalAnimate
    	}).then(function(modal) {
    		$scope.confirmPinModal = modal;
    	});

    	$scope.closeConfirmPinModal = function() {
        for(var i=0;i< maxPin;i++){
    			$scope.dotpins[i] = 'circle-color-white';
    		}
        $scope.passcode = "";
        $scope.starcode = "";
        $scope.turnClearAppData.checked = false;
        isBiometric = false;
        webStorage.setLocalStorage("isBiometric", isBiometric);
        console.log(webStorage.getLocalStorage("isBiometric"));
    		$scope.confirmPinModal.hide();
      };


    $scope.enrolled = false;

    $scope.showConfirm = function () {
      if ($scope.turnClearAppData.checked == false) {
        isBiometric = false;
        webStorage.setLocalStorage("isBiometric", isBiometric);
        console.log(webStorage.getLocalStorage("isBiometric"));
      } else {
        deviceService.isAvailable().then(function(result) {
          if(result.isAvailable) {
            $scope.confirmPinModal.show();
          } else {
            if(result.error.isEnrolled === false || result.error.isFaceIDPermitted === false) {
              // $scope.enrolled = true;
              $scope.turnClearAppData.checked = false;
              isBiometric = false;
              webStorage.setLocalStorage("isBiometric", isBiometric);
              console.log(webStorage.getLocalStorage("isBiometric"));
            }
          }
        });
      }
    };

    // deviceService.isAvailable().then(function(result) {
    //   if(result.isAvailable) {
    //     $scope.enrolled = false;
    //     $scope.showConfirm = function () {
    //       if ($scope.turnClearAppData.checked == false) {
    //         isBiometric = false;
    //         webStorage.setLocalStorage("isBiometric", isBiometric);
    //         console.log(webStorage.getLocalStorage("isBiometric"));
    //       } else {
    //         $scope.confirmPinModal.show();
    //         isBiometric = true;
    //         webStorage.setLocalStorage("isBiometric", isBiometric);
    //         console.log(webStorage.getLocalStorage("isBiometric"));
    //       }
    //     };
    //   } else {
    //     console.log(result.error);
    //     if(result.error.isEnrolled === false || result.error.isFaceIDPermitted === false) {
    //        $scope.enrolled = true;
    //        $scope.turnClearAppData.checked= false;
    //        isBiometric = false;
    //     }
    //   }
    // });

    if (webStorage.getLocalStorage("isBiometric") === true) {
      $scope.turnClearAppData.checked = true;
      console.log($scope.turnClearAppData);
    } else if (webStorage.getLocalStorage("isBiometric") === false) {
      $scope.turnClearAppData.checked= false;
    }

  });
