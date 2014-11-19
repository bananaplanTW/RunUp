var util = require('util');
var ModuleMysql = require('../modules/ModuleMysql').getInstance();

var truncateSearchIndexQueryString = "TRUNCATE TABLE search_index";
var insertSearchIndexQueryString = "INSERT INTO search_index (id, group_id, group_name, address, country, state, county, city) VALUES ";
var searchIndexValues = "(%s, \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\", \"%s\")";

var selectRunningGroupQueryString = "SELECT a.id, a.group_id, a.group_name, a.address, b.country_origin, c.state_origin, d.county_origin, e.city_origin FROM (((running_group AS a LEFT JOIN country AS b ON a.country_id = b.id) LEFT JOIN state AS c ON a.state_id = c.id ) LEFT JOIN county AS d ON a.county_id = d.id) LEFT JOIN city AS e ON a.city_id = e.id"

function update () {
	ModuleMysql.execute(truncateSearchIndexQueryString, function (error, rows) {
		if (error) {
			return;
		}
		ModuleMysql.execute(selectRunningGroupQueryString, function (error, running_group_indices) {
			if (error) {
				console.log(error);
				return;
			}
			var queryString = insertSearchIndexQueryString;
			var values, running_group_index;
			var length = running_group_indices.length;
			if (length > 0) {
				for (var i = 0; i < length; i ++) {
					running_group_index = running_group_indices[i];
					values = util.format(searchIndexValues, 
						running_group_index.id, 
						decodeURIComponent(running_group_index.group_id), 
						decodeURIComponent(running_group_index.group_name), 
						decodeURIComponent(running_group_index.address), 
						decodeURIComponent(running_group_index.country_origin), 
						decodeURIComponent(running_group_index.state_origin), 
						decodeURIComponent(running_group_index.county_origin), 
						decodeURIComponent(running_group_index.city_origin));
					queryString += (values + ",");
				}
				queryString = queryString.slice(0, queryString.length - 1);
				console.log(queryString);
				ModuleMysql.execute(queryString, function (error, rows) {
					if (error) {
						console.log(error);
						return;
					}
					console.log(rows);
				});
			}
		});
	})
}
exports.update = update;