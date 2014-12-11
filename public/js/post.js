function bindPost (map) {
    var that = this;
    var address = document.getElementById('address');
    var geoCodingResult = {};

    var searchTimeout;
    address.onkeypress = function () {
        if (searchTimeout != undefined) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
            if (address.value) {
                getPlaces(address.value, function (error, places) {
                    if (error) {
                        return;
                    }
                    google.maps.event.trigger(map, 'resize');
                    showAllPossiblePlaces.call(that, places, map);
                });
            }
        }, 500);
    };

    var createGroupForm    = document.getElementById('create-group');
    var submitButton       = document.getElementById('submit-button');

    createGroupForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    submitButton.addEventListener('click', function (e) {
        getAjax("/status", "", function(XHR, status) {
            if (XHR.readyState === 4 && XHR.status === 200) {
                var loginStatus = JSON.parse(XHR.response);
                if (loginStatus.status ==='OK') {
                    var createGroupElements = createGroupForm.elements;
                    var message = "";
                    //var coverPhotoFormElements = coverPhotoForm.elements;
                    var isPass = true;
                    if (!createGroupElements['group-name'].value) {
                        addClassName.call(createGroupElements['group-name'], "red-bottom-line");
                        isPass = false;
                        message += "Group name\n";
                    } else {
                        removeClassName.call(createGroupElements['group-name'], "red-bottom-line");
                    }

                    if (!createGroupElements['address'].value) {
                        addClassName.call(createGroupElements['address'], "red-bottom-line");
                        isPass = false;
                        message += "Address\n";
                    } else {
                        removeClassName.call(createGroupElements['address'], "red-bottom-line");
                    }
/*
                    if (!createGroupElements['lat'].value && !createGroupElements['lng'].value) {
                        addClassName.call(createGroupElements['address'], "red-bottom-line");
                        isPass = false;
                        message += "請填入正確地址\n";
                    } else {
                        removeClassName.call(createGroupElements['address'], "red-bottom-line");
                    }

                    if (!createGroupElements['contact'].value) {
                        addClassName.call(createGroupElements['contact'], "red-bottom-line");
                        isPass = false;
                        message += "請填入聯絡方式\n";
                    } else {
                        removeClassName.call(createGroupElements['contact'], "red-bottom-line");
                    }
*/
                    if (!createGroupElements['email'].value) {
                        addClassName.call(createGroupElements['email'], "red-bottom-line");
                        isPass = false;
                        message += "Email\n";
                    } else if (!emailRegex.test(createGroupElements['email'].value)) {
                        console.log(emailRegex);
                        console.log(createGroupElements['email'].value);
                        addClassName.call(createGroupElements['email'], "red-bottom-line");
                        isPass = false;
                        message += "Please check Email format\n";
                    } else {
                        removeClassName.call(createGroupElements['email'], "red-bottom-line");
                    }
/*
                    if (!createGroupElements['cover-photo'].value) {
                        addClassName.call(createGroupElements['cover-photo'], "red-bottom-line");
                        isPass = false;
                        message += "請上傳跑團封面照\n";
                    } else {
                        removeClassName.call(createGroupElements['cover-photo'], "red-bottom-line");
                    }
*/
                    if (limitCheckbox.totalChecked === 0) {
                        isPass = false;
                        message += "Please at least pick one feature that you love, so that we can provide better service for you\n";
                    }

                    if (isPass) {
                        createGroupForm.submit();
                    } else {
                        alert("Please provide: \n" + message);
                    }
                } else {
                    // need to login
                    var login = document.getElementById("login");
                    login.click();
                }
            }
        });
    });
};

function getPlaces(address, callback) {
    // your code here
    //if (address.value) {
        var addressString = "address=" + address;
        getAjax("/getGeoCoding", addressString, function (XHR, status) {
            if (XHR.readyState === 4 && XHR.status == 200) {
                geoCodingResult = JSON.parse(XHR.response);
                //console.log(geoCodingResult);
                if (geoCodingResult.status === "NOTFOUND") {
                    alert(geoCodingResult.message);
                    callback(true, null);
                } else {
                    //google.maps.event.trigger(map, 'resize');
                    console.log(geoCodingResult.places);
                    callback(null, geoCodingResult.places)
                    //showAllPossiblePlaces.call(that, geoCodingResult.places, map);
                }
                
            }
        });
    //}
}

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

