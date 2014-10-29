var util = require('util');
var ModuleMysql = require('../modules/ModuleMysql').getInstance();
var HttpsGet = require('../lib/HttpsGet');
var city='la', state ='ca';
var selectQuerySTring = "SELECT * FROM running_group";
var insertQueryString = "UPDATE running_group SET lat='%s', lng='%s' WHERE id=%s";

var selectCityQueryString = "SELECT * FROM city WHERE city_origin='%s'";
var insertCityQueryString = "INSERT city (city_origin, under_county_id) VALUES ('%s', %s)";

var selectCountyQueryString = "SELECT * FROM county WHERE county_origin='%s'";
var insertCountyQueryString = "INSERT county (county_origin, under_state_id) VALUES ('%s', %s)";

var selectStateQueryString = "SELECT * FROM state WHERE state_origin='%s'";
var insertStateQueryString = "INSERT state (state_origin, state_short, under_country_id) VALUES ('%s', '%s', %s)";

var selectCountryQueryString = "SELECT * FROM country WHERE country_origin='%s'";
var insertCountryQueryString = "INSERT INTO country (country_origin, country_short) VALUES ('%s', '%s')";

var updatePlaceQueryString = "UPDATE running_group SET country_id=%s, state_id=%s, county_id=%s, city_id=%s, lat='%s', lng='%s' WHERE id=%s";

var geocodingBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=AIzaSyCoq2mE4Ywhw2Lw5XzzBeWVc603qgA6RcE";
ModuleMysql.execute(selectQuerySTring, function (error, rows) {
	if (error) {
		console.log(error);
		return;
	}
	function callGeocoding (index) {
		if (index === rows.length) {// reach the end of records
			console.log('ending import.. leaving loop');
		} else {
			var address = encodeURIComponent(rows[index].address);
			var geocodingUrl = util.format(geocodingBaseUrl, address);
			HttpsGet.getHttpResponse(geocodingUrl, function (error, data) {
				if (error) {
					console.log(error);
					return;
				}
				var id = rows[index].id;
				var jsonData = JSON.parse(data);
				if (jsonData.status === 'OK'){
					var addressComponents = jsonData.results[0].address_components;
					var location = jsonData.results[0].geometry.location;
					var lat = location.lat.toString();
					var lng = location.lng.toString();
					var place = {
						city : null,
						county : null,
						state  : null,
						state_short : null,
						country : null,
						country_short : null,
						lat: lat,
						lng: lng
					};
					var queryString;
					//console.log(data);
					for (var i = 0; i < addressComponents.length; i++) {
						if (addressComponents[i].types[0] === "locality") {
							place.city = addressComponents[i].long_name;
						} else if (addressComponents[i].types[0] === "administrative_area_level_2") {
							place.county = addressComponents[i].long_name;
						} else if (addressComponents[i].types[0] === "administrative_area_level_1") {
							place.state = addressComponents[i].long_name;
							place.state_short = addressComponents[i].short_name;
						} else if (addressComponents[i].types[0] === "country") {
							place.country = addressComponents[i].long_name;
							place.country_short = addressComponents[i].short_name;
						}
					}
					updatePlace(place, id);
					queryString = util.format(insertQueryString, lat, lng, id);
					/*ModuleMysql.execute(queryString, function (error, _rows) {
						if (error) {
							console.log(error);
							return;
						}
						console.log(index);
						console.log(_rows);
						console.log("address: "+ rows[index].address + " lat:" + lat + " lng:" + lng);
					});*/
				}
			});
			setTimeout(function () {callGeocoding(index+1)}, 1500);
		}
	}
	callGeocoding(0);
});

function updatePlace (place, id) {
	console.log(place);
	var queryString;
	if (place.country) {
		queryString = util.format(selectCountryQueryString, encodeURIComponent(place.country));
		console.log(queryString);
		updateCountry(place, function (country_id) {
			updateState(place, country_id, function (state_id) {
				updateCounty(place, state_id, function (county_id) {
					updateCity(place, state_id, function (city_id) {
						queryString = util.format(updatePlaceQueryString, country_id, state_id, county_id, city_id, place.lat, place.lng, id);
						console.log(queryString);
						ModuleMysql.execute(queryString, function (error, _rows) {
							if (error) {
								console.log(error);
								return;
							}
							console.log(_rows);
							//console.log("address: "+ rows[index].address + " lat:" + lat + " lng:" + lng);
						});
					});
				});
			});
		});
	}
}

function updateCountry (place, callback) {
	var queryString = util.format(selectCountryQueryString, encodeURIComponent(place.country));
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
		if (rows.length == 0) {
			queryString = util.format(insertCountryQueryString, encodeURIComponent(place.country), encodeURIComponent(place.country_short));
			console.log(queryString);
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
};

function updateState (place, country_id, callback) {
	queryString = util.format(selectStateQueryString, encodeURIComponent(place.state));
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
		if (rows.length == 0) {
			queryString = util.format(insertStateQueryString, encodeURIComponent(place.state), encodeURIComponent(place.state_short), country_id);
			console.log(queryString);
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
}

function updateCounty (place, state_id, callback) {
	queryString = util.format(selectCountyQueryString, encodeURIComponent(place.county));
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
		if (rows.length == 0) {
			queryString = util.format(insertCountyQueryString, encodeURIComponent(place.county), state_id);
			console.log(queryString);
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
}

function updateCity (place, county_id, callback) {
	queryString = util.format(selectCityQueryString, encodeURIComponent(place.city));
	console.log(queryString);
	ModuleMysql.execute(queryString, function (error, rows) {
		if (error) {
			console.log(error);
			return;
		}
		console.log(rows);
		if (rows.length == 0) {
			queryString = util.format(insertCityQueryString, encodeURIComponent(place.city), county_id);
			console.log(queryString);
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
}


