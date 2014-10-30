var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";
var insertUserQuery = "INSERT INTO member (account, email, first_name, last_name, gender, locale, timezone, picture) VALUES ('%s', '%s', '%s', '%s', %s, '%s', %s, '%s')";

router.use(function (req, res, next) {
    var body = req.body;
    console.log("in login, user=", req.session.user);
    var queryString = util.format(selectUserQuery, body.id);
    moduleLogin.execute(queryString, function (error, rows) {
    	if (error) {
    		console.log(error);
    		return;
    	}
    	if (rows.length == 0) {
    		console.log("not registered yet");
    		queryString = util.format(insertUserQuery, body.id, body.email, body.first_name, body.last_name, body.gender == "male", body.locale, body.timezone, body.picture);
    		moduleLogin.execute(queryString, function (error, _rows) {
    			if (error) {
		    		console.log(error);
		    		return;
		    	}
		    	console.log("register successed", _rows);
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(_rows);
                res.end();
    		})
    	} else {
            req.session.user = rows[0].account;
            req.session.save();
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.write(JSON.stringify(rows[0]));
            res.end();
    	}
    })
});

module.exports = router;