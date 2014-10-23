var express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance();

router.get('/:state/:city', function (req, res) {
	// should set up checking process to prevent sql injectino
	var city  = req.params.city;
	var state = req.params.state;
	var querySTring = "SELECT a.*, b.city_short, b.city_origin, c.state_short, c.state_origin FROM running_group AS a, city AS b, state AS c WHERE a.city_id = b.id AND a.state_id = c.id AND b.city_short = '" + city + "' AND c.state_short = '"+ state +"' LIMIT 10";
	ModuleMysql.execute(querySTring, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}
		var data = {};
		data.groups = rows;
		res.render('region', {data : data});
	});
});

module.exports = router;