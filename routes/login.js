var express = require('express'),
    router  = express.Router();

router.use(function (req, res, next) {
    var body = req.body;
    conosle.log(body);

    console.log("in login");
    //next();
});

module.exports = router;