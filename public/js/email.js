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
    		message += "Please provide the name\n";
    		isPass = false;
    	}

    	if (!emailForm['email'].value) {
    		message += "Please provide email\n";
    		isPass = false;
    	}

    	if (!emailForm['comment'].value) {
    		message += "Please leave your comment so that we know how to improve our product to provide better service!\n";
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
			        alert("Thanks for your comment!");
			    }
    		});	
    	}
    });

    emailForm.addEventListener('click', function (e) {
    	e.stopPropagation();
    });
})();