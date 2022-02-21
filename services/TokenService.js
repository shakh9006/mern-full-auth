const Token = require('../models/TokenModel');
const jwt = require('jsonwebtoken');

class TokenService {
	generateTokens(data) {
		const accessToken = jwt.sign(data, '', {expiresIn: '30min'});
		const refreshToken = jwt.sign(data, '', {expiresIn: '7d'});
		return { accessToken, refreshToken };
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