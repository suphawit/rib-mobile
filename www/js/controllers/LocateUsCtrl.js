angular.module('ctrl.locateUs',[])
.controller('MapCtrl', function ($scope, $translate, $sce, invokeService, mainSession, popupService, kkconst) {
	
	var gMapsLoaded = false;
	window.gMapsCallback = function(){
	    gMapsLoaded = true;
	    $(window).trigger('gMapsLoaded');
	};
	
	window.loadGoogleMaps = function(){
	    if(gMapsLoaded){
	    	return window.gMapsCallback();
	    }
	    var script_tag = document.createElement('script');
	    script_tag.setAttribute("type","text/javascript");
	    script_tag.setAttribute("src",$sce.trustAsResourceUrl('h'+'ttps://maps.google.com/maps/api/js?key=AIzaSyCjOaGCEZierv6NPxPgQ1-jDebQMzVvYPE&callback=gMapsCallback'));
	    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	};
	
	//call to download Google Maps API on demand (on page load only)
	window.loadGoogleMaps();
	 
	var map;
	var markers = [];
	$scope.details = {};
	
	//call backend service to get the list of KK branch addresses
	$scope.loadMapDetails = function() {
	
		var obj = {};
		obj.params = {};
		obj.params.language = mainSession.lang;
		obj.actionCode = 'ACT_LOCATE_US';
		obj.procedure = 'getLocateUSProcedure';
		obj.onSuccess = function(result) {
	
			if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
				$scope.details = result.responseJSON.result.value;
				if ($scope.details.length > 0) {
					initAutocomplete();
				}else{
	        		popupService.showErrorPopupMessage('alert.title',"RIB-E-ACC008");
				}
			}else{
    		   	popupService.showErrorPopupMessage('alert.title',result.responseJSON.result.responseStatus.responseCode);
			} 			
		};
		  //invokeService.executeInvokePublicService(obj);
		  invokeService.executeInvokePublicService(obj,{adapter:kkconst.UTILITY_ADAPTER,isHideLoader:false});
	};
	
	//call to initialize the map on page load
	$scope.loadMapDetails();
			
	// Sets the map on all markers in the array.
	var setMapOnAll = function(mapSetMapOnAll) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(mapSetMapOnAll);
	  }
	};

	// Removes the markers from the map, but keeps them in the array.
	var clearMarkers = function() {
	  setMapOnAll(null);
	};

	// Shows any markers currently in the array.
	// var showMarkers = function() {
	//   setMapOnAll(map);
	// };

	// Deletes all markers in the array by removing references to them.
	var deleteMarkers = function() {
	  clearMarkers();
	  markers = [];
	};
	
	// initialize the map and show the KK Asoke office locaton by default
	function initAutocomplete() {		
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: {lat: 13.744670, lng: 100.561860},
		    zoom: 18,
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  });		  
		  var place = {
			  detail: $scope.details[0].detail,
			  location: $scope.details[0].location
		  };
		  $scope.updateAddressMap(place);
	}
	
	//update google maps to show new location address
	$scope.updateAddressMap	= function(place) {		
		deleteMarkers();		
		
		var lngLat = place.location.split(",");
		var location = new google.maps.LatLng(lngLat[0],lngLat[1]);
		map.setCenter(location);
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			animation: google.maps.Animation.DROP,
			title: place.detail,
			icon: new google.maps.MarkerImage('./images/map-icon.png',
			        new google.maps.Size(29, 43),
			        new google.maps.Point(0,0),
			        new google.maps.Point(18, 43))
		});
		var _toggleBounce = function() {
			if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
			} else {
			marker.setAnimation(google.maps.Animation.DROP);
			}
		};
		marker.addListener('click', _toggleBounce);	  
		markers.push(marker);
	  
		var infowindow = new google.maps.InfoWindow({ content: place.detail });
		infowindow.open(map , marker); 
	};
	
});
