require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const routes = require('./routes/index');
const routerMiddleware = require('./middlewares/exceptionMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
	useTempFiles: true
}))

app.use('/api/v1', routes);
app.use(routerMiddleware);

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