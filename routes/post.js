var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    fs = require('fs'),
    request = require('request'),
    crypto = require('crypto'),
    moduleLogin = require('../modules/ModuleLogin').getInstance(),
    HttpsGet = require('../lib/HttpsGet'),
    HTTPSRequest = require('../lib/HttpsRequest'),
    ModuleMysql = require('../modules/ModuleMysql').getInstance(),
    fs = require('fs'),
    multer = require('multer'),
    constructSearchIndexTable = require('../lib/ConstructSearchIndexTable');;

var insertToRunningGroupQuery = "INSERT INTO running_group (group_id, group_name, contact, email, website, city_id, county_id, state_id, country_id, address, lat, lng, owner_id, cover_photo, description, payment) \
													VALUES (\"%s\", \"%s\", '%s', '%s', '%s', %s, %s, %s, %s, '%s', '%s', '%s', %s, '%s', \"%s\", \"%s\")";

var selectCityQueryString = "SELECT * FROM city WHERE city_origin='%s'";
var insertCityQueryString = "INSERT city (city_origin, under_county_id, under_country_id) VALUES ('%s', %s, %s)";

var selectCountyQueryString = "SELECT * FROM county WHERE county_origin='%s'";
var insertCountyQueryString = "INSERT county (county_origin, under_state_id, under_country_id) VALUES ('%s', %s, %s)";

var selectStateQueryString = "SELECT * FROM state WHERE state_origin='%s'";
var insertStateQueryString = "INSERT state (state_origin, state_short, under_country_id) VALUES ('%s', '%s', %s)";

var selectCountryQueryString = "SELECT * FROM country WHERE country_origin='%s'";
var insertCountryQueryString = "INSERT INTO country (country_origin, country_short) VALUES ('%s', '%s')";

var instertGroupMemberQueryString = "INSERT INTO group_member (member_id, group_id) VALUES (%s, %s)";

var instertGroupScheduleQueryString = "INSERT INTO group_schedule (group_id, day, hour, minute, ampm) VALUES ";
var instertGroupScheduleValues = "(%s, %s, %s, %s, %s)";

var insertSurveyQueryString = "INSERT INTO survey (account, email, group_id";

router.get("/", function (req, res) {
	var i18n;
	var data = {};
	var i18n;
	if (req.geo.country === "TW") {
		i18n = require('../i18n/tw');
	} else {
		i18n = require('../i18n/us');	
	}
	data.i18n = i18n;
	data.user = req.user;
    res.render("post", {data : data});    
});

router.post("/group", function (req, res) {
    var groupInfo = req.body;
    if (req.user) {
    	console.log(req.files);
		var userId = req.user.id;
	    var coverPhotoName = req.files.cover_photo ? req.files.cover_photo.name : "cover.png";

	    if (req.files.cover_photo && req.files.cover_photo.overLimit) {
	    	var data = {
	    		warning: "照片大小請小於1mb"
	    	};
	    	res.render("post", {data: data});
	    	return;
	    }
console.log(groupInfo);
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

	    					insertSurvey(req.user.account, groupInfo.email, groupData.insertId, groupInfo.survey);
	    					updateGroupMemberAndScheduleInfo (userId, groupData.insertId, groupInfo, function (_error, rows) {
	    						if (error) {
	    							console.log(error);
	    						}
	    						constructSearchIndexTable.update();

	    						if (req.files.cover_photo) {
		    						savePhotoToImageServer(req.files, function (__error, result) {
		    							if (__error) {
		    								//res.redirect("/g/" + groupData.groupId);
		    								res.redirect("/done");
		    								console.log(__error);
		    								return;
		    							}
		    							//res.redirect("/g/" + groupData.groupId);
		    							res.redirect("/done");
		    						});
		    					} else {
		    						res.redirect("/done");
		    					}
	    						
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

function insertSurvey (account, email, gid, survey) {
	if (typeof(survey) === "string") {
		survey = [survey];
	}

	var length = survey.length;
	var queryString = insertSurveyQueryString;
	for (var i = 0; i < length; i ++) {
		queryString += (", " + survey[i]);
	}
	queryString += ") VALUES (\"" + account + "\", \"" + email + "\", " + gid + ",";
	for (var i = 0; i < length; i ++) {
		queryString += "true, ";
	}
	queryString = queryString.slice(0, queryString.length - 2) + ")";
console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
	});
}


function savePhotoToImageServer (files, callback) {
	var formData = {
		my_field: 'my_value',
		my_buffer: new Buffer([1,2,3]),
		my_file: fs.createReadStream(files.cover_photo.path)
	}
	request.post({url:'http:\/\/image.bitnamiapp.com:3000\/upload', formData: formData}, function (error, response, body) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}
		callback(null, {status: "OK"});
	});
}

//savePhotoToImageServer();

function createGroup (groupInfo, countryId, stateId, countyId, cityId, userId, coverPhotoName, callback) {
	var groupName   = encodeURIComponent(groupInfo.group_name);
	var groupId     = encodeURIComponent(groupInfo.group_name.toLowerCase());
	var contact     = typeof(groupInfo.contact) === 'undefined' ? "N/A": encodeURIComponent(groupInfo.contact);
	var email       = encodeURIComponent(groupInfo.email);
	var website     = typeof(groupInfo.website) === 'undefined'? "N/A" : encodeURIComponent(groupInfo.website);
	var address     = encodeURIComponent(groupInfo.address);
	var description = typeof(groupInfo.description) === 'undefined'? "No description" : encodeURIComponent(groupInfo.description);
	var payment     = typeof(groupInfo.payment) === 'undefined'? "Free" : encodeURIComponent(groupInfo.payment);
	var lat         = groupInfo.lat;
	var lng         = groupInfo.lng;
	var coverPhotoPath = coverPhotoName;
	var queryString = util.format(insertToRunningGroupQuery, groupId, groupName, contact, email, website, cityId, countyId, stateId, countryId, address, lat, lng, userId, coverPhotoPath, description, payment);
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

function updateGroupMemberAndScheduleInfo (mid, gid, groupInfo, callback) {
	// mid : member_id, gid: group_id in group member
	var queryString = util.format(instertGroupMemberQueryString, mid, gid);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			callback(error, null);
			return;
		}

		var length = groupInfo.day.length;
		if (length > 0) {
			var values = "";
			for (var i = 0; i < length; i ++) {
				values += util.format(instertGroupScheduleValues, gid, groupInfo.day[i], groupInfo.hour[i], groupInfo.minute[i], groupInfo.ampm[i]);
				values += ","
			}
			values = values.slice(0, values.length-1);
			queryString = instertGroupScheduleQueryString + values;
			ModuleMysql.execute(queryString, function (error, _rows) {
				if (error) {
					console.log(error);
					callback(error, null);
					return;
				}
				callback(null, _rows);
			});
		} else {
			callback(null, rows);
		}
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