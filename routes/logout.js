var express = require('express'),
    router  = express.Router();

router.use(function (req, res, next) {
    req.session.destroy();
    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    res.end();
});

module.exports = router;