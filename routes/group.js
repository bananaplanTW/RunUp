var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectQueryStringBase = "SELECT a.*, b.city_short, b.city_origin FROM running_group AS a JOIN city AS b on a.city_id=b.id WHERE group_id=\"%s\"";

require('../lib/GetLatLngFromAddress');
router.get('/:group_id', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var groupId = req.params.group_id;
	var queryString = util.format(selectQueryStringBase, groupId);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}
		var data = {};
		if (typeof(rows) !== undefined) {
			data = rows[0];	
		}
		console.log(data);
		res.render('group', {data : data});
	});
});

module.exports = router;