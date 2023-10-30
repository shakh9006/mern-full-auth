class UserDto {
	id;
	username;
	email;

	constructor(user) {
		this.id = user._id;
		this.email = user.email;
		this.username = user.username;
	}
}

module.exports = UserDto;