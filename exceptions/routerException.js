class RouterException {
	message;
	status;

	constructor(status, message) {
		this.status = status;
		this.message = message;
	}

	static BadRequest(message = 'Bad request') {
		return new RouterException(400, message);
	}

	static InternalError(message = 'Server error') {
		return new RouterException(500, message);
	}

	static UnauthorizedError(message = 'Permission denied') {
		return new RouterException(401, message);
	}
}

module.exports = RouterException;