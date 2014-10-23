var https = require('https');
exports.getHttpResponse = function (url, callback) {
    var request = https.get(url, function (response) {
        var data = "";
        response.on('data', function (chunk) {
            data += chunk.toString();
        });
        response.on('end', function () {
            if (response.statusCode === 200) {
                callback(null, data);
            } else {
                callback('url not found', null);
            }
        });;
    });
    request.on('error', function (e) {
        console.log(e);
        callback(e, null);
    });
    request.end();
};