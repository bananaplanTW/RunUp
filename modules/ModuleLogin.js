var ModelMysql = require('../models/ModelMysql');
var ModuleLogin = (function () {
	var instance;
	function getInstance () {
		var modelMysql = new ModelMysql();
		var a = 0;
		return {
			execute: function (queryString, callback) {
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
			return instance;
		}
	}
})();

module.exports = ModuleLogin;