var express = require('express'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    looger = require('morgan'),
    path = require('path'),
    methodOverride = require('method-override'),
    dust_engine = require('dustjs-linkedin'),
    dust_helper = require('dustjs-helpers'),
    cons = require('consolidate'),
    app = express(),
    auth = require('../routes/auth'),
    status = require('../routes/status'),
    fblogin = require('../routes/fblogin'),
    signup = require('../routes/signup'),
    login = require('../routes/login'),
    logout = require('../routes/logout'),
    join = require('../routes/join'),
    home = require('../routes/home'),
    region = require('../routes/region'),
    search = require('../routes/search'),
    post = require('../routes/post'),
    geoCoding = require('../routes/geoCoding'),
    group = require('../routes/group'),
    error = require('../routes/error'),
    httpLogFile;

// setting up template engine
app.set('port', process.env.PORT | 8051);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'dust');
app.engine('dust', cons.dust);
cons.dust.debugLevel = 'DEBUG';

//app.use(logger('combined', {stream: httpLogFile}))
app.use(bodyParser.json());
app.use(multer({
    dest: path.join(__dirname, '../public/assets/images/uploads'), 
    fileSize: 1000,
    onFileUploadStart: function (file) {
        console.log("file starts to upload");
    }}));
app.use(methodOverride());
app.use(cookieParser())
app.use(session({
    key: "ra",
    secret: "Gad@#$5fncd9$2230-=;SDf/][123f",
    store: new MongoStore({
        db: "running_area"
    })}));
app.use(express.static(path.join(__dirname, '../public')));

app.use(auth);
app.use('/status', status);
app.use('/fblogin', fblogin);
app.use('/signup', bodyParser.urlencoded(), signup);
app.use('/login', bodyParser.urlencoded(), login);
app.use('/logout', logout);
app.use('/join', join);
app.use('/search', search);
app.use('/s', search);
app.use('/post', bodyParser.urlencoded(), post);
app.use('/getGeoCoding', geoCoding);
app.use(home);
app.use('/g', group);
app.use('/r', region);
app.use(error);

app.listen(app.get('port'), function () {
	console.log("server now listen to port", app.get('port'));
});
