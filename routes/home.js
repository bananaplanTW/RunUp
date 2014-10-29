var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    queryString = "SELECT a.state_short, a.state_origin, b.country_short FROM state AS a, country AS b WHERE a.under_country_id = b.id";

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
		var data = {};
		data.states = rows;
		console.log(data);
		res.render('home', {data : data});
	});
});

module.exports = router;