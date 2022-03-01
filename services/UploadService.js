const fs = require('fs');
const cloudinary = require('cloudinary');
const RouterException = require('../exceptions/routerException');
const UserService = require('../services/UserService');
const {
	CLOUDINARY_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_SECRET_KEY
} = process.env;

class UploadService {
	constructor() {
		this.cloudinary = cloudinary;
		this.cloudinary.config({
			cloud_name: CLOUDINARY_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_SECRET_KEY,
		})
	}

	async uploadAvatar(id, file) {
		try {
			const data = await this.cloudinary.v2.uploader.upload(file.tempFilePath, {
				folder: 'avatar', width: 150, height: 150, crop: 'fill'
			});
			this.removeTmp(file.tempFilePath);
			const user = await UserService.findOneBy('_id', id);
			if (user) {
				user.avatar = data.secure_url;
				await user.save();
			}
			return {url: data.secure_url}
		} catch (err) {
			throw RouterException.BadRequest(err.message);
		}
	}

	removeTmp(path) {
		fs.unlink(path, err => {
			if (err)
				console.log('tmp error: ', err.message);
		})
	}
}

module.exports = new UploadService;