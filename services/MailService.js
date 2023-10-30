const RouterException = require('../exceptions/routerException');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const {
	CLIENT_URL, OAUTH_PLAYGROUND, MAIL_SERVICE, MAIL_SERVICE_TYPE, MAIL_SERVICE_CLIENT_ID,
	MAIL_SERVICE_CLIENT_SECRET, MAIL_SERVICE_CLIENT_REFRESH, MAIL_SERVICE_CLIENT_SENDER
} = process.env;

class MailService {
	constructor() {
		const oauth2Client = new OAuth2(
			MAIL_SERVICE_CLIENT_ID,
			MAIL_SERVICE_CLIENT_SECRET,
			MAIL_SERVICE_CLIENT_REFRESH,
			OAUTH_PLAYGROUND
		);

		oauth2Client.setCredentials({
			refresh_token: MAIL_SERVICE_CLIENT_REFRESH
		});

		const accessToken = oauth2Client.getAccessToken();
		this.transporter = nodemailer.createTransport({
			service: MAIL_SERVICE,
			auth: {
				type: MAIL_SERVICE_TYPE,
				user: MAIL_SERVICE_CLIENT_SENDER,
				clientId: MAIL_SERVICE_CLIENT_ID,
				clientSecret: MAIL_SERVICE_CLIENT_SECRET,
				refreshToken: MAIL_SERVICE_CLIENT_REFRESH,
				accessToken
			}
		});
	}

	async sendMail(to, link, text) {
		try {
			link = `${CLIENT_URL}/activate/${link}`;
			return await this.transporter.sendMail({
				from: MAIL_SERVICE_CLIENT_SENDER,
				to,
				subject: `Please ${text} on ${CLIENT_URL}`,
				html: `
					<div>
						<h2>Please click link in below to ${text}</h2>
						<a href="${link}">${link}</a>
					</div>
				`
			});
		} catch (err) {
			throw RouterException.BadRequest(err);
		}
	}

}

module.exports = new MailService();