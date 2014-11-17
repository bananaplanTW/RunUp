var DayMapping = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thirsday',
	'Friday',
	'Saturday'
];

var AmPmMapping = [
	'am',
	'pm'
];

function getDayString (day) {
	return DayMapping[day];
};

function getAmPmString (ampm) {
	return AmPmMapping[ampm];
};

module.exports = {
	getDayString: getDayString,
	getAmPmString: getAmPmString
};