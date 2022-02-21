const User = require('../models/UserModel');
class UserService {
	async findOneBy(key, value) {
		return await User.findOne({[key]: value});
	}
}

module.exports = new UserService();