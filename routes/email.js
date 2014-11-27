var express = require('express'),
	router  = express.Router(),
	nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport();

router.post('/', function (req, res) {
	var body = req.body;
	console.log(body);
	var mailOptions = {
	    from: body.email, // sender address
	    to: 'support@bananaplan.com', // list of receivers
	    subject: body.name + '給Running Area的建議', // Subject line
	    text: body.comment
	};
	console.log(mailOptions);
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent: ' + info);
	    }
	    res.writeHead(200);
	    res.end();
	});
});

module.exports = router;