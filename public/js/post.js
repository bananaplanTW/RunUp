function bindPost (map) {
    var that = this;
    var address = document.getElementById('address');
    var geoCodingResult = {};
    //console.log('focusout');
    address.addEventListener('blur', function (e) {
        if (address.value) {
            var addressString = "address=" + address.value;
            getAjax("/getGeoCoding", addressString, function (XHR, status) {
                if (XHR.readyState === 4 && XHR.status == 200) {
                    geoCodingResult = JSON.parse(XHR.response);
                    //console.log(geoCodingResult);
                    if (geoCodingResult.status === "NOTFOUND") {
                        alert(geoCodingResult.message);
                    } else {
                        google.maps.event.trigger(map, 'resize');
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
/*
// initialize facebook login
(function bindFBLogin () {
    var FBsignup = document.getElementById('fb-signup');
    FBsignup.addEventListener('click', function (e) {
        FB.login(function (response) {
            console.log(response);
            if (response.status === 'connected') {
                redirectToLogin();
            } else {
                //do nothing
            }
        }, {scope: 'public_profile,user_friends,email'});
    });

    var logout = document.getElementById('logout');
    logout.addEventListener('click', function (e) {
        getAjax('/logout', null, function (XHR, status) {
            if (XHR.readyState === 4 && XHR.status === 200) {
                location.reload();
            }
        })

        var user = document.getElementById("user");
        var userClass = user.className + " d-n";
        user.setAttribute('class', userClass);

        var auth = document.getElementById("auth");
        var authClass = auth.className.replace(" d-n", "");
        auth.setAttribute('class', authClass);
    });
})();

(function bindEmailSignup () {
    var emailSignup = document.getElementById('email-signup');
    emailSignup.addEventListener('click', function(e) {
        var emailSignupForm = document.getElementById("post-email-signup-form");
        var isPass = true;
        if (!emailSignupForm['account'].value) {
            addClassName.call(emailSignupForm['account'], "red-bottom-line");
            isPass = false;
        } else if (!emailRegex.test(emailSignupForm['account'].value)) {
            addClassName.call(emailSignupForm['account'], "red-bottom-line");
            isPass = false;
        } else {
            removeClassName.call(emailSignupForm['account'], "red-bottom-line");
        }

        if (!emailSignupForm['password'].value) {
            addClassName.call(emailSignupForm['password'], "red-bottom-line");
            isPass = false;
        } else {
            removeClassName.call(emailSignupForm['password'], "red-bottom-line");
        }

        if (!emailSignupForm['confirm-password'].value) {
            addClassName.call(emailSignupForm['confirm-password'], "red-bottom-line");
            isPass = false;
        } else if (emailSignupForm['confirm-password'].value !== emailSignupForm['password'].value) {
            addClassName.call(emailSignupForm['password'], "red-bottom-line");
            addClassName.call(emailSignupForm['confirm-password'], "red-bottom-line");
            isPass = false;
        } else {
            removeClassName.call(emailSignupForm['confirm-password'], "red-bottom-line");
        }

        if (isPass) {
            //emailSignupForm.submit();
            var data = {
                account : emailSignupForm['account'].value,
                password : emailSignupForm['password'].value
            };
            postAjax('/signup', JSON.stringify(data), function (XHR, status) {
                if (XHR.readyState === 4 && XHR.status === 200) {
                    var body = document.getElementsByTagName("body")[0];
                    var bodyClass = body.className.replace(" no-scroll", "");
                    body.setAttribute('class', bodyClass); 
                    document.getElementById("signup-popup-container").style.display = "none";

                    //replace the login/signup button with head icon
                    var user = document.getElementById("user");
                    var userClass = user.className.replace(" d-n", "");
                    user.setAttribute('class', userClass);

                    // setting user head image
                    var headImage = user.querySelector('img.head-image');
                    var userData = JSON.parse(XHR.response);
                    headImage.setAttribute('src', userData.picture);

                    // hiding signup/login button
                    var auth = document.getElementById("auth");
                    var authClass = auth.className + " d-n";
                    auth.setAttribute('class', authClass);

                    location.reload();
                } else if (XHR.readyState === 4 && XHR.status === 601) {
                    // account already been taken
                    alert("Account has been taken!");
                }
            });
        } else {
            e.preventDefault();
        }
    });
})();*/