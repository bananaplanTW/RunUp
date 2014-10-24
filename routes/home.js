var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    queryString = "SELECT a.*, b.* FROM city as a NATURAL JOIN state as b";

router.get('/', function (req, res) {
    ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			res.render('error');
			return;
		}
		var data = {};
		data.cities = rows;
		console.log(data);
		res.render('home', {data : data});
	});
});

module.exports = router;