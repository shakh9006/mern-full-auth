const RouterException = require('../exceptions/routerException');
const UserService = require('../services/UserService');

module.exports = async (req, res, next) => {
	try {
		const user = await UserService.findOneBy('_id', req.user.id);
		if ( !user || user.role !== 1 )
			return next(RouterException.UnauthorizedError());
		next();
	} catch (err) {
		return next(RouterException.UnauthorizedError());
	}

}