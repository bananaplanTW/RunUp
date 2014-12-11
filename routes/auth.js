var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    geoip = require('geoip-lite'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectUserQuery = "SELECT a.id, a.account, b.picture FROM account_info AS a, settings AS b WHERE a.account = b.account && a.account='%s'";

router.use(function (req, res, next) {
    var geo = geoip.lookup(req.ip);
    req.geo = geo;
    //req.geo.country = "US";

    console.log("session:", req.session.user);
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
    		next();
    	})
    } else {
    	// user is not login
    	next();
    }
});

module.exports = router;;