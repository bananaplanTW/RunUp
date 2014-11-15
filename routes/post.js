var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    moduleLogin = require('../modules/ModuleLogin').getInstance(),
    HttpsGet = require('../lib/HttpsGet'),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    fs = require('fs'),
    multer = require('multer');

var insertToRunningGroupQuery = "INSERT INTO running_group (group_id, group_name, contact, email, website, city_id, county_id, state_id, country_id, address, lat, lng, owner_id, cover_photo) \
													VALUES (\"%s\", \"%s\", '%s', '%s', '%s', %s, %s, %s, %s, '%s', '%s', '%s', %s, '%s')";

var selectCityQueryString = "SELECT * FROM city WHERE city_origin='%s'";
var insertCityQueryString = "INSERT city (city_origin, under_county_id, under_country_id) VALUES ('%s', %s, %s)";

var selectCountyQueryString = "SELECT * FROM county WHERE county_origin='%s'";
var insertCountyQueryString = "INSERT county (county_origin, under_state_id, under_country_id) VALUES ('%s', %s, %s)";

var selectStateQueryString = "SELECT * FROM state WHERE state_origin='%s'";
var insertStateQueryString = "INSERT state (state_origin, state_short, under_country_id) VALUES ('%s', '%s', %s)";

var selectCountryQueryString = "SELECT * FROM country WHERE country_origin='%s'";
var insertCountryQueryString = "INSERT INTO country (country_origin, country_short) VALUES ('%s', '%s')";

var instertGroupMemberQueryString = "INSERT INTO group_member (member_id, group_id) VALUES (%s, %s)";

router.get("/", function (req, res) {
	var data = {};
	data.user = req.user;
	console.log(data);
    res.render("post", {data : data});    
});

router.post("/group", function (req, res) {
    var groupInfo = req.body;
    if (req.user) {
	    var userId = req.user.id;
	    var coverPhotoName = req.files.cover_photo.name;
	    getCountry(groupInfo, function (countryId) {
	    	getState(groupInfo, countryId, function (stateId) {
	    		getCounty(groupInfo, stateId, countryId, function (countyId) {
	    			getCity(groupInfo, countyId, countryId, function (cityId) {
	    				createGroup(groupInfo, countryId, stateId, countyId, cityId, userId, coverPhotoName, function (error, groupData) {
	    					if (error) {
	    						console.error("error", error);
	    						res.render("post");
	    						return;
	    					}
	    					console.log(groupData);
	    					updateGroupMemberInfo (userId, groupData.insertId, function (_error, rows) {
	    						if (error) {
	    							console.log(error);
	    						}
	    						res.redirect("/g/" + groupData.groupId);
	    					})
	    				});
	    			});
	    		});
	    	});
	    });
	} else {
		res.render("post");
	}
});

function createGroup (groupInfo, countryId, stateId, countyId, cityId, userId, coverPhotoName, callback) {
	var groupName = encodeURIComponent(groupInfo.group_name);
	var groupId = encodeURIComponent(groupInfo.group_name.toLowerCase());
	var contact = encodeURIComponent(groupInfo.contact);
	var email = encodeURIComponent(groupInfo.email);
	var website = encodeURIComponent(groupInfo.website);
	var address = encodeURIComponent(groupInfo.address);
	var lat = groupInfo.lat;
	var lng = groupInfo.lng;
	var coverPhotoPath = "/assets/images/uploads/" + coverPhotoName;
	var queryString = util.format(insertToRunningGroupQuery, groupId, groupName, contact, email, website, cityId, countyId, stateId, countryId, address, lat, lng, userId, coverPhotoPath);
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			callback(error, null)
			return;
		}
		rows.groupId = groupId;
		callback(null, rows);
	});
};

function updateGroupMemberInfo (mid, gid, callback) {
	// mid : member_id, gid: group_id in group member
	var queryString = util.format(instertGroupMemberQueryString, mid, gid);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		callback(null, rows);
	});
};

function getCountry (place, callback) {
	if (place.country) {
		var queryString = util.format(selectCountryQueryString, encodeURIComponent(place.country));
		ModuleMysql.execute(queryString, function (error, rows) {
			if (error) {
				console.log(error);
				return;
			}
			if (rows.length == 0) {
				// no such country, add one
				queryString = util.format(insertCountryQueryString, encodeURIComponent(place.country), encodeURIComponent(place.country_short));
				ModuleMysql.execute(queryString, function (error, _rows) {
					if (error) {
						console.log(error);
						return;
					}
					console.log(_rows);
					callback(_rows.insertId);
				});
			} else {
				callback(rows[0].id);
			}
		});
	} else {
		callback(null);
	}
};

function getState (place, country_id, callback) {
	if (place.state) {
		var queryString = util.format(selectStateQueryString, encodeURIComponent(place.state));
		ModuleMysql.execute(queryString, function (error, rows) {
			if (error) {
				console.log(error);
				return;
			}
			if (rows.length == 0) {
				// no such country, add one
				queryString = util.format(insertStateQueryString, encodeURIComponent(place.state), encodeURIComponent(place.state_short), country_id);
				ModuleMysql.execute(queryString, function (error, _rows) {
					if (error) {
						console.log(error);
						return;
					}
					console.log(_rows);
					callback(_rows.insertId);
				});
			} else {
				callback(rows[0].id);
			}
		});
	} else {
		callback(null);
	}
};

function getCounty (place, state_id, country_id, callback) {
	if (place.county) {
		var queryString = util.format(selectCountyQueryString, encodeURIComponent(place.county));
		ModuleMysql.execute(queryString, function (error, rows) {
			if (error) {
				console.log(error);
				return;
			}
			if (rows.length == 0) {
				// no such country, add one
				queryString = util.format(insertCountyQueryString, encodeURIComponent(place.county), state_id, country_id);
				ModuleMysql.execute(queryString, function (error, _rows) {
					if (error) {
						console.log(error);
						return;
					}
					console.log(_rows);
					callback(_rows.insertId);
				});
			} else {
				callback(rows[0].id);
			}
		});
	} else {
		callback(null);
	}
};

function getCity (place, county_id, country_id, callback) {
	if (place.city) {
		var queryString = util.format(selectCityQueryString, encodeURIComponent(place.city));
		ModuleMysql.execute(queryString, function (error, rows) {
			if (error) {
				console.log(error);
				return;
			}
			if (rows.length == 0) {
				// no such country, add one
				queryString = util.format(insertCityQueryString, encodeURIComponent(place.city), county_id, country_id);
				ModuleMysql.execute(queryString, function (error, _rows) {
					if (error) {
						console.log(error);
						return;
					}
					console.log(_rows);
					callback(_rows.insertId);
				});
			} else {
				callback(rows[0].id);
			}
		});
	} else {
		callback(null);
	}
};

module.exports = router;