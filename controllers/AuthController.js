const AuthService = require('../services/AuthService');

class AuthController {
	async register(req, res, next) {
		try {
			const {username, email, password} = req.body;
			const result = await AuthService.register(username, email, password);
			res.cookie('refreshToken', result.refreshToken, {maxAge: 24 * 60 * 60 * 1000 * 7, httpOnly: true});
			res.send(result);
		} catch (err) {
			next(err);
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body;
			const result = await AuthService.login(email, password);
			res.cookie('refreshToken', result.refreshToken, {maxAge: 24 * 60 * 60 * 1000 * 7, httpOnly: true});
			res.send(result);
		} catch (err) {
			next(err);
		}
	}

	async logout(req, res, next) {
		try {

		} catch (err) {
			next(err);
		}
	}

	async refreshToken(req, res, next) {
		try {

		} catch (err) {
			next(err);
		}
	}

	async getUsers(req, res, next) {
		try {

		} catch (err) {
			next(err);
		}
	}

	async getAccessToken(req, res, next) {
		try {

		} catch (err) {
			next(err);
		}
	}

	async activationLink(req, res, next) {
		try {

		} catch (err) {
			next(err);
		}
	}
}

module.exports = new AuthController();