function addClassName (name) {
	if (this.className.indexOf(name) === -1) {
		this.className += (" " + name);
	}
};

function removeClassName (name) {
	var index, length;
	if ((index = this.className.indexOf(name)) !== -1) {
		this.className = this.className.replace(name, "");
	}
};
var emailRegex = /.+\@.+\..+/g;
var MyQueryString = {
	parse : function (queryString) {
		var result = {};
		var queryArray = queryString.split('&');
		var queryItem;
		var length = queryArray.length;
		for (var i = 0; i < length; i ++) {
			queryItem = queryArray[i].split('=');
			console.log(queryItem);
			result[queryItem[0]] = queryItem[1];
		}
		return result;
	},
	stringify : function(query) {
		var result = "";
		for (var a in query) {
			if (query.hasOwnProperty(a)) {
				result += (a + "=" + query[a] + "&");
			}
		}
		if (result.length > 0) {
			result = result.slice(0, result.length - 1);
		}
		return result;
	}
}