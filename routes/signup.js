var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance(),
    bcrypt = require('bcryptjs');;

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";
var insertUserQuery = "INSERT INTO member (account, password, salt, email, account_type) VALUES ('%s', '%s', '%s', '%s', 'email')";

router.post('/',function (req, res, next) {
    var body = req.body;
    var queryString = util.format(selectUserQuery, body.account);
    // checking the user existence
console.log("signup");
    moduleLogin.execute(queryString, function (error, rows) {
        if (error) {
            console.log(error);
            return;
        }
        if (rows.length == 0) {
            console.log("not registered yet");
            var salt = bcrypt.genSaltSync(10);
            var hashedPassword = bcrypt.hashSync(body.password, salt);
            queryString = util.format(insertUserQuery, body.account, hashedPassword, salt, body.account);
            moduleLogin.execute(queryString, function (error, _rows) {
                if (error) {
                    console.log(error);
                    return;
                }
                req.session.user = body.account;
                req.session.save();

                var responseData = {
                    account: body.account
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify(responseData));
                res.end();
            })
        } else { // account has been taken
            res.writeHead(601, {
                "Content-Type": "application/json"
            });
            res.end();
        }
    });
});

module.exports = router;