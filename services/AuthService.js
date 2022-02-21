const RouterException = require('../exceptions/routerException');
const User = require('../models/UserModel');
const UserService = require('../services/UserService');
const UserDto = require('../dtos/UserDto');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const validateEmail = require('../utils/validateEmail');

class AuthService {
	async register(username, email, password) {
		const candidate = await UserService.findOneBy('email', email);
		if (candidate)
			throw RouterException.BadRequest(`User with email ${email} already exist`);

		if (!email || !username || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const hashedPassword = await bcrypt.hash(password, 3);
		const user = await User.create({username, email, password: hashedPassword});
		const dto = new UserDto(user);

	}
}

module.exports = new AuthService;