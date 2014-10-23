function initializeMap() {
	var mapOptions = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8,
	  disableDefaultUI: true,
	  zoomControl: true,
	  style: google.maps.ZoomControlStyle.SMALL,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
};

google.maps.event.addDomListener(window, 'load', initializeMap);