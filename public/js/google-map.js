function initializeMap(mapOptions, callback) {
	var map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	console.log(map);
	callback(map);
};

