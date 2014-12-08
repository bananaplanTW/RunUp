var util = require('util'),
	express = require('express'),
    router  = express.Router(),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    selectGroupMember = "SELECT a.id, c.first_name, c.picture, b.group_id FROM account_info AS a, group_member AS b, settings AS c WHERE a.id = b.member_id AND a.account = c.account AND (",
    selectStateQueryStringBase = "SELECT i.* FROM (\
SELECT a.*, b.country_short, b.country_origin, c.state_short, c.state_origin FROM running_group AS a, country AS b, state AS c WHERE a.country_id = b.id AND a.state_id = c.id AND c.state_short = \"%s\" \
) AS i JOIN group_schedule AS j ON i.id = j.group_id",
	searchQueryString = "SELECT y.*, z.cover_photo, z.lat, z.lng%s%s FROM \
running_group AS z%s%s, \
	(SELECT * FROM search_index WHERE \
	MATCH(group_name, country, state, county, city, address) AGAINST(\"%s*\" IN BOOLEAN MODE) OR \
	MATCH(group_name, country, state, county, city, address) AGAINST(\"%s\") \
	ORDER BY id DESC) AS y \
WHERE z.id = y.id",
	fullSearchQueryString = "SELECT y.*, z.cover_photo, z.lat, z.lng%s%s FROM \
running_group AS z%s%s, \
	(SELECT * FROM search_index WHERE group_name LIKE \"%%%s%%\" \
	ORDER BY id DESC) AS y \
WHERE z.id = y.id",
	searchWithDayOrTimeQueryString = "SELECT i.* FROM (SELECT y.*, z.cover_photo, z.lat, z.lng%s%s FROM \
running_group AS z%s%s, \
	(SELECT * FROM search_index WHERE \
	MATCH(group_name, country, state, county, city, address) AGAINST(\"%s*\" IN BOOLEAN MODE) OR \
	MATCH(group_name, country, state, county, city, address) AGAINST(\"%s\") \
	ORDER BY id DESC) AS y \
WHERE z.id = y.id %s) AS i JOIN group_schedule AS j ON i.id = j.group_id",
	fullSearchWithDayOrTimeQueryString = "SELECT i.* FROM (SELECT y.*, z.cover_photo, z.lat, z.lng%s%s FROM \
running_group AS z%s%s, \
	(SELECT * FROM search_index WHERE group_name LIKE \"%%%s%%\" \
	ORDER BY id DESC) AS y \
WHERE z.id = y.id %s) AS i JOIN group_schedule AS j ON i.id = j.group_id",
	regionQueryString = " AND b.country_short = \"%s\" AND c.state_short = \"%s\"",
	selectCountry = ", b.country_short",
	joinCountry = " JOIN country AS b ON z.country_id = b.id",
	selectState = ", c.state_short",
	joinState = " JOIN state AS c ON z.state_id = c.id",
	where = "WHERE",
	dayEqualsTo = " j.day = %s ",
	limit = " LIMIT %s, 10 ",
	groupByID = " GROUP BY i.id";

//require('../lib/GetLatLngFromAddress');
router.get('/', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var query = req.query.q;
	var page  = req.query.p || '1';
	var day   = req.query.day;
	var time  = req.query.time;
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = getSearchQueryString(query, day, time, offset, false);
	console.log(queryString);
	if (!query) {
		res.render('search', {data: {
			user: req.user
		}});
		return;
	}

	ModuleMysql.execute(queryString, function (error, groups) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}

		if (groups.length === 0) {
			queryString = getSearchQueryString(query, day, time, offset, true);
console.log(queryString);
			ModuleMysql.execute(queryString, function (error, fullSearchGroups) {
				if (error) {
					console.log(error);
					next('route');
					return;
				}
				if (fullSearchGroups.length == 0) {
					res.render('search', {data: {
						user: req.user,
						q: query
					}});
					return;
				}
				handleGroupData(req, res, query, fullSearchGroups, null, null, page);
			});
		} else {
			handleGroupData(req, res, query, groups, null, null, page);
		}
	});
});

