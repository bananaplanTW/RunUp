(function registerSignupPopup () {
    
    //var signup = document.getElementById("signup");
    var emailSignup = document.getElementById("email-signup");
    var emailLogin = document.getElementById("email-login");
    var login  = document.getElementById("login");
    var signupPopupContainer = document.getElementById("signup-popup-container");

    //binding signup button click event
    /*signup.addEventListener('click', function (e) {
        var top = window.pageYOffset;
        signupPopupContainer.style.display = "table";
        signupPopupContainer.style.top = top.toString() + "px";

        // fillup the signup text
        var signupText = document.getElementById("signup-title");
        signupText.textContent = "Signup/Login"

        // disable scrolling
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className + " no-scroll";
        body.setAttribute('class', bodyClass);
    });*/

    emailSignup.addEventListener('click', function(e) {
        var emailSignupForm = document.getElementById("email-signup-form");
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

    emailLogin.addEventListener('click', function(e) {
        var emailLoginForm = document.getElementById("email-login-form");
        var isPass = true;
        if (!emailLoginForm['account'].value) {
            addClassName.call(emailLoginForm['account'], "red-bottom-line");
            isPass = false;
        } else if (!emailRegex.test(emailLoginForm['account'].value)) {
            addClassName.call(emailLoginForm['account'], "red-bottom-line");
            isPass = false;
        } else {
            removeClassName.call(emailLoginForm['account'], "red-bottom-line");
        }

        if (!emailLoginForm['password'].value) {
            addClassName.call(emailLoginForm['password'], "red-bottom-line");
            isPass = false;
        } else {
            removeClassName.call(emailLoginForm['password'], "red-bottom-line");
        }

        if (isPass) {
            //emailSignupForm.submit();
            var data = {
                account : emailLoginForm['account'].value,
                password : emailLoginForm['password'].value
            };
            postAjax('/login', JSON.stringify(data), function (XHR, status) {
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
                    alert("wrong account/password!");
                }
            });
        } else {
            e.preventDefault();
        }
    });
    
    //binding login button click event
    login.addEventListener('click', function (e) {
        var top = window.pageYOffset;
        signupPopupContainer.style.display = "table";
        signupPopupContainer.style.top = top.toString() + "px";

        // fillup the signup text
        var signupText = document.getElementById("signup-title");
        signupText.textContent = "Signup/Login"

        // disable scrolling
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className + " no-scroll";
        body.setAttribute('class', bodyClass);
    });

    //binding signup container click event
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
/*
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
}*/