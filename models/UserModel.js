const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
	username: {
		type: String,
		min: 3,
		max: 255,
		required: [true, 'Username is required.'],
	},
	email: {
		type: String,
		min: 7,
		max: 255,
		uniq: true,
		required: [true, 'Email is required'],
	},
	role: {
		type: Number,
		default: 0, // 0 = user, 1 = admin
	},
	isActivated: {
		type: Boolean,
		default: false,
	},
	avatar: {
		type: String,
		default: '',
	}
}, {timestamps: true});

module.exports = mongoose.model('User', UserModel);