const RouterException = require('../exceptions/routerException');
const TokenService = require('../services/TokenService');

module.exports = async (req, res, next) => {
	try {
		const {authorization} = req.headers;
		if ( !authorization )
			return next(RouterException.UnauthorizedError());

		const [, accessToken] = authorization.split(' ');
		if ( !accessToken )
			return next(RouterException.UnauthorizedError());

		const userData = TokenService.verifyAccessToken(accessToken);
		if ( !userData )
			return next(RouterException.UnauthorizedError());

		req.user = userData;
		next();
	} catch (e) {
		return next(RouterException.UnauthorizedError());
	}
}