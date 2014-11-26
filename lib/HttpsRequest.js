var http = require('http');

function HTTPRequest () {
	this.options;
	this.req;
};

HTTPRequest.prototype.setOptions = function(options) {
	this.options = options;
};

HTTPRequest.prototype.sendRequest = function(data, boundary, callback) {
	console.log(this.options);
	this.req = http.request(this.options, function (res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('chunk: ' + chunk);
		});
		res.on('end', function () {
			console.log("end");
			callback();
		});
	});
	this.req.on('error', function (e) {
		console.error(e.message);
	});

	var bodyHead = boundary + "\r\n" 
				+ 'Content-Disposition: form-data; name="cover_photo"; filename="daz.jpg"\r\n'
				+ 'Content-Type: image/jpeg\r\n'
				+ 'Content-Transfer-Encoding: base64\r\n\r\n'
	var bodyend = "\r\n" + boundary + "--\r\n";

	this.req.write(bodyHead);
	this.req.write(data);
	this.req.write(bodyend);
	this.req.end();
};

var HTTPRequestObj = new HTTPRequest();
module.exports = HTTPRequestObj;