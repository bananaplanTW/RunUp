var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance();

var selectGroupQuery = "SELECT id FROM running_group WHERE group_id='%s'";
var insertGroupMemberQuery = "INSERT INTO group_member (member_id, group_id) VALUES (%s, %s)";

router.post('/',function (req, res, next) {
    console.log("in join, user=", req.user.id);
    var body = req.body;
    console.log(body);
    var member_id = req.user.id;
    var group_id = req.body.group_id;
    var queryString = util.format(selectGroupQuery, group_id);

    moduleLogin.execute(queryString, function (error, rows) {
        if (error) {
            console.log(error);
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            res.end();
            return;
        }
        console.log("group found!, id is " , rows[0].id);
        var id = rows[0].id;
        queryString = util.format(insertGroupMemberQuery, member_id, id);
        moduleLogin.execute(queryString, function (error, _rows) {
            if (error) {
                console.log(error);
                res.writeHead(404, {
                    "Content-Type": "application/json"
                });
                res.end();
                return;
            }
            console.log("join success!", _rows);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end();
        });
    });
});

module.exports = router;