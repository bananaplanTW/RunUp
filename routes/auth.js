var express = require('express'),
    router  = express.Router();

router.use(function (req, res, next) {
console.log(req);
    // use this to check what the user type is
    console.log("in auth, need to set up authentication process");
    req.facebook.api('/me', function (error, user) {
        if(error) {
            console.log('error occurred', error);
            return;
        }
        console.log(user);
    });
    next();
});

module.exports = router;