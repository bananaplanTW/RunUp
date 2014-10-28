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

var accountInputBox = document.getElementById('account');
accountInputBox.onfocus = function () {
    accountInputBox.setAttribute("value", "");
}
accountInputBox.onblur = function () {
    if (accountInputBox.getAttribute("value").trim() === "") {
        accountInputBox.setAttribute("value", "Account");
    }
}

var passwordInputBox = document.getElementById('password');
passwordInputBox.onfocus = function () {
    passwordInputBox.setAttribute("value", "");
}
passwordInputBox.onblur = function () {
    if (accountInputBox.getAttribute("value").trim() === "") {
        passwordInputBox.setAttribute("value", "password");
    }
}