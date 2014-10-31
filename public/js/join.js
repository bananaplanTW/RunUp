(function registerJoin () {
    var joinButton = document.getElementById('join-button');
    joinButton.addEventListener('click', function (e) {
        var path = "/join";
        var group_id = joinButton.getAttribute('data-groupid');
        var postJson = {
            group_id: group_id
        };
        var postJsonString = JSON.stringify(postJson);
        console.log(postJsonString);
        postAjax(path, postJsonString, function (XHR, status) {
            if (XHR.readyState === 4 && XHR.status === 200) {
                console.log("join success!");
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
            }
        });
    });
})();
