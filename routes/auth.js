var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";

router.use(function (req, res, next) {
	console.log("session:", req.session);
    if (req.session.user) {
    	// user data is here
    	var queryString = util.format(selectUserQuery, req.session.user);
    	moduleLogin.execute(queryString, function (error, row) {
    		if (error) {
    			// not login
    			console.log(error);
    			req.session.destroy();
    			return;
    		}
    		// user is login
    		req.user = row[0];
    		next()
    	})
    } else {
    	// user is not login
    	next();
    }
});

module.exports = router;