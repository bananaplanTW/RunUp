(function () {
	var email = document.getElementById('email');
	var emailContainer = document.getElementById('email-container');
	var emailSubmit = document.getElementById('email-submit');
	var emailForm = document.getElementById('email-form');

	email.addEventListener('click', function (e) {
		var top = window.pageYOffset;
        emailContainer.style.display = "table";
        emailContainer.style.top = top.toString() + "px";
        
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className + " no-scroll";
        body.setAttribute('class', bodyClass);
	});

	emailContainer.addEventListener('click', function (e) {
        var body = document.getElementsByTagName("body")[0];
        var bodyClass = body.className.replace(" no-scroll", "");

        this.style.display = "none";
        body.setAttribute('class', bodyClass);
    });

    emailSubmit.addEventListener('click', function (e) {
    	var isPass = true;
    	var message = "";
    	console.log("Adf");
    	if (!emailForm['name'].value) {
    		message += "請讓我們知道如何稱呼您\n";
    		isPass = false;
    	}

    	if (!emailForm['email'].value) {
    		message += "請填入您的聯絡email\n";
    		isPass = false;
    	}

    	if (!emailForm['comment'].value) {
    		message += "請留下建議，讓我們知道如何改善！謝謝！\n";
    		isPass = false;
    	}

    	if (!isPass) {
    		alert(message);
    	} else {
    		var emailConent = {
    			name: emailForm['name'].value,
    			email: emailForm['email'].value,
    			comment: emailForm['comment'].value
    		};
    		console.log(JSON.stringify(emailConent));
    		postAjax("/email", JSON.stringify(emailConent), function (XHR, status) {
    			if (XHR.readyState === 4 && XHR.status == 200) {
	    			var body = document.getElementsByTagName("body")[0];
			        var bodyClass = body.className.replace(" no-scroll", "");

			        emailContainer.style.display = "none";
			        body.setAttribute('class', bodyClass);
			        alert("謝謝您的回饋！");
			    }
    		});	
    	}
    });

    emailForm.addEventListener('click', function (e) {
    	e.stopPropagation();
    });
})();