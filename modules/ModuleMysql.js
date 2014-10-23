var ModelMysql = require('../models/ModelMysql');
var ModuleMysql = (function () {
	var instance;
	function getInstance () {
		var modelMysql = new ModelMysql();
		var a = 0;
		return {
			execute: function (queryString, callback) {
				a ++;
				console.log(a);
				modelMysql.execute(queryString, callback);
			},
			close: function (callback) {
				modelMysql.end(callback);
			}
		}
	}
	return {
		getInstance: function () {
			if (typeof(instance) === 'undefined') {
				instance = getInstance();
			}
			console.log(instance);
			return instance;
		}
	}
})();

module.exports = ModuleMysql;