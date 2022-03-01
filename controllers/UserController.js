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

	async getUserData(req, res, next) {
		try {
			const {id} = req.user;
			const users = await UserService.getUserData(id);
			res.send(users)
		} catch (err) {
			next(err);
		}
	}

	async activationLink(req, res, next) {
		try {
			const {link} = req.body;
			await UserService.activate(link);
			res.json({message: 'Account activated'});
		} catch (err) {
			next(err);
		}
	}

	async getAccessToken(req, res, next) {
		try {
			const {refreshToken} = req.cookies;
			const accessToken = await UserService.getAccessToken(refreshToken);
			res.json({accessToken});
		} catch (err) {
			next(err);
		}
	}

	async forgotPassword(req, res, next) {
		try {
			const {email} = req.body;
			const data = await UserService.forgotPassword(email);
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const { password } = req.body;
			const {id} = req.user;
			const data = await UserService.resetPassword(password, id);
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async updateUserData(req, res, next) {
		try {
			const {name} = req.body;
			const {id} = req.user;
			const data = await UserService.updateUserData({name}, id);
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async updateUserRole(req, res, next) {
		try {
			const {role} = req.body;
			const {id} = req.user;
			console.log('role: ', role);
			console.log('id: ', id);
			const data = await UserService.updateUserRole(id, role);
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async deleteUser(req, res, next) {
		try {
			const {id} = req.user;
			const data = await UserService.deleteUser(id);
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async getUsersList(req, res, next) {
		try {
			const data = await UserService.getUsersList();
			res.json(data);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new UserController();