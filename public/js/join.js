(function registerJoin () {
    var joinButton = document.getElementById('join-button');
    if (!joinButton) {
        return;
    }
    joinButton.addEventListener('click', function (e) {
        var path = "/join";
        var group_id = joinButton.getAttribute('data-groupid');
        var postJson = {
            group_id: group_id
        };
        var postJsonString = JSON.stringify(postJson);
        postAjax(path, postJsonString, function (XHR, status) {
            if (XHR.readyState === 4 && XHR.status === 200) {
                var response = JSON.parse(XHR.response);
                console.log(response);
                if (response.status === 0) {
                    // join success
                    // updating the member list
                    var memberList = document.getElementById('member-list');
                    var memberIcon = document.createElement('li');
                    var memberHeadIconContainer = document.createElement('span');
                    var memberHeadIcon = document.getElementById("user-icon-img").cloneNode(true);

                    memberHeadIconContainer.className = "round-face border-icon user-head-image";
                    memberHeadIconContainer.appendChild(memberHeadIcon);
                    memberIcon.appendChild(memberHeadIconContainer);
                    memberList.insertBefore(memberIcon, memberList.firstChild);
                    console.log(memberHeadIconContainer);

                    joinButton.className += " display-none";

                    alert("Congrats! Join Success! :D");
                } else if (response.status === 1) {
                    // user not login
                    // decide the position of signup popup
                    var top = window.pageYOffset;
                    var signupPopupContainer = document.getElementById("signup-popup-container");
                    signupPopupContainer.style.display = "table";
                    signupPopupContainer.style.top = top.toString() + "px";

                    // fillup the signup text
                    var signupText = document.getElementById("signup-title");
                    signupText.textContent = "Login before joining group!"

                    // disable scrolling
                    var body = document.getElementsByTagName("body")[0];
                    var bodyClass = body.className + " no-scroll";
                    body.setAttribute('class', bodyClass);
                }
            }
        });
    });
})();
