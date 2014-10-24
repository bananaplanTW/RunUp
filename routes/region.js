var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectQueryStringBase = "SELECT a.*, b.city_short, b.city_origin, c.state_short, c.state_origin FROM running_group AS a, city AS b, state AS c WHERE a.city_id = b.id AND a.state_id = c.id AND b.city_short = '%s' AND c.state_short = '%s' LIMIT %s, 10";

//require('../lib/GetLatLngFromAddress');
router.get('/:state/:city', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var city  = req.params.city;
	var state = req.params.state;
	var page  = req.query.p || '1';
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = util.format(selectQueryStringBase, city, state, offset);
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}
		var data = {};
		data.groups = rows;
		data.prevPage = parseInt(page) - 1;
		data.nextPage = parseInt(page) + 1;
		console.log(data);
		res.render('region', {data : data});
	});
});

module.exports = router;