var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";

router.get("/", function (req, res) {
    console.log("in status");
    var status = {};
    if (req.user) {
    	// user data is here
        status.status = "OK";
    } else {
    	// user is not login
        status.status = "GUEST";
    }
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(status));
    res.end();
});

module.exports = router;