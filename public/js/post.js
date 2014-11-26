function bindPost (map) {
    var that = this;
    var address = document.getElementById('address');
    var geoCodingResult = {};
    address.addEventListener('focusout', function (e) {
        if (address.value) {
            var addressString = "address=" + address.value;
            getAjax("/getGeoCoding", addressString, function (XHR, status) {
                if (XHR.readyState === 4 && XHR.status == 200) {
                    geoCodingResult = JSON.parse(XHR.response);
                    console.log(geoCodingResult);
                    if (geoCodingResult.status === "NOTFOUND") {
                        alert(geoCodingResult.message);
                    } else {
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
                    
                }
            });
        }
    });

    var createGroupForm    = document.getElementById('create-group');
    var submitButton       = document.getElementById('submit-button');

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
                        message += "請填入跑團名稱\n";
                    } else {
                        removeClassName.call(createGroupElements['group-name'], "red-bottom-line");
                    }

                    if (!createGroupElements['address'].value) {
                        addClassName.call(createGroupElements['address'], "red-bottom-line");
                        isPass = false;
                        message += "請填入地址\n";
                    } else {
                        removeClassName.call(createGroupElements['address'], "red-bottom-line");
                    }

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

                    if (!createGroupElements['email'].value) {
                        addClassName.call(createGroupElements['email'], "red-bottom-line");
                        isPass = false;
                        message += "請填入email\n";
                    } else if (!emailRegex.test(createGroupElements['email'].value)) {
                        addClassName.call(createGroupElements['email'], "red-bottom-line");
                        isPass = false;
                        message += "請檢查email格式\n";
                    } else {
                        removeClassName.call(createGroupElements['email'], "red-bottom-line");
                    }

                    if (!createGroupElements['cover-photo'].value) {
                        addClassName.call(createGroupElements['cover-photo'], "red-bottom-line");
                        isPass = false;
                        message += "請上傳跑團封面照\n";
                    } else {
                        removeClassName.call(createGroupElements['cover-photo'], "red-bottom-line");
                    }

                    if (isPass) {
                        createGroupForm.submit();
                    } else {
                        alert("請檢查: \n" + message);
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

(function bindAddTimeSlotButton () {
    var scheduleContainer = document.getElementById('schedule-container');
    var addTimeSlotButton = document.getElementById('add-time-slot');
    addTimeSlotButton.addEventListener('click', function (e) {
        e.preventDefault();

        var scheduleSelector = document.getElementById('schedule-selector');
        var newScheduleSelector = scheduleSelector.cloneNode(true);
        var deleteTimeSlotButton = newScheduleSelector.querySelector('#delete-time-slot');
        addClassName.call(newScheduleSelector, 'mt-10');
        removeClassName.call(deleteTimeSlotButton, "display-none");

        deleteTimeSlotButton.addEventListener('click', function (e) {
            e.preventDefault();
            scheduleContainer.removeChild(newScheduleSelector);
        });

        scheduleContainer.appendChild(newScheduleSelector);
        
    });
})();

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