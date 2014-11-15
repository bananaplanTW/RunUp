var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectCityQueryStringBase = "SELECT a.*, b.country_short, b.country_origin, c.state_short, c.state_origin, d.city_origin FROM running_group AS a, country AS b, state AS c, city AS d WHERE a.country_id = b.id AND a.state_id = c.id AND a.city_id = d.id AND c.state_short = \"%s\" AND d.city_origin = \"%s\" LIMIT %s, 10";
    selectStateQueryStringBase = "SELECT a.*, b.country_short, b.country_origin, c.state_short, c.state_origin FROM running_group AS a, country AS b, state AS c WHERE a.country_id = b.id AND a.state_id = c.id AND c.state_short = \"%s\" LIMIT %s, 10",
    selectGroupMember = "SELECT a.id, a.first_name, a.picture, b.group_id FROM member AS a, group_member AS b WHERE a.id = b.member_id AND (",
    andGroupIdEqualsTo = " b.group_id=%s ";

//require('../lib/GetLatLngFromAddress');
router.get('/:country/:state', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var country = encodeURIComponent(req.params.country);
	var state = encodeURIComponent(req.params.state);
	var page  = req.query.p || '1';
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = util.format(selectStateQueryStringBase, state, offset);
	ModuleMysql.execute(queryString, function (error, groups) {
		if (error) {
			console.log(error);
			next('route');
			//return;
		}
		if (groups.length == 0) {
			res.render('region');
			return;
		}

		var data = {};
		data.groups = groups;		
		// construct the string of finding members in group
		queryString = selectGroupMember;
		groups.forEach (function (group) {
			queryString += util.format(andGroupIdEqualsTo, group.id);
			queryString += "OR ";
		});
		queryString = queryString.slice(0, queryString.length - 3);
		queryString += ')';
		ModuleMysql.execute(queryString, function (error, groupMemberPair) {
			if (error) {
				console.log(error);
				//res.render('region', {data : data});
				return;
			}

			// matching the pair of members to groups
			for (var i = 0; i < groupMemberPair.length; i ++) {
				var group_id = groupMemberPair[i].group_id;
				for (var j = 0; j < data.groups.length; j ++) {
					if (data.groups[j].id === group_id) {
						if (!data.groups[j].members) {
							data.groups[j].members = [];
						}
						if (data.groups[j].members.length < 5) {
							data.groups[j].members.push(groupMemberPair[i]);
						}
						break;
					}
				}
			}

			for (var j = 0; j < data.groups.length; j ++) {
				data.groups[j].group_name = decodeURIComponent(data.groups[j].group_name);
				data.groups[j].address = decodeURIComponent(data.groups[j].address);
			}

			// pagination
			if (page > 1) {
				data.prevPage = parseInt(page) - 1;
			}
			if (groups.length == 10) {
				data.nextPage = parseInt(page) + 1;
			}

			// send user data back
			data.user = req.user;
			res.render('region', {data : data});
		});

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
		data.user = req.user;
		res.render('region', {data : data});
	});
});

module.exports = router;