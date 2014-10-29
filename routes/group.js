var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectQueryStringBase = "SELECT a.*, b.state_short FROM running_group AS a, state AS b WHERE a.state_id = b.id AND group_id=\"%s\"";

//require('../lib/GetLatLngFromAddress');
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