var express = require('express'),
    router  = express.Router(),
    util = require('util'),
    HttpsGet = require('../lib/HttpsGet');

var geocodingBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=AIzaSyCoq2mE4Ywhw2Lw5XzzBeWVc603qgA6RcE";

router.get("/", function (req, res) {
	var address = req.query.address;
	var geocodingUrl = util.format(geocodingBaseUrl, address);
    HttpsGet.getHttpResponse(geocodingUrl, function (error, data) {
		if (error) {
			res.writeHead(404, {
				'Content-Type' : 'application/json'
			});
			res.end();
			return;
		}
		var jsonData = JSON.parse(data);
		if (jsonData.status === 'OK'){
			var addressComponents = jsonData.results[0].address_components;
			var location = jsonData.results[0].geometry.location;
			var lat = location.lat.toString();
			var lng = location.lng.toString();
			var place = {
				status: 'OK',
				city : null,
				county : null,
				state  : null,
				state_short : null,
				country : null,
				country_short : null,
				lat: lat,
				lng: lng
			};
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
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			res.write(JSON.stringify(place))
			res.end();
		} else {
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			var result = {
				status : "NOTFOUND",
				message : "找不到地址"
			};
			res.write(JSON.stringify(result));
			res.end();
		}
	}); 
});

module.exports = router;