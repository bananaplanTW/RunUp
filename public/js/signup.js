(function registerSignupPopup () {
    console.log("register");
    var signup = document.getElementById("signup");
    var signupPopupContainer = document.getElementById("signup-popup-container");
    signup.addEventListener('click', function (e) {
        var top = window.pageYOffset;
        signupPopupContainer.style.display = "table";
        signupPopupContainer.style.top = top;

        // disable scrolling
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className + " no-scroll";
        body.setAttribute('class', bodyClass);
    });
    signupPopupContainer.addEventListener('click', function (e) {
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className.replace(" no-scroll", "");

        this.style.display = "none";
        body.setAttribute('class', bodyClass); 
    });

    var popupPopup = document.getElementById("signup-popup");
    popupPopup.addEventListener('click', function (e) {
        e.stopPropagation();
    });
})();

(function bindFBLogin () {
    var FBLogin = document.getElementById('fb-login');
})();

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=803495859696013&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));