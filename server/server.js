var express = require('express'),
    bodyParser = require('body-parser'),
    looger = require('morgan'),
    path = require('path'),
    methodOverride = require('method-override'),
    dust_engine = require('dustjs-linkedin'),
    dust_helper = require('dustjs-helpers'),
    cons = require('consolidate'),
    app = express(),
    auth = require('../routes/auth'),
    home = require('../routes/home'),
    region = require('../routes/region'),
    error = require('../routes/error'),
    httpLogFile;

// setting up template engine
app.set('port', process.env.PORT | 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'dust');
app.engine('dust', cons.dust);
cons.dust.debugLevel = 'DEBUG';

//app.use(logger('combined', {stream: httpLogFile}))
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '../public')));

app.use(auth);
app.use(home);
app.use(region);
app.use(error);

app.listen(app.get('port'), function () {
	console.log("server now listen to port", app.get('port'));
});