router.get('/:country_short/:state_short', function (req, res, next) {
	// should set up checking process to prevent sql injection
	var country_short = req.params.country_short;
	var state_short = encodeURIComponent(req.params.state_short);
	var query = req.query.q;
	var day = req.query.day;
	var time = req.query.time;
	var page  = req.query.p || '1';
	var offset = ((parseInt(page) - 1)*10).toString();
	var queryString = getSearchInARegionQueryString(query, offset, day, time, country_short, state_short, false);
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, groups) {
		if (error) {
			console.log(error);
			next('route');
			return;
		}

		if (groups.length === 0) {
			queryString = getSearchInARegionQueryString(query, offset, day, time, country_short, state_short, true);
			console.log(queryString);
			ModuleMysql.execute(queryString, function (error, fullSearchGroups) {
				if (error) {
					console.log(error);
					next('route');
					return;
				}
				if (fullSearchGroups.length == 0) {
					res.render('search', {data: {
						user: req.user,
						q: query
					}});
					return;
				}
				handleGroupData(req, res, query, fullSearchGroups, country_short, state_short, page);
			});
		} else {
			handleGroupData(req, res, query, groups, country_short, state_short, page);
		}
	});
});

function getSearchQueryString (query, day, time, offset, is_full) {
	var queryString = getBaseSearchQueryString(query, day, time, "", "", "", "", " ", offset, is_full);
	queryString = getSearchWithDayTimeQueryString(queryString, day, time);
	queryString = getSearchLimitQueryString(queryString, offset);
	return queryString;
}

function getSearchInARegionQueryString (query, offset, day, time, country_short, state_short, is_full) {
	var region = util.format(regionQueryString, country_short, state_short);
	var queryString = getBaseSearchQueryString(query, day, time, selectCountry, joinCountry, selectState, joinState, region, offset, is_full);
	queryString = getSearchWithDayTimeQueryString(queryString, day, time);
	queryString = getSearchLimitQueryString(queryString, offset);
	return queryString;
}

function getBaseSearchQueryString (query, day, time, select_country, join_country, select_state, join_state, region, offset, is_full) {
	var queryString;
	if (day || time) {
		if (is_full) {
			queryString = util.format(fullSearchWithDayOrTimeQueryString, select_country, select_state, join_country, join_state, query, region);
		} else {
			queryString = util.format(searchWithDayOrTimeQueryString, select_country, select_state, join_country, join_state, query, query, region);
		}
	} else {
		if (is_full) {
			queryString = util.format(fullSearchQueryString, select_country, select_state, join_country, join_state, query, region);
		} else {
			queryString = util.format(searchQueryString, select_country, select_state, join_country, join_state, query, query, region);
		}
	}
	return queryString;
}

function getSearchWithDayTimeQueryString (queryString, day, time) {
	if (day) {
		var dayQueryString
		if (day.length == 1) {
			dayQueryString = " WHERE ( " + util.format(dayEqualsTo, day) + ")";
		} else {
			var dayLength = day.length;
			dayQueryString = " WHERE ( "
			for (var i = 0; i < dayLength; i ++) {
				dayQueryString += (util.format(dayEqualsTo, day[i]) + "OR");
			}
			dayQueryString = dayQueryString.slice(0, dayQueryString.length - 2) + ")";
		}
		queryString += dayQueryString;
	}
	if (time) {
		var timeQueryString = day ? " AND " : " WHERE ";
		if (time.length === 1) {
			timeQueryString += (getTimeQueryString(time));
		} else if (time.length === 2) {
			timeQueryString += ( " ( " + getTimeQueryString(time[0]) + " OR " + getTimeQueryString(time[1]) + " )");
		}
		queryString += timeQueryString;
	}

	if (day || (time && time.length < 3)) {
		queryString += groupByID;
	}
	return queryString;
}

function getSearchLimitQueryString (queryString, offset) {
	queryString += util.format(limit, offset);
	return queryString;
}


function getTimeQueryString (time) {
	switch (time) {
		case '0': //morning
			return "(j.ampm = 0 AND j.hour >= 1 AND j.hour < 12)";
		case '1': //afternoon
			return "(j.ampm = 1 AND j.hour >= 1 AND j.hour < 6)";
		case '2': //night
			return "(j.ampm = 1 AND j.hour >= 6 AND j.hour < 12)";
	}
}


function handleGroupData (req, res, query, groups, country_short, state_short, page) {
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
console.log(queryString);
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
		data.country_short = country_short? country_short : null;
		data.state_short   = state_short? decodeURIComponent(state_short) : null;
		data.q = query;
		res.render('search', {data : data});
	});
}

module.exports = router;