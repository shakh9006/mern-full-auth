const RouterException = require('../exceptions/routerException');
const User = require('../models/UserModel');
const UserService = require('../services/UserService');
const TokenService = require('../services/TokenService');
const UserDto = require('../dtos/UserDto');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const validateEmail = require('../utils/validateEmail');

class AuthService {
	async register(username, email, password) {
		if (!email || !username || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		const candidate = await UserService.findOneBy('email', email);
		if (candidate)
			throw RouterException.BadRequest(`User with email ${email} already exist`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const hashedPassword = await bcrypt.hash(password, 3);
		const user = await User.create({username, email, password: hashedPassword});

		return await this.userTokenRelations(user);
	}

	async login(email, password) {
		if (!email || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const user = await UserService.findOneBy('email', email);
		if (!user)
			throw RouterException.BadRequest(`Wrong email or password`);

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare)
			throw RouterException.BadRequest(`Wrong email or password`);

		return await this.userTokenRelations(user);
	}

	async userTokenRelations(user) {
		const dto = new UserDto(user);
		const tokens = TokenService.generateTokens({...dto});
		await TokenService.saveToken(dto.id, tokens.refreshToken);
		return {
			...dto,
			...tokens
		};
	}
}

module.exports = new AuthService;