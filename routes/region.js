var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectCityQueryStringBase = "SELECT a.*, b.country_short, b.country_origin, c.state_short, c.state_origin, d.city_origin FROM running_group AS a, country AS b, state AS c, city AS d WHERE a.country_id = b.id AND a.state_id = c.id AND a.city_id = d.id AND c.state_short = \"%s\" AND d.city_origin = \"%s\" LIMIT %s, 10";
    selectStateQueryStringBase = "SELECT a.*, b.country_short, b.country_origin, c.state_short, c.state_origin FROM running_group AS a, country AS b, state AS c WHERE a.country_id = b.id AND a.state_id = c.id AND c.state_short = \"%s\" LIMIT %s, 10";
//might useful
//SELECT a.*, b.city_short, b.city_origin, c.state_short, c.state_origin FROM running_group AS a JOIN city AS b JOIN state AS c ON a.city_id = b.id AND a.state_id = c.id WHERE b.city_short = 'la' AND c.state_short = 'ca' LIMIT 0, 10
//require('../lib/GetLatLngFromAddress');
router.get('/:country/:state', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var country = encodeURIComponent(req.params.country);
	var state = encodeURIComponent(req.params.state);
	var page  = req.query.p || '1';
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = util.format(selectStateQueryStringBase, state, offset);
	console.log(queryString);
	console.log("in state");
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			//return;
		}
		var data = {};
		data.groups = rows;
		data.prevPage = parseInt(page) - 1;
		data.nextPage = parseInt(page) + 1;
		console.log(data);
		res.render('region', {data : data});
	});
});

router.get('/:country/:state/:city', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var country = encodeURIComponent(req.params.country);
	var state = encodeURIComponent(req.params.state);
	var city  = encodeURIComponent(req.params.city);
	var page  = req.query.p || '1';
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = util.format(selectCityQueryStringBase, state, city, offset);
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			//return;
		}
		var data = {};
		data.groups = rows;
		if (page > 1) {
			data.prevPage = parseInt(page) - 1;
		}
		if (rows.length > 10) {
			data.nextPage = parseInt(page) + 1;
		}
		console.log(data);
		res.render('region', {data : data});
	});
});

module.exports = router;