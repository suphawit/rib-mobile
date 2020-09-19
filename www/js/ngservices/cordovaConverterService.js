angular.module('service.cordovaConverterService', [])
    .service('cordovadevice', function () {

        this.properties = function (property) {
       
            var returnValue = '';
            switch (property) {
                // Button events
                case 'name':
                    returnValue = device.name;
                    break;

                case 'cordova':
                    returnValue = device.cordova;
                    break;
                case 'platform':
                    if(navigator.platform === 'Win32' || navigator.platform === 'MacIntel'){
                        returnValue = 'preview';
                    }else{
                        returnValue = device.platform;
                    }
                    if (returnValue === '') {
                        returnValue = 'preview';
                    }
                    break;

                case 'uuid':
                    returnValue = device.uuid;
                    break;
                case 'version':
      
                    returnValue = device.version;
                    break;
                default:
                    return false;
            }
            return returnValue;
        }
    })

    .service('cordovaNetworkInfo', function () {

        this.getNetworkType = function(){
    
			var networkState = navigator.connection.type;
			// var states = {};
			//     states[Connection.UNKNOWN]  = 'Unknown connection';
			//     states[Connection.ETHERNET] = 'Ethernet connection';
			//     states[Connection.WIFI]     = 'WiFi connection';
			//     states[Connection.CELL_2G]  = 'Cell 2G connection';
			//     states[Connection.CELL_3G]  = 'Cell 3G connection';
			//     states[Connection.CELL_4G]  = 'Cell 4G connection';
			//     states[Connection.CELL]     = 'Cell generic connection';
			//     states[Connection.NONE]     = 'No network connection';
	
			    return networkState ;
		}

    });