(function bindFBLogin () {
    var FBLogin = document.getElementById('fb-login');
    FBLogin.addEventListener('click', function (e) {
        console.log("click fb login", FB);
        FB.getLoginStatus(function(response) {
            console.log(response);
        });
    });
})();


(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=816452901748097&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
