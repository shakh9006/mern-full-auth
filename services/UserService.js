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

		const user = await User.create({username, email, password: hashedPassword, activationLink});
		await MailService.sendMail(email, activationLink, 'activate your account');

		return await this.userTokenRelations(user);
	}

	async login(email, password) {
		if (!email || !password)
			throw RouterException.BadRequest(`Please fill all required fields`);

		if (!validateEmail(email))
			throw RouterException.BadRequest(`Invalid email format`);

		const user = await User.findOne({email});
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
		if (!refreshToken)
			throw RouterException.UnauthorizedError();

		const userData = TokenService.verifyRefreshToken(refreshToken);
		const tokenData = await TokenService.findOneBy('refreshToken', refreshToken);

		if (!userData || !tokenData)
			throw RouterException.UnauthorizedError();

		const user = await this.findOneBy('_id', userData.id);
		return this.userTokenRelations(user);
	}

	async getUserData(id) {
		return await this.findOneBy('_id', id);
	}

	async activate(link) {
		const user = await this.findOneBy('activationLink', link);
		if (!user)
			throw RouterException.BadRequest();

		user.isActivated = true;
		return await user.save();
	}

	async getAccessToken(refreshToken) {
		if (!refreshToken)
			throw RouterException.UnauthorizedError();

		const userData = TokenService.verifyRefreshToken(refreshToken);
		const user = await this.findOneBy({_id: userData.id});
		if (!userData || !user)
			throw RouterException.UnauthorizedError();

		const userDto = new UserDto(user);
		return TokenService.generateAccessToken({...userDto});
	}

	async forgotPassword(email) {
		if (!email || !validateEmail(email))
			throw RouterException.UnauthorizedError();

		const user = await this.findOneBy('email', email);
		if (!user)
			throw RouterException.UnauthorizedError();

		const link = `${process.env.CLIENT_URL}/reset`;
		await MailService.sendMail(user.email, link, 'reset your password');
		return {message: 'Please check your email'};
	}

	async resetPassword(password, id) {
		if (!password)
			throw RouterException.BadRequest('Please Enter valid password');

		console.log('password123: ', password);
		const hashedPassword = await bcrypt.hash(password, 3);
		await User.findOneAndUpdate({_id: id}, {
			password: hashedPassword
		});

		return {message: 'Password reset successfully'};
	}

	async updateUserData({name}, id) {
		await User.findOneAndUpdate({_id: id}, {
			username: name
		});

		return await this.findOneBy('_id', id);
	}

	async updateUserRole(id, role) {
		await User.findOneAndUpdate({_id: id}, {
			role: role
		});
		return {message: 'User role updated successfully'};
	}

	async deleteUser(id) {
		await TokenService.deleteOne('userId', id);
		await this.deleteOne('_id', id);
		return {message: 'User deleted successfully'};
	}

	async getUsersList() {
		return await User.find().select('-password');
	}

	async userTokenRelations(user) {
		const dto = new UserDto(user);
		const refreshToken = TokenService.generateRefreshToken({...dto});
		await TokenService.saveToken(dto.id, refreshToken);
		return {
			refreshToken,
			user: {...dto},
		};
	}

	async deleteOne(key, value) {
		return await User.deleteOne({[key]: value});
	}

	async findOneBy(key, value) {
		return await User.findOne({[key]: value}).select('-password');
	}
}

module.exports = new UserService;