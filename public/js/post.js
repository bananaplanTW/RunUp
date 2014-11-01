function bindPost (map) {
    var that = this;
    var address = document.getElementById('address');
    address.addEventListener('focusout', function (e) {
        console.log(address.value);
        if (address.value) {
            var addressString = "address=" + address.value;
            getAjax("/getGeoCoding", addressString, function (XHR, status) {
                if (XHR.readyState === 4 && XHR.status == 200) {
                    var geoCodingResult = JSON.parse(XHR.response);
                    var latlng = new google.maps.LatLng(geoCodingResult.lat, geoCodingResult.lng);
                    if (!that.marker) {
                        that.marker = new google.maps.Marker({
                                            position: latlng
                                        });
                        marker.setMap(map);
                    } else {
                        marker.setPosition(latlng);
                    }
                    map.setCenter(latlng);
                }
            });
        }
    });
};


google.maps.event.addDomListener(window, 'load', function () {
    var latlng = new google.maps.LatLng(25.0173405, 121.5397518);
    var mapOptions = {
      center: latlng,
      zoom: 14,
      maxZoom: 17,
      disableDefaultUI: true,
      zoomControl: true,
      style: google.maps.ZoomControlStyle.SMALL,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var marker = new google.maps.Marker({
                        position: latlng
                    });
    initializeMap(mapOptions, function (map) {
        bindPost.call(this, map);
    });
});