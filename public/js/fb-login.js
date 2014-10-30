function QueryString () {
    
}

QueryString.prototype.stringify = function (json) {
    var string = "";
    for (var i in json) {
        string += (i + "=" + json[i] + "&");
    }
    if (string.length > 0 ) {
        string = string.slice(0, string.length -1)
    }
    return string;
}

var queryString = new QueryString();

(function bindFBLogin () {
    var FBLogin = document.getElementById('fb-login');
    FBLogin.addEventListener('click', function (e) {
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
        
        //FB.logout(function (response) {
            //logout in the server
            ajaxGet();

            var user = document.getElementById("user");
            var userClass = user.className + " display-none";
            user.setAttribute('class', userClass);

            var auth = document.getElementById("auth");
            var authClass = auth.className.replace(" display-none", "");
            auth.setAttribute('class', authClass);
        //});
    });
})();

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function redirectToLogin () {
    var fields = "fields=id,email,first_name,last_name,gender,locale,timezone,picture";
    FB.api('/me?' + fields, function(response) {
        console.log("tostring", response.toString());
        if (!response.picture.data.is_silhouette) {
            response.picture = response.picture.data.url;
        } else {
            response.picture = null;
        }
        //var post = queryString.stringify(response);
        ajaxPost(JSON.stringify(response));
    });
};

function ajaxPost (post) {
    var XHR;
    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    XHR.onreadystatechange = function (status) {
        if (XHR.readyState === 4 && XHR.status === 200) {
            var body = document.getElementsByTagName("body")[0];
            var bodyClass = body.className.replace(" no-scroll", "");
            body.setAttribute('class', bodyClass); 
            document.getElementById("signup-popup-container").style.display = "none";

            //replace the login/signup button with head icon
            var user = document.getElementById("user");
            var userClass = user.className.replace(" display-none", "");
            user.setAttribute('class', userClass);

            var headImage = user.querySelector('img.head-image');
            var userData = JSON.parse(XHR.response);
            console.log(XHR);
            headImage.setAttribute('src', userData.picture);

            var auth = document.getElementById("auth");
            var authClass = auth.className + " display-none";
            auth.setAttribute('class', authClass);
        }
    }
    XHR.open('POST', "/login", false);
    XHR.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    XHR.send(post);
}

function ajaxGet () {
    var XHR;
    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    XHR.onreadystatechange = function (status) {
        if (XHR.readyState === 4 && XHR.status === 200) {
            
        }
    }
    XHR.open('GET', "/logout", false);
    XHR.send();
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '816452901748097',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
    });
    var fields = "fields=id,email,first_name,last_name,gender,locale,timezone,picture";
    FB.getLoginStatus(function(response) {
        console.log(response);
        console.log("tostring", JSON.stringify(response));
        FB.api('/me?' + fields, function(response) {
            console.log(response);
        });
    });
};