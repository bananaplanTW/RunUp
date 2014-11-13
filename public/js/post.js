function bindPost (map) {
    var that = this;
    var address = document.getElementById('address');
    var geoCodingResult = {};
    address.addEventListener('focusout', function (e) {
        console.log(address.value);
        if (address.value) {
            var addressString = "address=" + address.value;
            getAjax("/getGeoCoding", addressString, function (XHR, status) {
                if (XHR.readyState === 4 && XHR.status == 200) {
                    geoCodingResult = JSON.parse(XHR.response);
                    console.log(geoCodingResult);
                    bindFormInputs(geoCodingResult);
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

    var createGroupForm = document.getElementById('create-group');
    createGroupForm.addEventListener('submit', function (e) {
        console.log("click on submit");
        console.log(createGroupForm.elements);
        var elements = createGroupForm.elements;
        if (!elements['group-name'].value) {
            e.preventDefault();
        }
        if (!elements['address'].value) {
            e.preventDefault();
        }
    });
};

function bindFormInputs (geoCodingResult) {
    var lat           = document.getElementById('lat');
    var lng           = document.getElementById('lng');
    var city          = document.getElementById('city');
    var county        = document.getElementById('county');
    var state         = document.getElementById('state');
    var state_short   = document.getElementById('state_short');
    var country       = document.getElementById('country');
    var country_short = document.getElementById('country_short');
    lat.value           = geoCodingResult.lat;
    lng.value           = geoCodingResult.lng;
    city.value          = geoCodingResult.city;
    county.value        = geoCodingResult.county;
    state.value         = geoCodingResult.state;
    state_short.value   = geoCodingResult.state_short;
    country.value       = geoCodingResult.country;
    country_short.value = geoCodingResult.country_short;
};

google.maps.event.addDomListener(window, 'load', function () {
    var latlng = new google.maps.LatLng(25.0173405, 121.5397518);
    var mapOptions = {
      center: latlng,
      zoom: 15,
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