var express = require('express'),
    router  = express.Router();

router.get("/", function (req, res) {
	var data = {};
	var i18n;
	if (req.geo.country === "TW") {
		i18n = require('../i18n/tw');
	} else {
		i18n = require('../i18n/us');	
	}
	data.user = req.user;
	data.i18n = i18n;
    res.render("done", {data : data});    
});

module.exports = router;