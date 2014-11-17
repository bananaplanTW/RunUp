var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    TimeMapping = require('../lib/TimeMapping'),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    //selectQueryStringBase = "SELECT a.*, b.state_short FROM running_group AS a, state AS b WHERE a.state_id = b.id AND group_id=\"%s\"",
    selectQueryStringBase = "SELECT a.* FROM running_group AS a WHERE a.group_id=\"%s\"",
    selectGroupSchedule = "SELECT day, hour, minute, ampm FROM group_schedule WHERE group_id=\"%s\"",
    selectGroupMember = "SELECT a.id, a.first_name, a.picture FROM member AS a, group_member AS b WHERE a.id = b.member_id AND b.group_id=\"%s\"";

//require('../lib/GetLatLngFromAddress');
router.get('/:group_id', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var groupId = encodeURIComponent(req.params.group_id);
	var queryString = util.format(selectQueryStringBase, groupId);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error || !rows[0]) {
			console.log(error);
			next('route');
			return;
		}
		var data = {};
		data = rows[0];
		data.group_name = decodeURIComponent(data.group_name);
		data.address = decodeURIComponent(data.address);
		data.contact = decodeURIComponent(data.contact);
		data.email = decodeURIComponent(data.email);
		data.website = decodeURIComponent(data.website);
		data.description = decodeURIComponent(data.description);
		data.payment = decodeURIComponent(data.payment);
		data.user = req.user;

		//queryString = util.format(selectGroupMember, data.id);
		getGroupSchedule(data.id, function (error, schedule) {
			if (schedule) {
				data.schedule = schedule;
			}

			getGroupMember(data.id, function (error, members) {
				if (error) {
					console.log(error);
					res.render('group', {data : data});
					return;
				}
				var isMember = false;
				for (var i = 0; i < members.length; i++) {
					if (req.user && members[i].id == req.user.id) {
						isMember = true;
					}
				}
				data.members   = members;
				data.is_member = isMember;

				console.log(data);
				res.render('group', {data : data});
			});
		});
	});
});

function getGroupSchedule (gid, callback) {
	var queryString = util.format(selectGroupSchedule, gid);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			callback(error, null)
			return;
		}
		var length = rows.length;
		for (var i = 0; i < length; i ++) {
			rows[i].day = TimeMapping.getDayString(rows[i].day);
			rows[i].ampm = TimeMapping.getAmPmString(rows[i].ampm);

			rows[i].hour = rows[i].hour < 10 ? '0' + rows[i].hour.toString() : rows[i].hour.toString();
			rows[i].minute = rows[i].minute < 10 ? '0' + rows[i].minute.toString() : rows[i].minute.toString();
		}
		callback(null, rows);
	});
};

function getGroupMember (gid, callback) {
	queryString = util.format(selectGroupMember, gid);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			callback(error, null)
			return;
		}
		callback(null, rows);
	});
};

module.exports = router;