const Token = require('../models/TokenModel');
const jwt = require('jsonwebtoken');

class TokenService {
	generateTokens(data) {
		const {JWT_ACCESS_TOKEN, JWT_ACTIVE_TOKEN, JWT_REFRESH_TOKEN} = process.env;
		const activeToken = jwt.sign(data, JWT_ACTIVE_TOKEN, {expiresIn: '5min'});
		const accessToken = jwt.sign(data, JWT_ACCESS_TOKEN, {expiresIn: '30min'});
		const refreshToken = jwt.sign(data, JWT_REFRESH_TOKEN, {expiresIn: '7d'});
		return { activeToken, accessToken, refreshToken };
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
}

module.exports = new TokenService();