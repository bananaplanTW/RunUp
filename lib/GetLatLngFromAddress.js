var util = require('util');
var ModuleMysql = require('../modules/ModuleMysql').getInstance();
var HttpsGet = require('../lib/HttpsGet');
var city='la', state ='ca';
var selectQuerySTring = "SELECT * FROM running_group";
var insertQueryString = "UPDATE running_group SET lat='%s', lng='%s' WHERE id=%s";
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
					var location = jsonData.results[0].geometry.location;
					var lat = location.lat.toString();
					var lng = location.lng.toString();
					var queryString = util.format(insertQueryString, lat, lng, id);
					console.log(queryString);
					ModuleMysql.execute(queryString, function (error, _rows) {
						if (error) {
							console.log(error);
							return;
						}
						console.log(index);
						console.log(_rows);
						console.log("address: "+ rows[index].address + " lat:" + lat + " lng:" + lng);
					});
				}
			});
			setTimeout(function () {callGeocoding(index+1)}, 1500);
		}
	}
	callGeocoding(0);
});