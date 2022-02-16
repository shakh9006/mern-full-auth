require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.send('Hello bitch!!!');
});

const appStarter = async () => {
	try {
		const {PORT, MONGOOSE_URI} = process.env;
		await mongoose.connect(MONGOOSE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}, (err) => {
			if (err) {
				console.log('Database connect error');
				return;
			}
			console.log('Connected to db');
		})
		app.listen(PORT, () => console.log(`App is running at http://localhost:${PORT}`));
	} catch (err) {
		console.log('App starter error:', err.message);
	}
};

appStarter()
	.then(() => console.log('App started'));