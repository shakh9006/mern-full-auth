const UploadService = require('../services/UploadService');

class UploadController {
	async uploadAvatar(req, res, next) {
		try {
			const {file} = req.files;
			const {id} = req.user;
			const data = await UploadService.uploadAvatar(id, file);
			res.send(data);
		} catch (err) {
			return next(err);
		}
	}
}

module.exports = new UploadController();