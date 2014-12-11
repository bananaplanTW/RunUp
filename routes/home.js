var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    queryString = "SELECT a.state_short, a.state_origin, b.country_short FROM state AS a, country AS b WHERE a.under_country_id = b.id AND a.state_short != \'undefined\'";

router.get('/', function (req, res) {
    ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			res.render('error');
			return;
		}
		for (var i = 0; i < rows.length; i ++) {
			rows[i].state_origin = decodeURIComponent(rows[i].state_origin);
		}

		console.log(req);
		var i18n;
		if (req.geo.country === "TW") {
			i18n = require('../i18n/tw');
		} else {
			i18n = require('../i18n/us');	
		}

		var data = {};
		data.states = rows;
		data.user = req.user;
		data.i18n = i18n;
		console.log(data.user);
		res.render('home2', {data : data});
	});
});

module.exports = router;