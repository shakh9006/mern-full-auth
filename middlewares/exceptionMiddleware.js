const RouterException = require('../exceptions/routerException');

module.exports = function (err, req, res, next) {
	if (err instanceof RouterException) {
		return  res.status(err.status).json({message: err.message});
	}
	return res.status(500).json({message: err.message});
};