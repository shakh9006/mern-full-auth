const Token = require('../models/TokenModel');
const jwt = require('jsonwebtoken');
const {JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN} = process.env;

class TokenService {
	generateAccessToken(data) {
		return jwt.sign(data, JWT_ACCESS_TOKEN, {expiresIn: '5m'});
	}

	generateRefreshToken(data) {
		return jwt.sign(data, JWT_REFRESH_TOKEN, {expiresIn: '30d'});
	}

	verifyAccessToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
		} catch (e) {
			return null;
		}
	}

	verifyRefreshToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
		} catch (e) {
			return null;
		}
	}

	async saveToken(userId, refreshToken) {
		const token = await Token.findOne({userId});
		if (token) {
			token.refreshToken = refreshToken;
			return await token.save();
		}

		const createdToken = await Token.create({userId, refreshToken});
		return await createdToken.save();
	}

	async deleteOne(key, value) {
		return await Token.deleteOne({[key]: value});
	}

	async findOneBy(key, value) {
		return await Token.findOne({[key]: value});
	}
}

module.exports = new TokenService();