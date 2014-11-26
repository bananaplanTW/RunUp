var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance(),
    bcrypt = require('bcryptjs');;

var selectUserQuery = "SELECT salt, password FROM account_info WHERE account='%s'";
//var insertUserQuery = "INSERT INTO member (account, password, salt, email, account_type) VALUES ('%s', '%s', '%s', '%s', 'email')";

router.post('/',function (req, res, next) {
    var body = req.body;
    var queryString = util.format(selectUserQuery, body.account);
    // checking the user existence
console.log("login");
    moduleLogin.execute(queryString, function (error, rows) {
        if (error) {
            console.log(error);
            return;
        }
        if (rows.length == 0) {
            console.log("no such account yet");
            res.writeHead(601, {
                "Content-Type": "application/json"
            });
            res.end();
        } else { // account has been taken
            var salt = rows[0].salt;
            var validPassword = bcrypt.compareSync(body.password, rows[0].password);
            if (validPassword) {
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
            } else {
                res.writeHead(601, {
                    "Content-Type": "application/json"
                });
                res.end();
            }
        }
    });
});

module.exports = router;