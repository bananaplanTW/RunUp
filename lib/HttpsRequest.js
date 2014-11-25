var https = require('https');

function HTTPRequest = function () {
	this.options;
	this.req;
};

HTTPRequest.prototype.setOptions = function(options) {
	this.options = options;
};

HTTPRequest.prototype.sendRequest = function(data, callback) {
	this.req = http.request(this.options, function (res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on('data', function (chunk) {
			console.log('chunk: ' + chunk);
		});
		res.on('end', function () {
			callback();
		});
	});
	this.req.on('error', function (e) {
		console.error(e.message);
	});
	this.req.write(data);
	this.req.end();
};