var bounds;
var infowindows = [];
function setIconOnMap (map) {
	var groupCards = document.getElementsByClassName('group-card');
	var groupName;
	var marker, lat, lng, latlng;
	bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < groupCards.length; i ++ ){
		groupName = groupCards[i].querySelector("#group-name").innerHTML;
		lat = parseFloat(groupCards[i].getAttribute('data-lat'));
		lng = parseFloat(groupCards[i].getAttribute('data-lng'));
		putIconOnMap(map, lat, lng, groupName, groupCards[i]);
	}
	map.fitBounds(bounds);
};

function putIconOnMap(map, lat, lng, groupName, groupCard) {
	var latlng = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
				    position: latlng,
				    title:groupName
				});
	bounds.extend(latlng);
	marker.setMap(map);

	var infowindow = new google.maps.InfoWindow({
	    content: groupCard.innerHTML
	});
	infowindows.push(infowindow);
	var isOpen = false;

	google.maps.event.addListener(marker, 'click', function() {
	  for (var i = 0; i < infowindows.length; i ++) {
	  	infowindows[i].close();
	  }
	  if (!isOpen) {
	  	infowindow.open(map,marker);
	  }
	  isOpen = !isOpen;
	});
	

	groupCard.addEventListener('mouseover', function () {
	  for (var i = 0; i < infowindows.length; i ++) {
	  	infowindows[i].close();
	  }
	  infowindow.open(map,marker);
	});
	groupCard.addEventListener('mouseout', function () {
	  infowindow.close();
	});
};

google.maps.event.addDomListener(window, 'load', function () {
	var mapOptions = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8,
	  disableDefaultUI: true,
	  zoomControl: true,
	  style: google.maps.ZoomControlStyle.SMALL,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
    initializeMap(mapOptions, setIconOnMap);
});