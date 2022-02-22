const RouterException = require('../exceptions/routerException');
const User = require('../models/UserModel');
const TokenService = require('../services/TokenService');
const MailService = require('../services/MailService');
const UserDto = require('../dtos/UserDto');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const validateEmail = require('../utils/validateEmail');

class UserService {
	async register(username, email, password) {
		if (!email || !username || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		const candidate = await this.findOneBy('email', email);
		if (candidate)
			throw RouterException.BadRequest(`User with email ${email} already exist`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const hashedPassword = await bcrypt.hash(password, 3);
		const activationLink = uuid.v4();

		const user = await User.create({ username, email, password: hashedPassword, activationLink });
		await MailService.sendMail(email, activationLink);

		return await this.userTokenRelations(user);
	}

	async login(email, password) {
		if (!email || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const user = await this.findOneBy('email', email);
		if (!user)
			throw RouterException.BadRequest(`Wrong email or password`);

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare)
			throw RouterException.BadRequest(`Wrong email or password`);

		return await this.userTokenRelations(user);
	}

	async logout(refreshToken) {
		return await TokenService.deleteOne('refreshToken', refreshToken);
	}

	async refresh(refreshToken) {
		if ( !refreshToken )
			throw RouterException.UnauthorizedError();

		const userData = TokenService.verifyRefreshToken(refreshToken);
		const tokenData = await TokenService.findOneBy('refreshToken', refreshToken);

		if ( !userData || !tokenData )
			throw RouterException.UnauthorizedError();

		const user = await this.findOneBy('_id', userData.id);
		return this.userTokenRelations(user);
	}

	async getUsers() {
		return await User.find();
	}

	async activate(link) {
		const user = await this.findOneBy('activationLink', link);
		if ( !user )
			throw RouterException.BadRequest();

		user.isActivated = true;
		return await user.save();
	}

	async deleteOne(id) {
		return await User.deleteOne({[key]: value});
	}

	async findOneBy(key, value) {
		return await User.findOne({[key]: value});
	}

	async userTokenRelations(user) {
		const dto = new UserDto(user);
		const tokens = TokenService.generateTokens({...dto});
		await TokenService.saveToken(dto.id, tokens.refreshToken);
		return {
			user: {...dto},
			...tokens
		};
	}
}

module.exports = new UserService;