function showAllPossiblePlaces (places, map) {
    var length = places.length;
    var placesListContainer   = document.getElementById('places-list-container');
    var placesListCloseButton = document.getElementById('places-list-close-button');
    var placesList            = document.getElementById('places-list');

    // initialize the map
    var latlng = new google.maps.LatLng(places[0].lat, places[0].lng);
    if (!this.marker) {
        this.marker = new google.maps.Marker({
                            position: latlng
                        });
        marker.setMap(map);
    } else {
        marker.setPosition(latlng);
    }
    map.setCenter(latlng);
    bindFormInputs(places[0]);

    // set up click listener for each item, if there're more than 1 results
    if (length > 1) {
        placesList.innerHTML = "";
        removeClassName.call(placesListContainer, "d-n");

        for (var i = 0; i < length; i ++) {
            placesList.appendChild(generateListForPlace.call(this, places[i], map));
        }

        placesList.addEventListener("click", function (e) {
            placesList.innerHTML = "";
            addClassName.call(placesListContainer, "d-n");
        });

        placesListCloseButton.addEventListener("click", function (e) {
            placesList.innerHTML = "";
            addClassName.call(placesListContainer, "d-n");
        });
    }
}

function generateListForPlace (place, map) {
    var that = this;
    var listTemplate        = document.createElement("LI");

    addClassName.call(listTemplate, "place-item");
    listTemplate.innerHTML = place.address;

    listTemplate.addEventListener("mouseenter", function (e) {
        var latlng = new google.maps.LatLng(place.lat, place.lng);
        if (!that.marker) {
            that.marker = new google.maps.Marker({
                                position: latlng
                            });
            marker.setMap(map);
        } else {
            marker.setPosition(latlng);
        }
        map.setCenter(latlng);

        bindFormInputs(place);
    });

    return listTemplate;
}

(function bindAddTimeSlotButton () {
    var scheduleContainer = document.getElementById('schedule-container');
    var addTimeSlotButton = document.getElementById('add-time-slot');
    addTimeSlotButton.addEventListener('click', function (e) {
        e.preventDefault();

        var scheduleSelector = document.getElementById('schedule-selector');
        var newScheduleSelector = scheduleSelector.cloneNode(true);
        var deleteTimeSlotButton = newScheduleSelector.querySelector('#delete-time-slot');
        addClassName.call(newScheduleSelector, 'mt-10');
        removeClassName.call(deleteTimeSlotButton, "d-n");

        deleteTimeSlotButton.addEventListener('click', function (e) {
            e.preventDefault();
            scheduleContainer.removeChild(newScheduleSelector);
        });

        scheduleContainer.appendChild(newScheduleSelector);
        
    });
})();

function LimitCheckbox () {
    this.featureCheckboxes;
    this.length;
    this.totalChecked;
    this.checkLimit = 2;
}

LimitCheckbox.prototype.update = function () {
    if (this.totalChecked === this.checkLimit - 1) {
        // unlock other checkout boxes
        for (var i = 0; i < this.length; i ++) {
            if (!this.featureCheckboxes[i].checked) {
                this.featureCheckboxes[i].disabled = false;
            }
        }
    } else if (this.totalChecked === this.checkLimit) {
        // lock other checkout boxes
        for (var i = 0; i < this.length; i ++) {
            if (!this.featureCheckboxes[i].checked) {
                this.featureCheckboxes[i].disabled = true;
            }
        }
    }
}

var limitCheckbox = new LimitCheckbox();

(function bindFeatureCheckbox (limitCheckbox) {
    var featureCheckboxes = document.getElementsByClassName ("feature-checkbox");
    var length = featureCheckboxes.length;
    for (var i = 0; i < length; i ++) {
        featureCheckboxes[i].addEventListener('change', function (e) {
            if (this.checked) {
                limitCheckbox.totalChecked ++;
            } else {
                limitCheckbox.totalChecked --;
            }
            limitCheckbox.update();
        });
    }

    limitCheckbox.featureCheckboxes = featureCheckboxes;
    limitCheckbox.length = length;
    limitCheckbox.totalChecked = 0;

})(limitCheckbox);

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

