var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    //selectQueryStringBase = "SELECT a.*, b.state_short FROM running_group AS a, state AS b WHERE a.state_id = b.id AND group_id=\"%s\"",
    selectQueryStringBase = "SELECT a.* FROM running_group AS a WHERE group_id=\"%s\"",
    selectGroupMember = "SELECT a.id, a.first_name, a.picture FROM member AS a, group_member AS b WHERE a.id = b.member_id AND b.group_id=\"%s\"";

//require('../lib/GetLatLngFromAddress');
router.get('/:group_id', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var groupId = encodeURIComponent(req.params.group_id);
	var queryString = util.format(selectQueryStringBase, groupId);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}
		var data = {};
		data = rows[0];
		console.log(rows);
		if (!data) {
			next('route');
			return;
		}
		data.group_name = decodeURIComponent(data.group_name);
		data.address = decodeURIComponent(data.address);
		data.contact = decodeURIComponent(data.contact);
		data.email = decodeURIComponent(data.email);
		data.website = decodeURIComponent(data.website);
		data.user = req.user;
		queryString = util.format(selectGroupMember, data.id);
		ModuleMysql.execute(queryString, function (error, rows) {
			if (error) {
				console.log(error);
				res.render('group', {data : data});
				return;
			}
			var isMember = false;
			for (var i = 0; i < rows.length; i++) {
				if (req.user && rows[i].id == req.user.id) {
					isMember = true;
				}
			}
			data.members   = rows;
			data.is_member = isMember;
			res.render('group', {data : data});
		});
	});
});

module.exports = router;