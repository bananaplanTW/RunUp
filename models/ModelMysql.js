var mysql = require('mysql');

var ModelMysql = function () {
    this.conn = mysql.createConnection({
                    host: 'db.bitnamiapp.com',
                    user: 'root',
                    database: 'musicrun',
                    password: 'Sunflower123'
                });
    this.conn.connect(function (error) {
        if (error) {
            console.error(error);
            return;
        }
        console.log("db is connected");
    })
};

ModelMysql.prototype.execute = function (queryString, callback) {
    this.conn.query(queryString, function (error, rows) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, rows);
    });
};

ModelMysql.prototype.end = function (callback) {
    try {
        this.conn.end();
        callback();
    } catch (e) {
        callback(e);
    }
}

module.exports = ModelMysql;