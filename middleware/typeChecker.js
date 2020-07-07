'use strict'

const typeChecker = (req, res, next) => {
	// API responds to empty requests with page 1
	// if req.body is not an empty obect, check for type and content
	if (!(Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
		if (typeof (req.body.pages) === "number" &&
			req.body.pages > 0 &&
			req.body.pages < 6)
			next();
		else res.status(400).send('Page argument must be a number between 1 and 5');
	}
	else next();
};

module.exports = typeChecker;