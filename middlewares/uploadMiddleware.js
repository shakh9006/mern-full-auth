const UploadService = require('../services/UploadService');
const RouterException = require('../exceptions/routerException');

module.exports = (req, res, next) => {
	try {
		if (!req.files || Object.keys(req.files).length === 0)
			return next(RouterException.BadRequest('No file were found'));

		const {file} = req.files;
		if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
			UploadService.removeTmp(file.tempFilePath);
			return next(RouterException.BadRequest('File format doesn\'t match'));
		}

		if (file.size > 1024 * 1024) {
			UploadService.removeTmp(file.tempFilePath);
			return next(RouterException.BadRequest('Size to large'));
		}

		next();
	} catch (err) {
		return next(RouterException.BadRequest(err.message))
	}
}