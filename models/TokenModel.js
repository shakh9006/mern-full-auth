const mongoose = require('mongoose');

const TokenModel = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	refreshToken: {
		type: String,
		required: true
	}
}, {timestamps: true});

module.exports = mongoose.model('Token', TokenModel);