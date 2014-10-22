var express = require('express'),
    router  = express.Router();

router.use(function (req, res, next) {
	// use this to check what the user type is
	console.log("in auth, need to set up authentication process");
	next();
});

module.exports = router;