var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance(),
    HttpsGet = require('../lib/HttpsGet');

var selectUserQuery = "SELECT * FROM member WHERE account='%s'";

router.get("/", function (req, res) {
    res.render("post");    
});

router.post("/group", function (req, res) {
    console.log(req);
    res.render("post");
})

module.exports = router;