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
})();