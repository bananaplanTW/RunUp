var express = require('express'),
    router  = express.Router();

router.get('/', function (req, res) {
    console.log('in home');
    res.render('home');
});

module.exports = router;