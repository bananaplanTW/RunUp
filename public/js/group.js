google.maps.event.addDomListener(window, 'load', function () {
	var groupNameElement = document.getElementById("group-name");
	var groupName = document.querySelector('h2').innerHTML;
	var lat = parseFloat(groupNameElement.getAttribute('data-lat'));
	var lng = parseFloat(groupNameElement.getAttribute('data-lng'));
	var latlng = new google.maps.LatLng(lat, lng);
	var mapOptions = {
	  center: latlng,
	  zoom: 16,
	  disableDefaultUI: true,
	  zoomControl: true,
	  scrollwheel: false,
	  style: google.maps.ZoomControlStyle.SMALL,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};

    initializeMap(mapOptions, function (map) {
    	var marker = new google.maps.Marker({
    		position: latlng,
    		title:groupName
    	});
    	marker.setMap(map);
    });
});