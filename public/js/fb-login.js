(function bindFBLogin () {
    var FBLogin = document.getElementById('fb-login');
    FBLogin.addEventListener('click', function (e) {
        console.log("click fb login", FB);
        FB.login(function (response) {
          console.log(response);
        }, {scope: 'public_profile,user_friends,email'});
    });

    var templogout = document.getElementById('login');
    templogout.addEventListener('click', function (e) {
      FB.logout(function (response) {
        console.log(response);
      });
    });
})();


(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

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
        FB.api('/me?' + fields, function(response) {
            console.log(response);
        });
    });
};