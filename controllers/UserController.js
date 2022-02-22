const UserService = require('../services/UserService');

class UserController {
	async register(req, res, next) {
		try {
			const {username, email, password} = req.body;
			const result = await UserService.register(username, email, password);
			res.cookie('refreshToken', result.refreshToken, {maxAge: 39 * 24 * 60 * 60 * 1000 * 7, httpOnly: true});
			res.send(result);
		} catch (err) {
			next(err);
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body;
			const result = await UserService.login(email, password);
			res.cookie('refreshToken', result.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000 * 7, httpOnly: true});
			res.send(result);
		} catch (err) {
			next(err);
		}
	}

	async logout(req, res, next) {
		try {
			const {refreshToken} = req.cookies;
			const data = await UserService.logout(refreshToken);
			res.clearCookie('refreshToken');
			res.send(data);
		} catch (err) {
			next(err);
		}
	}

	async refreshToken(req, res, next) {
		try {
			const {refreshToken} = req.cookies;
			const result = await UserService.refresh(refreshToken);
			res.cookie('refreshToken', result.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000 * 7, httpOnly: true});
			res.send(result);
		} catch (err) {
			next(err);
		}
	}

	async getUsers(req, res, next) {
		try {
			const users = await UserService.getUsers();
			res.send(users)
		} catch (err) {
			next(err);
		}
	}

	async activationLink(req, res, next) {
		try {
			const {link} = req.params;
			await UserService.activate(link);
			res.redirect(process.env.CLIENT_URL);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new UserController();