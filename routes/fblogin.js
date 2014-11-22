var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";
var insertUserQuery = "INSERT INTO member (account, email, first_name, last_name, gender, locale, timezone, picture, account_type) VALUES ('%s', '%s', '%s', '%s', %s, '%s', %s, '%s', 'facebook')";

router.post('/',function (req, res, next) {
    var body = req.body;
    var queryString = util.format(selectUserQuery, body.id);
    // checking the user existence
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
                req.session.user = body.id;
                req.session.save();
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                var responseData = {
                    picture: body.picture
                };
                res.write(JSON.stringify(responseData));
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