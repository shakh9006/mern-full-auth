const nodemailer = require('nodemailer');

class MailService {
	constructor() {
		const {SMTP_HOST, SMTP_USER, SMTP_PORT, SMTP_PASSWORD} = process.env;
		this.transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASSWORD
			},
		});
	}

	async sendMail(to, link) {
		try {
			link = `${process.env.CLIENT_URL}/${link}`
			await this.transporter.sendMail({
				from: process.env.SMTP_HOST,
				to,
				subject: `Activation user from ${process.env.CLIENT_URL}`,
				html: `
				<div>
					<h2>Please click to link to activate your account</h2>
					<a href="${link}">${link}</a>
				</div>
			`
			});
		} catch (e) {
			console.log(e)
		}
	}
}

module.exports = new MailService();