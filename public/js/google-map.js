var map;
var bounds;
function initializeMap() {
	var mapOptions = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8,
	  disableDefaultUI: true,
	  zoomControl: true,
	  style: google.maps.ZoomControlStyle.SMALL,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),
	    mapOptions);
	bounds = new google.maps.LatLngBounds();
	setIconOnMap();
};

function setIconOnMap () {
	var groupCards = document.getElementsByClassName('group-card');
	var groupName;
	var marker, lat, lng, latlng;
	var infowindow;

	for (var i = 0; i < groupCards.length; i ++ ){
		groupName = groupCards[i].querySelector("#group-name").innerHTML;
		lat = parseFloat(groupCards[i].getAttribute('data-lat'));
		lng = parseFloat(groupCards[i].getAttribute('data-lng'));
		putIconOnMap(lat, lng, groupName);
	}
	map.fitBounds(bounds);
};

function putIconOnMap(lat, lng, groupName) {
	var latlng = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
				    position: latlng,
				    title:groupName
				});
	bounds.extend(latlng);
	marker.setMap(map);

	var infowindow = new google.maps.InfoWindow({
	    content: groupName
	});
	google.maps.event.addListener(marker, 'click', function() {
	  infowindow.open(map,marker);
	});
}

google.maps.event.addDomListener(window, 'load', initializeMap);